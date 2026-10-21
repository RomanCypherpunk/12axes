package com.twelveaxes.model;

import java.util.List;

/**
 * Comparacao entre 2 ou 3 perfis: perfis na ordem do pedido, todos os pares i &lt; j e a ideologia
 * mais proxima do conjunto (a do vetor medio dos perfis, sem os perfis que ja sao ideologias da comparacao).
 */
public record CompareProfiles(
        List<CompareProfile> profiles,
        List<ComparePair> pairs,
        IdeologyMatch commonIdeology
) {
}
