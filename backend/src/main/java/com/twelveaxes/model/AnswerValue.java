package com.twelveaxes.model;

public enum AnswerValue {
    STRONGLY_AGREE(1.0),
    AGREE(0.75),
    NEUTRAL(0.5),
    DISAGREE(0.25),
    STRONGLY_DISAGREE(0.0);

    private final double scoreTowardAgreement;

    AnswerValue(double scoreTowardAgreement) {
        this.scoreTowardAgreement = scoreTowardAgreement;
    }

    public double scoreTowardAgreement() {
        return scoreTowardAgreement;
    }
}
