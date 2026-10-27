package com.twelveaxes.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Set;

/**
 * Preferencia religiosa opcional do usuario nas recomendacoes.
 *
 * O filtro EXCLUI em vez de exigir: com "catholic" escolhido, some apenas o
 * perfil ligado a outra das religioes selecionaveis e nao ao cristianismo
 * (Arabia Saudita, Khomeini, ou um protestante como Lutero). Perfis seculares ([]) ou so com "other"
 * (xintoismo, sikhismo, religioes antigas) continuam aparecendo. A
 * compatibilidade de cada perfil nao muda; muda so quem entra no ranking.
 *
 * "other" tambem pode ser escolhido pelo usuario ("outra religiao"): some todo perfil ligado a
 * uma das religioes selecionaveis e ficam os perfis so com "other" (xintoismo, sikhismo, religioes
 * antigas) e os seculares ([]).
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
            List.of("catholic", "protestant", "orthodox", "judaism", "islam", "buddhism", "hinduism");

    /**
     * "Outra religiao": preferencia do usuario fora das selecionaveis acima. Oculta os perfis ligados
     * a uma religiao especifica e mantem os so com "other" e os seculares.
     */
    public static final String OTHER = "other";

    /** Marcador de exclusividade: o perfil so aparece para quem escolheu uma das religioes listadas. */
    public static final String ONLY = "only";

    /** Valores aceitos no campo religions dos catalogos. */
    public static final Set<String> ALLOWED =
            Set.of("catholic", "protestant", "orthodox", "judaism", "islam", "buddhism", "hinduism", "other", ONLY);

    /** Perfis com religiao &le; este valor no polo irreligioso precisam de ao menos uma religiao. */
    public static final double RELIGIOUS_THRESHOLD = 35.0;

    private ReligionFilter() {
    }

    /**
     * Valor valido da URL, ou null (sem filtro) para ausente/desconhecido. Aceita uma ou varias religioes
     * separadas por virgula ("catholic,protestant"): o filtro mostra quem combina com qualquer uma. Devolve a
     * lista sem repeticao e na ordem das selecionaveis, para o mesmo conjunto sempre dar o mesmo texto.
     */
    public static String normalize(String raw) {
        if (raw == null) {
            return null;
        }
        List<String> order = new ArrayList<>(SELECTABLE);
        order.add(OTHER);
        order.add(LEGACY_CHRISTIANITY);
        List<String> kept = new ArrayList<>();
        for (String part : raw.split(",")) {
            String value = part.trim().toLowerCase(Locale.ROOT);
            if (order.contains(value) && !kept.contains(value)) {
                kept.add(value);
            }
        }
        if (kept.isEmpty()) {
            return null;
        }
        kept.sort(Comparator.comparingInt(order::indexOf));
        return String.join(",", kept);
    }

    public static boolean allows(List<String> religions, String preference) {
        if (religions == null || religions.isEmpty()) {
            return true;
        }
        boolean hasSelectable = religions.stream().anyMatch(SELECTABLE::contains);
        List<String> preferred = preferredReligions(preference);
        if (preferred.contains(OTHER)) {
            // "Outra religiao": quem nao esta ligado a nenhuma religiao selecionavel entra; quem esta so entra
            // se tambem combinar com uma das outras religioes escolhidas junto.
            if (!hasSelectable) {
                return true;
            }
            if (preferred.stream().allMatch(OTHER::equals)) {
                return false;
            }
        }
        boolean matches = religions.stream().anyMatch(preferred::contains);
        if (religions.contains(ONLY)) {
            // ["other", "only"] (ex.: xintoismo): o perfil fica so para quem nao escolheu religiao (ou
            // escolheu "outra religiao", tratado acima) e some para qualquer religiao selecionavel.
            return hasSelectable ? matches : preference == null;
        }
        if (preference == null) {
            return true;
        }
        return matches || !hasSelectable;
    }

    /** As religioes da preferencia (uma ou varias, separadas por virgula), com o valor antigo expandido nas denominacoes. */
    private static List<String> preferredReligions(String preference) {
        if (preference == null) {
            return List.of();
        }
        List<String> result = new ArrayList<>();
        for (String part : preference.split(",")) {
            String value = part.trim();
            if (LEGACY_CHRISTIANITY.equals(value)) {
                CHRISTIAN.stream().filter(denomination -> !result.contains(denomination)).forEach(result::add);
            } else if (!value.isEmpty() && !result.contains(value)) {
                result.add(value);
            }
        }
        return result;
    }
}
