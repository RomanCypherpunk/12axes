package com.twelveaxes.model;

public record AnswerOption(
        AnswerValue id,
        String label,
        double scoreTowardAgreement
) {
}
