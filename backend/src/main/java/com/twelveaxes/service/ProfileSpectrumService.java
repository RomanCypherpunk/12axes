package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

/**
 * O espectro de um perfil: a categoria da ideologia mais proxima do vetor dele (sem filtro de religiao, porque e a cor do
 * perfil, nao um ranking do usuario). O resultado depende so do vetor e do idioma, entao fica guardado.
 */
@Service
public class ProfileSpectrumService {

    private final QuizDataService dataService;
    private final ScoringService scoringService;
    private final IdeologyMatcherService ideologyMatcherService;
    private final Map<String, String> cache = new ConcurrentHashMap<>();

    public ProfileSpectrumService(
            QuizDataService dataService,
            ScoringService scoringService,
            IdeologyMatcherService ideologyMatcherService
    ) {
        this.dataService = dataService;
        this.scoringService = scoringService;
        this.ideologyMatcherService = ideologyMatcherService;
    }

    /** Categoria da ideologia mais proxima do vetor (eixo -> leftPercent; eixo ausente conta como 50). */
    public String categoryOf(Map<String, Double> vector, String lang) {
        String normalizedLang = QuizDataService.normalizeLang(lang);
        return cache.computeIfAbsent(normalizedLang + ":" + new TreeMap<>(vector), key -> {
            List<Double> values = dataService.getAxes(normalizedLang).stream()
                    .map(axis -> vector.getOrDefault(axis.id(), 50.0))
                    .toList();
            List<AxisResult> axes = scoringService.scoreFromLeftPercents(values, normalizedLang);
            return ideologyMatcherService.findMatches(axes, normalizedLang, null).getFirst().category();
        });
    }
}
