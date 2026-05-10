package com.twelveaxes.model;

import java.util.List;

public record QuizPayload(
        String title,
        String description,
        String variant,
        int questionCount,
        List<Axis> axes,
        List<Question> questions,
        List<AnswerOption> answerOptions
) {
    public QuizPayload(
            String title,
            String description,
            List<Axis> axes,
            List<Question> questions,
            List<AnswerOption> answerOptions
    ) {
        this(title, description, "short", questions.size(), axes, questions, answerOptions);
    }
}
