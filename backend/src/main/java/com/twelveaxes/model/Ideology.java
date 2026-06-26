package com.twelveaxes.model;

import java.util.Map;

public record Ideology(
        String id,
        String name,
        String category,
        String description,
        String countryId,
        Map<String, Double> vector
) {
}
