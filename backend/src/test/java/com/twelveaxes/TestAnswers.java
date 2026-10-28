package com.twelveaxes;

import com.twelveaxes.model.AnswerValue;
import com.twelveaxes.model.Question;
import com.twelveaxes.model.ResultRequest;
import com.twelveaxes.model.SubmittedAnswer;
import com.twelveaxes.service.QuizDataService;
import java.util.ArrayList;
import java.util.List;

/** Respostas de teste: as cinco respostas se alternam pelas perguntas, com concordancia, discordancia e neutras em todo eixo. */
final class TestAnswers {
    private TestAnswers() {
    }

    static ResultRequest mixed(QuizDataService dataService) {
        List<Question> questions = dataService.getQuestions();
        AnswerValue[] values = AnswerValue.values();
        List<SubmittedAnswer> answers = new ArrayList<>();
        for (int i = 0; i < questions.size(); i++) {
            answers.add(new SubmittedAnswer(questions.get(i).id(), values[(i * 7 + i / 5) % values.length]));
        }
        return new ResultRequest(answers);
    }
}
