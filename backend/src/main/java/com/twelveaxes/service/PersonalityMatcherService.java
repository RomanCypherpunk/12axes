package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Personality;
import com.twelveaxes.model.PersonalityMatch;
import com.twelveaxes.model.PersonalityProfile;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class PersonalityMatcherService {
    private static final int TOP_MATCHES = 8;
    private static final int CATEGORY_MATCHES = 3;
    private static final int BOTTOM_MATCHES = 3;

    private final QuizDataService dataService;
    private final ProfileMatchScorer profileMatchScorer;

    public PersonalityMatcherService(QuizDataService dataService, ProfileMatchScorer profileMatchScorer) {
        this.dataService = dataService;
        this.profileMatchScorer = profileMatchScorer;
    }

    public List<PersonalityMatch> findMatches(List<AxisResult> axisResults) {
        return findMatches(axisResults, QuizDataService.LANG_PT);
    }

    public List<PersonalityMatch> findMatches(List<AxisResult> axisResults, String lang) {
        return rankAll(axisResults, lang).stream()
                .limit(TOP_MATCHES)
                .toList();
    }

    public PersonalityMatch findTopMatch(List<AxisResult> axisResults) {
        return findTopMatch(axisResults, QuizDataService.LANG_PT);
    }

    public PersonalityMatch findTopMatch(List<AxisResult> axisResults, String lang) {
        return findMatches(axisResults, lang).getFirst();
    }

    // Tres personalidades de categorias distintas entre si e diferentes da
    // categoria da mais compativel: percorre o ranking de cima para baixo e
    // pega a primeira de cada categoria ainda nao vista.
    public List<PersonalityMatch> findCategoryMatches(List<AxisResult> axisResults, String lang) {
        List<PersonalityMatch> ranking = rankAll(axisResults, lang);
        if (ranking.isEmpty()) {
            return List.of();
        }

        Set<String> categoriasVistas = new LinkedHashSet<>();
        categoriasVistas.add(ranking.getFirst().category());

        List<PersonalityMatch> selecionadas = new ArrayList<>();
        for (PersonalityMatch match : ranking) {
            if (selecionadas.size() == CATEGORY_MATCHES) {
                break;
            }
            if (categoriasVistas.add(match.category())) {
                selecionadas.add(match);
            }
        }
        return List.copyOf(selecionadas);
    }

    // A personalidade mais compativel de CADA categoria do catalogo, da categoria
    // mais compativel para a menos. Diferente de findCategoryMatches, que so
    // devolve tres: aqui nenhuma area de atuacao fica de fora.
    public List<PersonalityMatch> findBestPerCategory(List<AxisResult> axisResults, String lang) {
        Map<String, PersonalityMatch> melhorPorCategoria = new LinkedHashMap<>();
        for (PersonalityMatch match : rankAll(axisResults, lang)) {
            if (match.category() != null) {
                melhorPorCategoria.putIfAbsent(match.category(), match);
            }
        }
        return melhorPorCategoria.values().stream()
                .sorted(Comparator.comparingDouble(PersonalityMatch::compatibility).reversed())
                .toList();
    }

    // As tres menos compativeis do catalogo inteiro, em ordem crescente.
    public List<PersonalityMatch> findBottomMatches(List<AxisResult> axisResults, String lang) {
        List<PersonalityMatch> ranking = rankAll(axisResults, lang);
        return ranking.stream()
                .skip(Math.max(0, ranking.size() - BOTTOM_MATCHES))
                .sorted(Comparator.comparingDouble(PersonalityMatch::compatibility))
                .toList();
    }

    // Ranking completo do catalogo, do mais ao menos compativel. Todos os
    // recortes (topo, categorias, opostos) saem desta mesma lista.
    private List<PersonalityMatch> rankAll(List<AxisResult> axisResults, String lang) {
        Map<String, Double> userVector = profileMatchScorer.userVectorFor(axisResults);

        Comparator<PersonalityCandidate> byScore =
                Comparator.comparingDouble(PersonalityCandidate::compatibility).reversed();
        Comparator<PersonalityCandidate> byName = Comparator.comparing(candidate -> candidate.personality().name());

        List<PersonalityCandidate> candidates = dataService.getPersonalities(QuizDataService.normalizeLang(lang)).stream()
                .map(personality -> toCandidate(personality, userVector))
                .toList();
        List<Double> catalogScores = candidates.stream()
                .map(PersonalityCandidate::compatibility)
                .toList();

        return candidates.stream()
                .map(candidate -> withPercentile(candidate, catalogScores))
                .sorted(byScore.thenComparing(byName))
                .map(this::toMatch)
                .toList();
    }

    private PersonalityCandidate toCandidate(Personality personality, Map<String, Double> userVector) {
        double compatibility = profileMatchScorer.compatibility(userVector, targetVectorFor(personality));
        return new PersonalityCandidate(personality, compatibility, 0.0);
    }

    private PersonalityCandidate withPercentile(PersonalityCandidate candidate, List<Double> catalogScores) {
        double percentile = profileMatchScorer.percentile(candidate.compatibility(), catalogScores);
        return new PersonalityCandidate(candidate.personality(), candidate.compatibility(), percentile);
    }

    private PersonalityMatch toMatch(PersonalityCandidate candidate) {
        Personality personality = candidate.personality();
        return new PersonalityMatch(
                personality.id(),
                personality.name(),
                personality.role(),
                personality.category(),
                personality.lifespan(),
                personality.description(),
                personality.imagePath(),
                personality.imageSourceName(),
                personality.imageSourceUrl(),
                personality.imageNote(),
                candidate.compatibility(),
                candidate.compatibilityPercentile()
        );
    }

    private Map<String, Double> targetVectorFor(Personality personality) {
        PersonalityProfile profile = dataService.getPersonalityProfiles().get(personality.id());
        if (profile != null && profile.vector() != null && !profile.vector().isEmpty()) {
            return profile.vector();
        }
        return profileMatchScorer.neutralVector();
    }

    private record PersonalityCandidate(
            Personality personality,
            double compatibility,
            double compatibilityPercentile
    ) {
    }
}
