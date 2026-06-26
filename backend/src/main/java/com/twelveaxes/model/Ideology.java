package com.twelveaxes.model;

import java.util.Map;

public record Ideology(
        String id,
        String name,
        String category,
        String description,
        String countryId,
        String personalityId,
        Map<String, Double> vector
) {
}
