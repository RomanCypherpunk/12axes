package com.twelveaxes.model;

import java.util.List;

/**
 * Uma era da linha do tempo com os perfis mais compativeis do usuario.
 *
 * @param key antiguidade, medieval, moderna, xix, xx ou xxi
 * @param fromYear ano em que a era comeca (nulo na Antiguidade, que nao tem inicio)
 * @param toYear ano em que a era termina, exclusivo (nulo na ultima, ainda aberta)
 * @param compatibility compatibilidade da era: media da compatibilidade dos 10 perfis mais
 *     compativeis do usuario na era (personalidades, paises e partidos juntos, sem os tetos por tipo)
 * @param entries os 4 perfis mais compativeis da era (ate 3 personalidades, 3 paises e 1 partido), do
 *     topo para baixo; alimentam o cartao da epoca mais compativel
 * @param highlights os 2 perfis exibidos na lista da linha do tempo (ate 2 personalidades, 1 pais e
 *     1 partido), do topo para baixo
 */
public record TimelineEra(
        String key,
        Integer fromYear,
        Integer toYear,
        double compatibility,
        List<TimelineEntry> entries,
        List<TimelineEntry> highlights
) {
}
