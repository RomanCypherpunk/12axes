package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.model.Country;
import com.twelveaxes.model.Party;
import com.twelveaxes.model.QuizResult;
import com.twelveaxes.model.TimelineEntry;
import com.twelveaxes.model.TimelineEra;
import com.twelveaxes.service.EraResolver;
import com.twelveaxes.service.QuizDataService;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class TimelineTest {
    private static final String VECTOR = "70,80,20,30,70,40,60,55,60,25,20,45";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private QuizDataService dataService;

    private QuizResult result(String religion, boolean parties) throws Exception {
        var request = get("/api/results/by-axes").param("v", VECTOR);
        if (religion != null) {
            request = request.param("religion", religion);
        }
        if (!parties) {
            request = request.param("parties", "false");
        }
        String body = mockMvc.perform(request).andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        return objectMapper.readValue(body, QuizResult.class);
    }

    private static long count(List<TimelineEntry> entries, String type) {
        return entries.stream().filter(entry -> entry.type().equals(type)).count();
    }

    @Test
    void everyEraHasFourProfilesSortedByCompatibility() throws Exception {
        for (String religion : new String[] {null, "catholic", "islam", "judaism"}) {
            List<TimelineEra> timeline = result(religion, true).timeline();

            assertThat(timeline).extracting(TimelineEra::key)
                    .containsExactly("antiguidade", "medieval", "moderna", "xix", "xx", "xxi");
            for (TimelineEra era : timeline) {
                assertThat(era.entries()).as("%s com religiao %s", era.key(), religion).hasSize(4);
                assertThat(era.entries())
                        .isSortedAccordingTo((a, b) -> Double.compare(b.compatibility(), a.compatibility()));
            }
        }
    }

    @Test
    void eraCompatibilityIsAnAverageOfTheBestProfilesOfTheEra() throws Exception {
        for (TimelineEra era : result(null, true).timeline()) {
            double best = era.entries().getFirst().compatibility();
            assertThat(era.compatibility()).as(era.key()).isBetween(0.0, 100.0).isLessThanOrEqualTo(best);
        }
        // sem os tetos por tipo, a media dos 10 melhores nunca fica abaixo da media dos 4 exibidos
        // quando os exibidos ja sao os 4 melhores; aqui so exigimos coerencia com o topo da era.
    }

    @Test
    void eachEraRespectsTheLimitPerType() throws Exception {
        for (TimelineEra era : result(null, true).timeline()) {
            // cartao da epoca mais compativel: 4 perfis, ate 3 personalidades, 3 paises e 1 partido
            assertThat(count(era.entries(), "personality")).as(era.key()).isLessThanOrEqualTo(3);
            assertThat(count(era.entries(), "country")).as(era.key()).isLessThanOrEqualTo(3);
            assertThat(count(era.entries(), "party")).as(era.key()).isLessThanOrEqualTo(1);
            assertThat(era.entries()).allSatisfy(entry -> assertThat(onlyOneProfile(entry)).isTrue());
        }
    }

    @Test
    void eachEraHasTwoHighlightsForTheList() throws Exception {
        for (TimelineEra era : result(null, true).timeline()) {
            // lista da linha do tempo: 2 perfis, ate 2 personalidades, 1 pais e 1 partido
            assertThat(era.highlights()).as(era.key()).hasSize(2);
            assertThat(count(era.highlights(), "personality")).as(era.key()).isLessThanOrEqualTo(2);
            assertThat(count(era.highlights(), "country")).as(era.key()).isLessThanOrEqualTo(1);
            assertThat(count(era.highlights(), "party")).as(era.key()).isLessThanOrEqualTo(1);
            assertThat(era.highlights())
                    .isSortedAccordingTo((a, b) -> Double.compare(b.compatibility(), a.compatibility()));
            // o melhor perfil da era e o mesmo no cartao e na lista
            assertThat(era.highlights().getFirst().name()).isEqualTo(era.entries().getFirst().name());
        }
    }

    @Test
    void partiesCanBeLeftOut() throws Exception {
        for (TimelineEra era : result(null, false).timeline()) {
            assertThat(era.entries()).as(era.key()).hasSize(4);
            assertThat(count(era.entries(), "party")).as(era.key()).isZero();
            assertThat(count(era.highlights(), "party")).as(era.key()).isZero();
        }
    }

    @Test
    void profilesLandInTheEraOfTheirDeathOrOrigin() throws Exception {
        boolean sawParty = false;
        for (TimelineEra era : result(null, true).timeline()) {
            for (TimelineEntry entry : era.entries()) {
                int year;
                if (entry.personality() != null) {
                    year = EraResolver.yearOfDeath(entry.personality().lifespan());
                } else if (entry.country() != null) {
                    year = originYear(dataService.getCountryById(entry.country().countryId()));
                } else {
                    sawParty = true;
                    year = entry.party().historical()
                            ? EraResolver.startYear(entry.party().period()).orElseThrow()
                            : 2000;
                }
                assertThat(EraResolver.eraOfYear(year).key()).as(entry.name()).isEqualTo(era.key());
            }
        }
        assertThat(sawParty).as("a linha do tempo traz ao menos um partido").isTrue();
    }

    @Test
    void everyHistoricalCountryAndPartyHasAReadableStartYear() {
        for (Country country : dataService.getCountries()) {
            if (country.historical()) {
                assertThat(EraResolver.startYear(country.period()))
                        .as("periodo de %s", country.id()).isPresent();
            }
        }
        for (Party party : dataService.getParties()) {
            if (party.historical()) {
                assertThat(EraResolver.startYear(party.period()))
                        .as("periodo de %s", party.id()).isPresent();
            }
        }
    }

    private static boolean onlyOneProfile(TimelineEntry entry) {
        int present = (entry.personality() != null ? 1 : 0) + (entry.country() != null ? 1 : 0)
                + (entry.party() != null ? 1 : 0);
        return present == 1;
    }

    // Pais atual = seculo XXI; historico = primeiro ano do periodo.
    private static int originYear(Country country) {
        return country.historical() ? EraResolver.startYear(country.period()).orElseThrow() : 2000;
    }
}
