package com.twelveaxes.service;

import java.util.List;
import java.util.Locale;
import java.util.Set;

/**
 * Preferencia religiosa opcional do usuario nas recomendacoes.
 *
 * O filtro EXCLUI em vez de exigir: com "christianity" escolhido, some apenas o
 * perfil ligado a outra das religioes selecionaveis e nao ao cristianismo
 * (Arabia Saudita, Khomeini). Perfis seculares ([]) ou so com "other"
 * (xintoismo, religioes antigas) continuam aparecendo. A
 * compatibilidade de cada perfil nao muda; muda so quem entra no ranking.
 *
 * O marcador "only" (ex.: ["judaism", "only"]) torna o perfil exclusivo: ele so
 * aparece para quem escolheu uma das religioes listadas. Quem escolheu "nenhuma"
 * (ou nao escolheu) tambem nao o ve. Serve para perfis cuja identidade e a propria
 * religiao, como o Sionismo Trabalhista.
 */
public final class ReligionFilter {
    /** Religioes que o usuario pode escolher. */
    public static final List<String> SELECTABLE = List.of("christianity", "judaism", "islam", "buddhism", "hinduism");

    /** Marcador de exclusividade: o perfil so aparece para quem escolheu uma das religioes listadas. */
    public static final String ONLY = "only";

    /** Valores aceitos no campo religions dos catalogos. */
    public static final Set<String> ALLOWED = Set.of("christianity", "judaism", "islam", "buddhism", "hinduism", "other", ONLY);

    /** Perfis com religiao &le; este valor no polo irreligioso precisam de ao menos uma religiao. */
    public static final double RELIGIOUS_THRESHOLD = 35.0;

    private ReligionFilter() {
    }

    /** Valor valido da URL, ou null (sem filtro) para ausente/desconhecido. */
    public static String normalize(String raw) {
        if (raw == null) {
            return null;
        }
        String value = raw.trim().toLowerCase(Locale.ROOT);
        return SELECTABLE.contains(value) ? value : null;
    }

    public static boolean allows(List<String> religions, String preference) {
        if (religions == null || religions.isEmpty()) {
            return true;
        }
        if (religions.contains(ONLY)) {
            return preference != null && religions.contains(preference);
        }
        if (preference == null) {
            return true;
        }
        return religions.contains(preference) || religions.stream().noneMatch(SELECTABLE::contains);
    }
}
