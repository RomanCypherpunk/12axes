package com.twelveaxes.model;

/** Um candidato ranqueado para o usuario: a personalidade (com a compatibilidade) e o partido pelo qual concorre. */
public record ElectionCandidateMatch(PersonalityMatch candidate, PartyMatch party) {
}
