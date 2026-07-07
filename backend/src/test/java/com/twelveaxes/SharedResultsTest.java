package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.model.QuizResult;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class SharedResultsTest {
    private static final String LEFT_LIBERTARIAN_VECTOR = "70,80,20,30,70,40,60,55,60,25,20,45";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void rebuildsFullResultFromAxisVector() throws Exception {
        String body = mockMvc.perform(get("/api/results/by-axes").param("v", LEFT_LIBERTARIAN_VECTOR))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        QuizResult result = objectMapper.readValue(body, QuizResult.class);

        assertThat(result.axes()).hasSize(12);
        assertThat(result.axes().getFirst().leftPercent()).isEqualTo(70.0);
        assertThat(result.matches()).isNotEmpty();
        assertThat(result.topMatch().name()).isNotBlank();
        assertThat(result.topCountryMatch().name()).isNotBlank();
        assertThat(result.topPersonalityMatch().name()).isNotBlank();
    }

    @Test
    void sharedResultRespectsLanguage() throws Exception {
        String body = mockMvc.perform(get("/api/results/by-axes")
                        .param("v", LEFT_LIBERTARIAN_VECTOR)
                        .param("lang", "en"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        QuizResult result = objectMapper.readValue(body, QuizResult.class);

        assertThat(result.axes()).anySatisfy(axis -> assertThat(axis.label()).isEqualTo("Structure"));
        assertThat(result.axes()).allSatisfy(axis -> assertThat(axis.intensity())
                .isIn("Balanced", "Leaning", "Strong", "Very strong"));
    }

    @Test
    void rejectsInvalidVectors() throws Exception {
        mockMvc.perform(get("/api/results/by-axes").param("v", "10,20"))
                .andExpect(status().isBadRequest());
        mockMvc.perform(get("/api/results/by-axes").param("v", "10,20,30,40,50,60,70,80,90,100,110,50"))
                .andExpect(status().isBadRequest());
        mockMvc.perform(get("/api/results/by-axes").param("v", "abc,20,30,40,50,60,70,80,90,100,50,50"))
                .andExpect(status().isBadRequest());
    }
}
