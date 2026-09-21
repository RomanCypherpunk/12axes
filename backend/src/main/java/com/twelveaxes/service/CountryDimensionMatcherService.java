package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Country;
import com.twelveaxes.model.CountryDimensionMatch;
import com.twelveaxes.model.CountryMatch;
import com.twelveaxes.model.CountryProfile;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;

/**
 * Países e experiências históricas mais próximos em cada dimensão do perfil.
 *
 * A seção não separa países atuais de históricos: em cada dimensão concorrem
 * todos os perfis do catálogo. Os destaques principal atual e histórico são
 * excluídos, pois já aparecem acima na seção de países.
 */
@Service
public class CountryDimensionMatcherService {
    private final QuizDataService dataService;
    private final ProfileMatchScorer profileMatchScorer;

    public CountryDimensionMatcherService(QuizDataService dataService, ProfileMatchScorer profileMatchScorer) {
        this.dataService = dataService;
        this.profileMatchScorer = profileMatchScorer;
    }

    public List<CountryDimensionMatch> findAll(
            List<AxisResult> axisResults,
            String lang,
            List<String> excludeIds) {
        Set<String> excludedIds = new LinkedHashSet<>(excludeIds);
        List<CountryDimensionMatch> matches = new ArrayList<>();

        addIfPresent(matches, excludedIds, DimensionMatcherService.POLITICAL,
                DimensionMatcherService.POLITICAL_AXES, axisResults, lang);
        addIfPresent(matches, excludedIds, DimensionMatcherService.SOCIAL,
                DimensionMatcherService.SOCIAL_AXES, axisResults, lang);
        addIfPresent(matches, excludedIds, DimensionMatcherService.ECONOMIC,
                DimensionMatcherService.ECONOMIC_AXES, axisResults, lang);

        return List.copyOf(matches);
    }

    private void addIfPresent(
            List<CountryDimensionMatch> matches,
            Set<String> excludedIds,
            String dimension,
            List<String> axisIds,
            List<AxisResult> axisResults,
            String lang) {
        CountryMatch match = findBestFor(axisIds, axisResults, lang, excludedIds);
        if (match != null) {
            matches.add(new CountryDimensionMatch(dimension, match));
            excludedIds.add(match.countryId());
        }
    }

    private CountryMatch findBestFor(
            List<String> axisIds,
            List<AxisResult> axisResults,
            String lang,
            Set<String> excludedIds) {
        Map<String, Double> userVector = profileMatchScorer.userVectorFor(axisResults);
        List<Country> countries = dataService.getCountries(QuizDataService.normalizeLang(lang)).stream()
                .filter(country -> !excludedIds.contains(country.id()))
                .toList();
        if (countries.isEmpty()) {
            return null;
        }

        Comparator<Scored> byScore = Comparator.comparingDouble(Scored::score).reversed();
        Comparator<Scored> byName = Comparator.comparing(scored -> scored.country().name());
        List<Scored> scored = countries.stream()
                .map(country -> new Scored(
                        country,
                        profileMatchScorer.compatibility(userVector, targetVectorFor(country), axisIds)))
                .sorted(byScore.thenComparing(byName))
                .toList();

        List<Double> allScores = scored.stream().map(Scored::score).toList();
        Scored best = scored.getFirst();
        return toMatch(best, profileMatchScorer.percentile(best.score(), allScores));
    }

    private CountryMatch toMatch(Scored scored, double percentile) {
        Country country = scored.country();
        return new CountryMatch(
                country.id(), country.name(), country.category(), country.description(),
                country.flagPath(), country.flagKind(), country.flagSourceName(),
                country.flagSourceUrl(), country.flagNote(), country.historical(), country.period(),
                round1(scored.score()), percentile);
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

    private double round1(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private record Scored(Country country, double score) {
    }
}
