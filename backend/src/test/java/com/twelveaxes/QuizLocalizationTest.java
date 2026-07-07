package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.model.AnswerValue;
import com.twelveaxes.model.QuizPayload;
import com.twelveaxes.model.QuizResult;
import com.twelveaxes.model.ResultRequest;
import com.twelveaxes.model.SubmittedAnswer;
import com.twelveaxes.service.QuizDataService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class QuizLocalizationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private QuizDataService dataService;

    @Test
    void quizInEnglishReturnsTranslatedAxesQuestionsAndOptions() throws Exception {
        String body = mockMvc.perform(get("/api/quiz").param("lang", "en"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(java.nio.charset.StandardCharsets.UTF_8);
        QuizPayload quiz = objectMapper.readValue(body, QuizPayload.class);

        assertThat(quiz.description()).contains("political axes");
        assertThat(quiz.axes()).anySatisfy(axis -> assertThat(axis.label()).isEqualTo("Structure"));
        assertThat(quiz.answerOptions()).anySatisfy(option -> assertThat(option.label()).isEqualTo("Strongly agree"));
        assertThat(quiz.questions()).noneMatch(question -> question.text().contains("Brasil"));
        assertThat(quiz.questions()).noneMatch(question -> question.text().contains("STF"));
    }

    @Test
    void quizInPortugueseKeepsBrazilianReferences() throws Exception {
        String body = mockMvc.perform(get("/api/quiz"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(java.nio.charset.StandardCharsets.UTF_8);
        QuizPayload quiz = objectMapper.readValue(body, QuizPayload.class);

        assertThat(quiz.questions()).anyMatch(question -> question.text().contains("Brasil"));
        assertThat(quiz.questions()).anyMatch(question -> question.text().contains("STF"));
    }

    @Test
    void everyQuestionAndEntityHasEnglishTranslation() {
        assertThat(dataService.getQuestionsForLang("en"))
                .noneMatch(question -> question.text().contains("Brasil") || question.text().contains(" deveria "));
        assertThat(dataService.getIdeologies("en")).hasSameSizeAs(dataService.getIdeologies());
        assertThat(dataService.getCountries("en")).hasSameSizeAs(dataService.getCountries());
        assertThat(dataService.getPersonalities("en")).hasSameSizeAs(dataService.getPersonalities());
        assertThat(dataService.getCountries("en"))
                .anySatisfy(country -> assertThat(country.name()).isEqualTo("Brazil"));
    }

    @Test
    void resultsInEnglishReturnTranslatedAxesAndMatches() throws Exception {
        QuizPayload quiz = objectMapper.readValue(
                mockMvc.perform(get("/api/quiz").param("lang", "en"))
                        .andReturn().getResponse().getContentAsString(java.nio.charset.StandardCharsets.UTF_8),
                QuizPayload.class);

        List<SubmittedAnswer> answers = quiz.questions().stream()
                .collect(java.util.stream.Collectors.groupingBy(q -> q.axisId()))
                .values().stream()
                .flatMap(group -> group.stream().limit(3))
                .map(question -> new SubmittedAnswer(question.id(), AnswerValue.NEUTRAL))
                .toList();

        String body = mockMvc.perform(post("/api/results")
                        .param("lang", "en")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ResultRequest(answers, "short"))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(java.nio.charset.StandardCharsets.UTF_8);
        QuizResult result = objectMapper.readValue(body, QuizResult.class);

        assertThat(result.axes()).anySatisfy(axis -> assertThat(axis.label()).isEqualTo("Structure"));
        assertThat(result.axes()).allSatisfy(axis -> assertThat(axis.intensity())
                .isIn("Balanced", "Leaning", "Strong", "Very strong"));
        assertThat(result.topMatch().longDescription()).contains("Compatibility indicates");
    }

    @Test
    void unknownLangFallsBackToPortuguese() throws Exception {
        mockMvc.perform(get("/api/quiz").param("lang", "fr"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value(org.hamcrest.Matchers.containsString("eixos políticos")));
    }
}
