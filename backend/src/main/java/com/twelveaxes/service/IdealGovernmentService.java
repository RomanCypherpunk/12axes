package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.GovernmentSeat;
import com.twelveaxes.model.PersonalityMatch;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;

/**
 * Governo ideal do usuario: cada cargo e a personalidade mais compativel de uma categoria. Vale para qualquer
 * ideologia, inclusive libertarios e anarquistas (decisao do autor). O vice e a segunda "politico" mais compativel.
 */
@Service
public class IdealGovernmentService {
    private record Seat(String key, String category) {
    }

    // Ordem fixa dos cargos. O rotulo de cada um vem do i18n do front.
    private static final List<Seat> SEATS = List.of(
            new Seat("lider", "politico"),
            new Seat("vice", "politico"),
            new Seat("economia", "economista"),
            new Seat("educacao", "intelectual"),
            new Seat("estrategia", "teorico"),
            new Seat("filosofia", "filosofo"),
            new Seat("social", "ativista"),
            new Seat("industria", "empresario"),
            new Seat("cultura", "religioso")
    );

    /**
     * Quantas figuras de cada categoria seguem para o usuario trocar quem ocupa o cargo: sobram 3 opcoes mesmo quando as
     * outras cadeiras ja levaram algumas (o vice sai da mesma categoria do lider).
     */
    public static final int CANDIDATES_PER_SEAT = 6;

    private final PersonalityMatcherService personalityMatcherService;
    private final ProfileSpectrumService profileSpectrumService;

    public IdealGovernmentService(PersonalityMatcherService personalityMatcherService, ProfileSpectrumService profileSpectrumService) {
        this.personalityMatcherService = personalityMatcherService;
        this.profileSpectrumService = profileSpectrumService;
    }

    public List<GovernmentSeat> build(List<AxisResult> axes, String lang, String religion) {
        List<PersonalityMatch> ranking = personalityMatcherService.findAll(axes, lang, religion);
        Set<String> used = new HashSet<>();
        List<GovernmentSeat> seats = new ArrayList<>();
        for (Seat seat : SEATS) {
            PersonalityMatch holder = ranking.stream()
                    .filter(match -> seat.category().equals(match.category()) && !used.contains(match.personalityId()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalStateException("Nenhuma personalidade da categoria " + seat.category()));
            used.add(holder.personalityId());
            List<PersonalityMatch> candidates = ranking.stream()
                    .filter(match -> seat.category().equals(match.category()))
                    .limit(CANDIDATES_PER_SEAT)
                    .map(match -> withSpectrum(match, lang))
                    .toList();
            seats.add(new GovernmentSeat(seat.key(), seat.category(), withSpectrum(holder, lang), candidates));
        }
        return List.copyOf(seats);
    }

    private PersonalityMatch withSpectrum(PersonalityMatch match, String lang) {
        return match.vector() == null || match.vector().isEmpty() ? match : match.withSpectrum(profileSpectrumService.categoryOf(match.vector(), lang));
    }
}
