package com.twelveaxes.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

/**
 * Partido, movimento, casa dinastica, organizacao armada ou organizacao internacional.
 *
 * Cada perfil e associado a um pais do catalogo (atual ou historico) e a uma ideologia, e o
 * vetor de 12 eixos fica em parties-profiles.json, como nos demais catalogos.
 *
 * @param id identificador unico (inclui o pais quando o nome colide, ex.: partido-republicano-eua)
 * @param name nome exibido
 * @param category tipo do perfil (Partido, Movimento, Casa dinástica, Organização armada,
 *     Organização internacional), um dos valores de {@link #CATEGORIES}
 * @param description descricao factual curta
 * @param logoPath imagem quadrada 1:1 do simbolo oficial, nos recursos do frontend
 * @param logoSourceName fonte da imagem
 * @param logoSourceUrl pagina de origem da imagem
 * @param logoNote observacao sobre a imagem
 * @param countryId pais do catalogo ao qual o perfil esta associado (atual ou historico)
 * @param countryName nome do pais no idioma da resposta; preenchido ao carregar, nao esta no JSON
 * @param countryFlagPath bandeira do pais associado (a mesma do catalogo de paises); preenchida ao carregar
 * @param historical true para organizacoes de um periodo especifico, ja extintas ou muito diferentes
 * @param period periodo de referencia quando historical for true
 * @param religions tradicoes religiosas que o perfil representa (ver ReligionFilter)
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record Party(
        String id,
        String name,
        String category,
        String description,
        String logoPath,
        String logoSourceName,
        String logoSourceUrl,
        String logoNote,
        String countryId,
        String countryName,
        String countryFlagPath,
        boolean historical,
        String period,
        List<String> religions
) {
    /** Categorias validas em portugues (o catalogo EN traduz o rotulo). */
    public static final List<String> CATEGORIES = List.of(
            "Partido",
            "Movimento",
            "Casa dinástica",
            "Organização armada",
            "Organização internacional"
    );

    public Party withCountry(String newCountryName, String newCountryFlagPath) {
        return new Party(id, name, category, description, logoPath, logoSourceName, logoSourceUrl, logoNote,
                countryId, newCountryName, newCountryFlagPath, historical, period, religions);
    }

    public Party withText(String newName, String newCategory, String newDescription) {
        return new Party(id, newName, newCategory, newDescription, logoPath, logoSourceName, logoSourceUrl,
                logoNote, countryId, countryName, countryFlagPath, historical, period, religions);
    }
}
