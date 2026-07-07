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
    private final QuizDataService dataService;
    private final ProfileMatchScorer profileMatchScorer;

    public CountryMatcherService(QuizDataService dataService, ProfileMatchScorer profileMatchScorer) {
        this.dataService = dataService;
        this.profileMatchScorer = profileMatchScorer;
    }

    public CountryMatch findTopMatch(List<AxisResult> axisResults) {
        return findTopMatch(axisResults, QuizDataService.LANG_PT);
    }

    public CountryMatch findTopMatch(List<AxisResult> axisResults, String lang) {
        Map<String, Double> userVector = profileMatchScorer.userVectorFor(axisResults);

        Comparator<CountryCandidate> byCompatibility =
                Comparator.comparingDouble(CountryCandidate::compatibility).reversed();
        Comparator<CountryCandidate> byName = Comparator.comparing(candidate -> candidate.country().name());

        return dataService.getCountries(QuizDataService.normalizeLang(lang)).stream()
                .map(country -> toCandidate(country, userVector))
                .sorted(byCompatibility.thenComparing(byName))
                .findFirst()
                .map(this::toMatch)
                .orElseThrow(() -> new IllegalStateException("Nenhum pais disponivel para matching"));
    }

    private CountryCandidate toCandidate(Country country, Map<String, Double> userVector) {
        CountryProfile profile = dataService.getCountryProfiles().get(country.id());
        Map<String, Double> targetVector = targetVectorFor(country, profile);
        double compatibility = profileMatchScorer.compatibility(userVector, targetVector);
        return new CountryCandidate(country, compatibility);
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
                candidate.compatibility()
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

    private record CountryCandidate(Country country, double compatibility) {
    }
}
