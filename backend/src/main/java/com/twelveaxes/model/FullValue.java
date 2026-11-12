package com.twelveaxes.model;

/**
 * Valor declarado pelo usuario numa categoria dos valores completos (quiz de 240 perguntas), ja no idioma pedido.
 *
 * @param categoryId identificador da categoria
 * @param categoryLabel nome exibido da categoria
 * @param valueId identificador do valor
 * @param name nome exibido do valor
 * @param description descricao curta, sem juizo de valor
 * @param neutral verdadeiro para a saida "equilibrado" da categoria
 * @param icon imagem do valor e a fonte dela; nulo quando o valor ainda nao tem imagem livre
 */
public record FullValue(
        String categoryId,
        String categoryLabel,
        String valueId,
        String name,
        String description,
        boolean neutral,
        Icon icon
) {
    /** Arquivo em {@code frontend/public/values/<categoria>/} e de onde veio (autor e licenca). */
    public record Icon(String file, String sourceUrl, String author, String license, boolean modified) {}
}
