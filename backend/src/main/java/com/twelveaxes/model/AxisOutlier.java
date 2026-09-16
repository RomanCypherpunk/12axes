package com.twelveaxes.model;

/**
 * Posicao do usuario em um eixo comparada ao catalogo de ideologias.
 *
 * Usado para apontar onde o perfil mais destoa e onde mais se parece com o
 * conjunto das ideologias — uma leitura que a compatibilidade sozinha nao da.
 *
 * @param axisId identificador do eixo
 * @param label nome exibido do eixo
 * @param userPercent posicao do usuario no eixo (0-100, percentual do polo esquerdo)
 * @param catalogMedian mediana do catalogo de ideologias nesse eixo
 * @param distanceFromMedian distancia absoluta entre o usuario e a mediana
 * @param dominantPole polo para o qual o usuario pende nesse eixo
 * @param strongerThanPercent percentual do catalogo que o usuario supera na direcao do polo dominante
 */
public record AxisOutlier(
        String axisId,
        String label,
        double userPercent,
        double catalogMedian,
        double distanceFromMedian,
        String dominantPole,
        double strongerThanPercent
) {
}
