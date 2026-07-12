package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Personality;
import com.twelveaxes.model.PersonalityMatch;
import com.twelveaxes.model.PersonalityProfile;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class PersonalityMatcherService {
    private static final int TOP_MATCHES = 4;

    private final QuizDataService dataService;
    private final ProfileMatchScorer profileMatchScorer;

    public PersonalityMatcherService(QuizDataService dataService, ProfileMatchScorer profileMatchScorer) {
        this.dataService = dataService;
        this.profileMatchScorer = profileMatchScorer;
    }

    public List<PersonalityMatch> findMatches(List<AxisResult> axisResults) {
        return findMatches(axisResults, QuizDataService.LANG_PT);
    }

    public List<PersonalityMatch> findMatches(List<AxisResult> axisResults, String lang) {
        Map<String, Double> userVector = profileMatchScorer.userVectorFor(axisResults);

        Comparator<PersonalityCandidate> byScore =
                Comparator.comparingDouble(PersonalityCandidate::compatibility).reversed();
        Comparator<PersonalityCandidate> byName = Comparator.comparing(candidate -> candidate.personality().name());

        List<PersonalityCandidate> candidates = dataService.getPersonalities(QuizDataService.normalizeLang(lang)).stream()
                .map(personality -> toCandidate(personality, userVector))
                .toList();
        List<Double> catalogScores = candidates.stream()
                .map(PersonalityCandidate::compatibility)
                .toList();

        return candidates.stream()
                .map(candidate -> withPercentile(candidate, catalogScores))
                .sorted(byScore.thenComparing(byName))
                .limit(TOP_MATCHES)
                .map(this::toMatch)
                .toList();
    }

    public PersonalityMatch findTopMatch(List<AxisResult> axisResults) {
        return findTopMatch(axisResults, QuizDataService.LANG_PT);
    }

    public PersonalityMatch findTopMatch(List<AxisResult> axisResults, String lang) {
        return findMatches(axisResults, lang).getFirst();
    }

    private PersonalityCandidate toCandidate(Personality personality, Map<String, Double> userVector) {
        double compatibility = profileMatchScorer.compatibility(userVector, targetVectorFor(personality));
        return new PersonalityCandidate(personality, compatibility, 0.0);
    }

    private PersonalityCandidate withPercentile(PersonalityCandidate candidate, List<Double> catalogScores) {
        double percentile = profileMatchScorer.percentile(candidate.compatibility(), catalogScores);
        return new PersonalityCandidate(candidate.personality(), candidate.compatibility(), percentile);
    }

    private PersonalityMatch toMatch(PersonalityCandidate candidate) {
        Personality personality = candidate.personality();
        return new PersonalityMatch(
                personality.id(),
                personality.name(),
                personality.role(),
                personality.lifespan(),
                personality.description(),
                personality.imagePath(),
                personality.imageSourceName(),
                personality.imageSourceUrl(),
                personality.imageNote(),
                candidate.compatibility(),
                candidate.compatibilityPercentile()
        );
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
