package com.twelveaxes.model;

/**
 * Representa o resultado do usuário em um eixo ideológico do quiz.
 * 
 * Contém as porcentagens obtidas em cada polo do eixo, 
 * bem como o polo predominante e a intensidade dessa predominância.
 * 
 * @param axisId identificador único do eixo
 * @param label nome exibido para o eixo
 * @param leftPole conceito representado pelo polo esquerdo do eixo
 * @param rightPole conceito representado pelo polo direito do eixo
 * @param leftPercent porcentagem do usuário obtida no polo esquerdo
 * @param rightPercent porcentagem do usuário obtida no polo direito
 * @param dominantPole polo predominante no resultado do usuário
 * @param intensity intensidade da predominância no eixo
 */
public record AxisResult(
        String axisId,
        String label,
        String leftPole,
        String rightPole,
        double leftPercent,
        double rightPercent,
        String dominantPole,
        String intensity
) {
}
