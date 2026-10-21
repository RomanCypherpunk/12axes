package com.twelveaxes.model;

import java.util.Map;

/** Um perfil da comparacao entre perfis: dados do catalogo, vetor de 12 eixos (leftPercent) e seus vizinhos mais proximos. */
public record CompareProfile(
        CompareItem item,
        Map<String, Double> vector,
        CompareNearest nearest
) {
}
