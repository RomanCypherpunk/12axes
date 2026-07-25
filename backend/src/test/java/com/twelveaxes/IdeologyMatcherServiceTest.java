package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AnswerValue;
import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.IdeologyMatch;
import com.twelveaxes.model.Pole;
import com.twelveaxes.model.Question;
import com.twelveaxes.model.ResultRequest;
import com.twelveaxes.model.SubmittedAnswer;
import com.twelveaxes.service.IdeologyMatcherService;
import com.twelveaxes.service.QuizDataService;
import com.twelveaxes.service.ScoringService;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class IdeologyMatcherServiceTest {
    @Autowired
    private QuizDataService dataService;

    @Autowired
    private ScoringService scoringService;

    @Autowired
    private IdeologyMatcherService matcherService;

    @Test
    void everyIdeologyHasAnExplicitProfile() {
        var profileIds = dataService.getIdeologyProfiles().keySet();
        var ideologyIds = dataService.getIdeologies().stream()
                .map(i -> i.id())
                .toList();

        assertThat(ideologyIds).hasSizeGreaterThan(100);
        assertThat(profileIds).containsExactlyInAnyOrderElementsOf(ideologyIds);
    }

    @Test
    void everyIdeologyProfileUsesTheTwelveKnownAxes() {
        var axisIds = dataService.getAxes().stream()
                .map(axis -> axis.id())
                .toList();

        assertThat(dataService.getIdeologyProfiles().values())
                .allSatisfy(profile -> {
                    assertThat(profile.vector().keySet())
                            .as("Profile %s must define exactly the known axes", profile.ideologyId())
                            .containsExactlyInAnyOrderElementsOf(axisIds);
                    assertThat(profile.vector().values())
                            .as("Profile %s values must be percentages", profile.ideologyId())
                            .allSatisfy(value -> assertThat(value).isBetween(0.0, 100.0));
                });
    }

    @Test
    void canonicalVectorsMatchTheirOwnIdeologies() {
        List.of(
                "marxismo-leninismo",
                "neorreacionarismo",
                "paleolibertarianismo",
                "anarcocomunismo",
                "fascismo"
        ).forEach(ideologyId -> {
            var profile = dataService.getIdeologyProfiles().get(ideologyId);

            assertThat(profile)
                    .as("Perfil canônico deve existir para %s", ideologyId)
                    .isNotNull();

            var matches = matcherService.findMatches(axisResults(profile.vector()));

            assertThat(matches)
                    .as("Vetor canônico de %s deve produzir matches", ideologyId)
                    .isNotEmpty();
            assertThat(matches.getFirst().ideologyId())
                    .as("Vetor canônico de %s deve retornar a própria ideologia", ideologyId)
                    .isEqualTo(ideologyId);
            assertThat(matches.getFirst().compatibility())
                    .as("Vetor canônico de %s deve ter compatibilidade perfeita", ideologyId)
                    .isEqualTo(100.0);
        });
    }

    @Test
    void neutralAnswersFavorCentrismo() {
        List<SubmittedAnswer> answers = dataService.getQuestions().stream()
                .map(q -> new SubmittedAnswer(q.id(), AnswerValue.NEUTRAL))
                .toList();
        var axes = scoringService.score(new ResultRequest(answers));

        List<IdeologyMatch> matches = matcherService.findMatches(axes);

        assertThat(matches).isNotEmpty();
        assertThat(matches.get(0).ideologyId()).isEqualTo("centrismo");
        assertThat(Double.isFinite(matches.get(0).compatibility())).isTrue();
        assertThat(matches.get(0).compatibilityPercentile()).isGreaterThan(95.0);
    }

    @Test
    void rightAuthoritarianTraditionalProfileDoesNotFavorTransversalOrMemeIdeologies() {
        var axes = axisResults(Map.ofEntries(
                Map.entry("estrutura", 75.0),
                Map.entry("representacao", 18.8),
                Map.entry("poder", 62.5),
                Map.entry("imigracao", 87.5),
                Map.entry("diplomacia", 62.5),
                Map.entry("intervencao", 56.3),
                Map.entry("economia", 25.0),
                Map.entry("controle", 43.8),
                Map.entry("comercio", 43.8),
                Map.entry("religiao", 81.3),
                Map.entry("moral", 0.0),
                Map.entry("tecnologia", 87.5)
        ));

        var matches = matcherService.findMatches(axes);

        assertThat(matches).hasSize(4);
        assertThat(matches.get(0).category()).isEqualTo("Extrema Direita");
        assertThat(matches.get(0).ideologyId()).isIn(
                "alt-lite",
                "aceleracionismo-de-direita",
                "capitalismo-autoritario",
                "alt-right",
                "neorreacionarismo",
                "tecno-monarquismo"
        );
        assertThat(matches).extracting(IdeologyMatch::ideologyId)
                .doesNotContain("ambientalismo", "anarco-fascismo");
    }

    @Test
    void rankedMatchesAreReturnedInCompatibilityOrder() {
        var axes = axisResults(Map.ofEntries(
                Map.entry("estrutura", 75.0),
                Map.entry("representacao", 18.8),
                Map.entry("poder", 62.5),
                Map.entry("imigracao", 87.5),
                Map.entry("diplomacia", 62.5),
                Map.entry("intervencao", 56.3),
                Map.entry("economia", 25.0),
                Map.entry("controle", 43.8),
                Map.entry("comercio", 43.8),
                Map.entry("religiao", 81.3),
                Map.entry("moral", 0.0),
                Map.entry("tecnologia", 87.5)
        ));

        var matches = matcherService.findMatches(axes);

        assertThat(matches).hasSize(4);
        for (int index = 1; index < matches.size(); index++) {
            assertThat(matches.get(index).compatibility())
                    .isLessThanOrEqualTo(matches.get(index - 1).compatibility());
        }
    }

    @Test
    void matchDescriptionsHaveShortAndDetailedVariants() {
        List<SubmittedAnswer> answers = dataService.getQuestions().stream()
                .map(q -> new SubmittedAnswer(q.id(), AnswerValue.NEUTRAL))
                .toList();
        var axes = scoringService.score(new ResultRequest(answers));

        var match = matcherService.findMatches(axes).get(0);

        assertThat(match.description()).isNotBlank();
        assertThat(match.longDescription()).contains("compatibilidade");
        assertThat(match.longDescription().length()).isGreaterThan(match.description().length());
    }

    @Test
    void fascistAnswersFavorRightAuthoritarianIdeologies() {
        // Build extreme right-authoritarian responses by mapping each question
        // toward its agreePole that aligns with fascism's profile.
        List<SubmittedAnswer> answers = dataService.getQuestions().stream()
                .map(this::extremeFascistAnswer)
                .toList();
        var axes = scoringService.score(new ResultRequest(answers));

        var matches = matcherService.findMatches(axes);

        assertThat(matches).hasSize(4);
        assertThat(matches.get(0).category())
                .isIn("Extrema Direita", "Esquerda Radical");
        // Every top match should have meaningful compatibility (>= 60%).
        assertThat(matches).allSatisfy(m -> assertThat(m.compatibility()).isGreaterThan(50.0));
    }

    @Test
    void anarchistAnswersFavorLeftLibertarianIdeologies() {
        List<SubmittedAnswer> answers = dataService.getQuestions().stream()
                .map(this::extremeAnarchistAnswer)
                .toList();
        var axes = scoringService.score(new ResultRequest(answers));

        var matches = matcherService.findMatches(axes);

        assertThat(matches).hasSize(4);
        assertThat(matches.get(0).category())
                .isIn("Anarquismo", "Libertário");
    }

    private SubmittedAnswer extremeFascistAnswer(Question q) {
        // Fascism vector approximation: high authority/security/militarist/etc
        boolean towardLeftPole = switch (q.axisId()) {
            case "estrutura"     -> false; // unitário
            case "representacao" -> false; // autocracia
            case "poder"         -> true;  // segurança
            case "imigracao"     -> true;  // assimilacionista
            case "diplomacia"    -> true;  // militarista
            case "intervencao"   -> false; // nacionalista
            case "economia"      -> false; // privado-corporativista
            case "controle"      -> true;  // planejamento (corporativismo estatal)
            case "comercio"      -> true;  // protecionismo
            case "religiao"      -> false; // religioso
            case "moral"         -> false; // tradicionalista
            case "tecnologia"    -> false; // biologia
            default -> false;
        };
        AnswerValue answer;
        if (q.agreePole() == Pole.LEFT) {
            answer = towardLeftPole ? AnswerValue.STRONGLY_AGREE : AnswerValue.STRONGLY_DISAGREE;
        } else {
            answer = towardLeftPole ? AnswerValue.STRONGLY_DISAGREE : AnswerValue.STRONGLY_AGREE;
        }
        return new SubmittedAnswer(q.id(), answer);
    }

    private SubmittedAnswer extremeAnarchistAnswer(Question q) {
        // Social-anarchism vector approximation
        boolean towardLeftPole = switch (q.axisId()) {
            case "estrutura"     -> true;  // federal/descentralizado
            case "representacao" -> true;  // democracia
            case "poder"         -> false; // liberdade
            case "imigracao"     -> false; // multiculturalista
            case "diplomacia"    -> false; // pacifista
            case "intervencao"   -> true;  // não intervencionista
            case "economia"      -> true;  // serviço público/cooperativo
            case "controle"      -> true;  // planejamento popular/cooperativo
            case "comercio"      -> false; // globalismo solidário
            case "religiao"      -> true;  // irreligioso
            case "moral"         -> true;  // progressista
            case "tecnologia"    -> true;  // tecnologia
            default -> true;
        };
        AnswerValue answer;
        if (q.agreePole() == Pole.LEFT) {
            answer = towardLeftPole ? AnswerValue.STRONGLY_AGREE : AnswerValue.STRONGLY_DISAGREE;
        } else {
            answer = towardLeftPole ? AnswerValue.STRONGLY_DISAGREE : AnswerValue.STRONGLY_AGREE;
        }
        return new SubmittedAnswer(q.id(), answer);
    }

    private List<AxisResult> axisResults(Map<String, Double> vector) {
        return dataService.getAxes().stream()
                .map(axis -> {
                    double leftPercent = vector.getOrDefault(axis.id(), 50.0);
                    double rightPercent = Math.round((100.0 - leftPercent) * 10.0) / 10.0;
                    String dominantPole = leftPercent >= rightPercent ? axis.leftPole() : axis.rightPole();
                    return new AxisResult(
                            axis.id(),
                            axis.label(),
                            axis.leftPole(),
                            axis.rightPole(),
                            leftPercent,
                            rightPercent,
                            dominantPole,
                            ""
                    );
                })
                .toList();
    }
}
