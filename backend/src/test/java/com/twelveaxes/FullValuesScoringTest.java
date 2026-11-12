package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.within;

import com.twelveaxes.model.AnswerValue;
import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Question;
import com.twelveaxes.model.ResultRequest;
import com.twelveaxes.model.SubmittedAnswer;
import com.twelveaxes.service.QuizDataService;
import com.twelveaxes.service.ScoringService;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/** Valores completos na pontuacao: efeito de cada eixo com peso 2, neutro sem efeito, entradas invalidas = 400. */
@SpringBootTest
class FullValuesScoringTest {
    @Autowired
    private QuizDataService dataService;

    @Autowired
    private ScoringService realScoring;

    @Autowired
    private com.twelveaxes.service.FullValuesService realCatalog;

    /** Catalogo de teste (efeitos conhecidos): tecnocracia {poder 70, representacao 30}, democracia {representacao 90}. */
    private ScoringService scoring() {
        return new ScoringService(dataService, FullValuesServiceTest.service(FullValuesServiceTest.POLITICA));
    }

    /** 3 perguntas por eixo, todas neutras: cada eixo comeca em 50%. */
    private List<Question> threePerAxis() {
        return dataService.getQuestions().stream()
                .collect(Collectors.groupingBy(Question::axisId))
                .values().stream()
                .flatMap(questions -> questions.stream().limit(3))
                .toList();
    }

    private List<SubmittedAnswer> neutralAnswers() {
        return threePerAxis().stream().map(q -> new SubmittedAnswer(q.id(), AnswerValue.NEUTRAL)).toList();
    }

    private double axis(List<AxisResult> results, String axisId) {
        return results.stream().filter(r -> r.axisId().equals(axisId)).findFirst().orElseThrow().leftPercent();
    }

    private double weightOf(String axisId) {
        return threePerAxis().stream().filter(q -> q.axisId().equals(axisId)).mapToDouble(Question::weight).sum();
    }

    private ResultRequest withValues(Map<String, String> values) {
        return new ResultRequest(neutralAnswers(), "extreme", null, values);
    }

    @Test
    void eachEffectCountsWithWeightTwoOnEveryAxisItTouches() {
        var without = scoring().score(new ResultRequest(neutralAnswers(), "extreme"));
        var with = scoring().score(withValues(Map.of("politica", "tecnocracia")));

        // eixo com pergunta neutra (0,5) de peso total W + efeito 0,70 com peso 2
        double w = weightOf("poder");
        assertThat(axis(with, "poder")).isCloseTo((0.5 * w + 2 * 0.70) / (w + 2) * 100, within(0.06));
        double wr = weightOf("representacao");
        assertThat(axis(with, "representacao")).isCloseTo((0.5 * wr + 2 * 0.30) / (wr + 2) * 100, within(0.06));
        assertThat(axis(with, "poder")).isGreaterThan(axis(without, "poder"));
        // eixo que o valor nao toca nao muda
        assertThat(axis(with, "economia")).isEqualTo(axis(without, "economia"));
    }

    @Test
    void noValuesGivesExactlyTheSameVectorAsBefore() {
        var legacy = scoring().score(new ResultRequest(neutralAnswers(), "extreme"));
        assertThat(scoring().score(new ResultRequest(neutralAnswers(), "extreme", null, null))).isEqualTo(legacy);
        assertThat(scoring().score(new ResultRequest(neutralAnswers(), "extreme", null, Map.of()))).isEqualTo(legacy);
    }

    @Test
    void theNeutralValueDoesNotMoveTheVector() {
        var legacy = scoring().score(new ResultRequest(neutralAnswers(), "extreme"));
        assertThat(scoring().score(withValues(Map.of("politica", "equilibrado")))).isEqualTo(legacy);
    }

    @Test
    void rejectsUnknownCategoryForeignValueAndPendingCategory() {
        for (Map<String, String> bad : List.of(
                Map.of("nao_existe", "tecnocracia"),
                Map.of("politica", "nao_existe"),
                Map.of("tecnologia", "tecnocracia"))) {
            assertThatThrownBy(() -> scoring().score(withValues(bad)))
                    .as("values=%s", bad)
                    .isInstanceOfSatisfying(ResponseStatusException.class,
                            e -> assertThat(e.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST));
        }
    }

    /** Os 240 com a resposta que leva o eixo ao polo esquerdo (left=true), ao direito, ou todas neutras (left=null). */
    private List<SubmittedAnswer> allQuestions(Boolean left) {
        return dataService.getQuestions().stream().map(q -> {
            if (left == null) {
                return new SubmittedAnswer(q.id(), AnswerValue.NEUTRAL);
            }
            boolean agree = (q.agreePole() == com.twelveaxes.model.Pole.LEFT) == left;
            return new SubmittedAnswer(q.id(), agree ? AnswerValue.STRONGLY_AGREE : AnswerValue.STRONGLY_DISAGREE);
        }).toList();
    }

    @Test
    void noPoliticaValueMovesAnyAxisByMoreThanTenPointsInTheFullQuiz() {
        List<String> leaves = realCatalog.trees("pt").stream().filter(tree -> tree.categoryId().equals("politica"))
                .flatMap(tree -> tree.nodes().stream()).flatMap(node -> node.options().stream())
                .map(com.twelveaxes.model.ValueTree.OptionView::value).filter(java.util.Objects::nonNull).distinct().toList();
        assertThat(leaves).isNotEmpty();
        for (Boolean base : new Boolean[] {null, true, false}) {
            List<AxisResult> without = realScoring.score(new ResultRequest(allQuestions(base), "extreme"));
            for (String leaf : leaves) {
                List<AxisResult> with = realScoring.score(
                        new ResultRequest(allQuestions(base), "extreme", null, Map.of("politica", leaf)));
                for (int i = 0; i < without.size(); i++) {
                    assertThat(Math.abs(with.get(i).leftPercent() - without.get(i).leftPercent()))
                            .as("%s em %s (base %s)", leaf, without.get(i).axisId(), base)
                            .isLessThanOrEqualTo(10.0);
                }
            }
        }
    }
}
