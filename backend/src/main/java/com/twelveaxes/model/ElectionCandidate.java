package com.twelveaxes.model;

/**
 * Um candidato de uma eleicao: ids de uma personalidade e de um partido que ja existem no catalogo
 * (os perfis, nomes e retratos vem de la, ja traduzidos).
 */
public record ElectionCandidate(String personalityId, String partyId) {
}
