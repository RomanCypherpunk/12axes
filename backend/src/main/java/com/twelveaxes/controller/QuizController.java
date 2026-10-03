package com.twelveaxes.controller;

import com.twelveaxes.exception.ResourceNotFoundException;
import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Country;
import com.twelveaxes.model.Ideology;
import com.twelveaxes.model.Personality;
import com.twelveaxes.model.QuizPayload;
import com.twelveaxes.model.QuizResult;
import com.twelveaxes.model.ResultRequest;
import com.twelveaxes.service.AxisOutlierService;
import com.twelveaxes.service.AxisTensionService;
import com.twelveaxes.service.AxisValuesParser;
import com.twelveaxes.service.BoundedCache;
import com.twelveaxes.service.BookRecommendationService;
import com.twelveaxes.service.DimensionMatcherService;
import com.twelveaxes.service.CountryMatcherService;
import com.twelveaxes.service.CountryDimensionMatcherService;
import com.twelveaxes.service.IdeologyMatcherService;
import com.twelveaxes.service.PersonalityMatcherService;
import com.twelveaxes.service.QuizDataService;
import com.twelveaxes.service.ReligionFilter;
import com.twelveaxes.service.ScoringService;
import jakarta.validation.Valid;
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

@RestController
public class QuizController {
    // Os resultados sao deterministicos: mesmo vetor, idioma e religiao geram sempre a mesma
    // resposta. O limite mantem a memoria do plano pequeno do Render sob controle.
    private static final int RESULT_CACHE_ENTRIES = 2_000;
    private static final int QUIZ_CACHE_ENTRIES = 16;

    private final BoundedCache<String, QuizResult> resultCache = new BoundedCache<>(RESULT_CACHE_ENTRIES);
    private final BoundedCache<String, QuizPayload> quizCache = new BoundedCache<>(QUIZ_CACHE_ENTRIES);
    private final QuizDataService dataService;
    private final ScoringService scoringService;
    private final IdeologyMatcherService matcherService;
    private final CountryMatcherService countryMatcherService;
    private final CountryDimensionMatcherService countryDimensionMatcherService;
    private final PersonalityMatcherService personalityMatcherService;
    private final AxisOutlierService axisOutlierService;
    private final AxisTensionService axisTensionService;
    private final BookRecommendationService bookRecommendationService;
    private final DimensionMatcherService dimensionMatcherService;

    public QuizController(
            QuizDataService dataService,
            ScoringService scoringService,
            IdeologyMatcherService matcherService,
            CountryMatcherService countryMatcherService,
            CountryDimensionMatcherService countryDimensionMatcherService,
            PersonalityMatcherService personalityMatcherService,
            AxisOutlierService axisOutlierService,
            AxisTensionService axisTensionService,
            DimensionMatcherService dimensionMatcherService,
            BookRecommendationService bookRecommendationService
    ) {
        this.dataService = dataService;
        this.scoringService = scoringService;
        this.matcherService = matcherService;
        this.countryMatcherService = countryMatcherService;
        this.countryDimensionMatcherService = countryDimensionMatcherService;
        this.personalityMatcherService = personalityMatcherService;
        this.axisOutlierService = axisOutlierService;
        this.axisTensionService = axisTensionService;
        this.dimensionMatcherService = dimensionMatcherService;
        this.bookRecommendationService = bookRecommendationService;
    }


    @GetMapping("/api/quiz")
    public QuizPayload quiz(
            @RequestParam(defaultValue = QuizDataService.SHORT_VARIANT) String variant,
            @RequestParam(defaultValue = QuizDataService.LANG_PT) String lang
    ) {
        String key = dataService.normalizeVariant(variant) + "|" + QuizDataService.normalizeLang(lang);
        return quizCache.get(key, () -> dataService.getQuiz(variant, lang));
    }

    @PostMapping("/api/results")
    @ResponseStatus(HttpStatus.OK)
    public QuizResult results(
            @Valid @RequestBody ResultRequest request,
            @RequestParam(defaultValue = QuizDataService.LANG_PT) String lang,
            @RequestParam(required = false) String religion
    ) {
        return buildResult(scoringService.score(request, lang), lang, ReligionFilter.normalize(religion));
    }

    // Resultado compartilhável: reconstrói matches a partir do vetor de eixos
    // (12 leftPercents separados por vírgula, na ordem de axes.json).
    // religion é opcional: ausente ou desconhecido = ranking geral, sem filtro.
    @GetMapping("/api/results/by-axes")
    public QuizResult resultsByAxes(
            @RequestParam("v") String values,
            @RequestParam(defaultValue = QuizDataService.LANG_PT) String lang,
            @RequestParam(required = false) String religion
    ) {
        return buildResult(scoringService.scoreFromLeftPercents(AxisValuesParser.parse(values), lang), lang,
                ReligionFilter.normalize(religion));
    }

    private QuizResult buildResult(List<AxisResult> axes, String lang, String religion) {
        return resultCache.get(resultKey(axes, lang, religion), () -> computeResult(axes, lang, religion));
    }

    // O resultado depende so dos 12 percentuais (o resto vem do idioma), entao eles formam a chave.
    private static String resultKey(List<AxisResult> axes, String lang, String religion) {
        StringBuilder key = new StringBuilder(lang).append('|').append(religion).append('|');
        axes.forEach(axis -> key.append(axis.leftPercent()).append(','));
        return key.toString();
    }

    private QuizResult computeResult(List<AxisResult> axes, String lang, String religion) {
        var matches = matcherService.findMatches(axes, lang, religion);
        var personalityMatches = personalityMatcherService.findMatches(axes, lang, religion);
        var topPersonality = personalityMatches.getFirst();
        var categoryBestMatches = personalityMatcherService.findBestPerCategory(axes, lang, religion);
        var topCountry = countryMatcherService.findTopMatch(axes, lang, religion);
        var topHistoricalCountry = countryMatcherService.findTopHistoricalMatch(axes, lang, religion);
        return new QuizResult(
                axes,
                matches.getFirst(),
                matches,
                matcherService.findBottomMatch(axes, lang, religion),
                topCountry,
                countryMatcherService.findTopMatchesAny(axes, lang, religion),
                topHistoricalCountry,
                countryDimensionMatcherService.findAll(
                        axes, lang, List.of(topCountry.countryId(), topHistoricalCountry.countryId()), religion),
                countryMatcherService.findBottomMatches(axes, lang, religion),
                topPersonality,
                personalityMatches,
                dimensionMatcherService.findAll(axes, lang, topPersonality.personalityId(), religion),
                categoryBestMatches,
                personalityMatcherService.findBottomMatches(axes, lang, religion),
                axisOutlierService.findMostUnusual(axes, lang),
                axisOutlierService.findMostCommon(axes, lang),
                axisTensionService.findStrongest(axes, lang),
                bookRecommendationService.recommend(personalityMatches, categoryBestMatches, lang)
        );
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
