package com.twelveaxes.model;

/**
 * Uma das sete inclinacoes de um eixo, pela distancia do usuario ao centro (50). Os cortes sao os mesmos da
 * intensidade que o resultado ja mostra: equilibrado (menos de 7,5 pontos), inclinado (menos de 22,5), forte (menos de
 * 37,5) e muito forte, para cada lado.
 *
 * @param side "left" (polo esquerdo do eixo), "right" (direito) ou "balanced"
 * @param level "equilibrado", "inclinado", "forte" ou "muito_forte"
 */
public record AxisLevel(String side, String level) {
    public static AxisLevel of(double leftPercent) {
        double distance = Math.abs(leftPercent - 50.0);
        if (distance < 7.5) {
            return new AxisLevel("balanced", "equilibrado");
        }
        String side = leftPercent > 50.0 ? "left" : "right";
        if (distance < 22.5) {
            return new AxisLevel(side, "inclinado");
        }
        return new AxisLevel(side, distance < 37.5 ? "forte" : "muito_forte");
    }

    /** Chave do texto fixo: "estrutura.left.forte", ou "estrutura.balanced" quando equilibrado. */
    public String textKey(String axisId) {
        return "balanced".equals(side) ? axisId + ".balanced" : axisId + "." + side + "." + level;
    }
}
