package com.twelveaxes.model;

/**
 * Quanto uma resposta puxou o resultado de um eixo, em pontos de leftPercent: positivo puxa para o polo esquerdo,
 * negativo para o direito. A soma dos impactos de um eixo e a distancia dele ao centro (50).
 *
 * @param questionId id da pergunta
 * @param question texto da pergunta no idioma pedido
 * @param answer resposta dada
 * @param impact pontos de leftPercent que essa resposta somou ao eixo
 */
public record AnswerImpact(String questionId, String question, AnswerValue answer, double impact) {
}
