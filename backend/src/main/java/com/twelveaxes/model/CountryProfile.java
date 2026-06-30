package com.twelveaxes.model;

import java.util.List;
import java.util.Map;

public record CountryProfile(
        String countryId,
        Map<String, Double> vector,
        List<String> tags
) {
    public CountryProfile {
        tags = tags == null ? List.of() : List.copyOf(tags);
    }
}
