package com.twelveaxes.model;

import java.util.Map;

public record PartyMatch(
        String partyId,
        String name,
        String category,
        String description,
        String logoPath,
        String logoSourceName,
        String logoSourceUrl,
        String logoNote,
        String countryId,
        String countryName,
        String countryFlagPath,
        boolean historical,
        String period,
        double compatibility,
        double compatibilityPercentile,
        // Vetor de 12 eixos (leftPercent) do perfil, para mostrar os eixos que aproximam o usuario dele.
        Map<String, Double> vector
) {
}
