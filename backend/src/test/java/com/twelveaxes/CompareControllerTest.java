package com.twelveaxes;

import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.lessThanOrEqualTo;
import static org.hamcrest.Matchers.not;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class CompareControllerTest {
    private static final String CENTER = "50,50,50,50,50,50,50,50,50,50,50,50";
    private static final String THREE = "personality:alvaro-uribe,personality:gustavo-petro,country:colombia";

    @Autowired
    private MockMvc mockMvc;

    @Test
    void catalogListsAllFourTypes() throws Exception {
        mockMvc.perform(get("/api/compare/catalog").param("lang", "pt"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", greaterThan(600)))
                .andExpect(jsonPath("$[?(@.type=='personality')]").isNotEmpty())
                .andExpect(jsonPath("$[?(@.type=='country')]").isNotEmpty())
                .andExpect(jsonPath("$[?(@.type=='ideology')]").isNotEmpty())
                .andExpect(jsonPath("$[?(@.type=='party')]").isNotEmpty());
    }

    @Test
    void partyCaptionShowsTheAssociatedCountryAndComparisonWorks() throws Exception {
        mockMvc.perform(get("/api/compare/catalog").param("lang", "pt"))
                .andExpect(jsonPath("$[?(@.id=='partido-republicano-eua')].caption").value("Estados Unidos"))
                .andExpect(jsonPath("$[?(@.id=='partido-republicano-eua-new-deal')].caption")
                        .value("Estados Unidos do New Deal · 1933–1945"))
                .andExpect(jsonPath("$[?(@.id=='partido-republicano-eua')].imagePath")
                        .value("/parties/logos/partido-republicano-eua.png"));
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
    void comparesWithAPartyAndKeepsItsCountryAndLogo() throws Exception {
        mockMvc.perform(get("/api/compare").param("type", "party").param("id", "vox").param("v", CENTER))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.item.type").value("party"))
                .andExpect(jsonPath("$.item.name").value("Vox"))
                .andExpect(jsonPath("$.item.caption").value("Espanha"))
                .andExpect(jsonPath("$.item.imagePath").value("/parties/logos/vox.png"))
                .andExpect(jsonPath("$.vector.length()").value(12));
        mockMvc.perform(get("/api/compare").param("type", "party").param("id", "nobody").param("v", CENTER))
                .andExpect(status().isNotFound());
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

    @Test
    void comparesThreeProfilesWithAllPairs() throws Exception {
        mockMvc.perform(get("/api/compare/profiles").param("items", " " + THREE.replace(",", " , ")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.profiles.length()").value(3))
                .andExpect(jsonPath("$.profiles[0].item.id").value("alvaro-uribe"))
                .andExpect(jsonPath("$.profiles[1].item.id").value("gustavo-petro"))
                .andExpect(jsonPath("$.profiles[2].item.type").value("country"))
                .andExpect(jsonPath("$.profiles[0].vector.length()").value(12))
                .andExpect(jsonPath("$.profiles[2].vector.length()").value(12))
                .andExpect(jsonPath("$.pairs.length()").value(3))
                .andExpect(jsonPath("$.pairs[0].first").value(0))
                .andExpect(jsonPath("$.pairs[0].second").value(1))
                .andExpect(jsonPath("$.pairs[1].first").value(0))
                .andExpect(jsonPath("$.pairs[1].second").value(2))
                .andExpect(jsonPath("$.pairs[2].first").value(1))
                .andExpect(jsonPath("$.pairs[2].second").value(2))
                .andExpect(jsonPath("$.pairs[*].compatibility", everyItem(allOf(greaterThanOrEqualTo(0.0), lessThanOrEqualTo(100.0)))));
    }

    @Test
    void comparesPartiesWithOtherCatalogs() throws Exception {
        mockMvc.perform(get("/api/compare/profiles").param("items", "party:vox,ideology:social-democracia"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.profiles[0].item.type").value("party"))
                .andExpect(jsonPath("$.profiles[0].item.id").value("vox"))
                .andExpect(jsonPath("$.profiles[0].vector.length()").value(12))
                .andExpect(jsonPath("$.pairs.length()").value(1));
        expectProfilesStatus("party:partido-inexistente,country:colombia", 404);
    }

    @Test
    void profilesCarryTheirNearestMatchesWithoutThemselves() throws Exception {
        mockMvc.perform(get("/api/compare/profiles").param("items", "ideology:social-democracia,country:colombia"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.profiles[0].nearest.ideology.ideologyId").isNotEmpty())
                .andExpect(jsonPath("$.profiles[0].nearest.ideology.ideologyId", not("social-democracia")))
                .andExpect(jsonPath("$.profiles[1].nearest.country.countryId").isNotEmpty())
                .andExpect(jsonPath("$.profiles[1].nearest.country.countryId", not("colombia")))
                .andExpect(jsonPath("$.profiles[0].nearest.country.countryId").isNotEmpty())
                .andExpect(jsonPath("$.profiles[0].nearest.party.partyId").isNotEmpty())
                .andExpect(jsonPath("$.commonIdeology.ideologyId").isNotEmpty())
                .andExpect(jsonPath("$.commonIdeology.ideologyId", not("social-democracia")));
    }

    @Test
    void profilePairCompatibilityIsSymmetric() throws Exception {
        String forward = mockMvc.perform(get("/api/compare/profiles")
                        .param("items", "personality:alvaro-uribe,personality:gustavo-petro"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.pairs.length()").value(1))
                .andReturn().getResponse().getContentAsString();
        String backward = mockMvc.perform(get("/api/compare/profiles")
                        .param("items", "personality:gustavo-petro,personality:alvaro-uribe"))
                .andReturn().getResponse().getContentAsString();
        assertEquals(
                JsonPath.<Double>read(forward, "$.pairs[0].compatibility"),
                JsonPath.<Double>read(backward, "$.pairs[0].compatibility"));
    }

    @Test
    void profilesRespectsLang() throws Exception {
        mockMvc.perform(get("/api/compare/profiles").param("lang", "en")
                        .param("items", "country:colombia,country:brasil"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.profiles[0].item.name").value("Colombia"))
                .andExpect(jsonPath("$.profiles[1].item.name").value("Brazil"));
    }

    @Test
    void profilesRejectsNoItemsOrMoreThanThreeItems() throws Exception {
        expectProfilesStatus("", 400);
        expectProfilesStatus(THREE + ",ideology:social-democracia", 400);
    }

    @Test
    void singleProfileReturnsItsVectorAndNeighboursWithoutPairs() throws Exception {
        mockMvc.perform(get("/api/compare/profiles").param("items", "personality:alvaro-uribe"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.profiles.length()").value(1))
                .andExpect(jsonPath("$.profiles[0].vector.length()").value(12))
                .andExpect(jsonPath("$.profiles[0].nearest.ideology.ideologyId").isNotEmpty())
                .andExpect(jsonPath("$.pairs.length()").value(0));
    }

    @Test
    void profilesReturnsNotFoundForUnknownId() throws Exception {
        expectProfilesStatus("personality:alvaro-uribe,personality:nobody", 404);
    }

    @Test
    void profilesRejectsInvalidTypeMalformedTokenAndDuplicate() throws Exception {
        expectProfilesStatus("planet:x,personality:alvaro-uribe", 400);
        expectProfilesStatus("alvaro-uribe,personality:gustavo-petro", 400);
        expectProfilesStatus("personality:,personality:gustavo-petro", 400);
        expectProfilesStatus(":alvaro-uribe,personality:gustavo-petro", 400);
        expectProfilesStatus("personality:alvaro-uribe,personality:alvaro-uribe", 400);
    }

    private void expectProfilesStatus(String items, int expected) throws Exception {
        mockMvc.perform(get("/api/compare/profiles").param("items", items))
                .andExpect(status().is(expected));
    }
}
