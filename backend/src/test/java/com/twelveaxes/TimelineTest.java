package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Country;
import com.twelveaxes.model.Party;
import com.twelveaxes.model.TimelineEntry;
import com.twelveaxes.model.TimelineEra;
import com.twelveaxes.service.EraResolver;
import com.twelveaxes.service.QuizDataService;
import com.twelveaxes.service.ScoringService;
import com.twelveaxes.service.TimelineService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class TimelineTest {
    @Autowired
    private TimelineService timelineService;

    @Autowired
    private ScoringService scoringService;

    @Autowired
    private QuizDataService dataService;

    private List<TimelineEra> timeline(String religion, boolean parties) {
        List<AxisResult> axes = scoringService.score(TestAnswers.mixed(dataService), "pt");
        return timelineService.build(axes, "pt", religion, parties);
    }

    private static long count(List<TimelineEntry> entries, String type) {
        return entries.stream().filter(entry -> entry.type().equals(type)).count();
    }

    @Test
    void everyEraHasFourProfilesSortedByCompatibility() {
        for (String religion : new String[] {null, "catholic", "islam", "judaism"}) {
            List<TimelineEra> timeline = timeline(religion, true);

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
    void eraCompatibilityIsAnAverageOfTheBestProfilesOfTheEra() {
        for (TimelineEra era : timeline(null, true)) {
            double best = era.entries().getFirst().compatibility();
            assertThat(era.compatibility()).as(era.key()).isBetween(0.0, 100.0).isLessThanOrEqualTo(best);
        }
        // sem os tetos por tipo, a media dos 10 melhores nunca fica abaixo da media dos 4 exibidos
        // quando os exibidos ja sao os 4 melhores; aqui so exigimos coerencia com o topo da era.
    }

    @Test
    void eachEraRespectsTheLimitPerType() {
        for (TimelineEra era : timeline(null, true)) {
            // cartao da epoca mais compativel: 4 perfis, ate 3 personalidades, 3 paises e 1 partido
            assertThat(count(era.entries(), "personality")).as(era.key()).isLessThanOrEqualTo(3);
            assertThat(count(era.entries(), "country")).as(era.key()).isLessThanOrEqualTo(3);
            assertThat(count(era.entries(), "party")).as(era.key()).isLessThanOrEqualTo(1);
            assertThat(era.entries()).allSatisfy(entry -> assertThat(onlyOneProfile(entry)).isTrue());
        }
    }

    @Test
    void eachEraHasTwoHighlightsForTheList() {
        for (TimelineEra era : timeline(null, true)) {
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
    void partiesCanBeLeftOut() {
        for (TimelineEra era : timeline(null, false)) {
            assertThat(era.entries()).as(era.key()).hasSize(4);
            assertThat(count(era.entries(), "party")).as(era.key()).isZero();
            assertThat(count(era.highlights(), "party")).as(era.key()).isZero();
        }
    }

    @Test
    void profilesLandInTheEraOfTheirDeathOrOrigin() {
        boolean sawParty = false;
        for (TimelineEra era : timeline(null, true)) {
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
