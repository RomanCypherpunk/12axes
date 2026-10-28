package com.twelveaxes;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.service.QuizDataService;
import com.twelveaxes.service.ScoringService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/** Configuracao padrao (pagamentos desligados, sem modo local): o relatorio pago nao existe. */
@SpringBootTest
@AutoConfigureMockMvc
class PremiumControllerClosedTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private QuizDataService dataService;

    @Autowired
    private ScoringService scoringService;

    private String body() throws Exception {
        String vector = scoringService.score(TestAnswers.mixed(dataService), "pt").stream()
                .map(axis -> String.valueOf(axis.leftPercent())).collect(java.util.stream.Collectors.joining(","));
        return objectMapper.writeValueAsString(java.util.Map.of("v", vector));
    }

    @Test
    void reportIsNotFoundWhenPaymentsAreOff() throws Exception {
        mockMvc.perform(post("/api/premium/report")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body()))
                .andExpect(status().isNotFound());
    }

    @Test
    void aTokenDoesNotOpenTheReportWhenPaymentsAreOff() throws Exception {
        mockMvc.perform(post("/api/premium/report")
                        .header("X-Entitlement", "qualquer.coisa")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body()))
                .andExpect(status().isNotFound());
    }
}
