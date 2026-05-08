package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AnswerValue;
import com.twelveaxes.model.ResultRequest;
import com.twelveaxes.model.SubmittedAnswer;
import com.twelveaxes.service.QuizDataService;
import com.twelveaxes.service.ScoringService;
import java.util.List;
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
}
