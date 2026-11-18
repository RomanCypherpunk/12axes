package com.twelveaxes.model;

/**
 * O pais atual mais proximo do usuario em uma area (sistema politico, politica externa, organizacao territorial, sistema
 * economico, sociedade e cultura, tecnologia e natureza); a compatibilidade e a da area, nao a geral.
 *
 * @param area chave da area: politico, externa, territorial, economico, sociedade ou tecnologia
 */
public record AreaCountryMatch(String area, CountryMatch country) {
}
