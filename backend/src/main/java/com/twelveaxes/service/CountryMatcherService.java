package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Country;
import com.twelveaxes.model.CountryMatch;
import com.twelveaxes.model.CountryProfile;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class CountryMatcherService {
    private static final int BOTTOM_MATCHES = 3;
    private static final int TOP_MATCHES = 3;

    private final QuizDataService dataService;
    private final ProfileMatchScorer profileMatchScorer;
    private final RequestMemo<List<Object>, List<CountryMatch>> rankingMemo = new RequestMemo<>();

    public CountryMatcherService(QuizDataService dataService, ProfileMatchScorer profileMatchScorer) {
        this.dataService = dataService;
        this.profileMatchScorer = profileMatchScorer;
    }

    public CountryMatch findTopMatch(List<AxisResult> axisResults) {
        return findTopMatch(axisResults, QuizDataService.LANG_PT);
    }

    // Pais atual mais compativel. Experiencias historicas tem secao propria.
    public CountryMatch findTopMatch(List<AxisResult> axisResults, String lang) {
        return findTopMatch(axisResults, lang, null);
    }

    public CountryMatch findTopMatch(List<AxisResult> axisResults, String lang, String religion) {
        return firstMatching(axisResults, lang, religion, false);
    }

    public CountryMatch findTopHistoricalMatch(List<AxisResult> axisResults, String lang) {
        return findTopHistoricalMatch(axisResults, lang, null);
    }

    public CountryMatch findTopHistoricalMatch(List<AxisResult> axisResults, String lang, String religion) {
        return firstMatching(axisResults, lang, religion, true);
    }

    // Os tres paises atuais mais compativeis, em ordem decrescente (exclui experiencias historicas).
    public List<CountryMatch> findTopMatches(List<AxisResult> axisResults, String lang) {
        return rankAll(axisResults, lang, null).stream()
                .filter(match -> !match.historical())
                .limit(TOP_MATCHES)
                .toList();
    }

    // Os tres mais compativeis do catalogo inteiro, sem distincao entre paises atuais e
    // experiencias historicas. Usado no card de compartilhamento.
    public List<CountryMatch> findTopMatchesAny(List<AxisResult> axisResults, String lang) {
        return findTopMatchesAny(axisResults, lang, null);
    }

    public List<CountryMatch> findTopMatchesAny(List<AxisResult> axisResults, String lang, String religion) {
        return rankAll(axisResults, lang, religion).stream()
                .limit(TOP_MATCHES)
                .toList();
    }

    // Os tres menos compativeis do catalogo inteiro, em ordem crescente.
    public List<CountryMatch> findBottomMatches(List<AxisResult> axisResults, String lang) {
        return findBottomMatches(axisResults, lang, null);
    }

    public List<CountryMatch> findBottomMatches(List<AxisResult> axisResults, String lang, String religion) {
        List<CountryMatch> ranking = rankAll(axisResults, lang, religion);
        return ranking.stream()
                .skip(Math.max(0, ranking.size() - BOTTOM_MATCHES))
                .sorted(Comparator.comparingDouble(CountryMatch::compatibility))
                .toList();
    }

    private CountryMatch firstMatching(List<AxisResult> axisResults, String lang, String religion, boolean historical) {
        return rankAll(axisResults, lang, religion).stream()
                .filter(match -> match.historical() == historical)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException(
                        "Nenhum pais disponivel para matching (historical=" + historical + ")"));
    }

    // Ranking completo do catalogo, do mais ao menos compativel. O percentil
    // compara com o catalogo inteiro; a preferencia religiosa so tira paises.
    // Ranking completo do catalogo (respeita a preferencia religiosa), do mais ao menos compativel.
    public List<CountryMatch> findAll(List<AxisResult> axisResults, String lang, String religion) {
        return rankAll(axisResults, lang, religion);
    }

    private List<CountryMatch> rankAll(List<AxisResult> axisResults, String lang, String religion) {
        return rankingMemo.get(List.of(QuizDataService.normalizeLang(lang), axisResults, String.valueOf(religion)),
                () -> computeRanking(axisResults, lang, religion));
    }

    private List<CountryMatch> computeRanking(List<AxisResult> axisResults, String lang, String religion) {
        Map<String, Double> userVector = profileMatchScorer.userVectorFor(axisResults);

        Comparator<CountryCandidate> byCompatibility =
                Comparator.comparingDouble(CountryCandidate::compatibility).reversed();
        Comparator<CountryCandidate> byName = Comparator.comparing(candidate -> candidate.country().name());

        List<CountryCandidate> candidates = dataService.getCountries(QuizDataService.normalizeLang(lang)).stream()
                .map(country -> toCandidate(country, userVector))
                .toList();
        List<Double> catalogScores = candidates.stream()
                .map(CountryCandidate::compatibility)
                .toList();

        double[] percentiles = profileMatchScorer.percentiles(catalogScores);
        return java.util.stream.IntStream.range(0, candidates.size())
                .mapToObj(i -> new CountryCandidate(candidates.get(i).country(), candidates.get(i).compatibility(), percentiles[i]))
                .filter(candidate -> ReligionFilter.allows(candidate.country().religions(), religion))
                .sorted(byCompatibility.thenComparing(byName))
                .map(this::toMatch)
                .toList();
    }

    private CountryCandidate toCandidate(Country country, Map<String, Double> userVector) {
        CountryProfile profile = dataService.getCountryProfiles().get(country.id());
        Map<String, Double> targetVector = targetVectorFor(country, profile);
        double compatibility = profileMatchScorer.compatibility(userVector, targetVector);
        return new CountryCandidate(country, compatibility, 0.0);
    }

    private CountryMatch toMatch(CountryCandidate candidate) {
        Country country = candidate.country();
        return new CountryMatch(
                country.id(),
                country.name(),
                country.category(),
                country.description(),
                country.flagPath(),
                country.flagKind(),
                country.flagSourceName(),
                country.flagSourceUrl(),
                country.flagNote(),
                country.historical(),
                country.period(),
                candidate.compatibility(),
                candidate.compatibilityPercentile(),
                targetVectorFor(country, dataService.getCountryProfiles().get(country.id()))
        );
    }

    private Map<String, Double> targetVectorFor(Country country, CountryProfile profile) {
        if (profile != null && profile.vector() != null && !profile.vector().isEmpty()) {
            return profile.vector();
        }
        if (country.vector() != null && !country.vector().isEmpty()) {
            return country.vector();
        }
        return profileMatchScorer.neutralVector();
    }

    private CountryCandidate withPercentile(CountryCandidate candidate, List<Double> catalogScores) {
        double percentile = profileMatchScorer.percentile(candidate.compatibility(), catalogScores);
        return new CountryCandidate(candidate.country(), candidate.compatibility(), percentile);
    }

    private record CountryCandidate(Country country, double compatibility, double compatibilityPercentile) {
    }
}
