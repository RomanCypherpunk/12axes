package com.twelveaxes.model;

/**
 * Valor politico do usuario em uma categoria (economicos, politicos, ...), derivado
 * dos percentuais dos eixos da categoria.
 *
 * @param categoryId identificador da categoria
 * @param categoryLabel nome exibido da categoria
 * @param valueId identificador do valor
 * @param name nome exibido do valor
 * @param description descricao curta, sem juizo de valor
 * @param neutral verdadeiro quando o valor escolhido e o neutro da categoria (usuario perto do centro nos eixos dela)
 */
public record PoliticalValue(
        String categoryId,
        String categoryLabel,
        String valueId,
        String name,
        String description,
        boolean neutral
) {
}
