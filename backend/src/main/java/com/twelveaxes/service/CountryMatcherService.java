package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Country;
import com.twelveaxes.model.CountryMatch;
import com.twelveaxes.model.CountryProfile;
import com.twelveaxes.model.IdeologyMatch;
import com.twelveaxes.model.IdeologyProfile;
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

    public CountryMatch findTopMatch(List<AxisResult> axisResults, IdeologyMatch topIdeology) {
        Map<String, Double> userVector = profileMatchScorer.userVectorFor(axisResults);
        List<String> requiredTags = requiredTagsFor(topIdeology);

        Comparator<CountryCandidate> byCompatibility =
                Comparator.comparingDouble(CountryCandidate::compatibility).reversed();
        Comparator<CountryCandidate> byName = Comparator.comparing(candidate -> candidate.country().name());

        return candidatesFor(requiredTags).stream()
                .map(country -> toCandidate(country, userVector))
                .sorted(byCompatibility.thenComparing(byName))
                .findFirst()
                .map(this::toMatch)
                .orElseThrow(() -> new IllegalStateException("Nenhum pais disponivel para matching"));
    }

    private List<Country> candidatesFor(List<String> requiredTags) {
        if (requiredTags.isEmpty()) {
            return dataService.getCountries();
        }

        List<Country> strictMatches = dataService.getCountries().stream()
                .filter(country -> tagsFor(country).containsAll(requiredTags))
                .toList();
        if (!strictMatches.isEmpty()) {
            return strictMatches;
        }

        List<Country> partialMatches = dataService.getCountries().stream()
                .filter(country -> tagsFor(country).stream().anyMatch(requiredTags::contains))
                .toList();
        return partialMatches.isEmpty() ? dataService.getCountries() : partialMatches;
    }

    private CountryCandidate toCandidate(Country country, Map<String, Double> userVector) {
        CountryProfile profile = dataService.getCountryProfiles().get(country.id());
        Map<String, Double> targetVector = targetVectorFor(country, profile);
        List<String> tags = profile == null ? List.of() : profile.tags();
        double compatibility = profileMatchScorer.compatibility(userVector, targetVector);
        return new CountryCandidate(country, tags, compatibility);
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
                candidate.tags(),
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

    private List<String> tagsFor(Country country) {
        CountryProfile profile = dataService.getCountryProfiles().get(country.id());
        return profile == null ? List.of() : profile.tags();
    }

    private List<String> requiredTagsFor(IdeologyMatch ideology) {
        if (ideology == null || ideology.ideologyId() == null || ideology.ideologyId().isBlank()) {
            return List.of();
        }

        IdeologyProfile profile = dataService.getIdeologyProfiles().get(ideology.ideologyId());
        return profile == null ? List.of() : profile.countryTags();
    }

    private record CountryCandidate(Country country, List<String> tags, double compatibility) {
    }
}
