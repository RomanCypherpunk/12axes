package com.twelveaxes;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class PoliticalValuesPayloadTest {
    private static final String CENTRO = "50,50,50,50,50,50,50,50,50,50,50,50";
    private static final String EXTREMO = "0,0,0,0,0,0,0,0,0,0,0,0";

    @Autowired
    private MockMvc mockMvc;

    @Test
    void sharedResultCarriesPoliticalValuesAndNoTimeline() throws Exception {
        mockMvc.perform(get("/api/results/by-axes").param("v", CENTRO))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.politicalValues.length()").value(6))
                .andExpect(jsonPath("$.politicalValues[0].categoryId").value("politicos"))
                .andExpect(jsonPath("$.politicalValues[0].valueId").value("neutralidade-politica"))
                .andExpect(jsonPath("$.politicalValues[0].neutral").value(true))
                .andExpect(jsonPath("$.politicalValues[*].categoryId").value(
                        org.hamcrest.Matchers.contains("politicos", "externa", "economicos", "imigracao", "sociedade", "tecnologicos")))
                .andExpect(jsonPath("$.timeline").doesNotExist());
    }

    @Test
    void extremeVectorStillResolvesInEnglish() throws Exception {
        mockMvc.perform(get("/api/results/by-axes").param("v", EXTREMO).param("lang", "en"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.politicalValues[0].name").isNotEmpty())
                .andExpect(jsonPath("$.politicalValues[0].categoryLabel").value("Politics"));
    }
}
