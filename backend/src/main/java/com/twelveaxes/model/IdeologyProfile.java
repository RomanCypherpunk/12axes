package com.twelveaxes.model;

import java.util.List;
import java.util.Map;

public record IdeologyProfile(
        String ideologyId,
        Map<String, Double> vector,
        List<String> countryTags
) {
    public IdeologyProfile {
        countryTags = countryTags == null ? List.of() : List.copyOf(countryTags);
    }
}
