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

    private static final double CENTER = 50.0;
    private static final double AXIS_SPREAD = 50.0;
    static final double AXIS_WEIGHT = 0.50;
    private static final double OPPOSITE_SIDE_MAX_PENALTY = 0.45;
    private static final double OPPOSITE_SIDE_SPREAD = 25.0;

    public Map<String, Double> userVectorFor(List<AxisResult> axisResults) {
        return axisResults.stream()
                .collect(HashMap::new, (map, axis) -> map.put(axis.axisId(), axis.leftPercent()), HashMap::putAll);
    }

    public double compatibility(Map<String, Double> userVector, Map<String, Double> targetVector) {
        double axisSimilarity = axisSimilarity(userVector, targetVector);
        double directionSimilarity = directionSimilarity(userVector, targetVector);
        return round1(clamp(
                AXIS_WEIGHT * axisSimilarity
                        + (1.0 - AXIS_WEIGHT) * directionSimilarity
        ));
    }

    public double percentile(double compatibility, List<Double> catalogCompatibilities) {
        if (catalogCompatibilities.isEmpty()) {
            return 0.0;
        }
        long lowerScores = catalogCompatibilities.stream()
                .filter(score -> score < compatibility)
                .count();
        return round1(100.0 * lowerScores / catalogCompatibilities.size());
    }

    public Map<String, Double> neutralVector() {
        Map<String, Double> neutral = new LinkedHashMap<>();
        AXIS_IDS.forEach(axisId -> neutral.put(axisId, CENTER));
        return neutral;
    }

    private double axisSimilarity(Map<String, Double> userVector, Map<String, Double> targetVector) {
        double totalSimilarity = 0.0;
        for (String axisId : AXIS_IDS) {
            double userValue = userVector.getOrDefault(axisId, CENTER);
            double targetValue = targetVector.getOrDefault(axisId, CENTER);
            double diff = Math.abs(userValue - targetValue);
            double similarity = Math.max(0.0, 1.0 - Math.pow(diff / AXIS_SPREAD, 2));

            if ((userValue - CENTER) * (targetValue - CENTER) < 0.0) {
                similarity *= oppositeSideSimilarityFactor(userValue, targetValue);
            }

            totalSimilarity += similarity;
        }

        return 100.0 * totalSimilarity / AXIS_IDS.size();
    }

    private double directionSimilarity(Map<String, Double> userVector, Map<String, Double> targetVector) {
        double dotProduct = 0.0;
        double userNormSquared = 0.0;
        double targetNormSquared = 0.0;
        for (String axisId : AXIS_IDS) {
            double centeredUserValue = userVector.getOrDefault(axisId, CENTER) - CENTER;
            double centeredTargetValue = targetVector.getOrDefault(axisId, CENTER) - CENTER;
            dotProduct += centeredUserValue * centeredTargetValue;
            userNormSquared += centeredUserValue * centeredUserValue;
            targetNormSquared += centeredTargetValue * centeredTargetValue;
        }

        if (userNormSquared == 0.0 || targetNormSquared == 0.0) {
            return CENTER;
        }
        double cosine = dotProduct / (Math.sqrt(userNormSquared) * Math.sqrt(targetNormSquared));
        return CENTER + CENTER * cosine;
    }

    private double oppositeSideSimilarityFactor(double userValue, double targetValue) {
        double userSide = Math.abs(userValue - CENTER);
        double targetSide = Math.abs(targetValue - CENTER);
        double penalty = OPPOSITE_SIDE_MAX_PENALTY
                * Math.tanh(userSide / OPPOSITE_SIDE_SPREAD)
                * Math.tanh(targetSide / OPPOSITE_SIDE_SPREAD);
        return 1.0 - penalty;
    }

    private double clamp(double value) {
        return Math.max(0.0, Math.min(100.0, value));
    }

    private double round1(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
