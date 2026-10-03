package com.twelveaxes;

import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.not;
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
class CompareControllerTest {
    private static final String CENTER = "50,50,50,50,50,50,50,50,50,50,50,50";

    @Autowired
    private MockMvc mockMvc;

    @Test
    void catalogListsAllThreeTypes() throws Exception {
        mockMvc.perform(get("/api/compare/catalog").param("lang", "pt"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", greaterThan(600)))
                .andExpect(jsonPath("$[?(@.type=='personality')]").isNotEmpty())
                .andExpect(jsonPath("$[?(@.type=='country')]").isNotEmpty())
                .andExpect(jsonPath("$[?(@.type=='ideology')]").isNotEmpty());
    }

    @Test
    void catalogAppliesTheReligionFilterLikeTheResults() throws Exception {
        // Sem religiao escolhida, perfis "only" ficam escondidos; com a religiao listada, aparecem.
        mockMvc.perform(get("/api/compare/catalog").param("lang", "pt"))
                .andExpect(jsonPath("$[*].id", not(hasItem("teocracia-judaica"))));
        mockMvc.perform(get("/api/compare/catalog").param("lang", "pt").param("religion", "judaism"))
                .andExpect(jsonPath("$[*].id", hasItem("teocracia-judaica")));
        mockMvc.perform(get("/api/compare/catalog").param("lang", "pt").param("religion", "christianity"))
                .andExpect(jsonPath("$[*].id", not(hasItem("teocracia-judaica"))));
    }

    @Test
    void ideologyHasNoImageAndCountryHasAFlag() throws Exception {
        mockMvc.perform(get("/api/compare/catalog").param("lang", "en"))
                .andExpect(jsonPath("$[?(@.type=='ideology')]").isNotEmpty())
                .andExpect(jsonPath("$[?(@.type=='ideology' && @.imagePath != null)]", hasSize(0)))
                .andExpect(jsonPath("$[?(@.type=='country' && @.imagePath != null)]").isNotEmpty());
    }

    @Test
    void comparesWithAPersonality() throws Exception {
        mockMvc.perform(get("/api/compare")
                        .param("type", "personality").param("id", "joe-biden").param("v", CENTER).param("lang", "pt"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.item.id").value("joe-biden"))
                .andExpect(jsonPath("$.item.type").value("personality"))
                .andExpect(jsonPath("$.compatibility", greaterThan(0.0)))
                .andExpect(jsonPath("$.vector.economia").isNumber())
                .andExpect(jsonPath("$.vector.length()").value(12));
    }

    @Test
    void comparesWithACountryAndAnIdeology() throws Exception {
        mockMvc.perform(get("/api/compare").param("type", "country").param("id", "brasil").param("v", CENTER))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.item.type").value("country"))
                .andExpect(jsonPath("$.vector.length()").value(12));
        mockMvc.perform(get("/api/compare").param("type", "ideology").param("id", "social-democracia").param("v", CENTER))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.item.type").value("ideology"))
                .andExpect(jsonPath("$.vector.length()").value(12));
    }

    @Test
    void rejectsUnknownTypeUnknownIdAndBadVector() throws Exception {
        mockMvc.perform(get("/api/compare").param("type", "planet").param("id", "x").param("v", CENTER))
                .andExpect(status().isBadRequest());
        mockMvc.perform(get("/api/compare").param("type", "personality").param("id", "nobody").param("v", CENTER))
                .andExpect(status().isNotFound());
        mockMvc.perform(get("/api/compare").param("type", "personality").param("id", "joe-biden").param("v", "abc"))
                .andExpect(status().isBadRequest());
    }
}
