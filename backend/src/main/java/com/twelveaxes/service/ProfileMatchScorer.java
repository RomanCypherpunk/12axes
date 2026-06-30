package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class ProfileMatchScorer {
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

    private static final Map<String, Double> AXIS_WEIGHTS = Map.ofEntries(
            Map.entry("estrutura", 1.00),
            Map.entry("representacao", 1.00),
            Map.entry("poder", 1.00),
            Map.entry("imigracao", 1.00),
            Map.entry("diplomacia", 1.00),
            Map.entry("intervencao", 1.00),
            Map.entry("economia", 1.00),
            Map.entry("controle", 1.00),
            Map.entry("comercio", 1.00),
            Map.entry("religiao", 1.00),
            Map.entry("moral", 1.00),
            Map.entry("tecnologia", 0.75)
    );

    private static final double AXIS_SIMILARITY_SPREAD = 50.0;
    private static final double DISTANCE_DECAY_SPREAD = 35.0;
    private static final double OPPOSITE_SIDE_FACTOR = 0.55;

    public Map<String, Double> userVectorFor(List<AxisResult> axisResults) {
        return axisResults.stream()
                .collect(HashMap::new, (map, axis) -> map.put(axis.axisId(), axis.leftPercent()), HashMap::putAll);
    }

    public double compatibility(Map<String, Double> userVector, Map<String, Double> targetVector) {
        MatchScore score = score(userVector, targetVector);
        double compatibility = round(score.compatibility());
        if (compatibility == 100.0 && score.weightedRmse() != 0.0) {
            compatibility = 99.9;
        }
        if (compatibility == 0.0 && score.weightedRmse() == 0.0) {
            compatibility = 100.0;
        }
        return compatibility;
    }

    public Map<String, Double> neutralVector() {
        Map<String, Double> neutral = new LinkedHashMap<>();
        AXIS_IDS.forEach(axisId -> neutral.put(axisId, 50.0));
        return neutral;
    }

    private MatchScore score(Map<String, Double> userVector, Map<String, Double> targetVector) {
        double weightedAxisSimilarity = weightedAxisSimilarity(userVector, targetVector);
        double weightedRmse = weightedRmse(userVector, targetVector);
        double distanceSimilarity = 100.0 * Math.exp(-Math.pow(weightedRmse / DISTANCE_DECAY_SPREAD, 1.8));
        double compatibility = (weightedAxisSimilarity * 0.65) + (distanceSimilarity * 0.35);
        return new MatchScore(Math.max(0.0, Math.min(100.0, compatibility)), weightedRmse);
    }

    private double weightedAxisSimilarity(Map<String, Double> userVector, Map<String, Double> targetVector) {
        double totalSimilarity = 0.0;
        double totalWeight = 0.0;
        for (String axisId : AXIS_IDS) {
            double userValue = userVector.getOrDefault(axisId, 50.0);
            double targetValue = targetVector.getOrDefault(axisId, 50.0);
            double diff = Math.abs(userValue - targetValue);
            double similarity = Math.max(0.0, 1.0 - Math.pow(diff / AXIS_SIMILARITY_SPREAD, 2));

            double userSide = Math.abs(userValue - 50.0);
            double targetSide = Math.abs(targetValue - 50.0);
            if ((userValue - 50.0) * (targetValue - 50.0) < 0.0 && userSide >= 12.0 && targetSide >= 15.0) {
                similarity *= OPPOSITE_SIDE_FACTOR;
            }

            double weight = AXIS_WEIGHTS.getOrDefault(axisId, 1.0);
            totalSimilarity += weight * similarity;
            totalWeight += weight;
        }

        return totalWeight == 0.0 ? 0.0 : 100.0 * totalSimilarity / totalWeight;
    }

    private double weightedRmse(Map<String, Double> userVector, Map<String, Double> targetVector) {
        double sumOfSquares = 0.0;
        double totalWeight = 0.0;
        for (String axisId : AXIS_IDS) {
            double diff = userVector.getOrDefault(axisId, 50.0) - targetVector.getOrDefault(axisId, 50.0);
            double weight = AXIS_WEIGHTS.getOrDefault(axisId, 1.0);
            sumOfSquares += weight * diff * diff;
            totalWeight += weight;
        }

        return totalWeight == 0.0 ? 0.0 : Math.sqrt(sumOfSquares / totalWeight);
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private record MatchScore(double compatibility, double weightedRmse) {
    }
}
