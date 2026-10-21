package com.twelveaxes.model;

/**
 * Perfis do catalogo mais proximos de um perfil da comparacao (o proprio perfil fica de fora).
 * Cada campo e null quando o catalogo nao tem outro candidato.
 */
public record CompareNearest(
        IdeologyMatch ideology,
        CountryMatch country,
        PartyMatch party
) {
}
