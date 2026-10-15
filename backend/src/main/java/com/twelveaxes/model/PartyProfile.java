package com.twelveaxes.model;

import java.util.Map;

public record PartyProfile(
        String partyId,
        Map<String, Double> vector
) {
}
