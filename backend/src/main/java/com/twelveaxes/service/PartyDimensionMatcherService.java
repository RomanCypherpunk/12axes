package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Party;
import com.twelveaxes.model.PartyDimensionMatch;
import com.twelveaxes.model.PartyMatch;
import com.twelveaxes.model.PartyProfile;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;

/**
 * Partidos, movimentos e organizações mais compatíveis em cada dimensão do perfil
 * (política, social e econômica).
 */
@Service
public class PartyDimensionMatcherService {
    private final QuizDataService dataService;
    private final ProfileMatchScorer profileMatchScorer;

    public PartyDimensionMatcherService(QuizDataService dataService, ProfileMatchScorer profileMatchScorer) {
        this.dataService = dataService;
        this.profileMatchScorer = profileMatchScorer;
    }

    public List<PartyDimensionMatch> findAll(
            List<AxisResult> axisResults,
            String lang,
            List<String> excludeIds) {
        return findAll(axisResults, lang, excludeIds, null);
    }

    public List<PartyDimensionMatch> findAll(
            List<AxisResult> axisResults,
            String lang,
            List<String> excludeIds,
            String religion) {
        Set<String> excludedIds = new LinkedHashSet<>(excludeIds);
        List<PartyDimensionMatch> matches = new ArrayList<>();

        addIfPresent(matches, excludedIds, DimensionMatcherService.POLITICAL,
                DimensionMatcherService.POLITICAL_AXES, axisResults, lang, religion);
        addIfPresent(matches, excludedIds, DimensionMatcherService.SOCIAL,
                DimensionMatcherService.SOCIAL_AXES, axisResults, lang, religion);
        addIfPresent(matches, excludedIds, DimensionMatcherService.ECONOMIC,
                DimensionMatcherService.ECONOMIC_AXES, axisResults, lang, religion);

        return List.copyOf(matches);
    }

    private void addIfPresent(
            List<PartyDimensionMatch> matches,
            Set<String> excludedIds,
            String dimension,
            List<String> axisIds,
            List<AxisResult> axisResults,
            String lang,
            String religion) {
        PartyMatch match = findBestFor(axisIds, axisResults, lang, religion, excludedIds);
        if (match != null) {
            matches.add(new PartyDimensionMatch(dimension, match));
            excludedIds.add(match.partyId());
        }
    }

    private PartyMatch findBestFor(
            List<String> axisIds,
            List<AxisResult> axisResults,
            String lang,
            String religion,
            Set<String> excludedIds) {
        Map<String, Double> userVector = profileMatchScorer.userVectorFor(axisResults);
        List<Party> parties = dataService.getParties(QuizDataService.normalizeLang(lang)).stream()
                .filter(party -> !excludedIds.contains(party.id()))
                .filter(party -> ReligionFilter.allows(party.religions(), religion))
                .toList();
        if (parties.isEmpty()) {
            return null;
        }

        Comparator<Scored> byScore = Comparator.comparingDouble(Scored::score).reversed();
        Comparator<Scored> byName = Comparator.comparing(scored -> scored.party().name());
        List<Scored> scored = parties.stream()
                .map(party -> new Scored(
                        party,
                        profileMatchScorer.compatibility(userVector, targetVectorFor(party), axisIds)))
                .sorted(byScore.thenComparing(byName))
                .toList();

        List<Double> allScores = scored.stream().map(Scored::score).toList();
        Scored best = scored.getFirst();
        return toMatch(best, profileMatchScorer.percentile(best.score(), allScores));
    }

    private PartyMatch toMatch(Scored scored, double percentile) {
        Party party = scored.party();
        return new PartyMatch(
                party.id(),
                party.name(),
                party.category(),
                party.description(),
                party.logoPath(),
                party.logoSourceName(),
                party.logoSourceUrl(),
                party.logoNote(),
                party.countryId(),
                party.countryName(),
                party.countryFlagPath(),
                party.historical(),
                party.period(),
                round1(scored.score()),
                percentile,
                targetVectorFor(party)
        );
    }

    private Map<String, Double> targetVectorFor(Party party) {
        PartyProfile profile = dataService.getPartyProfiles().get(party.id());
        if (profile != null && profile.vector() != null && !profile.vector().isEmpty()) {
            return profile.vector();
        }
        return profileMatchScorer.neutralVector();
    }

    private double round1(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private record Scored(Party party, double score) {
    }
}

