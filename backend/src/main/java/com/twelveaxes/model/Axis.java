package com.twelveaxes.model;

/**
 * Representa um eixo político utilizado no cálculo e na exibição
 * dos resultados do quiz.
 *
 * Cada eixo possui dois polos ideológicos opostos e suas respectivas
 * cores para apresentação na interface.
 * 
 * @param id identificador único do eixo
 * @param label nome exibido para o eixo
 * @param leftPole conceito representado pelo polo esquerdo do eixo
 * @param rightPole conceito representado pelo polo direito do eixo
 * @param leftColor cor associada ao polo esquerdo do eixo (formato hexadecimal)
 * @param rightColor cor associada ao polo direito do eixo (formato hexadecimal)
 */
public record Axis(
        String id,
        String label,
        String leftPole,
        String rightPole,
        String leftColor,
        String rightColor
) {
}