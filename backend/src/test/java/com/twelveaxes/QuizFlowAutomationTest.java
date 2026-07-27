package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.greaterThan;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.model.AnswerValue;
import com.twelveaxes.model.Pole;
import com.twelveaxes.model.Question;
import com.twelveaxes.model.QuizPayload;
import com.twelveaxes.model.QuizResult;
import com.twelveaxes.model.ResultRequest;
import com.twelveaxes.model.SubmittedAnswer;
import com.twelveaxes.service.QuizDataService;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class QuizFlowAutomationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void quizDefaultsToShortVariantWhenVariantIsMissing() throws Exception {
        mockMvc.perform(get("/api/quiz"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.variant").value(QuizDataService.SHORT_VARIANT))
                .andExpect(jsonPath("$.questionCount").value(36));
    }

    @ParameterizedTest
    @MethodSource("variants")
    void quizzesAcceptEveryAnswerOption(String variant) throws Exception {
        for (AnswerValue answer : AnswerValue.values()) {
            QuizPayload quiz = fetchQuiz(variant);
            List<SubmittedAnswer> answers = selectQuestionsForVariant(quiz).stream()
                    .map(question -> new SubmittedAnswer(question.id(), answer))
                    .toList();

            mockMvc.perform(post("/api/results")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(new ResultRequest(answers, variant))))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.axes.length()").value(12))
                    .andExpect(jsonPath("$.topMatch.ideologyId").isNotEmpty())
                    .andExpect(jsonPath("$.topPersonalityMatch.personalityId").isNotEmpty())
                    .andExpect(jsonPath("$.topPersonalityMatch.compatibility").isNumber())
                    .andExpect(jsonPath("$.matches.length()").value(4));
        }
    }

    @ParameterizedTest
    @MethodSource("variants")
    void neutralAnswersProducePragmatismo(String variant) throws Exception {
        QuizPayload quiz = fetchQuiz(variant);
        List<SubmittedAnswer> answers = selectQuestionsForVariant(quiz).stream()
                .map(question -> new SubmittedAnswer(question.id(), AnswerValue.NEUTRAL))
                .toList();

        mockMvc.perform(post("/api/results")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ResultRequest(answers, variant))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.topMatch.ideologyId").value("pragmatismo"))
                .andExpect(jsonPath("$.topMatch.compatibility").isNumber())
                .andExpect(jsonPath("$.topMatch.compatibilityPercentile").value(greaterThan(95.0)));
    }

    @ParameterizedTest
    @MethodSource("variants")
    void differentAnswerProfilesProduceDifferentResults(String variant) throws Exception {
        QuizPayload quiz = fetchQuiz(variant);

        QuizResult authoritarianTraditional = postResults(variant, answersTowardProfile(quiz, Map.ofEntries(
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
        )));
        QuizResult libertarianProfile = postResults(variant, answersTowardProfile(quiz, Map.ofEntries(
                Map.entry("estrutura", Pole.LEFT),
                Map.entry("representacao", Pole.LEFT),
                Map.entry("poder", Pole.RIGHT),
                Map.entry("imigracao", Pole.RIGHT),
                Map.entry("diplomacia", Pole.RIGHT),
                Map.entry("intervencao", Pole.LEFT),
                Map.entry("economia", Pole.LEFT),
                Map.entry("controle", Pole.RIGHT),
                Map.entry("comercio", Pole.RIGHT),
                Map.entry("religiao", Pole.LEFT),
                Map.entry("moral", Pole.LEFT),
                Map.entry("tecnologia", Pole.LEFT)
        )));

        assertThat(authoritarianTraditional.topMatch().category()).isEqualTo("Extrema Direita");
        assertThat(libertarianProfile.topMatch().category())
                .isIn("Libertário", "Anarquismo");
        assertThat(authoritarianTraditional.topMatch().ideologyId())
                .isNotEqualTo(libertarianProfile.topMatch().ideologyId());
    }

    @ParameterizedTest
    @EnumSource(AnswerValue.class)
    void answerOptionsExposeExpectedPortugueseLabels(AnswerValue answer) throws Exception {
        QuizPayload quiz = fetchQuiz(QuizDataService.SHORT_VARIANT);

        assertThat(quiz.answerOptions())
                .anySatisfy(option -> {
                    assertThat(option.id()).isEqualTo(answer);
                    assertThat(option.label()).isEqualTo(expectedLabel(answer));
                });
    }

    private QuizPayload fetchQuiz(String variant) throws Exception {
        String json = mockMvc.perform(get("/api/quiz").param("variant", variant))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.variant").value(variant))
                .andReturn()
                .getResponse()
                .getContentAsString();
        return objectMapper.readValue(json, QuizPayload.class);
    }

    private QuizResult postResults(String variant, List<SubmittedAnswer> answers) throws Exception {
        byte[] json = mockMvc.perform(post("/api/results")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ResultRequest(answers, variant))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.axes.length()").value(12))
                .andExpect(jsonPath("$.matches.length()").value(4))
                .andReturn()
                .getResponse()
                .getContentAsByteArray();
        return objectMapper.readValue(json, QuizResult.class);
    }

    private List<SubmittedAnswer> answersTowardProfile(QuizPayload quiz, Map<String, Pole> preferredPoleByAxis) {
        return selectQuestionsForVariant(quiz).stream()
                .map(question -> {
                    Pole preferredPole = preferredPoleByAxis.get(question.axisId());
                    AnswerValue answer = question.agreePole() == preferredPole
                            ? AnswerValue.STRONGLY_AGREE
                            : AnswerValue.STRONGLY_DISAGREE;
                    return new SubmittedAnswer(question.id(), answer);
                })
                .toList();
    }

    private List<Question> selectQuestionsForVariant(QuizPayload quiz) {
        if (quiz.questionsPerAxis() == 0) {
            assertThat(quiz.questions()).hasSize(quiz.questionCount());
            return quiz.questions();
        }

        Map<String, List<Question>> questionsByAxis = new LinkedHashMap<>();
        for (Question question : quiz.questions()) {
            questionsByAxis.computeIfAbsent(question.axisId(), ignored -> new java.util.ArrayList<>()).add(question);
        }

        List<Question> selected = questionsByAxis.values().stream()
                .flatMap(axisQuestions -> axisQuestions.stream().limit(quiz.questionsPerAxis()))
                .toList();

        assertThat(selected).hasSize(quiz.questionCount());
        return selected;
    }

    private static Stream<String> variants() {
        return Stream.of(
                QuizDataService.SHORT_VARIANT,
                QuizDataService.EXTENDED_VARIANT,
                QuizDataService.EXTREME_VARIANT
        );
    }

    private String expectedLabel(AnswerValue answer) {
        return switch (answer) {
            case STRONGLY_AGREE -> "Concordo totalmente";
            case AGREE -> "Concordo";
            case NEUTRAL -> "Neutro ou Depende";
            case DISAGREE -> "Discordo";
            case STRONGLY_DISAGREE -> "Discordo totalmente";
        };
    }
}
