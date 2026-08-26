package com.twelveaxes.controller;

import com.twelveaxes.exception.ResourceNotFoundException;
import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Country;
import com.twelveaxes.model.Ideology;
import com.twelveaxes.model.Personality;
import com.twelveaxes.model.QuizPayload;
import com.twelveaxes.model.QuizResult;
import com.twelveaxes.model.ResultRequest;
import com.twelveaxes.service.CountryMatcherService;
import com.twelveaxes.service.IdeologyMatcherService;
import com.twelveaxes.service.PersonalityMatcherService;
import com.twelveaxes.service.QuizDataService;
import com.twelveaxes.service.ScoringService;
import com.twelveaxes.service.CandidateMatcherService;
import com.twelveaxes.model.Candidate;
import com.twelveaxes.model.ElectionResult;
import jakarta.validation.Valid;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class QuizController {
    private final QuizDataService dataService;
    private final ScoringService scoringService;
    private final IdeologyMatcherService matcherService;
    private final CountryMatcherService countryMatcherService;
    private final PersonalityMatcherService personalityMatcherService;
    private final CandidateMatcherService candidateMatcherService;

    public QuizController(
            QuizDataService dataService,
            ScoringService scoringService,
            IdeologyMatcherService matcherService,
            CountryMatcherService countryMatcherService,
            PersonalityMatcherService personalityMatcherService, CandidateMatcherService candidateMatcherService
    ) {
        this.dataService = dataService;
        this.scoringService = scoringService;
        this.matcherService = matcherService;
        this.countryMatcherService = countryMatcherService;
        this.personalityMatcherService = personalityMatcherService;
        this.candidateMatcherService = candidateMatcherService;
    }

    @GetMapping("/api/election/quiz") public QuizPayload electionQuiz() { return dataService.getElectionQuiz(); }
    @GetMapping("/api/election/candidates") public List<Candidate> electionCandidates() { return dataService.getCandidates(); }
    @PostMapping("/api/election/results") public ElectionResult electionResults(@Valid @RequestBody ResultRequest request) { var axes=scoringService.scoreElection(request); return new ElectionResult(axes,candidateMatcherService.findMatches(axes)); }
    @GetMapping("/api/election/results/by-axes") public ElectionResult electionByAxes(@RequestParam("v") String values) { var axes=scoringService.scoreFromLeftPercents(parseAxisValues(values), QuizDataService.LANG_PT); return new ElectionResult(axes,candidateMatcherService.findMatches(axes)); }

    @GetMapping("/api/quiz")
    public QuizPayload quiz(
            @RequestParam(defaultValue = QuizDataService.SHORT_VARIANT) String variant,
            @RequestParam(defaultValue = QuizDataService.LANG_PT) String lang
    ) {
        return dataService.getQuiz(variant, lang);
    }

    @PostMapping("/api/results")
    @ResponseStatus(HttpStatus.OK)
    public QuizResult results(
            @Valid @RequestBody ResultRequest request,
            @RequestParam(defaultValue = QuizDataService.LANG_PT) String lang
    ) {
        return buildResult(scoringService.score(request, lang), lang);
    }

    // Resultado compartilhável: reconstrói matches a partir do vetor de eixos
    // (12 leftPercents separados por vírgula, na ordem de axes.json).
    @GetMapping("/api/results/by-axes")
    public QuizResult resultsByAxes(
            @RequestParam("v") String values,
            @RequestParam(defaultValue = QuizDataService.LANG_PT) String lang
    ) {
        return buildResult(scoringService.scoreFromLeftPercents(parseAxisValues(values), lang), lang);
    }

    private QuizResult buildResult(List<AxisResult> axes, String lang) {
        var matches = matcherService.findMatches(axes, lang);
        var topMatch = matches.getFirst();
        var topCountryMatch = countryMatcherService.findTopMatch(axes, lang);
        var topPersonalityMatch = personalityMatcherService.findTopMatch(axes, lang);
        return new QuizResult(axes, topMatch, matches, topCountryMatch, topPersonalityMatch);
    }

    private List<Double> parseAxisValues(String values) {
        try {
            List<Double> parsed = Arrays.stream(values.split(","))
                    .map(String::trim)
                    .map(Double::parseDouble)
                    .toList();
            if (parsed.stream().anyMatch(value -> value.isNaN() || value < 0 || value > 100)) {
                throw new NumberFormatException("fora do intervalo 0-100");
            }
            return parsed;
        } catch (NumberFormatException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vetor de eixos inválido");
        }
    }

    @GetMapping("/api/ideologies")
    public List<Ideology> ideologies(@RequestParam(defaultValue = QuizDataService.LANG_PT) String lang) {
        return dataService.getIdeologies(lang);
    }

    @GetMapping("/api/ideologies/{id}")
    public Ideology ideology(
            @PathVariable String id,
            @RequestParam(defaultValue = QuizDataService.LANG_PT) String lang
    ) {
        return Optional.ofNullable(dataService.getIdeologyById(id, lang))
                .orElseThrow(() -> new ResourceNotFoundException("Ideologia não encontrada"));
    }

    @GetMapping("/api/countries")
    public List<Country> countries(@RequestParam(defaultValue = QuizDataService.LANG_PT) String lang) {
        return dataService.getCountries(lang);
    }

    @GetMapping("/api/countries/{id}")
    public Country country(
            @PathVariable String id,
            @RequestParam(defaultValue = QuizDataService.LANG_PT) String lang
    ) {
        return Optional.ofNullable(dataService.getCountryById(id, lang))
                .orElseThrow(() -> new ResourceNotFoundException("País não encontrado"));
    }

    @GetMapping("/api/personalities")
    public List<Personality> personalities(@RequestParam(defaultValue = QuizDataService.LANG_PT) String lang) {
        return dataService.getPersonalities(lang);
    }

    @GetMapping("/api/personalities/{id}")
    public Personality personality(
            @PathVariable String id,
            @RequestParam(defaultValue = QuizDataService.LANG_PT) String lang
    ) {
        return Optional.ofNullable(dataService.getPersonalityById(id, lang))
                .orElseThrow(() -> new ResourceNotFoundException("Personalidade não encontrada"));
    }
}
