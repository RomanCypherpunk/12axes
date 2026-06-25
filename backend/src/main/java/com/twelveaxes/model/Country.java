package com.twelveaxes.model;

import java.util.Map;

public record Country(
        String id,
        String name,
        String category,
        String description,
        String flagPath,
        String flagKind,
        String flagSourceName,
        String flagSourceUrl,
        String flagNote,
        boolean historical,
        String period,
        Map<String, Double> vector
) {
}
