package com.twelveaxes.model;

/**
 * Um perfil da linha do tempo: uma personalidade, um pais/regime OU um partido/organizacao
 * (os outros dois campos sao nulos).
 *
 * @param type "personality", "country" ou "party"
 * @param personality a personalidade, quando type for "personality"
 * @param country o pais ou regime, quando type for "country"
 * @param party o partido ou organizacao, quando type for "party"
 */
public record TimelineEntry(String type, PersonalityMatch personality, CountryMatch country, PartyMatch party) {
    public double compatibility() {
        if (personality != null) {
            return personality.compatibility();
        }
        return country != null ? country.compatibility() : party.compatibility();
    }

    public String name() {
        if (personality != null) {
            return personality.name();
        }
        return country != null ? country.name() : party.name();
    }
}
