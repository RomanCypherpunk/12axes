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
        mockMvc.perform(get("/api/quiz").param("lang", "de"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value(org.hamcrest.Matchers.containsString("eixos políticos")));
    }

    @Test
    void frenchQuizIncludesAllQuestionsArchetypesAndAnswerLabels() throws Exception {
        for (String variant : List.of("short", "extended", "extreme")) {
            QuizPayload quiz = objectMapper.readValue(mockMvc.perform(get("/api/quiz")
                            .param("variant", variant).param("lang", "fr-CA"))
                    .andExpect(status().isOk()).andReturn().getResponse().getContentAsString(java.nio.charset.StandardCharsets.UTF_8), QuizPayload.class);
            assertThat(quiz.description()).contains("axes politiques");
            assertThat(quiz.axes()).hasSize(12).anySatisfy(axis -> assertThat(axis.label()).isEqualTo("Économie"));
            assertThat(quiz.questions()).hasSize(240);
            assertThat(quiz.answerOptions()).anySatisfy(option -> assertThat(option.label()).isEqualTo("Tout à fait d’accord"));
            assertThat(quiz.archetypeQuestions()).hasSize(5);
            assertThat(quiz.archetypeQuestions().getFirst().text()).isEqualTo("Sur quoi la société devrait-elle reposer ?");
            assertThat(quiz.archetypeQuestions().getFirst().options().getFirst().text()).isEqualTo("La foi, la famille et les traditions nationales");
        }
    }

    @Test
    void frenchOverlaysKeepScoringInputsAndCatalogIds() {
        assertThat(dataService.getQuestionsForLang("fr")).usingRecursiveComparison().ignoringFields("text")
                .isEqualTo(dataService.getQuestionsForLang("en"));
        assertThat(dataService.getIdeologies("fr")).extracting(com.twelveaxes.model.Ideology::id)
                .containsExactlyElementsOf(dataService.getIdeologies().stream().map(com.twelveaxes.model.Ideology::id).toList());
        assertThat(dataService.getCountries("fr")).extracting(com.twelveaxes.model.Country::id)
                .containsExactlyElementsOf(dataService.getCountries().stream().map(com.twelveaxes.model.Country::id).toList());
        assertThat(dataService.getPersonalities("fr")).extracting(com.twelveaxes.model.Personality::id)
                .containsExactlyElementsOf(dataService.getPersonalities().stream().map(com.twelveaxes.model.Personality::id).toList());
        assertThat(dataService.getCountryById("irlanda", "fr").name()).isEqualTo("Irlande");
        assertThat(dataService.getCountryById("imperio-romano", "fr").period()).contains("av. J.-C.", "apr. J.-C.");
        assertThat(dataService.getPersonalityById("platao", "fr").name()).isEqualTo("Platon");
    }

    @Test
    void frenchResultsPreserveScoresAndTranslateExplanations() throws Exception {
        String vector = "12,26,35,49,61,72,84,96,23,47,65,89";
        QuizResult en = sharedResult(vector, "en");
        QuizResult fr = sharedResult(vector, "FR-fr");
        assertThat(fr.axes()).extracting(com.twelveaxes.model.AxisResult::leftPercent)
                .containsExactlyElementsOf(en.axes().stream().map(com.twelveaxes.model.AxisResult::leftPercent).toList());
        assertThat(fr.axes()).extracting(com.twelveaxes.model.AxisResult::intensity)
                .containsOnly("Équilibrée", "Modérée", "Forte", "Très forte");
        assertThat(fr.topMatch().longDescription()).contains("La compatibilité mesure");
        assertThat(fr.topMatch().compatibility()).isEqualTo(en.topMatch().compatibility());
        assertThat(fr.bookRecommendations()).isNotEmpty().allSatisfy(book -> {
            assertThat(book.title()).isNotBlank();
            assertThat(book.url()).startsWith("https://www.amazon.fr/s?").doesNotContain("tag=");
        });
        assertThat(sharedResult(vector, "fr")).isEqualTo(fr);
    }

    @Test
    void frenchSubmissionUsesTheSameAnswerAndArchetypeScores() throws Exception {
        List<SubmittedAnswer> answers = dataService.getQuestions().stream()
                .collect(java.util.stream.Collectors.groupingBy(q -> q.axisId())).values().stream()
                .flatMap(group -> group.stream().limit(3))
                .map(question -> new SubmittedAnswer(question.id(), AnswerValue.AGREE)).toList();
        ResultRequest request = new ResultRequest(answers, "short", java.util.Map.of("sociedade", "A"));
        List<QuizResult> results = new java.util.ArrayList<>();
        for (String lang : List.of("en", "fr")) {
            results.add(objectMapper.readValue(mockMvc.perform(post("/api/results").param("lang", lang)
                            .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk()).andReturn().getResponse().getContentAsString(java.nio.charset.StandardCharsets.UTF_8), QuizResult.class));
        }
        assertThat(results.get(1).axes()).extracting(com.twelveaxes.model.AxisResult::leftPercent)
                .containsExactlyElementsOf(results.getFirst().axes().stream().map(com.twelveaxes.model.AxisResult::leftPercent).toList());
    }

    private QuizResult sharedResult(String vector, String lang) throws Exception {
        return objectMapper.readValue(mockMvc.perform(get("/api/results/by-axes").param("v", vector).param("lang", lang))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString(java.nio.charset.StandardCharsets.UTF_8), QuizResult.class);
    }
}
