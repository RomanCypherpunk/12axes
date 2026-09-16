package com.twelveaxes.model;

public record PersonalityMatch(
        String personalityId,
        String name,
        String role,
        String category,
        String lifespan,
        String description,
        String imagePath,
        String imageSourceName,
        String imageSourceUrl,
        String imageNote,
        double compatibility,
        double compatibilityPercentile
) {
}
