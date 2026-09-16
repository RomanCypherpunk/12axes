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
 * @param dominantPole polo para o qual o usuario pende, ou null quando esta no centro
 * @param balanced true quando o usuario esta perto demais do centro para pender a um polo
 * @param abovePole polo na direcao do qual o usuario supera parte do catalogo
 * @param abovePercent percentual do catalogo que fica atras do usuario na direcao de abovePole
 */
public record AxisOutlier(
        String axisId,
        String label,
        double userPercent,
        double catalogMedian,
        double distanceFromMedian,
        String dominantPole,
        boolean balanced,
        String abovePole,
        double abovePercent
) {
}
