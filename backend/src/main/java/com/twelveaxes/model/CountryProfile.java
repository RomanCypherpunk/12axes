package com.twelveaxes.model;

import java.util.Map;

public record CountryProfile(
        String countryId,
        Map<String, Double> vector
) {
}
