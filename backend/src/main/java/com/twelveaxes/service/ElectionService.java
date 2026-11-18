package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Election;
import com.twelveaxes.model.ElectionCandidate;
import com.twelveaxes.model.ElectionCandidateMatch;
import com.twelveaxes.model.ElectionResult;
import com.twelveaxes.model.PartyMatch;
import com.twelveaxes.model.PersonalityMatch;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/**
 * Eleicoes ativas para o idioma do usuario, com os candidatos ranqueados pelo mesmo matching das personalidades
 * e dos partidos. Sem filtro de religiao: os candidatos sao fixos.
 */
@Service
public class ElectionService {
    private final QuizDataService dataService;
    private final PersonalityMatcherService personalityMatcherService;
    private final PartyMatcherService partyMatcherService;

    public ElectionService(
            QuizDataService dataService,
            PersonalityMatcherService personalityMatcherService,
            PartyMatcherService partyMatcherService
    ) {
        this.dataService = dataService;
        this.personalityMatcherService = personalityMatcherService;
        this.partyMatcherService = partyMatcherService;
    }

    public List<ElectionResult> findActive(List<AxisResult> axes, String lang) {
        // A eleicao do pais do idioma vem primeiro; o resto segue a ordem do arquivo (sort estavel).
        List<Election> applicable = dataService.getElections().stream()
                .filter(election -> election.appliesTo(lang))
                .sorted(Comparator.comparingInt((Election election) -> election.isHomeFor(lang) ? 0 : 1))
                .toList();
        if (applicable.isEmpty()) {
            return List.of();
        }
        // Os dois rankings sao calculados uma vez por chamada e servem a todas as eleicoes.
        Map<String, PersonalityMatch> personalities = personalityMatcherService.findAll(axes, lang, null).stream()
                .collect(Collectors.toMap(PersonalityMatch::personalityId, Function.identity(), (a, b) -> a));
        Map<String, PartyMatch> parties = partyMatcherService.findAll(axes, lang, null).stream()
                .collect(Collectors.toMap(PartyMatch::partyId, Function.identity(), (a, b) -> a));
        return applicable.stream()
                .map(election -> toResult(election, lang, personalities, parties))
                .toList();
    }

    private static ElectionResult toResult(
            Election election,
            String lang,
            Map<String, PersonalityMatch> personalities,
            Map<String, PartyMatch> parties
    ) {
        List<ElectionCandidateMatch> candidates = election.candidates().stream()
                .map((ElectionCandidate candidate) -> new ElectionCandidateMatch(
                        personalities.get(candidate.personalityId()), parties.get(candidate.partyId())))
                .sorted(Comparator.comparingDouble((ElectionCandidateMatch match) -> match.candidate().compatibility())
                        .reversed())
                .toList();
        return new ElectionResult(election.id(), election.countryId(), election.date(), election.nameFor(lang), candidates);
    }
}
