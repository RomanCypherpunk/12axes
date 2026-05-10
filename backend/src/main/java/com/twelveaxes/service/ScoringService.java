package com.twelveaxes.service;

import com.twelveaxes.model.Axis;
import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Pole;
import com.twelveaxes.model.Question;
import com.twelveaxes.model.ResultRequest;
import com.twelveaxes.model.SubmittedAnswer;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ScoringService {
    private final QuizDataService dataService;

    public ScoringService(QuizDataService dataService) {
        this.dataService = dataService;
    }

    public List<AxisResult> score(ResultRequest request) {
        List<Question> questions = dataService.getQuestions(request.variant());
        Map<String, SubmittedAnswer> answerByQuestion = request.answers().stream()
                .collect(Collectors.toMap(SubmittedAnswer::questionId, Function.identity(), (first, ignored) -> first));
        Map<String, Question> questionById = questions.stream()
                .collect(Collectors.toMap(Question::id, Function.identity()));

        validateAnswers(answerByQuestion.keySet(), questionById.keySet());

        Map<String, WeightedScore> scores = new HashMap<>();
        for (Question question : questions) {
            SubmittedAnswer submittedAnswer = answerByQuestion.get(question.id());
            double towardAgreement = submittedAnswer.answer().scoreTowardAgreement();
            double leftScore = question.agreePole() == Pole.LEFT ? towardAgreement : 1.0 - towardAgreement;
            scores.computeIfAbsent(question.axisId(), ignored -> new WeightedScore())
                    .add(leftScore, question.weight());
        }

        return dataService.getAxes().stream()
                .map(axis -> toAxisResult(axis, scores.get(axis.id())))
                .toList();
    }

    private void validateAnswers(Set<String> submittedIds, Set<String> expectedIds) {
        if (!expectedIds.equals(submittedIds)) {
            Set<String> missing = expectedIds.stream()
                    .filter(id -> !submittedIds.contains(id))
                    .collect(Collectors.toSet());
            Set<String> unknown = submittedIds.stream()
                    .filter(id -> !expectedIds.contains(id))
                    .collect(Collectors.toSet());
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Respostas inválidas. Faltando: " + missing + ". Desconhecidas: " + unknown
            );
        }
    }

    private AxisResult toAxisResult(Axis axis, WeightedScore weightedScore) {
        double leftPercent = round(weightedScore.average() * 100.0);
        double rightPercent = round(100.0 - leftPercent);
        String dominantPole = leftPercent >= rightPercent ? axis.leftPole() : axis.rightPole();
        double distanceFromCenter = Math.abs(leftPercent - 50.0);
        String intensity = intensityFor(distanceFromCenter);
        return new AxisResult(
                axis.id(),
                axis.label(),
                axis.leftPole(),
                axis.rightPole(),
                leftPercent,
                rightPercent,
                dominantPole,
                intensity
        );
    }

    private String intensityFor(double distanceFromCenter) {
        if (distanceFromCenter < 7.5) {
            return "Equilibrado";
        }
        if (distanceFromCenter < 22.5) {
            return "Inclinado";
        }
        if (distanceFromCenter < 37.5) {
            return "Forte";
        }
        return "Muito forte";
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private static final class WeightedScore {
        private double total;
        private double weight;

        void add(double score, double itemWeight) {
            total += score * itemWeight;
            weight += itemWeight;
        }

        double average() {
            return weight == 0.0 ? 0.5 : total / weight;
        }
    }
}
