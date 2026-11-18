package com.twelveaxes.model;

import java.util.List;
import java.util.Map;

/**
 * Representa um país, Estado ou entidade política utilizada na comparação
 * de compatibilidade com o resultado do usuário no quiz.
 *
 * Além das informações descritivas, contém o vetor de pontuações nos eixos
 * ideológicos utilizado pelo algoritmo de correspondência.
 *
 * @param id identificador único do país
 * @param name nome do país
 * @param category categoria ou classificação política
 * @param description descrição resumida da entidade
 * @param flagPath caminho da imagem da bandeira nos recursos da aplicação
 * @param flagKind tipo da bandeira (atual, histórica, movimento etc.)
 * @param flagSourceName nome da fonte da imagem
 * @param flagSourceUrl URL da fonte da imagem
 * @param flagNote observações sobre a bandeira
 * @param historical indica se a entidade é histórica
 * @param region indica se a entidade é uma região de outro país ("Texas (Estados Unidos)", "Dubai (Emirados Árabes Unidos)");
 *     regiões ficam de fora das seções que sugerem países, como "países mais próximos por área"
 * @param period período de existência da entidade, quando aplicável
 * @param vector valores do país em cada eixo ideológico
 * @param religions tradições religiosas que o país representa (ver ReligionFilter)
 */
public record Country(
        String id,
        String name,
        String category,
        String description,
        String flagPath,
        String flagKind,
        String flagSourceName,
        String flagSourceUrl,
        String flagNote,
        boolean historical,
        boolean region,
        String period,
        Map<String, Double> vector,
        List<String> religions
) {
}
