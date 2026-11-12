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
 * @param topCountryMatches os 3 mais compativeis do catalogo inteiro (paises e experiencias
 *     historicas juntos, sem distincao), a comecar pelo topo
 * @param topHistoricalCountryMatch experiencia historica mais compativel
 * @param bottomCountryMatches paises mais distantes do catalogo
 * @param topPersonalityMatch personalidade mais compativel, de qualquer categoria
 * @param personalityMatches personalidades mais compativeis, sem filtro por categoria
 * @param dimensionMatches personalidade mais compativel em cada dimensao (politica, social, economica)
 * @param bottomPersonalityMatches personalidades mais distantes do catalogo
 * @param mostUnusualAxis eixo em que o usuario mais destoa do catalogo de ideologias
 * @param mostCommonAxis eixo em que o usuario mais se aproxima do catalogo
 * @param axisTension par de eixos em que o usuario contraria o padrao do catalogo, ou null
 * @param bookRecommendations livros das personalidades mais compativeis (ate 3)
 * @param topPartyMatch partido atual mais compativel
 * @param topPartyMatches os 3 partidos, movimentos e organizacoes mais compativeis (atuais e
 *     historicos juntos); lista vazia enquanto o catalogo estiver vazio
 * @param topHistoricalPartyMatch partido historico mais compativel
 * @param partyDimensionMatches partido mais compativel em cada dimensao (politica, social, economica)
 * @param bottomPartyMatches os 3 menos compativeis, do menos ao mais distante
 * @param politicalValues um valor politico nomeado por categoria, derivado so dos eixos
 * @param fullValues valores que o usuario declarou na arvore do quiz de 240 perguntas (um por categoria);
 *     nulo quando nao ha (outros quizzes, links antigos ou chave invalida)
 * @param fullValuesKey chave curta ({@code f=}) desses valores para o link; nula quando nao ha valores
 */
public record QuizResult(
        List<AxisResult> axes,
        IdeologyMatch topMatch,
        List<IdeologyMatch> matches,
        IdeologyMatch bottomIdeologyMatch,
        CountryMatch topCountryMatch,
        List<CountryMatch> topCountryMatches,
        CountryMatch topHistoricalCountryMatch,
        List<CountryDimensionMatch> countryDimensionMatches,
        List<CountryMatch> bottomCountryMatches,
        PersonalityMatch topPersonalityMatch,
        List<PersonalityMatch> personalityMatches,
        List<DimensionMatch> dimensionMatches,
        List<PersonalityMatch> bottomPersonalityMatches,
        AxisOutlier mostUnusualAxis,
        AxisOutlier mostCommonAxis,
        AxisTension axisTension,
        List<BookRecommendation> bookRecommendations,
        PartyMatch topPartyMatch,
        List<PartyMatch> topPartyMatches,
        PartyMatch topHistoricalPartyMatch,
        List<PartyDimensionMatch> partyDimensionMatches,
        List<PartyMatch> bottomPartyMatches,
        List<PoliticalValue> politicalValues,
        List<FullValue> fullValues,
        String fullValuesKey
) {
    /** Copia com os valores declarados; o resultado em cache (so por vetor) nunca e alterado. */
    public QuizResult withFullValues(List<FullValue> values, String key) {
        return new QuizResult(axes, topMatch, matches, bottomIdeologyMatch, topCountryMatch, topCountryMatches,
                topHistoricalCountryMatch, countryDimensionMatches, bottomCountryMatches, topPersonalityMatch,
                personalityMatches, dimensionMatches, bottomPersonalityMatches, mostUnusualAxis, mostCommonAxis,
                axisTension, bookRecommendations, topPartyMatch, topPartyMatches, topHistoricalPartyMatch,
                partyDimensionMatches, bottomPartyMatches, politicalValues, values, key);
    }
}
