package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AnswerValue;
import com.twelveaxes.model.Pole;
import com.twelveaxes.model.ResultRequest;
import com.twelveaxes.model.SubmittedAnswer;
import com.twelveaxes.service.QuizDataService;
import com.twelveaxes.service.ScoringService;
import java.util.List;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ScoringServiceTest {
    @Autowired
    private QuizDataService dataService;

    @Autowired
    private ScoringService scoringService;

    @Test
    void neutralAnswersProduceCenteredAxes() {
        List<SubmittedAnswer> answers = dataService.getQuestions().stream()
                .map(question -> new SubmittedAnswer(question.id(), AnswerValue.NEUTRAL))
                .toList();

        var results = scoringService.score(new ResultRequest(answers));

        assertThat(results).hasSize(12);
        assertThat(results).allSatisfy(axis -> {
            assertThat(axis.leftPercent()).isEqualTo(50.0);
            assertThat(axis.rightPercent()).isEqualTo(50.0);
            assertThat(axis.intensity()).isEqualTo("Equilibrado");
        });
    }

    @Test
    void shortQuizHasThreeQuestionsPerAxis() {
        var questions = dataService.getQuestions(QuizDataService.SHORT_VARIANT);
        var questionsByAxis = questions.stream()
                .collect(Collectors.groupingBy(question -> question.axisId(), Collectors.counting()));

        assertThat(questions).hasSize(36);
        assertThat(questionsByAxis).hasSize(12);
        assertThat(questionsByAxis).allSatisfy((axisId, count) -> assertThat(count).isEqualTo(3));
    }

    @Test
    void extendedQuizHasTenQuestionsPerAxis() {
        var questionsByAxis = dataService.getQuestions(QuizDataService.EXTENDED_VARIANT).stream()
                .collect(Collectors.groupingBy(question -> question.axisId(), Collectors.counting()));

        assertThat(questionsByAxis).hasSize(12);
        assertThat(questionsByAxis).allSatisfy((axisId, count) -> assertThat(count).isEqualTo(10));
    }

    @Test
    void extendedQuizIsBalancedAndAlternatesPolesPerAxis() {
        var questionsByAxis = dataService.getQuestions(QuizDataService.EXTENDED_VARIANT).stream()
                .collect(Collectors.groupingBy(question -> question.axisId()));

        assertThat(questionsByAxis).allSatisfy((axisId, questions) -> {
            assertThat(questions).hasSize(10);
            assertThat(questions).filteredOn(question -> question.agreePole() == Pole.LEFT).hasSize(5);
            assertThat(questions).filteredOn(question -> question.agreePole() == Pole.RIGHT).hasSize(5);
            for (int index = 1; index < questions.size(); index++) {
                assertThat(questions.get(index).agreePole()).isNotEqualTo(questions.get(index - 1).agreePole());
            }
            assertThat(List.of(questions.get(8).agreePole(), questions.get(9).agreePole()))
                    .containsExactlyInAnyOrder(Pole.LEFT, Pole.RIGHT);
        });
    }

    @Test
    void shortQuizIsGloballyBalancedAcrossPoles() {
        var questions = dataService.getQuestions(QuizDataService.SHORT_VARIANT);

        assertThat(questions).filteredOn(question -> question.agreePole() == Pole.LEFT).hasSize(18);
        assertThat(questions).filteredOn(question -> question.agreePole() == Pole.RIGHT).hasSize(18);
    }

    @Test
    void extendedNeutralAnswersProduceCenteredAxes() {
        List<SubmittedAnswer> answers = dataService.getQuestions(QuizDataService.EXTENDED_VARIANT).stream()
                .map(question -> new SubmittedAnswer(question.id(), AnswerValue.NEUTRAL))
                .toList();

        var results = scoringService.score(new ResultRequest(answers, QuizDataService.EXTENDED_VARIANT));

        assertThat(results).hasSize(12);
        assertThat(results).allSatisfy(axis -> {
            assertThat(axis.leftPercent()).isEqualTo(50.0);
            assertThat(axis.rightPercent()).isEqualTo(50.0);
            assertThat(axis.intensity()).isEqualTo("Equilibrado");
        });
    }
}
