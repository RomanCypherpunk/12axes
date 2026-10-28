package com.twelveaxes.service;

import com.twelveaxes.model.AxisDivergence;
import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.CountryMatch;
import com.twelveaxes.model.Disagreement;
import com.twelveaxes.model.IdeologyMatch;
import com.twelveaxes.model.PersonalityMatch;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

/** Onde o usuario mais discorda da ideologia, da personalidade e do pais mais compativeis com ele. */
@Service
public class DisagreementService {
    private final IdeologyMatcherService ideologyMatcherService;
    private final PersonalityMatcherService personalityMatcherService;
    private final CountryMatcherService countryMatcherService;
    private final ScoringService scoringService;

    public DisagreementService(
            IdeologyMatcherService ideologyMatcherService,
            PersonalityMatcherService personalityMatcherService,
            CountryMatcherService countryMatcherService,
            ScoringService scoringService
    ) {
        this.ideologyMatcherService = ideologyMatcherService;
        this.personalityMatcherService = personalityMatcherService;
        this.countryMatcherService = countryMatcherService;
        this.scoringService = scoringService;
    }

    public List<Disagreement> compute(List<AxisResult> axes, String lang, String religion) {
        IdeologyMatch ideology = ideologyMatcherService.findAll(axes, lang, religion).getFirst();
        PersonalityMatch personality = personalityMatcherService.findAll(axes, lang, religion).getFirst();
        CountryMatch country = countryMatcherService.findTopMatch(axes, lang, religion);
        return List.of(
                new Disagreement("ideology", ideology.ideologyId(), ideology.name(), ideology.category(),
                        divergences(axes, ideologyMatcherService.targetVectorOf(ideology.ideologyId(), lang))),
                new Disagreement("personality", personality.personalityId(), personality.name(),
                        closestIdeologyCategory(axes, personality.vector(), lang),
                        divergences(axes, personality.vector())),
                new Disagreement("country", country.countryId(), country.name(),
                        closestIdeologyCategory(axes, country.vector(), lang),
                        divergences(axes, country.vector()))
        );
    }

    // Categoria da ideologia mais proxima de um perfil, pelo vetor dele (sem filtro de religiao: e a cor do perfil, nao um ranking do usuario).
    private String closestIdeologyCategory(List<AxisResult> axes, Map<String, Double> profileVector, String lang) {
        List<Double> values = axes.stream().map(axis -> profileVector.getOrDefault(axis.axisId(), 50.0)).toList();
        List<AxisResult> profileAxes = scoringService.scoreFromLeftPercents(values, lang);
        return ideologyMatcherService.findMatches(profileAxes, lang, null).getFirst().category();
    }

    // Os 12 eixos, do que mais destoa do perfil para o que menos destoa.
    private List<AxisDivergence> divergences(List<AxisResult> axes, Map<String, Double> profileVector) {
        return axes.stream()
                .map(axis -> {
                    double profile = profileVector.getOrDefault(axis.axisId(), 50.0);
                    return new AxisDivergence(axis.axisId(), axis.label(), axis.leftPercent(), profile,
                            Math.round((axis.leftPercent() - profile) * 10.0) / 10.0);
                })
                .sorted(Comparator.comparingDouble((AxisDivergence divergence) -> Math.abs(divergence.difference())).reversed())
                .toList();
    }
}
