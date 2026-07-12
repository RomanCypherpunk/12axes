package com.twelveaxes.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ScorerBenchmarkTest {
    private static final long SEED = 123_456_789L;
    private static final double NOISE_SIGMA_10 = 10.0;
    private static final double NOISE_SIGMA_15 = 15.0;
    private static final int CENTERED_PROFILES = 15;
    private static final int CENTER_STRESS_SAMPLES_PER_CATALOG = 200;

    private static final double MIN_RECOVERY_SIGMA_10_PERCENT = 77.0;
    private static final double MIN_RECOVERY_SIGMA_15_PERCENT = 50.0;
    private static final double MIN_OPPOSITE_REJECTION_PERCENT = 85.0;
    private static final double MIN_CENTER_REJECTION_PERCENT = 60.0;
    private static final double MIN_STABILITY_PERCENT = 96.0;
    private static final double MIN_DISCRIMINATION_PERCENT = 3.5;

    @Autowired
    private QuizDataService dataService;

    @Autowired
    private ProfileMatchScorer scorer;

    @Test
    void scorerKeepsCoreMatchingPropertiesInsideEachCatalog() {
        BenchmarkReport report = runBenchmark();

        System.out.printf(
                "Scorer benchmark: recovery10=%.1f%%, recovery15=%.1f%%, opposite=%.1f%%, "
                        + "center=%.1f%%, stability=%.1f%%, discrimination=%.2f%%%n",
                report.recoverySigma10Percent(),
                report.recoverySigma15Percent(),
                report.oppositeRejectionPercent(),
                report.centerRejectionPercent(),
                report.stabilityPercent(),
                report.discriminationPercent()
        );

        assertThat(report.recoverySigma10Percent())
                .as("recovers the source profile under moderate noise")
                .isGreaterThanOrEqualTo(MIN_RECOVERY_SIGMA_10_PERCENT);
        assertThat(report.recoverySigma15Percent())
                .as("recovers the source profile under stronger noise")
                .isGreaterThanOrEqualTo(MIN_RECOVERY_SIGMA_15_PERCENT);
        assertThat(report.oppositeRejectionPercent())
                .as("pushes mirrored profiles into the bottom of their own catalog")
                .isGreaterThanOrEqualTo(MIN_OPPOSITE_REJECTION_PERCENT);
        assertThat(report.centerRejectionPercent())
                .as("keeps centered profiles away from the top for extreme users")
                .isGreaterThanOrEqualTo(MIN_CENTER_REJECTION_PERCENT);
        assertThat(report.stabilityPercent())
                .as("does not flip top-1 when one answer moves by two points")
                .isGreaterThanOrEqualTo(MIN_STABILITY_PERCENT);
        assertThat(report.discriminationPercent())
                .as("keeps a measurable margin between the first and second match")
                .isGreaterThanOrEqualTo(MIN_DISCRIMINATION_PERCENT);
    }

    private BenchmarkReport runBenchmark() {
        Random random = new Random(SEED);
        List<String> axisIds = dataService.getAxes().stream()
                .map(axis -> axis.id())
                .toList();

        int recoverySigma10 = 0;
        int recoverySigma15 = 0;
        int recoveryTotal = 0;
        int oppositeRejections = 0;
        int oppositeTotal = 0;
        int centerRejections = 0;
        int centerTotal = 0;
        int stableTopMatches = 0;
        int stabilityTotal = 0;
        double discriminationTotal = 0.0;
        int discriminationCount = 0;

        for (Catalog catalog : catalogs()) {
            Set<String> centeredProfileIds = catalog.profiles().stream()
                    .sorted(Comparator.comparingDouble(profile -> distanceFromCenter(profile.vector(), axisIds)))
                    .limit(CENTERED_PROFILES)
                    .map(Profile::id)
                    .collect(Collectors.toUnmodifiableSet());

            for (Profile profile : catalog.profiles()) {
                List<RankedProfile> sigma10Rank = rank(catalog, noisyVector(profile.vector(), axisIds, NOISE_SIGMA_10, random));
                if (sigma10Rank.getFirst().profile().id().equals(profile.id())) {
                    recoverySigma10++;
                }
                recoveryTotal++;

                List<RankedProfile> sigma15Rank = rank(catalog, noisyVector(profile.vector(), axisIds, NOISE_SIGMA_15, random));
                if (sigma15Rank.getFirst().profile().id().equals(profile.id())) {
                    recoverySigma15++;
                }

                List<RankedProfile> oppositeRank = rank(catalog, mirroredVector(profile.vector(), axisIds));
                int sourceRankIndex = indexOf(oppositeRank, profile.id());
                if (sourceRankIndex >= Math.ceil(catalog.profiles().size() * 0.90)) {
                    oppositeRejections++;
                }
                oppositeTotal++;

                Map<String, Double> stableQuery = noisyVector(profile.vector(), axisIds, NOISE_SIGMA_10, random);
                String before = rank(catalog, stableQuery).getFirst().profile().id();
                Map<String, Double> shiftedQuery = new LinkedHashMap<>(stableQuery);
                String shiftedAxis = axisIds.get(random.nextInt(axisIds.size()));
                shiftedQuery.put(shiftedAxis, clamp(shiftedQuery.getOrDefault(shiftedAxis, 50.0) + 2.0));
                List<RankedProfile> shiftedRank = rank(catalog, shiftedQuery);
                if (before.equals(shiftedRank.getFirst().profile().id())) {
                    stableTopMatches++;
                }
                stabilityTotal++;

                if (shiftedRank.size() > 1) {
                    discriminationTotal += discrimination(shiftedRank);
                    discriminationCount++;
                }
            }

            for (int sample = 0; sample < CENTER_STRESS_SAMPLES_PER_CATALOG; sample++) {
                List<String> topIds = rank(catalog, extremeVector(axisIds, random)).stream()
                        .limit(CENTERED_PROFILES)
                        .map(ranked -> ranked.profile().id())
                        .toList();
                if (topIds.stream().noneMatch(centeredProfileIds::contains)) {
                    centerRejections++;
                }
                centerTotal++;
            }
        }

        return new BenchmarkReport(
                percent(recoverySigma10, recoveryTotal),
                percent(recoverySigma15, recoveryTotal),
                percent(oppositeRejections, oppositeTotal),
                percent(centerRejections, centerTotal),
                percent(stableTopMatches, stabilityTotal),
                discriminationTotal / discriminationCount
        );
    }

    private List<Catalog> catalogs() {
        return List.of(
                new Catalog(
                        dataService.getIdeologyProfiles().values().stream()
                                .map(profile -> new Profile(profile.ideologyId(), profile.vector()))
                                .sorted(Comparator.comparing(Profile::id))
                                .toList()
                ),
                new Catalog(
                        dataService.getCountryProfiles().values().stream()
                                .map(profile -> new Profile(profile.countryId(), profile.vector()))
                                .sorted(Comparator.comparing(Profile::id))
                                .toList()
                ),
                new Catalog(
                        dataService.getPersonalityProfiles().values().stream()
                                .map(profile -> new Profile(profile.personalityId(), profile.vector()))
                                .sorted(Comparator.comparing(Profile::id))
                                .toList()
                )
        );
    }

    private List<RankedProfile> rank(Catalog catalog, Map<String, Double> queryVector) {
        return catalog.profiles().stream()
                .map(profile -> new RankedProfile(profile, scorer.compatibility(queryVector, profile.vector())))
                .sorted(Comparator.comparingDouble(RankedProfile::score)
                        .reversed()
                        .thenComparing(ranked -> ranked.profile().id()))
                .toList();
    }

    private Map<String, Double> noisyVector(
            Map<String, Double> source,
            List<String> axisIds,
            double sigma,
            Random random
    ) {
        Map<String, Double> vector = new LinkedHashMap<>();
        for (String axisId : axisIds) {
            vector.put(axisId, clamp(value(source, axisId) + random.nextGaussian() * sigma));
        }
        return vector;
    }

    private Map<String, Double> mirroredVector(Map<String, Double> source, List<String> axisIds) {
        Map<String, Double> vector = new LinkedHashMap<>();
        for (String axisId : axisIds) {
            vector.put(axisId, 100.0 - value(source, axisId));
        }
        return vector;
    }

    private Map<String, Double> extremeVector(List<String> axisIds, Random random) {
        Map<String, Double> vector = new LinkedHashMap<>();
        for (String axisId : axisIds) {
            double value = random.nextBoolean()
                    ? random.nextDouble(0.0, 15.0)
                    : random.nextDouble(85.0, 100.0);
            vector.put(axisId, value);
        }
        return vector;
    }

    private double distanceFromCenter(Map<String, Double> vector, List<String> axisIds) {
        double total = 0.0;
        for (String axisId : axisIds) {
            total += Math.abs(value(vector, axisId) - 50.0);
        }
        return total / axisIds.size();
    }

    private double discrimination(List<RankedProfile> rankedProfiles) {
        double topScore = rankedProfiles.get(0).score();
        double secondScore = rankedProfiles.get(1).score();
        double bottomScore = rankedProfiles.getLast().score();
        double amplitude = Math.max(0.0001, topScore - bottomScore);
        return 100.0 * (topScore - secondScore) / amplitude;
    }

    private int indexOf(List<RankedProfile> rankedProfiles, String profileId) {
        for (int index = 0; index < rankedProfiles.size(); index++) {
            if (rankedProfiles.get(index).profile().id().equals(profileId)) {
                return index;
            }
        }
        throw new IllegalArgumentException("Profile not ranked: " + profileId);
    }

    private double value(Map<String, Double> vector, String axisId) {
        return vector.getOrDefault(axisId, 50.0);
    }

    private double clamp(double value) {
        return Math.max(0.0, Math.min(100.0, value));
    }

    private double percent(int count, int total) {
        return 100.0 * count / total;
    }

    private record Catalog(List<Profile> profiles) {
    }

    private record Profile(String id, Map<String, Double> vector) {
    }

    private record RankedProfile(Profile profile, double score) {
    }

    private record BenchmarkReport(
            double recoverySigma10Percent,
            double recoverySigma15Percent,
            double oppositeRejectionPercent,
            double centerRejectionPercent,
            double stabilityPercent,
            double discriminationPercent
    ) {
    }
}
