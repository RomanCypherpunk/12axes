package com.twelveaxes.model;

public record IdeologyMatch(
        String ideologyId,
        String name,
        String category,
        String description,
        String longDescription,
        String phrase,
        double compatibility,
        double compatibilityPercentile
) {
}
