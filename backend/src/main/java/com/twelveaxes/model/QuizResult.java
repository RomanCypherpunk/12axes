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
 * @param categoryPersonalityMatches personalidades compativeis de categorias distintas
 * @param bottomPersonalityMatches personalidades mais distantes do catalogo
 * @param mostUnusualAxis eixo em que o usuario mais destoa do catalogo de ideologias
 * @param mostCommonAxis eixo em que o usuario mais se aproxima do catalogo
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
        List<PersonalityMatch> categoryPersonalityMatches,
        List<PersonalityMatch> bottomPersonalityMatches,
        AxisOutlier mostUnusualAxis,
        AxisOutlier mostCommonAxis
) {
}
