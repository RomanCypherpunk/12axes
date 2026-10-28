package com.twelveaxes.model;

/**
 * Uma linha do ranking completo, em formato enxuto (sem descricao nem imagem) para o JSON nao pesar.
 *
 * @param id id do perfil
 * @param name nome no idioma pedido
 * @param category categoria do perfil (familia da ideologia, area da personalidade, tipo do pais ou do partido)
 * @param historical se e um pais ou partido historico (sempre falso para ideologias e personalidades)
 * @param compatibility compatibilidade com o usuario (0 a 100)
 */
public record RankingRow(String id, String name, String category, boolean historical, double compatibility) {
}
