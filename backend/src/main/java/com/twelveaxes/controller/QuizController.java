package com.twelveaxes.controller;

import com.twelveaxes.model.Country;
import com.twelveaxes.model.Ideology;
import com.twelveaxes.model.QuizPayload;
import com.twelveaxes.model.QuizResult;
import com.twelveaxes.model.ResultRequest;
import com.twelveaxes.service.CountryResolverService;
import com.twelveaxes.service.IdeologyMatcherService;
import com.twelveaxes.service.QuizDataService;
import com.twelveaxes.service.ScoringService;
import jakarta.validation.Valid;
import java.util.List;
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
    private final CountryResolverService countryResolverService;

    public QuizController(
            QuizDataService dataService,
            ScoringService scoringService,
            IdeologyMatcherService matcherService,
            CountryResolverService countryResolverService
    ) {
        this.dataService = dataService;
        this.scoringService = scoringService;
        this.matcherService = matcherService;
        this.countryResolverService = countryResolverService;
    }

    @GetMapping("/api/quiz")
    public QuizPayload quiz(@RequestParam(defaultValue = QuizDataService.SHORT_VARIANT) String variant) {
        return dataService.getQuiz(variant);
    }

    @PostMapping("/api/results")
    @ResponseStatus(HttpStatus.OK)
    public QuizResult results(@Valid @RequestBody ResultRequest request) {
        var axes = scoringService.score(request);
        var matches = matcherService.findMatches(axes);
        var topMatch = matches.getFirst();
        var topCountryMatch = countryResolverService.resolveFor(topMatch);
        return new QuizResult(axes, topMatch, matches, topCountryMatch);
    }

    @GetMapping("/api/ideologies")
    public List<Ideology> ideologies() {
        return dataService.getIdeologies();
    }

    @GetMapping("/api/ideologies/{id}")
    public Ideology ideology(@PathVariable String id) {
        return dataService.getIdeologies().stream()
                .filter(ideology -> ideology.id().equals(id))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ideologia não encontrada"));
    }

    @GetMapping("/api/countries")
    public List<Country> countries() {
        return dataService.getCountries();
    }

    @GetMapping("/api/countries/{id}")
    public Country country(@PathVariable String id) {
        return dataService.getCountries().stream()
                .filter(country -> country.id().equals(id))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "PaÃ­s nÃ£o encontrado"));
    }
}
