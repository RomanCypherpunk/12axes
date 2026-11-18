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

    /**
     * Mesma formula, com um peso por eixo (so entram os eixos com peso positivo). Com todos os pesos iguais o resultado e o da
     * versao sem pesos. Usada pelas areas do relatorio pago, em que os eixos da area pesam mais que os outros.
     * No outlier, a diferenca de cada eixo e escalada por peso/pesoMaximo: um eixo secundario quase nao puxa o maior desvio.
     */
    public double compatibility(Map<String, Double> userVector, Map<String, Double> targetVector, Map<String, Double> axisWeights) {
        double totalWeight = 0.0;
        double maxWeight = 0.0;
        for (double weight : axisWeights.values()) {
            if (weight > 0.0) {
                totalWeight += weight;
                maxWeight = Math.max(maxWeight, weight);
            }
        }
        if (totalWeight == 0.0) {
            return 0.0;
        }
        double similaritySum = 0.0;
        double dot = 0.0;
        double userNormSquared = 0.0;
        double targetNormSquared = 0.0;
        double userIntensity = 0.0;
        double targetIntensity = 0.0;
        double maxScaledDiff = 0.0;
        for (Map.Entry<String, Double> entry : axisWeights.entrySet()) {
            double weight = entry.getValue();
            if (weight <= 0.0) {
                continue;
            }
            double userValue = userVector.getOrDefault(entry.getKey(), CENTER);
            double targetValue = targetVector.getOrDefault(entry.getKey(), CENTER);
            similaritySum += weight * singleAxisSimilarity(userValue, targetValue);
            double centeredUser = userValue - CENTER;
            double centeredTarget = targetValue - CENTER;
            dot += weight * centeredUser * centeredTarget;
            userNormSquared += weight * centeredUser * centeredUser;
            targetNormSquared += weight * centeredTarget * centeredTarget;
            userIntensity += weight * Math.abs(centeredUser);
            targetIntensity += weight * Math.abs(centeredTarget);
            maxScaledDiff = Math.max(maxScaledDiff, Math.abs(userValue - targetValue) * (weight / maxWeight));
        }
        double axisSimilarity = 100.0 * similaritySum / totalWeight;
        double augment = totalWeight * DIRECTION_AUGMENT_RADIUS * DIRECTION_AUGMENT_RADIUS;
        double cosine = (dot + augment) / Math.sqrt((userNormSquared + augment) * (targetNormSquared + augment));
        double directionSimilarity = CENTER + CENTER * cosine;
        double magnitudeSimilarity = 100.0 - 2.0 * Math.abs(userIntensity / totalWeight - targetIntensity / totalWeight);
        double outlierSimilarity = 100.0 * Math.max(0.0, 1.0 - Math.pow(maxScaledDiff / OUTLIER_FULL_SPREAD, OUTLIER_EXPONENT));
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

    /**
     * Percentis de todas as notas de um catalogo de uma vez: ordena uma vez e
     * localiza cada nota por busca binaria. Mesmo resultado de chamar
     * percentile() para cada uma, mas em O(n log n) em vez de O(n^2).
     */
    public double[] percentiles(List<Double> catalogCompatibilities) {
        int size = catalogCompatibilities.size();
        double[] result = new double[size];
        if (size == 0) {
            return result;
        }
        double[] sorted = catalogCompatibilities.stream().mapToDouble(Double::doubleValue).sorted().toArray();
        for (int i = 0; i < size; i++) {
            result[i] = round1(100.0 * countLower(sorted, catalogCompatibilities.get(i)) / size);
        }
        return result;
    }

    private static int countLower(double[] sorted, double value) {
        int low = 0;
        int high = sorted.length;
        while (low < high) {
            int mid = (low + high) >>> 1;
            if (sorted[mid] < value) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        return low;
    }

    public Map<String, Double> neutralVector() {
        Map<String, Double> neutral = new LinkedHashMap<>();
        AXIS_IDS.forEach(axisId -> neutral.put(axisId, CENTER));
        return neutral;
    }

    // A similaridade de um eixo: quadratica na distancia, com penalidade quando os dois ficam em lados opostos do centro.
    private double singleAxisSimilarity(double userValue, double targetValue) {
        double diff = Math.abs(userValue - targetValue);
        double similarity = Math.max(0.0, 1.0 - Math.pow(diff / AXIS_SPREAD, 2));
        if ((userValue - CENTER) * (targetValue - CENTER) < 0.0) {
            similarity *= oppositeSideSimilarityFactor(userValue, targetValue);
        }
        return similarity;
    }

    private double axisSimilarity(Map<String, Double> userVector, Map<String, Double> targetVector, List<String> axisIds) {
        double totalSimilarity = 0.0;
        for (String axisId : axisIds) {
            totalSimilarity += singleAxisSimilarity(userVector.getOrDefault(axisId, CENTER), targetVector.getOrDefault(axisId, CENTER));
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
