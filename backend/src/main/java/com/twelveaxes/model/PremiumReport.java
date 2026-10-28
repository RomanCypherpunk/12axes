package com.twelveaxes.model;

import java.util.List;

/**
 * Conteudo do Relatorio Completo (pago): so sai do endpoint protegido por token, nunca da API livre.
 *
 * @param axisAnalysis analise eixo a eixo, na ordem dos eixos
 * @param topCountries os 10 paises atuais mais compativeis em compatibilidade geral
 * @param personalitiesByArea a personalidade mais compativel de cada area de atuacao, da mais para a menos compativel
 * @param disagreements onde o usuario mais discorda da ideologia, da personalidade e do pais mais compativeis
 * @param idealGovernment os cargos do governo ideal, cada um com a personalidade mais compativel da categoria
 * @param timeline as seis eras da historia, cada uma com os perfis (personalidades, paises e partidos) mais compativeis
 * @param ranking ranking completo de compatibilidade com cada perfil do catalogo
 */
public record PremiumReport(
        List<AxisAnalysis> axisAnalysis,
        List<CountryMatch> topCountries,
        List<PersonalityMatch> personalitiesByArea,
        List<Disagreement> disagreements,
        List<GovernmentSeat> idealGovernment,
        List<TimelineEra> timeline,
        PremiumRanking ranking
) {
}
