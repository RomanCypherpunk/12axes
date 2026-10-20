package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.CountryMatch;
import com.twelveaxes.model.PartyMatch;
import com.twelveaxes.model.PersonalityMatch;
import com.twelveaxes.model.TimelineEntry;
import com.twelveaxes.model.TimelineEra;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

/**
 * Monta a linha do tempo: em cada uma das seis eras, os perfis mais compativeis entre
 * personalidades (era da morte), paises e partidos (atuais no seculo XXI, historicos pelo
 * primeiro ano do periodo), num so ranking, com teto por tipo para nenhum catalogo dominar a era.
 * Cada era traz 4 perfis para o cartao da epoca mais compativel e 2 para a lista.
 */
@Service
public class TimelineService {
    /** Perfis do cartao da epoca mais compativel (entries) e tetos por tipo. */
    static final int PER_ERA = 4;
    static final Limits CARD_LIMITS = new Limits(3, 3, 1);

    /** Perfis exibidos na lista da linha do tempo (highlights) e tetos por tipo. */
    static final int HIGHLIGHTS_PER_ERA = 2;
    static final Limits LIST_LIMITS = new Limits(2, 1, 1);

    /** Quantos perfis entram na media que define a compatibilidade da era. */
    static final int ERA_AVERAGE_SIZE = 10;

    /** Ano que coloca os perfis atuais na ultima era. */
    private static final int CURRENT_YEAR = 2000;

    /** Teto de cada tipo de perfil numa selecao. */
    record Limits(int personalities, int countries, int parties) {
        int of(String type) {
            return switch (type) {
                case "personality" -> personalities;
                case "country" -> countries;
                default -> parties;
            };
        }
    }

    private final PersonalityMatcherService personalityMatcherService;
    private final CountryMatcherService countryMatcherService;
    private final PartyMatcherService partyMatcherService;

    public TimelineService(
            PersonalityMatcherService personalityMatcherService,
            CountryMatcherService countryMatcherService,
            PartyMatcherService partyMatcherService
    ) {
        this.personalityMatcherService = personalityMatcherService;
        this.countryMatcherService = countryMatcherService;
        this.partyMatcherService = partyMatcherService;
    }

    /** includeParties e falso quando os partidos estao escondidos no front (VITE_SHOW_PARTIES). */
    public List<TimelineEra> build(List<AxisResult> axisResults, String lang, String religion, boolean includeParties) {
        List<TimelineCandidate> candidates = new ArrayList<>();
        for (PersonalityMatch match : personalityMatcherService.findAll(axisResults, lang, religion)) {
            candidates.add(new TimelineCandidate(
                    EraResolver.yearOfDeath(match.lifespan()),
                    new TimelineEntry("personality", match, null, null)));
        }
        for (CountryMatch match : countryMatcherService.findAll(axisResults, lang, religion)) {
            candidates.add(new TimelineCandidate(
                    yearOf(match.historical(), match.period()),
                    new TimelineEntry("country", null, match, null)));
        }
        if (includeParties) {
            for (PartyMatch match : partyMatcherService.findAll(axisResults, lang, religion)) {
                candidates.add(new TimelineCandidate(
                        yearOf(match.historical(), match.period()),
                        new TimelineEntry("party", null, null, match)));
            }
        }

        Comparator<TimelineEntry> byCompatibility =
                Comparator.comparingDouble(TimelineEntry::compatibility).reversed().thenComparing(TimelineEntry::name);

        return EraResolver.ERAS.stream()
                .map(era -> {
                    List<TimelineEntry> ranked = candidates.stream()
                            .filter(candidate -> EraResolver.eraOfYear(candidate.year()) == era)
                            .map(TimelineCandidate::entry)
                            .sorted(byCompatibility)
                            .toList();
                    return new TimelineEra(
                            era.key(),
                            era.fromYear() == Integer.MIN_VALUE ? null : era.fromYear(),
                            era.toYear(),
                            eraCompatibility(ranked),
                            pick(ranked, PER_ERA, CARD_LIMITS),
                            pick(ranked, HIGHLIGHTS_PER_ERA, LIST_LIMITS));
                })
                .toList();
    }

    // Media da compatibilidade dos ERA_AVERAGE_SIZE mais compativeis da era (sem os tetos por tipo).
    private static double eraCompatibility(List<TimelineEntry> ranked) {
        return ranked.stream()
                .limit(ERA_AVERAGE_SIZE)
                .mapToDouble(TimelineEntry::compatibility)
                .average()
                .orElse(0.0);
    }

    // Os count mais compativeis respeitando o teto de cada tipo; a lista ja vem ordenada.
    private static List<TimelineEntry> pick(List<TimelineEntry> ranked, int count, Limits limits) {
        Map<String, Integer> taken = new HashMap<>();
        List<TimelineEntry> picked = new ArrayList<>();
        for (TimelineEntry entry : ranked) {
            if (picked.size() == count) {
                break;
            }
            if (taken.getOrDefault(entry.type(), 0) < limits.of(entry.type())) {
                taken.merge(entry.type(), 1, Integer::sum);
                picked.add(entry);
            }
        }
        return List.copyOf(picked);
    }

    // Atual (historical false) e do seculo XXI; historico entra pelo primeiro ano do period.
    // Sem ano legivel (nao ha caso no catalogo, o teste garante) cai na era aberta.
    private static int yearOf(boolean historical, String period) {
        return historical ? EraResolver.startYear(period).orElse(CURRENT_YEAR) : CURRENT_YEAR;
    }

    private record TimelineCandidate(int year, TimelineEntry entry) {
    }
}
