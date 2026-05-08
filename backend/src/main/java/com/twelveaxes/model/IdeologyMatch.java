package com.twelveaxes.model;

public record IdeologyMatch(
        String ideologyId,
        String name,
        String category,
        String description,
        double compatibility
) {
}
