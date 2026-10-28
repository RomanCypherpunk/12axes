package com.twelveaxes.service;

import com.twelveaxes.model.AnswerImpact;
import com.twelveaxes.model.AnswerValue;
import com.twelveaxes.model.ArchetypeQuestion;
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
        return score(request, QuizDataService.LANG_PT);
    }

    public List<AxisResult> score(ResultRequest request, String lang) {
        Map<String, Question> questionById = questionsById();
        validateAnswers(request.answers(), questionById);
        Map<String, WeightedScore> scores = accumulate(request, questionById);

        String normalizedLang = QuizDataService.normalizeLang(lang);
        return dataService.getAxes(normalizedLang).stream()
                .map(axis -> toAxisResult(axis, scores.get(axis.id()), normalizedLang))
                .toList();
    }

    /**
     * Quanto cada resposta puxou o eixo dela, em pontos de leftPercent (positivo = polo esquerdo). E a mesma conta do
     * {@link #score(ResultRequest, String)}: a soma dos impactos de um eixo e a distancia dele ao centro, sem o
     * arredondamento. As perguntas de arquetipo entram no peso do eixo, mas nao aparecem na lista (nao tem texto).
     */
    public Map<String, List<AnswerImpact>> answerImpacts(ResultRequest request, String lang) {
        Map<String, Question> questionById = questionsById();
        validateAnswers(request.answers(), questionById);
        Map<String, WeightedScore> scores = accumulate(request, questionById);
        Map<String, String> textById = dataService.getQuestionsForLang(QuizDataService.normalizeLang(lang)).stream()
                .collect(Collectors.toMap(Question::id, Question::text));

        Map<String, List<AnswerImpact>> byAxis = new HashMap<>();
        for (SubmittedAnswer submittedAnswer : request.answers()) {
            Question question = questionById.get(submittedAnswer.questionId());
            double totalWeight = scores.get(question.axisId()).weight;
            double impact = question.weight() * (leftScore(question, submittedAnswer.answer()) - 0.5) / totalWeight * 100.0;
            byAxis.computeIfAbsent(question.axisId(), ignored -> new java.util.ArrayList<>()).add(new AnswerImpact(
                    question.id(),
                    textById.getOrDefault(question.id(), question.text()),
                    submittedAnswer.answer(),
                    impact));
        }
        return byAxis;
    }

    private Map<String, Question> questionsById() {
        return dataService.getQuestions().stream()
                .collect(Collectors.toMap(Question::id, Function.identity()));
    }

    private Map<String, WeightedScore> accumulate(ResultRequest request, Map<String, Question> questionById) {
        Map<String, WeightedScore> scores = new HashMap<>();
        for (SubmittedAnswer submittedAnswer : request.answers()) {
            Question question = questionById.get(submittedAnswer.questionId());
            scores.computeIfAbsent(question.axisId(), ignored -> new WeightedScore())
                    .add(leftScore(question, submittedAnswer.answer()), question.weight());
        }
        addArchetypeAnswers(request.archetype(), scores);
        return scores;
    }

    // Nota da resposta no polo esquerdo (0 a 1): concordar com uma pergunta do polo direito vale o oposto.
    private static double leftScore(Question question, AnswerValue answer) {
        double towardAgreement = answer.scoreTowardAgreement();
        return question.agreePole() == Pole.LEFT ? towardAgreement : 1.0 - towardAgreement;
    }

    // Reconstrói o resultado a partir de um vetor de leftPercent (um valor por
    // eixo, na ordem de axes.json) — usado pelas URLs de resultado compartilhado.
    public List<AxisResult> scoreFromLeftPercents(List<Double> leftPercents, String lang) {
        String normalizedLang = QuizDataService.normalizeLang(lang);
        List<Axis> axes = dataService.getAxes(normalizedLang);
        if (leftPercents.size() != axes.size()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Vetor de eixos inválido: esperados " + axes.size() + " valores"
            );
        }
        return java.util.stream.IntStream.range(0, axes.size())
                .mapToObj(index -> buildAxisResult(axes.get(index), leftPercents.get(index), normalizedLang))
                .toList();
    }

    // Cada alternativa escolhida entra como uma resposta a mais em cada eixo que
    // ela toca, com o mesmo peso (1) de uma pergunta comum.
    private void addArchetypeAnswers(Map<String, String> choices, Map<String, WeightedScore> scores) {
        if (choices == null || choices.isEmpty()) {
            return;
        }
        Map<String, ArchetypeQuestion> byId = dataService.getArchetypeQuestions().stream()
                .collect(Collectors.toMap(ArchetypeQuestion::id, Function.identity()));
        choices.forEach((questionId, optionId) -> {
            ArchetypeQuestion question = byId.get(questionId);
            ArchetypeQuestion.Option option = question == null ? null : question.options().stream()
                    .filter(candidate -> candidate.id().equals(optionId))
                    .findFirst()
                    .orElse(null);
            if (option == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Resposta de arquétipo inválida: " + questionId + "=" + optionId
                );
            }
            option.effects().forEach((axisId, leftPercent) ->
                    scores.computeIfAbsent(axisId, ignored -> new WeightedScore()).add(leftPercent / 100.0, 1.0));
        });
    }

    private void validateAnswers(List<SubmittedAnswer> answers, Map<String, Question> questionById) {
        Set<String> unknown = answers.stream()
                .map(SubmittedAnswer::questionId)
                .filter(id -> !questionById.containsKey(id))
                .collect(Collectors.toSet());
        if (!unknown.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Respostas inválidas. IDs desconhecidos: " + unknown
            );
        }
    }

    private AxisResult toAxisResult(Axis axis, WeightedScore weightedScore, String lang) {
        return buildAxisResult(axis, weightedScore.average() * 100.0, lang);
    }

    private AxisResult buildAxisResult(Axis axis, double rawLeftPercent, String lang) {
        double leftPercent = round(Math.max(0.0, Math.min(100.0, rawLeftPercent)));
        double rightPercent = round(100.0 - leftPercent);
        String dominantPole = leftPercent >= rightPercent ? axis.leftPole() : axis.rightPole();
        double distanceFromCenter = Math.abs(leftPercent - 50.0);
        String intensity = intensityFor(distanceFromCenter, lang);
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

    private String intensityFor(double distanceFromCenter, String lang) {
        boolean en = QuizDataService.LANG_EN.equals(lang);
        if (distanceFromCenter < 7.5) {
            return en ? "Balanced" : "Equilibrado";
        }
        if (distanceFromCenter < 22.5) {
            return en ? "Leaning" : "Inclinado";
        }
        if (distanceFromCenter < 37.5) {
            return en ? "Strong" : "Forte";
        }
        return en ? "Very strong" : "Muito forte";
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
