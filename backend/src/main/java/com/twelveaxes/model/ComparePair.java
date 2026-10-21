package com.twelveaxes.model;

/**
 * Compatibilidade entre dois perfis da comparacao.
 *
 * @param first indice do primeiro perfil em {@link CompareProfiles#profiles()}
 * @param second indice do segundo perfil (sempre maior que first)
 * @param compatibility compatibilidade simetrica de 0 a 100 (mesma formula dos resultados)
 */
public record ComparePair(
        int first,
        int second,
        double compatibility
) {
}
