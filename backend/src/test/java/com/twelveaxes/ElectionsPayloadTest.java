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
class ElectionsPayloadTest {
    private static final String CENTRO = "50,50,50,50,50,50,50,50,50,50,50,50";

    @Autowired
    private MockMvc mockMvc;

    @Test
    void sharedResultInSpanishCarriesBothElectionsSpainFirst() throws Exception {
        mockMvc.perform(get("/api/results/by-axes").param("v", CENTRO).param("lang", "es"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.elections.length()").value(2))
                .andExpect(jsonPath("$.elections[0].id").value("espanha-2026-gerais"))
                .andExpect(jsonPath("$.elections[0].date").value("2026-11-29"))
                .andExpect(jsonPath("$.elections[0].candidates.length()").value(3))
                .andExpect(jsonPath("$.elections[0].candidates[0].candidate.name").isNotEmpty())
                .andExpect(jsonPath("$.elections[0].candidates[0].candidate.compatibility").isNumber())
                .andExpect(jsonPath("$.elections[0].candidates[0].party.name").isNotEmpty())
                .andExpect(jsonPath("$.elections[0].candidates[0].party.countryFlagPath").isNotEmpty())
                .andExpect(jsonPath("$.elections[1].id").value("brasil-2026-presidenciais"))
                .andExpect(jsonPath("$.elections[1].candidates.length()").value(5));
    }

    @Test
    void portugueseGetsBrazilFirst() throws Exception {
        mockMvc.perform(get("/api/results/by-axes").param("v", CENTRO).param("lang", "pt"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.elections.length()").value(2))
                .andExpect(jsonPath("$.elections[0].id").value("brasil-2026-presidenciais"))
                .andExpect(jsonPath("$.elections[1].id").value("espanha-2026-gerais"));
    }

    @Test
    void otherLanguagesGetAnEmptyListNeverAMissingField() throws Exception {
        for (String lang : new String[] {"en", "de", "it", "ru", "fr"}) {
            mockMvc.perform(get("/api/results/by-axes").param("v", CENTRO).param("lang", lang))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.elections").isArray())
                    .andExpect(jsonPath("$.elections.length()").value(0));
        }
    }
}
