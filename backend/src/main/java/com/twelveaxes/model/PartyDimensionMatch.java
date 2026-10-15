package com.twelveaxes.model;

/**
 * Partido, movimento ou organização mais compatível dentro de uma dimensão do
 * perfil (política, social ou econômica).
 */
public record PartyDimensionMatch(
        String dimension,
        PartyMatch match
) {
}

