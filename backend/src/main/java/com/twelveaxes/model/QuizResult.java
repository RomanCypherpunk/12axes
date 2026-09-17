package com.twelveaxes.model;

import java.util.List;

/**
 * Resultado completo do quiz: a posicao do usuario nos 12 eixos e os recortes
 * de afinidade e de distancia em cada catalogo (ideologias, paises e
 * personalidades).
 *
 * @param axes resultado do usuario em cada um dos 12 eixos
 * @param topMatch ideologia mais compativel
 * @param matches ideologias mais compativeis, a comecar pela do topo
 * @param bottomIdeologyMatch ideologia mais distante do catalogo
 * @param topCountryMatch pais atual mais compativel
 * @param topHistoricalCountryMatch experiencia historica mais compativel
 * @param bottomCountryMatches paises mais distantes do catalogo
 * @param topPersonalityMatch personalidade mais compativel, de qualquer categoria
 * @param personalityMatches personalidades mais compativeis, sem filtro por categoria
 * @param dimensionMatches personalidade mais compativel em cada dimensao (politica, social, economica)
 * @param categoryBestMatches personalidade mais compativel de cada area de atuacao
 * @param bottomPersonalityMatches personalidades mais distantes do catalogo
 * @param mostUnusualAxis eixo em que o usuario mais destoa do catalogo de ideologias
 * @param mostCommonAxis eixo em que o usuario mais se aproxima do catalogo
 * @param axisTension par de eixos em que o usuario contraria o padrao do catalogo, ou null
 */
public record QuizResult(
        List<AxisResult> axes,
        IdeologyMatch topMatch,
        List<IdeologyMatch> matches,
        IdeologyMatch bottomIdeologyMatch,
        CountryMatch topCountryMatch,
        CountryMatch topHistoricalCountryMatch,
        List<CountryMatch> bottomCountryMatches,
        PersonalityMatch topPersonalityMatch,
        List<PersonalityMatch> personalityMatches,
        List<DimensionMatch> dimensionMatches,
        List<PersonalityMatch> categoryBestMatches,
        List<PersonalityMatch> bottomPersonalityMatches,
        AxisOutlier mostUnusualAxis,
        AxisOutlier mostCommonAxis,
        AxisTension axisTension
) {
}
