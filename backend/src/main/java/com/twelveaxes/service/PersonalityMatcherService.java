package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Personality;
import com.twelveaxes.model.PersonalityMatch;
import com.twelveaxes.model.PersonalityProfile;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class PersonalityMatcherService {
    public static final String REPRESENTATION_MALE = "male";
    public static final String REPRESENTATION_FEMALE = "female";

    private static final int TOP_MATCHES = 8;
    private static final int CATEGORY_MATCHES = 3;
    private static final int BOTTOM_MATCHES = 3;

    private final QuizDataService dataService;
    private final ProfileMatchScorer profileMatchScorer;
    private final RequestMemo<List<Object>, List<PersonalityMatch>> rankingMemo = new RequestMemo<>();

    public PersonalityMatcherService(QuizDataService dataService, ProfileMatchScorer profileMatchScorer) {
        this.dataService = dataService;
        this.profileMatchScorer = profileMatchScorer;
    }

    public List<PersonalityMatch> findMatches(List<AxisResult> axisResults) {
        return findMatches(axisResults, QuizDataService.LANG_PT, null, REPRESENTATION_MALE);
    }

    public List<PersonalityMatch> findMatches(List<AxisResult> axisResults, String lang) {
        return findMatches(axisResults, lang, null, REPRESENTATION_MALE);
    }

    public List<PersonalityMatch> findMatches(List<AxisResult> axisResults, String lang, String religion) {
        return findMatches(axisResults, lang, religion, REPRESENTATION_MALE);
    }

    public List<PersonalityMatch> findMatches(
            List<AxisResult> axisResults, String lang, String religion, String representation) {
        return rankAll(axisResults, lang, religion, representation).stream()
                .limit(TOP_MATCHES)
                .toList();
    }

    public PersonalityMatch findTopMatch(List<AxisResult> axisResults) {
        return findTopMatch(axisResults, QuizDataService.LANG_PT);
    }

    public PersonalityMatch findTopMatch(List<AxisResult> axisResults, String lang) {
        return findMatches(axisResults, lang).getFirst();
    }

    public List<PersonalityMatch> findCategoryMatches(List<AxisResult> axisResults, String lang) {
        return findCategoryMatches(axisResults, lang, null, REPRESENTATION_MALE);
    }

    public List<PersonalityMatch> findCategoryMatches(List<AxisResult> axisResults, String lang, String religion) {
        return findCategoryMatches(axisResults, lang, religion, REPRESENTATION_MALE);
    }

    public List<PersonalityMatch> findCategoryMatches(
            List<AxisResult> axisResults, String lang, String religion, String representation) {
        List<PersonalityMatch> ranking = rankAll(axisResults, lang, religion, representation);
        if (ranking.isEmpty()) {
            return List.of();
        }

        Set<String> categoriasVistas = new LinkedHashSet<>();
        categoriasVistas.add(ranking.getFirst().category());

        List<PersonalityMatch> selecionadas = new ArrayList<>();
        for (PersonalityMatch match : ranking) {
            if (selecionadas.size() == CATEGORY_MATCHES) {
                break;
            }
            if (categoriasVistas.add(match.category())) {
                selecionadas.add(match);
            }
        }
        return List.copyOf(selecionadas);
    }

    public List<PersonalityMatch> findBestPerCategory(List<AxisResult> axisResults, String lang) {
        return findBestPerCategory(axisResults, lang, null, REPRESENTATION_MALE);
    }

    public List<PersonalityMatch> findBestPerCategory(List<AxisResult> axisResults, String lang, String religion) {
        return findBestPerCategory(axisResults, lang, religion, REPRESENTATION_MALE);
    }

    public List<PersonalityMatch> findBestPerCategory(
            List<AxisResult> axisResults, String lang, String religion, String representation) {
        Map<String, PersonalityMatch> melhorPorCategoria = new LinkedHashMap<>();
        for (PersonalityMatch match : rankAll(axisResults, lang, religion, representation)) {
            if (match.category() != null) {
                melhorPorCategoria.putIfAbsent(match.category(), match);
            }
        }
        return melhorPorCategoria.values().stream()
                .sorted(Comparator.comparingDouble(PersonalityMatch::compatibility).reversed())
                .toList();
    }

    public List<PersonalityMatch> findBottomMatches(List<AxisResult> axisResults, String lang) {
        return findBottomMatches(axisResults, lang, null, REPRESENTATION_MALE);
    }

    public List<PersonalityMatch> findBottomMatches(List<AxisResult> axisResults, String lang, String religion) {
        return findBottomMatches(axisResults, lang, religion, REPRESENTATION_MALE);
    }

    public List<PersonalityMatch> findBottomMatches(
            List<AxisResult> axisResults, String lang, String religion, String representation) {
        List<PersonalityMatch> ranking = rankAll(axisResults, lang, religion, representation);
        return ranking.stream()
                .skip(Math.max(0, ranking.size() - BOTTOM_MATCHES))
                .sorted(Comparator.comparingDouble(PersonalityMatch::compatibility))
                .toList();
    }

    private List<PersonalityMatch> rankAll(
            List<AxisResult> axisResults, String lang, String religion, String representation) {
        String normalizedRepresentation = normalizeRepresentation(representation);
        return rankingMemo.get(
                List.of(
                        QuizDataService.normalizeLang(lang),
                        String.valueOf(religion),
                        normalizedRepresentation,
                        axisResults),
                () -> computeRanking(axisResults, lang, religion, normalizedRepresentation));
    }

    private List<PersonalityMatch> computeRanking(
            List<AxisResult> axisResults, String lang, String religion, String representation) {
        Map<String, Double> userVector = profileMatchScorer.userVectorFor(axisResults);

        Comparator<PersonalityCandidate> byScore =
                Comparator.comparingDouble(PersonalityCandidate::compatibility).reversed();
        Comparator<PersonalityCandidate> byName = Comparator.comparing(candidate -> candidate.personality().name());

        List<PersonalityCandidate> candidates = dataService.getPersonalities(QuizDataService.normalizeLang(lang)).stream()
                .filter(personality -> representation.equals(representationOf(personality)))
                .map(personality -> toCandidate(personality, userVector))
                .toList();
        List<Double> catalogScores = candidates.stream()
                .map(PersonalityCandidate::compatibility)
                .toList();

        double[] percentiles = profileMatchScorer.percentiles(catalogScores);
        return java.util.stream.IntStream.range(0, candidates.size())
                .mapToObj(i -> new PersonalityCandidate(
                        candidates.get(i).personality(),
                        candidates.get(i).compatibility(),
                        percentiles[i]))
                .filter(candidate -> ReligionFilter.allows(candidate.personality().religions(), religion))
                .sorted(byScore.thenComparing(byName))
                .map(this::toMatch)
                .toList();
    }

    private PersonalityCandidate toCandidate(Personality personality, Map<String, Double> userVector) {
        double compatibility = profileMatchScorer.compatibility(userVector, targetVectorFor(personality));
        return new PersonalityCandidate(personality, compatibility, 0.0);
    }

    private PersonalityMatch toMatch(PersonalityCandidate candidate) {
        Personality personality = candidate.personality();
        return new PersonalityMatch(
                personality.id(),
                personality.name(),
                personality.role(),
                personality.category(),
                personality.lifespan(),
                personality.description(),
                personality.imagePath(),
                personality.imageSourceName(),
                personality.imageSourceUrl(),
                personality.imageNote(),
                candidate.compatibility(),
                candidate.compatibilityPercentile(),
                targetVectorFor(personality)
        );
    }

    public static String normalizeRepresentation(String representation) {
        if (representation == null) {
            return REPRESENTATION_MALE;
        }
        return REPRESENTATION_FEMALE.equals(representation.trim().toLowerCase())
                ? REPRESENTATION_FEMALE
                : REPRESENTATION_MALE;
    }

    public static String representationOf(Personality personality) {
        return normalizeRepresentation(personality.representation());
    }

    private Map<String, Double> targetVectorFor(Personality personality) {
        PersonalityProfile profile = dataService.getPersonalityProfiles().get(personality.id());
        if (profile != null && profile.vector() != null && !profile.vector().isEmpty()) {
            return profile.vector();
        }
        return profileMatchScorer.neutralVector();
    }

    private record PersonalityCandidate(
            Personality personality,
            double compatibility,
            double compatibilityPercentile
    ) {
    }
}
