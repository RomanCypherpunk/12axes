package com.twelveaxes.model;

import java.util.List;

/** Comparacao entre 2 ou 3 perfis: perfis na ordem do pedido e todos os pares i &lt; j. */
public record CompareProfiles(
        List<CompareProfile> profiles,
        List<ComparePair> pairs
) {
}
