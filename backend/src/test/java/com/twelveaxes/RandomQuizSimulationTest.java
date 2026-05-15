package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AnswerOption;
import com.twelveaxes.model.AnswerValue;
import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Pole;
import com.twelveaxes.model.Question;
import com.twelveaxes.model.QuizPayload;
import com.twelveaxes.model.ResultRequest;
import com.twelveaxes.model.SubmittedAnswer;
import com.twelveaxes.service.IdeologyMatcherService;
import com.twelveaxes.service.QuizDataService;
import com.twelveaxes.service.ScoringService;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class RandomQuizSimulationTest {
    private static final String VARIANT_PROPERTY = "quiz.variant";
    private static final String SEED_PROPERTY = "quiz.seed";
    private static final String MODE_PROPERTY = "quiz.mode";
    private static final String RANDOM_MODE = "random";

    @Autowired
    private QuizDataService dataService;

    @Autowired
    private ScoringService scoringService;

    @Autowired
    private IdeologyMatcherService matcherService;

    @Test
    void simulateQuizWithRandomAnswers() {
        String variant = System.getProperty(VARIANT_PROPERTY, QuizDataService.SHORT_VARIANT);
        String mode = System.getProperty(MODE_PROPERTY, RANDOM_MODE).trim().toLowerCase();
        long seed = Long.getLong(SEED_PROPERTY, System.currentTimeMillis());
        Random random = new Random(seed);

        QuizPayload quiz = dataService.getQuiz(variant);
        List<Question> selectedQuestions = selectRandomQuestions(quiz, random);
        List<AnswerOption> answerOptions = quiz.answerOptions();
        Map<String, Pole> preferredPoleByAxis = preferredPoleByAxis(mode);
        List<SubmittedAnswer> answers = new ArrayList<>();

        printHeader(quiz, seed, mode);

        for (int index = 0; index < selectedQuestions.size(); index++) {
            Question question = selectedQuestions.get(index);
            AnswerValue selectedAnswerValue = selectAnswer(question, preferredPoleByAxis, random);
            AnswerOption selectedAnswer = answerOptions.stream()
                    .filter(option -> option.id() == selectedAnswerValue)
                    .findFirst()
                    .orElseThrow();
            answers.add(new SubmittedAnswer(question.id(), selectedAnswerValue));
            printAnsweredQuestion(index + 1, selectedQuestions.size(), question, selectedAnswer);
        }

        List<AxisResult> axes = scoringService.score(new ResultRequest(answers, quiz.variant()));
        var matches = matcherService.findMatches(axes);

        printResult(matches.getFirst(), axes);

        assertThat(answers).hasSize(quiz.questionCount());
        assertThat(axes).hasSize(12);
        assertThat(matches).isNotEmpty();
    }

    private AnswerValue selectAnswer(Question question, Map<String, Pole> preferredPoleByAxis, Random random) {
        Pole preferredPole = preferredPoleByAxis.get(question.axisId());
        if (preferredPole == null) {
            AnswerValue[] values = AnswerValue.values();
            return values[random.nextInt(values.length)];
        }

        AnswerValue[] supportingAnswers = question.agreePole() == preferredPole
                ? new AnswerValue[] { AnswerValue.NEUTRAL, AnswerValue.AGREE, AnswerValue.STRONGLY_AGREE }
                : new AnswerValue[] { AnswerValue.NEUTRAL, AnswerValue.DISAGREE, AnswerValue.STRONGLY_DISAGREE };
        return supportingAnswers[random.nextInt(supportingAnswers.length)];
    }

    private Map<String, Pole> preferredPoleByAxis(String mode) {
        return switch (mode) {
            case RANDOM_MODE -> Map.of();
            case "left" -> Map.ofEntries(
                    Map.entry("estrutura", Pole.LEFT),
                    Map.entry("representacao", Pole.LEFT),
                    Map.entry("poder", Pole.RIGHT),
                    Map.entry("imigracao", Pole.RIGHT),
                    Map.entry("diplomacia", Pole.RIGHT),
                    Map.entry("intervencao", Pole.LEFT),
                    Map.entry("economia", Pole.LEFT),
                    Map.entry("controle", Pole.LEFT),
                    Map.entry("comercio", Pole.LEFT),
                    Map.entry("religiao", Pole.LEFT),
                    Map.entry("moral", Pole.LEFT),
                    Map.entry("tecnologia", Pole.LEFT)
            );
            case "right" -> Map.ofEntries(
                    Map.entry("estrutura", Pole.RIGHT),
                    Map.entry("representacao", Pole.RIGHT),
                    Map.entry("poder", Pole.RIGHT),
                    Map.entry("imigracao", Pole.LEFT),
                    Map.entry("diplomacia", Pole.LEFT),
                    Map.entry("intervencao", Pole.RIGHT),
                    Map.entry("economia", Pole.RIGHT),
                    Map.entry("controle", Pole.RIGHT),
                    Map.entry("comercio", Pole.RIGHT),
                    Map.entry("religiao", Pole.RIGHT),
                    Map.entry("moral", Pole.RIGHT),
                    Map.entry("tecnologia", Pole.RIGHT)
            );
            case "authoritarian" -> Map.ofEntries(
                    Map.entry("estrutura", Pole.RIGHT),
                    Map.entry("representacao", Pole.RIGHT),
                    Map.entry("poder", Pole.LEFT),
                    Map.entry("imigracao", Pole.LEFT),
                    Map.entry("diplomacia", Pole.LEFT),
                    Map.entry("intervencao", Pole.RIGHT),
                    Map.entry("economia", Pole.RIGHT),
                    Map.entry("controle", Pole.LEFT),
                    Map.entry("comercio", Pole.LEFT),
                    Map.entry("religiao", Pole.RIGHT),
                    Map.entry("moral", Pole.RIGHT),
                    Map.entry("tecnologia", Pole.RIGHT)
            );
            case "libertarian" -> Map.ofEntries(
                    Map.entry("estrutura", Pole.LEFT),
                    Map.entry("representacao", Pole.LEFT),
                    Map.entry("poder", Pole.RIGHT),
                    Map.entry("imigracao", Pole.RIGHT),
                    Map.entry("diplomacia", Pole.RIGHT),
                    Map.entry("intervencao", Pole.LEFT),
                    Map.entry("economia", Pole.RIGHT),
                    Map.entry("controle", Pole.RIGHT),
                    Map.entry("comercio", Pole.RIGHT),
                    Map.entry("religiao", Pole.LEFT),
                    Map.entry("moral", Pole.LEFT),
                    Map.entry("tecnologia", Pole.LEFT)
            );
            case "progressive" -> Map.ofEntries(
                    Map.entry("estrutura", Pole.LEFT),
                    Map.entry("representacao", Pole.LEFT),
                    Map.entry("poder", Pole.RIGHT),
                    Map.entry("imigracao", Pole.RIGHT),
                    Map.entry("diplomacia", Pole.RIGHT),
                    Map.entry("intervencao", Pole.LEFT),
                    Map.entry("economia", Pole.LEFT),
                    Map.entry("controle", Pole.LEFT),
                    Map.entry("comercio", Pole.RIGHT),
                    Map.entry("religiao", Pole.LEFT),
                    Map.entry("moral", Pole.LEFT),
                    Map.entry("tecnologia", Pole.LEFT)
            );
            case "traditional" -> Map.ofEntries(
                    Map.entry("estrutura", Pole.RIGHT),
                    Map.entry("representacao", Pole.RIGHT),
                    Map.entry("poder", Pole.LEFT),
                    Map.entry("imigracao", Pole.LEFT),
                    Map.entry("diplomacia", Pole.LEFT),
                    Map.entry("intervencao", Pole.RIGHT),
                    Map.entry("economia", Pole.RIGHT),
                    Map.entry("controle", Pole.RIGHT),
                    Map.entry("comercio", Pole.LEFT),
                    Map.entry("religiao", Pole.RIGHT),
                    Map.entry("moral", Pole.RIGHT),
                    Map.entry("tecnologia", Pole.RIGHT)
            );
            default -> throw new IllegalArgumentException(
                    "Modo invalido: " + mode
                            + ". Use random, left, right, authoritarian, libertarian, progressive ou traditional."
            );
        };
    }

    private List<Question> selectRandomQuestions(QuizPayload quiz, Random random) {
        Map<String, List<Question>> questionsByAxis = new LinkedHashMap<>();
        for (Question question : quiz.questions()) {
            questionsByAxis.computeIfAbsent(question.axisId(), ignored -> new ArrayList<>()).add(question);
        }

        List<Question> selected = new ArrayList<>();
        for (List<Question> axisQuestions : questionsByAxis.values()) {
            List<Question> shuffled = new ArrayList<>(axisQuestions);
            shuffled.sort(Comparator.comparing(Question::id));
            shuffle(shuffled, random);
            selected.addAll(shuffled.stream().limit(quiz.questionsPerAxis()).toList());
        }
        shuffle(selected, random);
        return selected;
    }

    private <T> void shuffle(List<T> items, Random random) {
        for (int index = items.size() - 1; index > 0; index--) {
            int other = random.nextInt(index + 1);
            T current = items.get(index);
            items.set(index, items.get(other));
            items.set(other, current);
        }
    }

    private void printHeader(QuizPayload quiz, long seed, String mode) {
        System.out.println();
        System.out.println("============================================================");
        System.out.printf("SIMULACAO 12 AXES - quiz %s (%d perguntas)%n", quiz.variant(), quiz.questionCount());
        System.out.printf("Modo de resposta: %s%n", mode);
        System.out.printf("Seed aleatoria: %d%n", seed);
        System.out.println("============================================================");
        System.out.println();
    }

    private void printAnsweredQuestion(int number, int total, Question question, AnswerOption answer) {
        System.out.printf("%02d/%02d [%s]%n", number, total, question.axisId());
        System.out.printf("Pergunta: %s%n", question.text());
        System.out.printf("Resposta selecionada: %s (%s)%n", answer.label(), answer.id());
        System.out.println();
    }

    private void printResult(com.twelveaxes.model.IdeologyMatch topMatch, List<AxisResult> axes) {
        System.out.println("============================================================");
        System.out.println("RESULTADO FINAL");
        System.out.println("============================================================");
        System.out.printf("Ideologia aproximada: %s%n", topMatch.name());
        System.out.printf("Categoria: %s%n", topMatch.category());
        System.out.printf("Compatibilidade: %.1f%%%n", topMatch.compatibility());
        System.out.printf("Descricao: %s%n", topMatch.description());
        System.out.println();
        System.out.println("Eixos:");

        for (AxisResult axis : axes) {
            System.out.printf(
                    "- %s: %s %.1f%% | %s %.1f%% | dominante: %s (%s)%n",
                    axis.label(),
                    axis.leftPole(),
                    axis.leftPercent(),
                    axis.rightPole(),
                    axis.rightPercent(),
                    axis.dominantPole(),
                    axis.intensity()
            );
        }
        System.out.println();
    }
}
