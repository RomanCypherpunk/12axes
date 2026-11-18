package com.twelveaxes.model;

import com.twelveaxes.service.QuizDataService;
import java.util.List;
import java.util.Map;

/**
 * Uma eleicao de elections.json. A eleicao aparece enquanto estiver no arquivo: nao ha logica de data,
 * quem mantem o arquivo remove a entrada quando quiser.
 *
 * @param id identificador estavel (ex.: espanha-2026-gerais)
 * @param countryId pais do catalogo em que ocorre
 * @param date data da eleicao (ISO, yyyy-MM-dd); so exibicao
 * @param languages idiomas do quiz em que aparece; nulo ou vazio = todos
 * @param homeLanguages idiomas do pais da eleicao: nesses, ela vem primeiro (nulo ou vazio = ordem do arquivo)
 * @param name nome por idioma (cai para en e depois pt)
 * @param candidates candidatos, cada um com personalidade e partido do catalogo
 */
public record Election(
        String id,
        String countryId,
        String date,
        List<String> languages,
        List<String> homeLanguages,
        Map<String, String> name,
        List<ElectionCandidate> candidates
) {
    public boolean appliesTo(String lang) {
        if (languages == null || languages.isEmpty()) {
            return true;
        }
        String normalized = QuizDataService.normalizeLang(lang);
        return languages.stream().anyMatch(language -> QuizDataService.normalizeLang(language).equals(normalized));
    }

    /** Eleicao "da casa" do idioma: a do pais em que ele e falado. */
    public boolean isHomeFor(String lang) {
        if (homeLanguages == null || homeLanguages.isEmpty()) {
            return false;
        }
        String normalized = QuizDataService.normalizeLang(lang);
        return homeLanguages.stream().anyMatch(language -> QuizDataService.normalizeLang(language).equals(normalized));
    }

    public String nameFor(String lang) {
        String normalized = QuizDataService.normalizeLang(lang);
        for (String key : List.of(normalized, QuizDataService.LANG_EN, QuizDataService.LANG_PT)) {
            String value = name == null ? null : name.get(key);
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return id;
    }
}
