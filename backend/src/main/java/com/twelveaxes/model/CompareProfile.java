package com.twelveaxes.model;

import java.util.Map;

/** Um perfil da comparacao entre perfis: dados do catalogo e vetor de 12 eixos (leftPercent). */
public record CompareProfile(
        CompareItem item,
        Map<String, Double> vector
) {
}
