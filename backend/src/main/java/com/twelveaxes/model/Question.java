package com.twelveaxes.model;

/**
 * @param help ajuda de leitura no idioma da pergunta; null quando ainda não foi escrita
 */
public record Question(
        String id,
        String axisId,
        String text,
        Pole agreePole,
        double weight,
        QuestionHelp help
) {
    public Question withText(String newText) {
        return new Question(id, axisId, newText, agreePole, weight, help);
    }

    public Question withHelp(QuestionHelp newHelp) {
        return new Question(id, axisId, text, agreePole, weight, newHelp);
    }
}
