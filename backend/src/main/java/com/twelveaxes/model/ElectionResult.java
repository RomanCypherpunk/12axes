package com.twelveaxes.model;

import java.util.List;

/**
 * Uma eleicao no resultado do usuario.
 *
 * @param name nome ja no idioma do pedido
 * @param candidates candidatos do mais ao menos compativel
 */
public record ElectionResult(
        String id,
        String countryId,
        String date,
        String name,
        List<ElectionCandidateMatch> candidates
) {
}
