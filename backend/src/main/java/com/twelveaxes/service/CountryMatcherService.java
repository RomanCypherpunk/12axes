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

    private final QuizDataService dataService;
    private final ProfileMatchScorer profileMatchScorer;

    public CountryMatcherService(QuizDataService dataService, ProfileMatchScorer profileMatchScorer) {
        this.dataService = dataService;
        this.profileMatchScorer = profileMatchScorer;
    }

    public CountryMatch findTopMatch(List<AxisResult> axisResults) {
        return findTopMatch(axisResults, QuizDataService.LANG_PT);
    }

    // Pais atual mais compativel. Experiencias historicas tem secao propria.
    public CountryMatch findTopMatch(List<AxisResult> axisResults, String lang) {
        return firstMatching(axisResults, lang, false);
    }

    public CountryMatch findTopHistoricalMatch(List<AxisResult> axisResults, String lang) {
        return firstMatching(axisResults, lang, true);
    }

    // Os tres menos compativeis do catalogo inteiro, em ordem crescente.
    public List<CountryMatch> findBottomMatches(List<AxisResult> axisResults, String lang) {
        List<CountryMatch> ranking = rankAll(axisResults, lang);
        return ranking.stream()
                .skip(Math.max(0, ranking.size() - BOTTOM_MATCHES))
                .sorted(Comparator.comparingDouble(CountryMatch::compatibility))
                .toList();
    }

    private CountryMatch firstMatching(List<AxisResult> axisResults, String lang, boolean historical) {
        return rankAll(axisResults, lang).stream()
                .filter(match -> match.historical() == historical)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException(
                        "Nenhum pais disponivel para matching (historical=" + historical + ")"));
    }

    // Ranking completo do catalogo, do mais ao menos compativel.
    private List<CountryMatch> rankAll(List<AxisResult> axisResults, String lang) {
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

        return candidates.stream()
                .map(candidate -> withPercentile(candidate, catalogScores))
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
                candidate.compatibilityPercentile()
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
