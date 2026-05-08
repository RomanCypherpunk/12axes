package com.twelveaxes.controller;

import com.twelveaxes.model.Ideology;
import com.twelveaxes.model.QuizPayload;
import com.twelveaxes.model.QuizResult;
import com.twelveaxes.model.ResultRequest;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class QuizController {
    private final QuizDataService dataService;
    private final ScoringService scoringService;
    private final IdeologyMatcherService matcherService;

    public QuizController(
            QuizDataService dataService,
            ScoringService scoringService,
            IdeologyMatcherService matcherService
    ) {
        this.dataService = dataService;
        this.scoringService = scoringService;
        this.matcherService = matcherService;
    }

    @GetMapping("/api/quiz")
    public QuizPayload quiz() {
        return dataService.getQuiz();
    }

    @PostMapping("/api/results")
    @ResponseStatus(HttpStatus.OK)
    public QuizResult results(@Valid @RequestBody ResultRequest request) {
        var axes = scoringService.score(request);
        var matches = matcherService.findMatches(axes);
        return new QuizResult(axes, matches.getFirst(), matches);
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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ideologia nao encontrada"));
    }
}
