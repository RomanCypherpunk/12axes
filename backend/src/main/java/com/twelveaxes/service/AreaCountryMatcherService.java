package com.twelveaxes.service;

import com.twelveaxes.model.AreaCountryMatch;
import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Country;
import com.twelveaxes.model.CountryMatch;
import com.twelveaxes.model.CountryProfile;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

/**
 * O pais (atual ou historico) mais proximo do usuario em cada area do relatorio pago. Os eixos principais da area valem metade da nota
 * (divididos igualmente) e todos os outros eixos juntos valem a outra metade (tambem divididos igualmente): a area manda e
 * o resto desempata. O mesmo pais pode vencer mais de uma area. Respeita o filtro de religiao e ignora regioes (Country.region),
 * que nao sao paises; paises historicos concorrem normalmente.
 */
@Service
public class AreaCountryMatcherService {
    private static final List<String> ALL_AXES = List.of(
            "estrutura", "representacao", "poder", "imigracao", "diplomacia", "intervencao",
            "economia", "controle", "comercio", "religiao", "moral", "tecnologia");

    /** As areas, na ordem em que aparecem, com os eixos principais de cada uma. */
    private static final Map<String, List<String>> AREAS = new LinkedHashMap<>();

    static {
        AREAS.put("politico", List.of("representacao", "estrutura"));
        AREAS.put("externa", List.of("intervencao", "diplomacia", "comercio"));
        AREAS.put("territorial", List.of("estrutura"));
        AREAS.put("economico", List.of("economia", "controle", "comercio"));
        AREAS.put("sociedade", List.of("imigracao", "moral", "religiao"));
        AREAS.put("tecnologia", List.of("tecnologia", "moral"));
    }

    private final QuizDataService dataService;
    private final ProfileMatchScorer profileMatchScorer;

    public AreaCountryMatcherService(QuizDataService dataService, ProfileMatchScorer profileMatchScorer) {
        this.dataService = dataService;
        this.profileMatchScorer = profileMatchScorer;
    }

    public static List<String> mainAxes(String area) {
        return AREAS.get(area);
    }

    /** Pesos dos 12 eixos para a area: principais somam 0,5 e os demais somam 0,5. */
    public static Map<String, Double> weights(String area) {
        List<String> main = AREAS.get(area);
        int others = ALL_AXES.size() - main.size();
        Map<String, Double> weights = new LinkedHashMap<>();
        for (String axis : ALL_AXES) {
            weights.put(axis, main.contains(axis) ? 0.5 / main.size() : 0.5 / others);
        }
        return weights;
    }

    public List<AreaCountryMatch> findAll(List<AxisResult> axisResults, String lang, String religion) {
        Map<String, Double> userVector = profileMatchScorer.userVectorFor(axisResults);
        List<Country> countries = dataService.getCountries(QuizDataService.normalizeLang(lang)).stream()
                .filter(country -> !country.region())
                .filter(country -> ReligionFilter.allows(country.religions(), religion))
                .toList();
        if (countries.isEmpty()) {
            return List.of();
        }
        return AREAS.keySet().stream()
                .map(area -> new AreaCountryMatch(area, best(area, userVector, countries)))
                .toList();
    }

    private CountryMatch best(String area, Map<String, Double> userVector, List<Country> countries) {
        Map<String, Double> weights = weights(area);
        List<Scored> scored = countries.stream()
                .map(country -> new Scored(country, profileMatchScorer.compatibility(userVector, targetVectorFor(country), weights)))
                .sorted(Comparator.comparingDouble(Scored::score).reversed().thenComparing(item -> item.country().name()))
                .toList();
        List<Double> allScores = scored.stream().map(Scored::score).toList();
        Scored top = scored.getFirst();
        Country country = top.country();
        return new CountryMatch(
                country.id(), country.name(), country.category(), country.description(),
                country.flagPath(), country.flagKind(), country.flagSourceName(),
                country.flagSourceUrl(), country.flagNote(), country.historical(), country.period(),
                Math.round(top.score() * 10.0) / 10.0, profileMatchScorer.percentile(top.score(), allScores),
                targetVectorFor(country));
    }

    private Map<String, Double> targetVectorFor(Country country) {
        CountryProfile profile = dataService.getCountryProfiles().get(country.id());
        if (profile != null && profile.vector() != null && !profile.vector().isEmpty()) {
            return profile.vector();
        }
        if (country.vector() != null && !country.vector().isEmpty()) {
            return country.vector();
        }
        return profileMatchScorer.neutralVector();
    }

    private record Scored(Country country, double score) {
    }
}
