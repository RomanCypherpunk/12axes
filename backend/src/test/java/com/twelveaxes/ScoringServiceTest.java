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
    void poolHasTwoHundredFortyQuestionsAcrossTwelveAxes() {
        var questions = dataService.getQuestions();
        var questionsByAxis = questions.stream()
                .collect(Collectors.groupingBy(question -> question.axisId(), Collectors.counting()));

        assertThat(questions).hasSize(240);
        assertThat(questionsByAxis).hasSize(12);
        assertThat(questionsByAxis).allSatisfy((axisId, count) -> assertThat(count).isEqualTo(20));
    }

    @Test
    void poolHasTenQuestionsPerPolePerAxis() {
        var questionsByAxis = dataService.getQuestions().stream()
                .collect(Collectors.groupingBy(question -> question.axisId()));

        assertThat(questionsByAxis).allSatisfy((axisId, axisQuestions) -> {
            long leftCount = axisQuestions.stream()
                    .filter(q -> q.agreePole() == Pole.LEFT).count();
            long rightCount = axisQuestions.stream()
                    .filter(q -> q.agreePole() == Pole.RIGHT).count();
            assertThat(leftCount).as("LEFT em %s", axisId).isEqualTo(10);
            assertThat(rightCount).as("RIGHT em %s", axisId).isEqualTo(10);
        });
    }

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
    void shortQuizPayloadHasCorrectQuestionsPerAxis() {
        var payload = dataService.getQuiz(QuizDataService.SHORT_VARIANT);
        assertThat(payload.questionsPerAxis()).isEqualTo(3);
        assertThat(payload.questionCount()).isEqualTo(36);
        assertThat(payload.questions()).hasSize(240);
    }

    @Test
    void extendedQuizPayloadHasCorrectQuestionsPerAxis() {
        var payload = dataService.getQuiz(QuizDataService.EXTENDED_VARIANT);
        assertThat(payload.questionsPerAxis()).isEqualTo(5);
        assertThat(payload.questionCount()).isEqualTo(60);
        assertThat(payload.questions()).hasSize(240);
    }
}
