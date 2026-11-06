package com.twelveaxes.model;

import java.util.List;

/**
 * Analise de um eixo para o relatorio pago: onde o usuario esta, o que isso significa e o que mais pesou.
 *
 * @param axisId id do eixo
 * @param label nome do eixo no idioma pedido
 * @param userLeftPercent posicao do usuario (0 a 100, 50 no centro)
 * @param side "left", "right" ou "balanced"
 * @param level "equilibrado", "inclinado", "forte" ou "muito_forte"
 * @param text texto fixo daquela inclinacao, ou nulo enquanto ainda nao foi escrito
 * @param pros por que quem tem essa tendencia costuma ser elogiado (texto do polo); nulo no equilibrado
 * @param cons por que quem tem essa tendencia costuma ser criticado (texto do polo); nulo no equilibrado
 * @param impacts as respostas que mais puxaram o eixo (ate 5), da que mais pesou para a que menos pesou
 * @param ideologyLeftPercent posicao da ideologia mais compativel neste eixo
 * @param personalityLeftPercent posicao da personalidade mais compativel neste eixo
 * @param countryLeftPercent posicao do pais mais compativel neste eixo
 */
public record AxisAnalysis(
        String axisId,
        String label,
        double userLeftPercent,
        String side,
        String level,
        String text,
        String pros,
        String cons,
        List<AnswerImpact> impacts,
        Double ideologyLeftPercent,
        Double personalityLeftPercent,
        Double countryLeftPercent
) {
}
