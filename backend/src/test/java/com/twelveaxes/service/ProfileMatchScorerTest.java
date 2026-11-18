package com.twelveaxes.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.LinkedHashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;

class ProfileMatchScorerTest {
    private static final double MAGNITUDE_PERFECT_SCORE = 100.0;
    private static final double OUTLIER_PERFECT_SCORE = 100.0;

    private final ProfileMatchScorer scorer = new ProfileMatchScorer();

    @Test
    void identicalVectorsScorePerfectly() {
        Map<String, Double> vector = vector(Map.ofEntries(
                Map.entry("estrutura", 96.0),
                Map.entry("representacao", 17.0),
                Map.entry("poder", 44.0),
                Map.entry("imigracao", 62.0),
                Map.entry("diplomacia", 71.0),
                Map.entry("intervencao", 53.0),
                Map.entry("economia", 34.0),
                Map.entry("controle", 13.0),
                Map.entry("comercio", 38.0),
                Map.entry("religiao", 80.0),
                Map.entry("moral", 9.0),
                Map.entry("tecnologia", 86.0)
        ));

        assertThat(scorer.compatibility(vector, vector)).isEqualTo(100.0);
    }

    @Test
    void sameSideDirectionBeatsOppositeSideAtEqualDistance() {
        Map<String, Double> user = vector(Map.of(
                "estrutura", 80.0,
                "representacao", 80.0
        ));
        Map<String, Double> sameDirection = vector(Map.of(
                "estrutura", 70.0,
                "representacao", 70.0
        ));
        Map<String, Double> oppositeDirection = vector(Map.of(
                "estrutura", 30.0,
                "representacao", 30.0
        ));

        assertThat(scorer.compatibility(user, sameDirection))
                .isGreaterThan(scorer.compatibility(user, oppositeDirection));
    }

    @Test
    void oppositeSidePenaltyChangesContinuouslyAroundTheOldThreshold() {
        Map<String, Double> user = vector(Map.of("estrutura", 38.0));
        Map<String, Double> targetNearCenter = vector(Map.of("estrutura", 64.0));
        Map<String, Double> targetSlightlyFurther = vector(Map.of("estrutura", 66.0));

        double nearCenterScore = scorer.compatibility(user, targetNearCenter);
        double slightlyFurtherScore = scorer.compatibility(user, targetSlightlyFurther);

        assertThat(nearCenterScore - slightlyFurtherScore).isLessThan(2.0);
    }

    @Test
    void neutralVectorScoresPerfectlyAgainstItself() {
        Map<String, Double> neutral = scorer.neutralVector();

        // Cosseno aumentado: centro x centro tem direção 100, então o total é 100.
        assertThat(scorer.compatibility(neutral, neutral)).isEqualTo(100.0);
    }

    @Test
    void neutralUserOrTargetUsesAugmentedDirection() {
        Map<String, Double> neutral = scorer.neutralVector();
        Map<String, Double> target = vector(Map.of(
                "estrutura", 100.0,
                "representacao", 100.0,
                "poder", 100.0
        ));

        double augment = 12 * ProfileMatchScorer.DIRECTION_AUGMENT_RADIUS * ProfileMatchScorer.DIRECTION_AUGMENT_RADIUS;
        double targetNormSquared = 3 * 50.0 * 50.0;
        double direction = 50.0 + 50.0 * augment / Math.sqrt(augment * (targetNormSquared + augment));
        double outlierScore = 100.0 * (1.0 - Math.pow(
                50.0 / ProfileMatchScorer.OUTLIER_FULL_SPREAD, ProfileMatchScorer.OUTLIER_EXPONENT));
        double expected = expectedScore(75.0, direction, 75.0, outlierScore);
        assertThat(scorer.compatibility(neutral, target)).isEqualTo(expected);
        assertThat(scorer.compatibility(target, neutral)).isEqualTo(expected);
    }

    @Test
    void augmentedDirectionConvergesToPlainCosineFarFromCenter() {
        Map<String, Double> user = vector(Map.of("economia", 95.0, "controle", 95.0, "religiao", 5.0));
        Map<String, Double> sameDirection = vector(Map.of("economia", 90.0, "controle", 90.0, "religiao", 10.0));
        Map<String, Double> nearCenter = vector(Map.of("economia", 53.0, "controle", 53.0, "religiao", 47.0));

        // Longe do centro a direção quase não muda; o perfil alinhado e intenso segue vencendo.
        assertThat(scorer.compatibility(user, sameDirection))
                .isGreaterThan(scorer.compatibility(user, nearCenter));
    }

