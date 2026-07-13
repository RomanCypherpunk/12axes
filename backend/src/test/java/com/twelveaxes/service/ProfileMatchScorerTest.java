package com.twelveaxes.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.LinkedHashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;

class ProfileMatchScorerTest {
    private static final double DIRECTION_NEUTRAL_SCORE = 50.0;
    private static final double MAGNITUDE_PERFECT_SCORE = 100.0;

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
                .isEqualTo(expectedScore(100.0, DIRECTION_NEUTRAL_SCORE, MAGNITUDE_PERFECT_SCORE));
    }

    @Test
    void neutralUserOrTargetKeepsDirectionComponentNeutral() {
        Map<String, Double> neutral = scorer.neutralVector();
        Map<String, Double> target = vector(Map.of(
                "estrutura", 100.0,
                "representacao", 100.0,
                "poder", 100.0
        ));

        double expected = expectedScore(75.0, DIRECTION_NEUTRAL_SCORE, 75.0);
        assertThat(scorer.compatibility(neutral, target)).isEqualTo(expected);
        assertThat(scorer.compatibility(target, neutral)).isEqualTo(expected);
    }

    @Test
    void mildProfileBeatsPerfectlyAlignedExtremeProfileForMildUser() {
        Map<String, Double> mildUser = vector(Map.ofEntries(
                Map.entry("estrutura", 58.0),
                Map.entry("representacao", 58.0),
                Map.entry("poder", 58.0),
                Map.entry("imigracao", 58.0),
                Map.entry("diplomacia", 58.0),
                Map.entry("intervencao", 58.0),
                Map.entry("economia", 58.0),
                Map.entry("controle", 58.0),
                Map.entry("comercio", 58.0),
                Map.entry("religiao", 58.0),
                Map.entry("moral", 58.0),
                Map.entry("tecnologia", 58.0)
        ));
        Map<String, Double> alignedExtremeTarget = vector(Map.ofEntries(
                Map.entry("estrutura", 78.0),
                Map.entry("representacao", 78.0),
                Map.entry("poder", 78.0),
                Map.entry("imigracao", 78.0),
                Map.entry("diplomacia", 78.0),
                Map.entry("intervencao", 78.0),
                Map.entry("economia", 78.0),
                Map.entry("controle", 78.0),
                Map.entry("comercio", 78.0),
                Map.entry("religiao", 78.0),
                Map.entry("moral", 78.0),
                Map.entry("tecnologia", 78.0)
        ));
        Map<String, Double> similarlyMildTarget = vector(Map.ofEntries(
                Map.entry("estrutura", 58.0),
                Map.entry("representacao", 58.0),
                Map.entry("poder", 58.0),
                Map.entry("imigracao", 58.0),
                Map.entry("diplomacia", 58.0),
                Map.entry("intervencao", 58.0),
                Map.entry("economia", 58.0),
                Map.entry("controle", 58.0),
                Map.entry("comercio", 58.0),
                Map.entry("religiao", 42.0),
                Map.entry("moral", 42.0),
                Map.entry("tecnologia", 42.0)
        ));

        assertThat(scorer.compatibility(mildUser, similarlyMildTarget))
                .isGreaterThan(scorer.compatibility(mildUser, alignedExtremeTarget));
    }

    @Test
    void weightsAddUpToOne() {
        assertThat(ProfileMatchScorer.AXIS_WEIGHT
                + ProfileMatchScorer.DIRECTION_WEIGHT
                + ProfileMatchScorer.MAGNITUDE_WEIGHT)
                .isEqualTo(1.0);
    }

    private double expectedScore(double axisSimilarity, double directionSimilarity, double magnitudeSimilarity) {
        return round1(ProfileMatchScorer.AXIS_WEIGHT * axisSimilarity
                + ProfileMatchScorer.DIRECTION_WEIGHT * directionSimilarity
                + ProfileMatchScorer.MAGNITUDE_WEIGHT * magnitudeSimilarity);
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
