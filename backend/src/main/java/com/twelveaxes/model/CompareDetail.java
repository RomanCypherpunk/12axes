package com.twelveaxes.model;

import java.util.List;
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
        Map<String, Double> vector,
        // Religioes do perfil no catalogo (so os valores do JSON, sem o marcador "only"); vazia quando nao ha vinculo.
        List<String> religions
) {
}
