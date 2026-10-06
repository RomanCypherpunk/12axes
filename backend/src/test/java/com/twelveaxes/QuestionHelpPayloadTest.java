package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.model.Question;
import com.twelveaxes.model.QuestionHelp;
import com.twelveaxes.model.QuizPayload;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class QuestionHelpPayloadTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private QuizPayload quiz(String lang) throws Exception {
        String body = mockMvc.perform(get("/api/quiz").param("variant", "extreme").param("lang", lang))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        return objectMapper.readValue(body, QuizPayload.class);
    }

    private static Question byId(QuizPayload quiz, String id) {
        return quiz.questions().stream().filter(q -> q.id().equals(id)).findFirst().orElseThrow();
    }

    @Test
    void portugueseQuizCarriesHelpWithInlinedGlossary() throws Exception {
        QuestionHelp help = byId(quiz("pt"), "controle_03").help();

        assertThat(help).isNotNull();
        assertThat(help.simple()).isNotBlank();
        assertThat(help.example().agree()).isNotBlank();
        assertThat(help.example().disagree()).isNotBlank();
        assertThat(help.terms()).anySatisfy(term -> {
            assertThat(term.match()).isEqualTo("Banco Central");
            assertThat(term.definition()).contains("juros");
        });
    }

    @Test
    void englishQuizUsesEnglishHelpAndMatchesEnglishText() throws Exception {
        Question question = byId(quiz("en"), "controle_03");

        assertThat(question.help().simple()).contains("president");
        assertThat(question.help().terms()).allSatisfy(term ->
                assertThat(question.text().toLowerCase(Locale.ROOT)).contains(term.match().toLowerCase(Locale.ROOT)));
        assertThat(question.help().terms()).anySatisfy(term -> assertThat(term.term()).isEqualTo("Central bank"));
    }

    @Test
    void everyQuestionHasHelpInEveryLanguage() throws Exception {
        for (String lang : new String[] {"pt", "en"}) {
            QuizPayload quiz = quiz(lang);
            assertThat(quiz.questions()).as(lang).hasSize(240);
            assertThat(quiz.questions()).as(lang).allSatisfy(question -> {
                assertThat(question.help()).as(question.id()).isNotNull();
                assertThat(question.help().simple()).as(question.id()).isNotBlank();
                assertThat(question.help().example()).as(question.id()).isNotNull();
                assertThat(question.help().terms()).as(question.id()).allSatisfy(term ->
                        assertThat(question.text().toLowerCase(Locale.ROOT))
                                .contains(term.match().toLowerCase(Locale.ROOT)));
            });
        }
    }
}
