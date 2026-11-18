package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AreaCountryMatch;
import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Country;
import com.twelveaxes.model.CountryProfile;
import com.twelveaxes.service.AreaCountryMatcherService;
import com.twelveaxes.service.QuizDataService;
import com.twelveaxes.service.ScoringService;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class AreaCountryMatcherServiceTest {
    private static final List<String> AREAS =
            List.of("politico", "externa", "territorial", "economico", "sociedade", "tecnologia");

    @Autowired
    private AreaCountryMatcherService service;

    @Autowired
    private QuizDataService dataService;

    @Autowired
    private ScoringService scoringService;

    @Test
    void everyAreaWeightsSumToOneAndTheMainAxesGetExactlyHalf() {
        for (String area : AREAS) {
            Map<String, Double> weights = AreaCountryMatcherService.weights(area);
            List<String> main = AreaCountryMatcherService.mainAxes(area);

            assertThat(weights).as(area).hasSize(12);
            assertThat(weights.values().stream().mapToDouble(Double::doubleValue).sum()).as(area).isCloseTo(1.0, org.assertj.core.data.Offset.offset(1e-9));
            assertThat(main.stream().mapToDouble(weights::get).sum()).as(area).isCloseTo(0.5, org.assertj.core.data.Offset.offset(1e-9));
        }
    }

    @Test
    void theMainAxesAreTheOnesTheAuthorDefined() {
        assertThat(AreaCountryMatcherService.mainAxes("politico")).containsExactlyInAnyOrder("representacao", "estrutura");
        assertThat(AreaCountryMatcherService.mainAxes("externa")).containsExactlyInAnyOrder("intervencao", "diplomacia", "comercio");
        assertThat(AreaCountryMatcherService.mainAxes("territorial")).containsExactly("estrutura");
        assertThat(AreaCountryMatcherService.mainAxes("economico")).containsExactlyInAnyOrder("economia", "controle", "comercio");
        assertThat(AreaCountryMatcherService.mainAxes("sociedade")).containsExactlyInAnyOrder("imigracao", "moral", "religiao");
        assertThat(AreaCountryMatcherService.mainAxes("tecnologia")).containsExactlyInAnyOrder("tecnologia", "moral");
    }

    @Test
    void aUserWithTheExactProfileOfACurrentCountryGetsThatCountryInEveryArea() {
        Country country = dataService.getCountries("pt").stream()
                .filter(c -> !c.historical() && !c.region())
                .filter(c -> dataService.getCountryProfiles().get(c.id()) != null)
                .findFirst().orElseThrow();
        CountryProfile profile = dataService.getCountryProfiles().get(country.id());
        List<Double> leftPercents = dataService.getAxes("pt").stream().map(axis -> profile.vector().get(axis.id())).toList();
        List<AxisResult> axes = scoringService.scoreFromLeftPercents(leftPercents, "pt");

        List<AreaCountryMatch> matches = service.findAll(axes, "pt", null);

        assertThat(matches.stream().map(AreaCountryMatch::area)).containsExactlyElementsOf(AREAS);
        assertThat(matches).allSatisfy(match -> {
            assertThat(match.country().countryId()).isEqualTo(country.id());
            assertThat(match.country().compatibility()).isGreaterThanOrEqualTo(99.9);
        });
    }

    @Test
    void onlyCurrentCountriesAreSuggested() {
        List<AxisResult> axes = scoringService.scoreFromLeftPercents(java.util.Collections.nCopies(12, 50.0), "es");

        List<AreaCountryMatch> matches = service.findAll(axes, "es", null);

        assertThat(matches).hasSize(6);
        assertThat(matches).allSatisfy(match -> assertThat(match.country().historical()).isFalse());
        assertThat(matches).allSatisfy(match -> assertThat(match.country().name()).isNotBlank());
    }

    @Test
    void regionsAreMarkedInTheCatalogAndNeverSuggestedByArea() {
        // Toda entrada atual cujo nome traz o pais entre parenteses ("Texas (Estados Unidos)") e uma regiao; as demais nao.
        for (Country country : dataService.getCountries("pt")) {
            boolean looksLikeRegion = !country.historical() && country.name().matches(".*\\(.+\\)\\s*$");
            assertThat(country.region()).as(country.id()).isEqualTo(looksLikeRegion);
        }
        assertThat(dataService.getCountryById("eua-texas", "pt").region()).isTrue();
        assertThat(dataService.getCountryById("dubai", "pt").region()).isTrue();
        assertThat(dataService.getCountryById("hong-kong", "pt").region()).isTrue();
        assertThat(dataService.getCountryById("suica-zug", "pt").region()).isTrue();
        assertThat(dataService.getCountryById("brasil", "pt").region()).isFalse();
        assertThat(dataService.getCountryById("espanha", "pt").region()).isFalse();

        // Perfis de varios tipos (centro, extremos e o conservador que antes ganhava com Texas e Florida): nenhuma area traz regiao.
        List<List<Double>> users = List.of(
                java.util.Collections.nCopies(12, 50.0),
                java.util.Collections.nCopies(12, 5.0),
                java.util.Collections.nCopies(12, 95.0),
                List.of(70.0, 25.0, 75.0, 85.0, 70.0, 20.0, 15.0, 25.0, 75.0, 80.0, 90.0, 20.0));
        for (List<Double> user : users) {
            List<AreaCountryMatch> matches = service.findAll(scoringService.scoreFromLeftPercents(user, "pt"), "pt", null);
            assertThat(matches).hasSize(6);
            assertThat(matches).allSatisfy(match ->
                    assertThat(dataService.getCountryById(match.country().countryId(), "pt").region()).as(match.country().name()).isFalse());
        }
    }
}
