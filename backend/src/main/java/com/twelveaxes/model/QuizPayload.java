package com.twelveaxes.model;

import java.util.List;

public record QuizPayload(
        String title,
        String description,
        List<Axis> axes,
        List<Question> questions,
        List<AnswerOption> answerOptions
) {
}
