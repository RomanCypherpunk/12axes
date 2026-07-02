package com.twelveaxes.model;

import java.util.Map;

public record IdeologyProfile(
        String ideologyId,
        Map<String, Double> vector
) {
}
