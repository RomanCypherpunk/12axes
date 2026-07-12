package com.twelveaxes.model;

public record CountryMatch(
        String countryId,
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
        double compatibility,
        double compatibilityPercentile
) {
}
