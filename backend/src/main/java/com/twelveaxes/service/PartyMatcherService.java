package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Party;
import com.twelveaxes.model.PartyMatch;
import com.twelveaxes.model.PartyProfile;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;
import org.springframework.stereotype.Service;

/** Partidos, movimentos e organizacoes mais e menos compativeis com o usuario. */
@Service
public class PartyMatcherService {
    private static final int TOP_MATCHES = 3;
    private static final int BOTTOM_MATCHES = 3;

    private final QuizDataService dataService;
    private final ProfileMatchScorer profileMatchScorer;
    private final RequestMemo<List<Object>, List<PartyMatch>> rankingMemo = new RequestMemo<>();

    public PartyMatcherService(QuizDataService dataService, ProfileMatchScorer profileMatchScorer) {
        this.dataService = dataService;
        this.profileMatchScorer = profileMatchScorer;
    }

    // Partido atual mais compativel.
    public PartyMatch findTopMatch(List<AxisResult> axisResults, String lang) {
        return findTopMatch(axisResults, lang, null);
    }

    public PartyMatch findTopMatch(List<AxisResult> axisResults, String lang, String religion) {
        return firstMatching(axisResults, lang, religion, false);
    }

    // Partido historico mais compativel.
    public PartyMatch findTopHistoricalMatch(List<AxisResult> axisResults, String lang) {
        return findTopHistoricalMatch(axisResults, lang, null);
    }

    public PartyMatch findTopHistoricalMatch(List<AxisResult> axisResults, String lang, String religion) {
        return firstMatching(axisResults, lang, religion, true);
    }

    private PartyMatch firstMatching(List<AxisResult> axisResults, String lang, String religion, boolean historical) {
        return rankAll(axisResults, lang, religion).stream()
                .filter(match -> match.historical() == historical)
                .findFirst()
                .orElse(null);
    }

    // Os tres mais compativeis do catalogo inteiro (atuais e historicos juntos), do topo para baixo.
    public List<PartyMatch> findTopMatches(List<AxisResult> axisResults, String lang, String religion) {
        return rankAll(axisResults, lang, religion).stream().limit(TOP_MATCHES).toList();
    }

    // Os tres menos compativeis do catalogo inteiro, em ordem crescente de compatibilidade.
    public List<PartyMatch> findBottomMatches(List<AxisResult> axisResults, String lang, String religion) {
        List<PartyMatch> ranking = rankAll(axisResults, lang, religion);
        return ranking.stream()
                .skip(Math.max(0, ranking.size() - BOTTOM_MATCHES))
                .sorted(Comparator.comparingDouble(PartyMatch::compatibility))
                .toList();
    }

    // Ranking completo, do mais ao menos compativel. O percentil compara com o catalogo inteiro;
    // a preferencia religiosa so tira perfis da lista.
    private List<PartyMatch> rankAll(List<AxisResult> axisResults, String lang, String religion) {
        return rankingMemo.get(List.of(QuizDataService.normalizeLang(lang), axisResults, String.valueOf(religion)),
                () -> computeRanking(axisResults, lang, religion));
    }

    private List<PartyMatch> computeRanking(List<AxisResult> axisResults, String lang, String religion) {
        Map<String, Double> userVector = profileMatchScorer.userVectorFor(axisResults);
        List<Party> parties = dataService.getParties(QuizDataService.normalizeLang(lang));
        if (parties.isEmpty()) {
            return List.of();
        }
        List<Double> scores = parties.stream()
                .map(party -> profileMatchScorer.compatibility(userVector, targetVectorFor(party)))
                .toList();
        double[] percentiles = profileMatchScorer.percentiles(scores);

        Comparator<PartyMatch> byCompatibility = Comparator.comparingDouble(PartyMatch::compatibility).reversed();
        return IntStream.range(0, parties.size())
                .filter(i -> ReligionFilter.allows(parties.get(i).religions(), religion))
                .mapToObj(i -> toMatch(parties.get(i), scores.get(i), percentiles[i]))
                .sorted(byCompatibility.thenComparing(PartyMatch::name))
                .toList();
    }

    private PartyMatch toMatch(Party party, double compatibility, double percentile) {
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
                compatibility,
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
}
