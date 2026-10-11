package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.model.Personality;
import com.twelveaxes.model.PersonalityMatch;
import com.twelveaxes.model.QuizResult;
import com.twelveaxes.service.PersonalityMatcherService;
import com.twelveaxes.service.ProfileMatchScorer;
import com.twelveaxes.service.QuizDataService;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class PersonalityRepresentationTest {
    // Canonical Ayn Rand vector from personality-profiles.json.
    private static final String FEMALE_VECTOR =
            "78,55,6,45,72,28,3,3,6,96,55,92";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private QuizDataService dataService;

    @Autowired
    private ProfileMatchScorer profileMatchScorer;

    @Test
    void firstFemaleBatchContainsExactlyTenProfiles() {
        List<Personality> women = dataService.getPersonalities().stream()
                .filter(personality -> PersonalityMatcherService.REPRESENTATION_FEMALE.equals(
                        PersonalityMatcherService.representationOf(personality)))
                .toList();

        assertThat(women).hasSize(10);
        assertThat(women)
                .extracting(Personality::id)
                .containsExactlyInAnyOrder(
                        "ayn-rand",
                        "hannah-arendt",
                        "mary-wollstonecraft",
                        "elinor-ostrom",
                        "judith-butler",
                        "bell-hooks",
                        "lelia-gonzalez",
                        "nisia-floresta",
                        "dorothy-day",
                        "condoleezza-rice");
    }

    @Test
    void femaleBatchHasNoBlockingNearDuplicate() {
        var women = dataService.getPersonalities().stream()
                .filter(personality -> PersonalityMatcherService.REPRESENTATION_FEMALE.equals(
                        PersonalityMatcherService.representationOf(personality)))
                .toList();
        var profiles = dataService.getPersonalityProfiles();

        for (int i = 0; i < women.size(); i++) {
            for (int j = i + 1; j < women.size(); j++) {
                var left = women.get(i);
                var right = women.get(j);
                double compatibility = profileMatchScorer.compatibility(
                        profiles.get(left.id()).vector(),
                        profiles.get(right.id()).vector());

                assertThat(compatibility)
                        .as("%s e %s nao devem cair no limiar bloqueante de duplicata",
                                left.id(), right.id())
                        .isLessThan(97.0);
            }
        }
    }

    @Test
    void defaultResultsRemainMaleOnly() throws Exception {
        QuizResult result = resultFor(null);
        Map<String, Personality> byId = personalitiesById();

        assertThat(result.personalityMatches())
                .isNotEmpty()
                .allSatisfy(match -> assertThat(
                        PersonalityMatcherService.representationOf(byId.get(match.personalityId())))
                        .isEqualTo(PersonalityMatcherService.REPRESENTATION_MALE));
        assertThat(result.topPersonalityMatch().personalityId()).isNotEqualTo("ayn-rand");
    }

    @Test
    void femaleResultsRankWomenOnly() throws Exception {
        QuizResult result = resultFor(PersonalityMatcherService.REPRESENTATION_FEMALE);
        Map<String, Personality> byId = personalitiesById();

        assertThat(result.personalityMatches())
                .hasSize(8)
                .allSatisfy(match -> assertThat(
                        PersonalityMatcherService.representationOf(byId.get(match.personalityId())))
                        .isEqualTo(PersonalityMatcherService.REPRESENTATION_FEMALE));
        assertThat(result.topPersonalityMatch().personalityId()).isEqualTo("ayn-rand");
        // FEMALE_VECTOR is the rounded URL representation of the canonical profile,\n        // so an exact 100.0 score is not guaranteed after scorer rounding.\n        assertThat(result.topPersonalityMatch().compatibility()).isGreaterThanOrEqualTo(99.0);

        assertThat(result.dimensionMatches())
                .allSatisfy(dimension -> assertFemale(dimension.match(), byId));
        assertThat(result.categoryBestMatches())
                .allSatisfy(match -> assertFemale(match, byId));
        assertThat(result.bottomPersonalityMatches())
                .allSatisfy(match -> assertFemale(match, byId));
    }

    @Test
    void personalitiesEndpointIsSeparatedByRepresentation() throws Exception {
        String femaleBody = mockMvc.perform(get("/api/personalities")
                        .param("representation", PersonalityMatcherService.REPRESENTATION_FEMALE))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        List<Personality> women = objectMapper.readValue(femaleBody, new TypeReference<>() {});

        String defaultBody = mockMvc.perform(get("/api/personalities"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        List<Personality> defaultPool = objectMapper.readValue(defaultBody, new TypeReference<>() {});

        assertThat(women).hasSize(10)
                .allSatisfy(personality -> assertThat(personality.representation()).isEqualTo("female"));
        assertThat(defaultPool)
                .isNotEmpty()
                .noneMatch(personality -> "female".equals(personality.representation()));
    }

    private QuizResult resultFor(String representation) throws Exception {
        var request = get("/api/results/by-axes").param("v", FEMALE_VECTOR);
        if (representation != null) {
            request = request.param("representation", representation);
        }
        String body = mockMvc.perform(request)
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        return objectMapper.readValue(body, QuizResult.class);
    }

    private Map<String, Personality> personalitiesById() {
        return dataService.getPersonalities().stream()
                .collect(Collectors.toMap(Personality::id, Function.identity()));
    }

    private void assertFemale(PersonalityMatch match, Map<String, Personality> byId) {
        assertThat(PersonalityMatcherService.representationOf(byId.get(match.personalityId())))
                .isEqualTo(PersonalityMatcherService.REPRESENTATION_FEMALE);
    }
}
