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

        Comparator<PersonalityMatch> byScore = Comparator.comparingDouble(PersonalityMatch::compatibility).reversed();
        Comparator<PersonalityMatch> byName = Comparator.comparing(PersonalityMatch::name);

        return dataService.getPersonalities(QuizDataService.normalizeLang(lang)).stream()
                .map(personality -> toMatch(personality, userVector))
                .sorted(byScore.thenComparing(byName))
                .limit(TOP_MATCHES)
                .toList();
    }

    public PersonalityMatch findTopMatch(List<AxisResult> axisResults) {
        return findTopMatch(axisResults, QuizDataService.LANG_PT);
    }

    public PersonalityMatch findTopMatch(List<AxisResult> axisResults, String lang) {
        return findMatches(axisResults, lang).getFirst();
    }

    private PersonalityMatch toMatch(Personality personality, Map<String, Double> userVector) {
        double compatibility = profileMatchScorer.compatibility(userVector, targetVectorFor(personality));
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
                compatibility
        );
    }

    private Map<String, Double> targetVectorFor(Personality personality) {
        PersonalityProfile profile = dataService.getPersonalityProfiles().get(personality.id());
        if (profile != null && profile.vector() != null && !profile.vector().isEmpty()) {
            return profile.vector();
        }
        return profileMatchScorer.neutralVector();
    }
}