    @Test
    void singleExtremeOutlierAxisLowersScoreEvenWhenOtherAxesMatchPerfectly() {
        Map<String, Double> user = vector(Map.ofEntries(
                Map.entry("estrutura", 60.0),
                Map.entry("representacao", 60.0),
                Map.entry("poder", 60.0),
                Map.entry("imigracao", 60.0),
                Map.entry("diplomacia", 60.0),
                Map.entry("intervencao", 60.0),
                Map.entry("economia", 15.0),
                Map.entry("controle", 60.0),
                Map.entry("comercio", 60.0),
                Map.entry("religiao", 60.0),
                Map.entry("moral", 60.0),
                Map.entry("tecnologia", 60.0)
        ));
        Map<String, Double> targetWithOutlier = vector(Map.ofEntries(
                Map.entry("estrutura", 60.0),
                Map.entry("representacao", 60.0),
                Map.entry("poder", 60.0),
                Map.entry("imigracao", 60.0),
                Map.entry("diplomacia", 60.0),
                Map.entry("intervencao", 60.0),
                Map.entry("economia", 90.0),
                Map.entry("controle", 60.0),
                Map.entry("comercio", 60.0),
                Map.entry("religiao", 60.0),
                Map.entry("moral", 60.0),
                Map.entry("tecnologia", 60.0)
        ));
        Map<String, Double> targetWithoutOutlier = vector(Map.ofEntries(
                Map.entry("estrutura", 60.0),
                Map.entry("representacao", 60.0),
                Map.entry("poder", 60.0),
                Map.entry("imigracao", 60.0),
                Map.entry("diplomacia", 60.0),
                Map.entry("intervencao", 60.0),
                Map.entry("economia", 55.0),
                Map.entry("controle", 60.0),
                Map.entry("comercio", 60.0),
                Map.entry("religiao", 60.0),
                Map.entry("moral", 60.0),
                Map.entry("tecnologia", 60.0)
        ));

        assertThat(scorer.compatibility(user, targetWithoutOutlier))
                .isGreaterThan(scorer.compatibility(user, targetWithOutlier));
    }

    @Test
    void mildProfileBeatsPerfectlyAlignedExtremeProfileForMildUser() {
        Map<String, Double> mildUser = vector(Map.ofEntries(
                Map.entry("estrutura", 58.0),
                Map.entry("representacao", 58.0),
                Map.entry("poder", 58.0),
                Map.entry("imigracao", 58.0),
                Map.entry("diplomacia", 58.0),
                Map.entry("intervencao", 58.0),
                Map.entry("economia", 58.0),
                Map.entry("controle", 58.0),
                Map.entry("comercio", 58.0),
                Map.entry("religiao", 58.0),
                Map.entry("moral", 58.0),
                Map.entry("tecnologia", 58.0)
        ));
        Map<String, Double> alignedExtremeTarget = vector(Map.ofEntries(
                Map.entry("estrutura", 78.0),
                Map.entry("representacao", 78.0),
                Map.entry("poder", 78.0),
                Map.entry("imigracao", 78.0),
                Map.entry("diplomacia", 78.0),
                Map.entry("intervencao", 78.0),
                Map.entry("economia", 78.0),
                Map.entry("controle", 78.0),
                Map.entry("comercio", 78.0),
                Map.entry("religiao", 78.0),
                Map.entry("moral", 78.0),
                Map.entry("tecnologia", 78.0)
        ));
        Map<String, Double> similarlyMildTarget = vector(Map.ofEntries(
                Map.entry("estrutura", 58.0),
                Map.entry("representacao", 58.0),
                Map.entry("poder", 58.0),
                Map.entry("imigracao", 58.0),
                Map.entry("diplomacia", 58.0),
                Map.entry("intervencao", 58.0),
                Map.entry("economia", 58.0),
                Map.entry("controle", 58.0),
                Map.entry("comercio", 58.0),
                Map.entry("religiao", 42.0),
                Map.entry("moral", 42.0),
                Map.entry("tecnologia", 42.0)
        ));

        assertThat(scorer.compatibility(mildUser, similarlyMildTarget))
                .isGreaterThan(scorer.compatibility(mildUser, alignedExtremeTarget));
    }

