package com.twelveaxes.model;

import java.util.List;

/**
 * Par de eixos em que o usuario contraria o padrao do catalogo de ideologias.
 *
 * No catalogo certos eixos andam juntos (quem e federalista tende a ser
 * democratico, por exemplo). Quando o usuario combina os dois de forma
 * contraria a essa tendencia, a combinacao e rara e diz algo que nenhum eixo
 * isolado diz.
 *
 * @param firstAxisLabel nome exibido do primeiro eixo
 * @param firstPole polo do usuario no primeiro eixo
 * @param secondAxisLabel nome exibido do segundo eixo
 * @param secondPole polo do usuario no segundo eixo
 * @param matchingIdeologies quantas ideologias do catalogo tem a mesma combinacao
 * @param catalogSize tamanho do catalogo comparado
 * @param examples ate tres ideologias que combinam os mesmos polos
 */
public record AxisTension(
        String firstAxisLabel,
        String firstPole,
        String secondAxisLabel,
        String secondPole,
        int matchingIdeologies,
        int catalogSize,
        List<String> examples
) {
}
