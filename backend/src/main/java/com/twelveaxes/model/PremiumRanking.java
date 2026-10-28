package com.twelveaxes.model;

import java.util.List;

/** Ranking completo de compatibilidade com cada perfil do catalogo (o que o filtro de religiao deixa ver), do mais ao menos compativel. */
public record PremiumRanking(
        List<RankingRow> ideologies,
        List<RankingRow> personalities,
        List<RankingRow> countries,
        List<RankingRow> parties
) {
}