    @Test
    void weightsAddUpToOne() {
        assertThat(ProfileMatchScorer.AXIS_WEIGHT
                + ProfileMatchScorer.DIRECTION_WEIGHT
                + ProfileMatchScorer.MAGNITUDE_WEIGHT
                + ProfileMatchScorer.OUTLIER_WEIGHT)
                .isEqualTo(1.0);
    }

    private double expectedScore(double axisSimilarity, double directionSimilarity, double magnitudeSimilarity,
            double outlierSimilarity) {
        return round1(ProfileMatchScorer.AXIS_WEIGHT * axisSimilarity
                + ProfileMatchScorer.DIRECTION_WEIGHT * directionSimilarity
                + ProfileMatchScorer.MAGNITUDE_WEIGHT * magnitudeSimilarity
                + ProfileMatchScorer.OUTLIER_WEIGHT * outlierSimilarity);
    }

    private double round1(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private static final java.util.List<String> ALL_AXES = java.util.List.of(
            "estrutura", "representacao", "poder", "imigracao", "diplomacia", "intervencao",
            "economia", "controle", "comercio", "religiao", "moral", "tecnologia");

    private Map<String, Double> sampleUser() {
        return vector(Map.of("estrutura", 80.0, "representacao", 20.0, "poder", 65.0, "economia", 35.0,
                "comercio", 70.0, "religiao", 15.0, "moral", 75.0, "tecnologia", 40.0));
    }

    private Map<String, Double> sampleTarget() {
        return vector(Map.of("estrutura", 55.0, "representacao", 40.0, "poder", 30.0, "economia", 60.0,
                "comercio", 45.0, "religiao", 70.0, "moral", 20.0, "tecnologia", 85.0, "controle", 25.0));
    }

    @Test
    void weightedScoreWithEqualWeightsOnEveryAxisMatchesTheUnweightedScore() {
        Map<String, Double> equal = new LinkedHashMap<>();
        ALL_AXES.forEach(axis -> equal.put(axis, 1.0));

        assertThat(scorer.compatibility(sampleUser(), sampleTarget(), equal))
                .isEqualTo(scorer.compatibility(sampleUser(), sampleTarget()));
    }

    @Test
    void weightedScoreWithEqualWeightsOnASubsetMatchesTheSubsetScore() {
        java.util.List<String> subset = java.util.List.of("estrutura", "comercio", "moral");
        Map<String, Double> weights = new LinkedHashMap<>();
        subset.forEach(axis -> weights.put(axis, 1.0));

        assertThat(scorer.compatibility(sampleUser(), sampleTarget(), weights))
                .isEqualTo(scorer.compatibility(sampleUser(), sampleTarget(), subset));
    }

    @Test
    void aHeavilyWeightedAxisDecidesAndTheOthersOnlyBreakTies() {
        Map<String, Double> user = vector(Map.of("estrutura", 90.0, "economia", 10.0, "moral", 10.0));
        // Igual ao usuario em estrutura, oposto nos outros dois.
        Map<String, Double> sameOnMainAxis = vector(Map.of("estrutura", 90.0, "economia", 90.0, "moral", 90.0));
        // Oposto em estrutura, igual ao usuario nos outros dois.
        Map<String, Double> oppositeOnMainAxis = vector(Map.of("estrutura", 10.0, "economia", 10.0, "moral", 10.0));
        Map<String, Double> weights = new LinkedHashMap<>();
        ALL_AXES.forEach(axis -> weights.put(axis, 0.5 / 11));
        weights.put("estrutura", 0.5);

        assertThat(scorer.compatibility(user, sameOnMainAxis, weights))
                .isGreaterThan(scorer.compatibility(user, oppositeOnMainAxis, weights));
        // Sem peso, as duas perdem do mesmo jeito (so um terco dos eixos muda de lado): a ordem nao depende da area.
        assertThat(scorer.compatibility(user, oppositeOnMainAxis, weights)).isBetween(0.0, 100.0);
    }

    private Map<String, Double> vector(Map<String, Double> overrides) {
        Map<String, Double> vector = new LinkedHashMap<>(scorer.neutralVector());
        vector.putAll(overrides);
        return vector;
    }
}
