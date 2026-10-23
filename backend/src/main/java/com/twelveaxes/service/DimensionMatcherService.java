package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.DimensionMatch;
import com.twelveaxes.model.Personality;
import com.twelveaxes.model.PersonalityMatch;
import com.twelveaxes.model.PersonalityProfile;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;

/**
 * Personalidade mais compativel com o usuario em cada area de atuacao.
 *
 * A compatibilidade geral responde "com quem voce mais se parece". Estas tres
 * respondem "quem, entre os politicos e teoricos, entre os pensadores e
 * ativistas e entre os economistas e empresarios, mais se parece com voce".
 * Politica e social usam a compatibilidade dos 12 eixos; a economica usa so os
 * tres eixos economicos ({@link #ECONOMIC_AXES}). Alem disso, cada area compara
 * apenas o grupo de pessoas dela: um filosofo nao entra na disputa economica,
 * nem um economista na politica.
 *
 * Os grupos de eixos de {@link #POLITICAL_AXES}, {@link #SOCIAL_AXES} e
 * {@link #ECONOMIC_AXES} seguem valendo para paises e partidos.
 */
@Service
public class DimensionMatcherService {
    /**
     * Instituicoes, poder, politica externa, imigracao, tecnologia e orientacao
     * comercial.
     */
    public static final List<String> POLITICAL_AXES = List.of(
            "estrutura", "representacao", "poder", "diplomacia", "imigracao",
            "intervencao", "tecnologia", "controle", "comercio", "religiao", "economia", "moral");

    /** Costumes, fe, economia, imigracao, poder e tecnologia. */
    public static final List<String> SOCIAL_AXES = List.of("representacao", "moral", "religiao", "economia", "controle",
            "comercio", "imigracao", "poder", "tecnologia");

    /** Propriedade, coordenacao da producao e abertura comercial. */
    public static final List<String> ECONOMIC_AXES = List.of("economia", "controle", "comercio");

    /**
     * Quem atua na politica: governantes, estadistas, formuladores de doutrina e
     * militantes. {@code ativista} tambem esta em {@link #SOCIAL_CATEGORIES}: boa
     * parte (revolucionarios, lideres de movimento) e ator politico, o resto
     * (direitos civis, cultura) e social. Como a dimensao politica e calculada
     * primeiro, a pessoa fica com a que mais combina.
     */
    public static final Set<String> POLITICAL_CATEGORIES = Set.of("politico", "teorico", "ativista");

    /** Quem molda costumes, fe e ideias: filosofos, religiosos, intelectuais e ativistas. */
    public static final Set<String> SOCIAL_CATEGORIES = Set.of("filosofo", "religioso", "intelectual", "ativista");

    /**
     * Quem atua na economia: economistas, empresarios e politicos (quem governa
     * decide politica economica, e a nota so olha os tres eixos economicos).
     */
    public static final Set<String> ECONOMIC_CATEGORIES = Set.of("politico", "economista", "empresario");

    public static final String POLITICAL = "political";
    public static final String SOCIAL = "social";
    public static final String ECONOMIC = "economic";

    private final QuizDataService dataService;
    private final ProfileMatchScorer profileMatchScorer;

    public DimensionMatcherService(QuizDataService dataService, ProfileMatchScorer profileMatchScorer) {
        this.dataService = dataService;
        this.profileMatchScorer = profileMatchScorer;
    }

    /**
     * As tres dimensoes, na ordem politica, social, economica.
     *
     * @param excludeId personalidade a deixar de fora, normalmente a mais
     *                  compativel no geral: a secao se chama "tambem proximos",
     *                  entao repetir quem ja aparece como destaque nao acrescenta
     *                  nada ao leitor.
     */
    public List<DimensionMatch> findAll(List<AxisResult> axisResults, String lang, String excludeId) {
        return findAll(axisResults, lang, excludeId, null);
    }

    public List<DimensionMatch> findAll(
            List<AxisResult> axisResults, String lang, String excludeId, String religion) {
        List<DimensionMatch> matches = new ArrayList<>();
        Set<String> excludedIds = new LinkedHashSet<>();
        if (excludeId != null) {
            excludedIds.add(excludeId);
        }
        addIfPresent(matches, excludedIds, POLITICAL, POLITICAL_CATEGORIES, axisResults, lang, religion);
        addIfPresent(matches, excludedIds, SOCIAL, SOCIAL_CATEGORIES, axisResults, lang, religion);
        addIfPresent(matches, excludedIds, ECONOMIC, ECONOMIC_CATEGORIES, axisResults, lang, religion);
        return List.copyOf(matches);
    }

    public List<DimensionMatch> findAll(List<AxisResult> axisResults, String lang) {
        return findAll(axisResults, lang, null);
    }

    private void addIfPresent(
            List<DimensionMatch> matches,
            Set<String> excludedIds,
            String dimension,
            Set<String> categories,
            List<AxisResult> axisResults,
            String lang,
            String religion) {
        PersonalityMatch match = findBestFor(dimension, categories, axisResults, lang, religion, excludedIds);
        if (match != null) {
            matches.add(new DimensionMatch(dimension, match));
            excludedIds.add(match.personalityId());
        }
    }

    private PersonalityMatch findBestFor(
            String dimension,
            Set<String> categories,
            List<AxisResult> axisResults,
            String lang,
            String religion,
            Set<String> excludedIds) {
        Map<String, Double> userVector = profileMatchScorer.userVectorFor(axisResults);
        List<Personality> personalities = dataService.getPersonalities(QuizDataService.normalizeLang(lang)).stream()
                .filter(personality -> !excludedIds.contains(personality.id()))
                .filter(personality -> categories.contains(personality.category()))
                .filter(personality -> ReligionFilter.allows(personality.religions(), religion))
                .toList();
        if (personalities.isEmpty()) {
            return null;
        }

        Comparator<Scored> byScore = Comparator.comparingDouble(Scored::score).reversed();
        Comparator<Scored> byName = Comparator.comparing(scored -> scored.personality().name());

        List<Scored> scored = personalities.stream()
                .map(personality -> new Scored(
                        personality,
                        scoreFor(dimension, userVector, targetVectorFor(personality))))
                .sorted(byScore.thenComparing(byName))
                .toList();

        // O percentil compara a nota com as dos demais da mesma area de atuacao.
        List<Double> allScores = scored.stream().map(Scored::score).toList();
        Scored best = scored.getFirst();
        return toMatch(best, profileMatchScorer.percentile(best.score(), allScores));
    }

    // Politica e social usam os 12 eixos; a economica olha so os eixos economicos.
    private double scoreFor(String dimension, Map<String, Double> userVector, Map<String, Double> targetVector) {
        if (ECONOMIC.equals(dimension)) {
            return profileMatchScorer.compatibility(userVector, targetVector, ECONOMIC_AXES);
        }
        return profileMatchScorer.compatibility(userVector, targetVector);
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
                percentile,
                targetVectorFor(personality));
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
