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
    static final double AXIS_WEIGHT = 0.42;
    static final double DIRECTION_WEIGHT = 0.33;
    static final double MAGNITUDE_WEIGHT = 0.18;
    static final double OUTLIER_WEIGHT = 0.07;
    private static final double OPPOSITE_SIDE_MAX_PENALTY = 0.45;
    private static final double OPPOSITE_SIDE_SPREAD = 25.0;
    static final double OUTLIER_FULL_SPREAD = 100.0;
    static final double OUTLIER_EXPONENT = 2.5;
    // Raio RMS (pontos por eixo) abaixo do qual a direção pesa menos que o termo constante.
    static final double DIRECTION_AUGMENT_RADIUS = 8.0;

    public Map<String, Double> userVectorFor(List<AxisResult> axisResults) {
        return axisResults.stream()
                .collect(HashMap::new, (map, axis) -> map.put(axis.axisId(), axis.leftPercent()), HashMap::putAll);
    }

    public double compatibility(Map<String, Double> userVector, Map<String, Double> targetVector) {
        return compatibility(userVector, targetVector, AXIS_IDS);
    }

    /**
     * Mesma formula, restrita a um subconjunto de eixos. Usada para responder
     * "com quem eu combino politicamente / socialmente / economicamente", em que
     * so os eixos daquele grupo entram na conta.
     */
    public double compatibility(Map<String, Double> userVector, Map<String, Double> targetVector, List<String> axisIds) {
        double axisSimilarity = axisSimilarity(userVector, targetVector, axisIds);
        double directionSimilarity = directionSimilarity(userVector, targetVector, axisIds);
        double magnitudeSimilarity = magnitudeSimilarity(userVector, targetVector, axisIds);
        double outlierSimilarity = outlierSimilarity(userVector, targetVector, axisIds);
        return round1(clamp(
                AXIS_WEIGHT * axisSimilarity
                        + DIRECTION_WEIGHT * directionSimilarity
                        + MAGNITUDE_WEIGHT * magnitudeSimilarity
                        + OUTLIER_WEIGHT * outlierSimilarity
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

    private double axisSimilarity(Map<String, Double> userVector, Map<String, Double> targetVector, List<String> axisIds) {
        double totalSimilarity = 0.0;
        for (String axisId : axisIds) {
            double userValue = userVector.getOrDefault(axisId, CENTER);
            double targetValue = targetVector.getOrDefault(axisId, CENTER);
            double diff = Math.abs(userValue - targetValue);
            double similarity = Math.max(0.0, 1.0 - Math.pow(diff / AXIS_SPREAD, 2));

            if ((userValue - CENTER) * (targetValue - CENTER) < 0.0) {
                similarity *= oppositeSideSimilarityFactor(userValue, targetValue);
            }

            totalSimilarity += similarity;
        }

        return 100.0 * totalSimilarity / axisIds.size();
    }

    private double directionSimilarity(Map<String, Double> userVector, Map<String, Double> targetVector, List<String> axisIds) {
        double dotProduct = 0.0;
        double userNormSquared = 0.0;
        double targetNormSquared = 0.0;
        for (String axisId : axisIds) {
            double centeredUserValue = userVector.getOrDefault(axisId, CENTER) - CENTER;
            double centeredTargetValue = targetVector.getOrDefault(axisId, CENTER) - CENTER;
            dotProduct += centeredUserValue * centeredTargetValue;
            userNormSquared += centeredUserValue * centeredUserValue;
            targetNormSquared += centeredTargetValue * centeredTargetValue;
        }

        // Cosseno aumentado: soma uma componente constante aos dois vetores antes
        // do cosseno. Perto do centro a direção é ruído de resposta, e o termo
        // constante domina (centro x centro = 100); longe do centro converge ao
        // cosseno puro. Mesma fórmula para todo alvo, sem limiar nem caso especial.
        double augment = axisIds.size() * DIRECTION_AUGMENT_RADIUS * DIRECTION_AUGMENT_RADIUS;
        double cosine = (dotProduct + augment)
                / Math.sqrt((userNormSquared + augment) * (targetNormSquared + augment));
        return CENTER + CENTER * cosine;
    }

    private double magnitudeSimilarity(Map<String, Double> userVector, Map<String, Double> targetVector, List<String> axisIds) {
        double userIntensity = averageDistanceFromCenter(userVector, axisIds);
        double targetIntensity = averageDistanceFromCenter(targetVector, axisIds);
        return 100.0 - 2.0 * Math.abs(userIntensity - targetIntensity);
    }

    private double averageDistanceFromCenter(Map<String, Double> vector, List<String> axisIds) {
        return axisIds.stream()
                .mapToDouble(axisId -> Math.abs(vector.getOrDefault(axisId, CENTER) - CENTER))
                .average()
                .orElse(0.0);
    }

    private double outlierSimilarity(Map<String, Double> userVector, Map<String, Double> targetVector, List<String> axisIds) {
        double maxDiff = 0.0;
        for (String axisId : axisIds) {
            double userValue = userVector.getOrDefault(axisId, CENTER);
            double targetValue = targetVector.getOrDefault(axisId, CENTER);
            maxDiff = Math.max(maxDiff, Math.abs(userValue - targetValue));
        }
        return 100.0 * Math.max(0.0, 1.0 - Math.pow(maxDiff / OUTLIER_FULL_SPREAD, OUTLIER_EXPONENT));
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
