package com.twelveaxes.model;

import java.util.List;

/**
 * O "comecinho" do relatorio pago, para o convite da compra: so o que o convite mostra, sem acesso. O resto (o texto inteiro, as
 * respostas, os outros cargos, as outras eras, os paises) nunca sai do servidor sem token.
 *
 * @param analysis o eixo em que o usuario mais se afasta do centro, com {@code text} cortado no comeco e {@code impacts} vazio
 * @param profiles a ideologia, a personalidade e o pais mais compativeis (so nome e cor, sem os eixos), de onde vem o marcador de cada um
 * @param government so o lider e o vice-lider do governo ideal
 * @param timeline so a primeira era (Antiguidade), com os perfis da lista e sem a compatibilidade nem o cartao da epoca mais compativel
 */
public record ReportPreview(AxisAnalysis analysis, List<Disagreement> profiles, List<GovernmentSeat> government, List<TimelineEra> timeline) {
}
