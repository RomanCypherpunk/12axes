package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.DimensionMatch;
import com.twelveaxes.model.Personality;
import com.twelveaxes.model.PersonalityMatch;
import com.twelveaxes.model.PersonalityProfile;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

/**
 * Personalidade mais compativel com o usuario em cada dimensao do perfil.
 *
 * A compatibilidade geral soma os 12 eixos e responde "com quem voce mais se
 * parece". Estas tres respondem algo mais especifico: com quem voce combina
 * POLITICAMENTE, SOCIALMENTE e ECONOMICAMENTE, olhando so os eixos daquele
 * grupo. Sao perguntas diferentes, e as respostas costumam ser pessoas
 * diferentes.
 */
@Service
public class DimensionMatcherService {
    /** Como o poder se organiza e se legitima, e como o Estado trata o cidadao. */
    static final List<String> POLITICAL_AXES =
            List.of("estrutura", "representacao", "poder", "diplomacia", "intervencao");

    /** Costumes, identidade, fe e a relacao com a tecnica. */
    static final List<String> SOCIAL_AXES =
            List.of("moral", "religiao", "imigracao", "tecnologia");

    /** Propriedade, coordenacao da producao e abertura comercial. */
    static final List<String> ECONOMIC_AXES =
            List.of("economia", "controle", "comercio");

    public static final String POLITICAL = "political";
    public static final String SOCIAL = "social";
    public static final String ECONOMIC = "economic";

    private final QuizDataService dataService;
    private final ProfileMatchScorer profileMatchScorer;

    public DimensionMatcherService(QuizDataService dataService, ProfileMatchScorer profileMatchScorer) {
        this.dataService = dataService;
        this.profileMatchScorer = profileMatchScorer;
    }

    /** As tres dimensoes, na ordem politica, social, economica. */
    public List<DimensionMatch> findAll(List<AxisResult> axisResults, String lang) {
        List<DimensionMatch> matches = new ArrayList<>();
        addIfPresent(matches, POLITICAL, POLITICAL_AXES, axisResults, lang);
        addIfPresent(matches, SOCIAL, SOCIAL_AXES, axisResults, lang);
        addIfPresent(matches, ECONOMIC, ECONOMIC_AXES, axisResults, lang);
        return List.copyOf(matches);
    }

    private void addIfPresent(
            List<DimensionMatch> matches,
            String dimension,
            List<String> axisIds,
            List<AxisResult> axisResults,
            String lang
    ) {
        PersonalityMatch match = findBestFor(axisIds, axisResults, lang);
        if (match != null) {
            matches.add(new DimensionMatch(dimension, match));
        }
    }

    private PersonalityMatch findBestFor(List<String> axisIds, List<AxisResult> axisResults, String lang) {
        Map<String, Double> userVector = profileMatchScorer.userVectorFor(axisResults);
        List<Personality> personalities = dataService.getPersonalities(QuizDataService.normalizeLang(lang));
        if (personalities.isEmpty()) {
            return null;
        }

        Comparator<Scored> byScore = Comparator.comparingDouble(Scored::score).reversed();
        Comparator<Scored> byName = Comparator.comparing(scored -> scored.personality().name());

        List<Scored> scored = personalities.stream()
                .map(personality -> new Scored(
                        personality,
                        profileMatchScorer.compatibility(userVector, targetVectorFor(personality), axisIds)))
                .sorted(byScore.thenComparing(byName))
                .toList();

        // O percentil compara a nota da dimensao com as notas da mesma dimensao,
        // nunca com as dos 12 eixos.
        List<Double> allScores = scored.stream().map(Scored::score).toList();
        Scored best = scored.getFirst();
        return toMatch(best, profileMatchScorer.percentile(best.score(), allScores));
    }

    private PersonalityMatch toMatch(Scored scored, double percentile) {
        Personality personality = scored.personality();
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
                round1(scored.score()),
                percentile
        );
    }

    private Map<String, Double> targetVectorFor(Personality personality) {
        PersonalityProfile profile = dataService.getPersonalityProfiles().get(personality.id());
        if (profile != null && profile.vector() != null && !profile.vector().isEmpty()) {
            return profile.vector();
        }
        return profileMatchScorer.neutralVector();
    }

    private double round1(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private record Scored(Personality personality, double score) {
    }
}
