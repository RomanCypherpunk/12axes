package com.twelveaxes.model;

/**
 * Distancia entre o usuario e um perfil (ideologia, personalidade ou pais) em um eixo, em pontos de leftPercent.
 *
 * @param axisId id do eixo
 * @param label nome do eixo no idioma pedido
 * @param userLeftPercent posicao do usuario (0 a 100, 50 no centro)
 * @param profileLeftPercent posicao do perfil no mesmo eixo
 * @param difference usuario menos perfil: positivo = o usuario esta mais para o polo esquerdo
 */
public record AxisDivergence(String axisId, String label, double userLeftPercent, double profileLeftPercent, double difference) {
}
