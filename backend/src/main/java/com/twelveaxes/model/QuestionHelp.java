package com.twelveaxes.model;

/**
 * Explicação de uma pergunta, já no idioma pedido: o que significa concordar e discordar.
 *
 * @param agree           a posição de quem concorda
 * @param disagree        a posição de quem discorda
 * @param note            aviso para quem pensa fora do enquadramento da pergunta; null quando não há
 * @param agreeExample    país real que adota a posição de quem concorda; null quando não há
 * @param disagreeExample país real que adota a posição de quem discorda; null quando não há
 */
public record QuestionHelp(String agree, String disagree, String note, String agreeExample, String disagreeExample) {
}
