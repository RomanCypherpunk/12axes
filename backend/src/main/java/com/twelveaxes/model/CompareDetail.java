package com.twelveaxes.model;

import java.util.Map;

/**
 * Comparacao do usuario com um unico perfil: compatibilidade (mesma formula das outras
 * secoes do resultado) e vetor do perfil para desenhar os 12 eixos.
 */
public record CompareDetail(
        CompareItem item,
        String description,
        double compatibility,
        // Vetor de 12 eixos (leftPercent) do perfil comparado.
        Map<String, Double> vector
) {
}
