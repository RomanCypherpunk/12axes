package com.twelveaxes.model;

/**
 * País ou experiência histórica mais compatível dentro de uma dimensão do
 * perfil (política, social ou econômica).
 */
public record CountryDimensionMatch(
        String dimension,
        CountryMatch match
) {
}
