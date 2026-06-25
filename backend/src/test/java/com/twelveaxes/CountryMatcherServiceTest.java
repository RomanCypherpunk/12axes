package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.CountryMatch;
import com.twelveaxes.service.CountryMatcherService;
import com.twelveaxes.service.QuizDataService;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CountryMatcherServiceTest {
    @Autowired
    private QuizDataService dataService;

    @Autowired
    private CountryMatcherService countryMatcherService;

    @Test
    void everyCountryHasAnExplicitProfile() {
        var countryIds = dataService.getCountries().stream()
                .map(country -> country.id())
                .toList();
        var profileIds = dataService.getCountryProfiles().keySet();

        assertThat(countryIds).hasSize(50);
        assertThat(profileIds).containsExactlyInAnyOrderElementsOf(countryIds);
        assertThat(dataService.getCountries()).allSatisfy(country -> {
            assertThat(country.flagPath()).startsWith("/countries/flags/");
            assertThat(country.flagPath()).doesNotEndWith(".svg");
            assertThat(country.flagPath()).matches(".+\\.(gif|png|jpg|jpeg|webp)$");
            assertThat(country.description()).isNotBlank();
            if (country.historical()) {
                assertThat(country.flagPath()).doesNotEndWith(".gif");
                assertThat(country.flagSourceName()).isEqualTo("Wikimedia Commons");
                assertThat(country.flagSourceUrl()).startsWith("https://commons.wikimedia.org/wiki/");
                assertThat(country.flagKind()).isNotBlank();
            }
        });
    }

    @Test
    void canonicalVectorsMatchTheirOwnCountries() {
        List.of(
                "brasil",
                "suica",
                "china",
                "imperio-romano",
                "sacro-imperio-romano-germanico",
                "uniao-sovietica-urss"
        ).forEach(countryId -> {
            var profile = dataService.getCountryProfiles().get(countryId);

            assertThat(profile)
                    .as("Perfil canonico deve existir para %s", countryId)
                    .isNotNull();

            CountryMatch match = countryMatcherService.findTopMatch(axisResults(profile.vector()));

            assertThat(match.countryId())
                    .as("Vetor canonico de %s deve retornar o proprio pais", countryId)
                    .isEqualTo(countryId);
            assertThat(match.compatibility())
                    .as("Vetor canonico de %s deve ter compatibilidade perfeita", countryId)
                    .isEqualTo(100.0);
        });
    }

    private List<AxisResult> axisResults(Map<String, Double> vector) {
        return dataService.getAxes().stream()
                .map(axis -> {
                    double leftPercent = vector.getOrDefault(axis.id(), 50.0);
                    double rightPercent = Math.round((100.0 - leftPercent) * 10.0) / 10.0;
                    String dominantPole = leftPercent >= rightPercent ? axis.leftPole() : axis.rightPole();
                    return new AxisResult(
                            axis.id(),
                            axis.label(),
                            axis.leftPole(),
                            axis.rightPole(),
                            leftPercent,
                            rightPercent,
                            dominantPole,
                            ""
                    );
                })
                .toList();
    }
}
