package com.twelveaxes.model;

/**
 * Representa os possíveis níveis de concordância para uma resposta do quiz.
 *
 * Cada valor possui uma pontuação normalizada entre 0.0 (discordância total)
 * e 1.0 (concordância total), utilizada no cálculo dos eixos ideológicos.
 */
public enum AnswerValue {

    STRONGLY_AGREE(1.0),
    AGREE(0.75),
    NEUTRAL(0.5),
    DISAGREE(0.25),
    STRONGLY_DISAGREE(0.0);

    /**
     * Pontuação normalizada que representa o grau de concordância da resposta.
     */
    private final double scoreTowardAgreement;

    AnswerValue(double scoreTowardAgreement) {
        this.scoreTowardAgreement = scoreTowardAgreement;
    }

    /**
     * Retorna a pontuação associada ao nível de concordância.
     *
     * @return valor entre 0.0 e 1.0
     */
    public double scoreTowardAgreement() {
        return scoreTowardAgreement;
    }
}