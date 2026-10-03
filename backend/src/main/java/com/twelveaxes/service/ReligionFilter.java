package com.twelveaxes.service;

import java.util.List;
import java.util.Locale;
import java.util.Set;

/**
 * Preferencia religiosa opcional do usuario nas recomendacoes.
 *
 * O filtro EXCLUI em vez de exigir: com "catholic" escolhido, some apenas o
 * perfil ligado a outra das religioes selecionaveis e nao ao cristianismo
 * (Arabia Saudita, Khomeini, ou um protestante como Lutero). Perfis seculares ([]) ou so com "other"
 * (hinduismo, xintoismo, religioes antigas) continuam aparecendo. A
 * compatibilidade de cada perfil nao muda; muda so quem entra no ranking.
 *
 * O marcador "only" (ex.: ["judaism", "only"]) torna o perfil exclusivo: ele so
 * aparece para quem escolheu uma das religioes listadas. Quem escolheu "nenhuma"
 * (ou nao escolheu) tambem nao o ve. Serve para perfis cuja identidade e a propria
 * religiao, como o Sionismo Trabalhista.
 */
public final class ReligionFilter {
    /** Denominacoes cristas: o cristianismo e dividido em tres para que cada perfil e cada usuario tenha uma. */
    public static final List<String> CHRISTIAN = List.of("catholic", "protestant", "orthodox");

    /**
     * Valor antigo (links compartilhados ate a divisao em denominacoes): vale como "qualquer
     * denominacao crista". Nenhum perfil usa mais este valor, so a preferencia do usuario.
     */
    public static final String LEGACY_CHRISTIANITY = "christianity";

    /** Religioes que o usuario pode escolher. */
    public static final List<String> SELECTABLE =
            List.of("catholic", "protestant", "orthodox", "judaism", "islam", "buddhism");

    /** Marcador de exclusividade: o perfil so aparece para quem escolheu uma das religioes listadas. */
    public static final String ONLY = "only";

    /** Valores aceitos no campo religions dos catalogos. */
    public static final Set<String> ALLOWED =
            Set.of("catholic", "protestant", "orthodox", "judaism", "islam", "buddhism", "other", ONLY);

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
        if (LEGACY_CHRISTIANITY.equals(value)) {
            return LEGACY_CHRISTIANITY;
        }
        return SELECTABLE.contains(value) ? value : null;
    }

    public static boolean allows(List<String> religions, String preference) {
        if (religions == null || religions.isEmpty()) {
            return true;
        }
        List<String> preferred = preferredReligions(preference);
        boolean matches = religions.stream().anyMatch(preferred::contains);
        if (religions.contains(ONLY)) {
            // ["other", "only"] (ex.: xintoismo): ninguem escolhe "other", entao o perfil fica so para
            // quem nao escolheu religiao e some para quem e de qualquer uma das religioes selecionaveis.
            boolean hasSelectable = religions.stream().anyMatch(SELECTABLE::contains);
            return hasSelectable ? matches : preference == null;
        }
        if (preference == null) {
            return true;
        }
        return matches || religions.stream().noneMatch(SELECTABLE::contains);
    }

    private static List<String> preferredReligions(String preference) {
        if (preference == null) {
            return List.of();
        }
        return LEGACY_CHRISTIANITY.equals(preference) ? CHRISTIAN : List.of(preference);
    }
}
