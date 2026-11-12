package com.twelveaxes.model;

import java.util.List;

/**
 * @param valueTrees arvores dos valores completos (so no quiz de 240 perguntas; lista vazia nas outras variantes)
 */
public record QuizPayload(
        String title,
        String description,
        String variant,
        int questionCount,
        int questionsPerAxis,
        List<Axis> axes,
        List<Question> questions,
        List<AnswerOption> answerOptions,
        List<ArchetypeQuestion.View> archetypeQuestions,
        List<ValueTree.View> valueTrees
) {
    /** Copia com as arvores dos valores completos. */
    public QuizPayload withValueTrees(List<ValueTree.View> trees) {
        return new QuizPayload(title, description, variant, questionCount, questionsPerAxis, axes, questions,
                answerOptions, archetypeQuestions, trees);
    }
}
