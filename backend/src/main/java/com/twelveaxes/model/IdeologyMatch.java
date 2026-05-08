package com.twelveaxes.model;

public record IdeologyMatch(
        String ideologyId,
        String name,
        String category,
        String description,
        String longDescription,
        double compatibility
) {
}
