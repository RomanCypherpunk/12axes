package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Ideology;
import com.twelveaxes.model.IdeologyMatch;
import com.twelveaxes.model.IdeologyProfile;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class IdeologyMatcherService {
    private static final List<String> AXIS_IDS = List.of(
            "estrutura",
            "representacao",
            "poder",
            "imigracao",
            "diplomacia",
            "intervencao",
            "economia",
            "controle",
            "comercio",
            "religiao",
            "moral",
            "tecnologia"
    );

    /**
     * Maximum theoretical Euclidean distance between two 12-axis vectors
     * (each axis ranges 0..100). Used to normalize compatibility into 0..100.
     */
    private static final double MAX_DISTANCE = Math.sqrt(AXIS_IDS.size() * 100.0 * 100.0);

    private static final int TOP_MATCHES = 4;

    private final QuizDataService dataService;

    public IdeologyMatcherService(QuizDataService dataService) {
        this.dataService = dataService;
    }

    public List<IdeologyMatch> findMatches(List<AxisResult> axisResults) {
        Map<String, Double> userVector = axisResults.stream()
                .collect(HashMap::new, (map, axis) -> map.put(axis.axisId(), axis.leftPercent()), HashMap::putAll);

        Comparator<IdeologyMatch> byScore = Comparator.comparingDouble(IdeologyMatch::compatibility).reversed();
        Comparator<IdeologyMatch> byName = Comparator.comparing(IdeologyMatch::name);

        return dataService.getIdeologies().stream()
                .map(ideology -> toMatch(ideology, userVector))
                .sorted(byScore.thenComparing(byName))
                .limit(TOP_MATCHES)
                .toList();
    }

    private IdeologyMatch toMatch(Ideology ideology, Map<String, Double> userVector) {
        Map<String, Double> targetVector = targetVectorFor(ideology);
        double sumOfSquares = 0.0;
        for (String axisId : AXIS_IDS) {
            double diff = userVector.getOrDefault(axisId, 50.0) - targetVector.getOrDefault(axisId, 50.0);
            sumOfSquares += diff * diff;
        }
        double distance = Math.sqrt(sumOfSquares);
        double compatibility = round(Math.max(0.0, 100.0 * (1.0 - distance / MAX_DISTANCE)));
        return new IdeologyMatch(
                ideology.id(),
                ideology.name(),
                ideology.category(),
                ideology.description(),
                compatibility
        );
    }

    private Map<String, Double> targetVectorFor(Ideology ideology) {
        IdeologyProfile profile = dataService.getIdeologyProfiles().get(ideology.id());
        if (profile != null && profile.vector() != null && !profile.vector().isEmpty()) {
            return profile.vector();
        }
        if (ideology.vector() != null && !ideology.vector().isEmpty()) {
            return ideology.vector();
        }
        // All 155 ideologies should have explicit profiles. Fallback to neutral.
        Map<String, Double> neutral = new HashMap<>();
        AXIS_IDS.forEach(axisId -> neutral.put(axisId, 50.0));
        return neutral;
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
