package com.twelveaxes.model;

import java.util.List;

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
        List<String> tags,
        double compatibility
) {
}
