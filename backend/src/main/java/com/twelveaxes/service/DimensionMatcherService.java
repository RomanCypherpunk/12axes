package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.DimensionMatch;
import com.twelveaxes.model.Personality;
import com.twelveaxes.model.PersonalityMatch;
import com.twelveaxes.model.PersonalityProfile;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class DimensionMatcherService {
    public static final List<String> POLITICAL_AXES = List.of(
            "estrutura", "representacao", "poder", "diplomacia", "imigracao",
            "intervencao", "tecnologia", "controle", "comercio", "religiao", "economia", "moral");

    public static final List<String> SOCIAL_AXES = List.of(
            "representacao", "moral", "religiao", "economia", "controle",
            "comercio", "imigracao", "poder", "tecnologia");

    public static final List<String> ECONOMIC_AXES = List.of("economia", "controle", "comercio");

    public static final String POLITICAL = "political";
    public static final String SOCIAL = "social";
    public static final String ECONOMIC = "economic";

    private final QuizDataService dataService;
    private final ProfileMatchScorer profileMatchScorer;

    public DimensionMatcherService(QuizDataService dataService, ProfileMatchScorer profileMatchScorer) {
        this.dataService = dataService;
        this.profileMatchScorer = profileMatchScorer;
    }

    public List<DimensionMatch> findAll(List<AxisResult> axisResults, String lang, String excludeId) {
        return findAll(
                axisResults, lang, excludeId, null, PersonalityMatcherService.REPRESENTATION_MALE);
    }

    public List<DimensionMatch> findAll(
            List<AxisResult> axisResults, String lang, String excludeId, String religion) {
        return findAll(
                axisResults, lang, excludeId, religion, PersonalityMatcherService.REPRESENTATION_MALE);
    }

    public List<DimensionMatch> findAll(
            List<AxisResult> axisResults,
            String lang,
            String excludeId,
            String religion,
            String representation) {
        String normalizedRepresentation = PersonalityMatcherService.normalizeRepresentation(representation);
        List<DimensionMatch> matches = new ArrayList<>();
        Set<String> excludedIds = new LinkedHashSet<>();
        if (excludeId != null) {
            excludedIds.add(excludeId);
        }
        addIfPresent(matches, excludedIds, POLITICAL, POLITICAL_AXES, axisResults, lang, religion, normalizedRepresentation);
        addIfPresent(matches, excludedIds, SOCIAL, SOCIAL_AXES, axisResults, lang, religion, normalizedRepresentation);
        addIfPresent(matches, excludedIds, ECONOMIC, ECONOMIC_AXES, axisResults, lang, religion, normalizedRepresentation);
        return List.copyOf(matches);
    }

    public List<DimensionMatch> findAll(List<AxisResult> axisResults, String lang) {
        return findAll(axisResults, lang, null);
    }

    private void addIfPresent(
            List<DimensionMatch> matches,
            Set<String> excludedIds,
            String dimension,
            List<String> axisIds,
            List<AxisResult> axisResults,
            String lang,
            String religion,
            String representation) {
        PersonalityMatch match = findBestFor(
                axisIds, axisResults, lang, religion, representation, excludedIds);
        if (match != null) {
            matches.add(new DimensionMatch(dimension, match));
            excludedIds.add(match.personalityId());
        }
    }

    private PersonalityMatch findBestFor(
            List<String> axisIds,
            List<AxisResult> axisResults,
            String lang,
            String religion,
            String representation,
            Set<String> excludedIds) {
        Map<String, Double> userVector = profileMatchScorer.userVectorFor(axisResults);
        List<Personality> personalities = dataService.getPersonalities(QuizDataService.normalizeLang(lang)).stream()
                .filter(personality -> representation.equals(PersonalityMatcherService.representationOf(personality)))
                .filter(personality -> !excludedIds.contains(personality.id()))
                .filter(personality -> ReligionFilter.allows(personality.religions(), religion))
                .toList();
        if (personalities.isEmpty()) {
            return null;
        }

        Comparator<Scored> byScore = Comparator.comparingDouble(Scored::score).reversed();
        Comparator<Scored> byName = Comparator.comparing(scored -> scored.personality().name());

        List<Scored> scored = personalities.stream()
                .map(personality -> new Scored(
                        personality,
                        profileMatchScorer.compatibility(userVector, targetVectorFor(personality), axisIds)))
                .sorted(byScore.thenComparing(byName))
                .toList();

        List<Double> allScores = scored.stream().map(Scored::score).toList();
        Scored best = scored.getFirst();
        return toMatch(best, profileMatchScorer.percentile(best.score(), allScores));
    }

    private PersonalityMatch toMatch(Scored scored, double percentile) {
        Personality personality = scored.personality();
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
                round1(scored.score()),
                percentile,
                targetVectorFor(personality));
    }

    private Map<String, Double> targetVectorFor(Personality personality) {
        PersonalityProfile profile = dataService.getPersonalityProfiles().get(personality.id());
        if (profile != null && profile.vector() != null && !profile.vector().isEmpty()) {
            return profile.vector();
        }
        return profileMatchScorer.neutralVector();
    }

    private double round1(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private record Scored(Personality personality, double score) {
    }
}
