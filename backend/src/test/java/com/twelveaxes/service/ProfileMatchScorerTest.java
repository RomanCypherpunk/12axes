package com.twelveaxes.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.LinkedHashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;

class ProfileMatchScorerTest {
    private static final double DIRECTION_NEUTRAL_SCORE = 50.0;

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
    void neutralVectorScoresByFormulaAgainstItselfBecauseDirectionIsUndefined() {
        Map<String, Double> neutral = scorer.neutralVector();

        assertThat(scorer.compatibility(neutral, neutral))
                .isEqualTo(expectedScore(100.0, DIRECTION_NEUTRAL_SCORE));
    }

    @Test
    void neutralUserOrTargetKeepsDirectionComponentNeutral() {
        Map<String, Double> neutral = scorer.neutralVector();
        Map<String, Double> target = vector(Map.of(
                "estrutura", 100.0,
                "representacao", 100.0,
                "poder", 100.0
        ));

        double expected = expectedScore(75.0, DIRECTION_NEUTRAL_SCORE);
        assertThat(scorer.compatibility(neutral, target)).isEqualTo(expected);
        assertThat(scorer.compatibility(target, neutral)).isEqualTo(expected);
    }

    private double expectedScore(double axisSimilarity, double directionSimilarity) {
        return round1(ProfileMatchScorer.AXIS_WEIGHT * axisSimilarity
                + (1.0 - ProfileMatchScorer.AXIS_WEIGHT) * directionSimilarity);
    }

    private double round1(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private Map<String, Double> vector(Map<String, Double> overrides) {
        Map<String, Double> vector = new LinkedHashMap<>(scorer.neutralVector());
        vector.putAll(overrides);
        return vector;
    }
}
