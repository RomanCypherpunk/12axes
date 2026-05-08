package com.twelveaxes.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SubmittedAnswer(
        @NotBlank String questionId,
        @NotNull AnswerValue answer
) {
}
