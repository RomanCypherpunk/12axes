package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.CountryMatch;
import com.twelveaxes.model.IdeologyMatch;
import com.twelveaxes.service.CountryResolverService;
import com.twelveaxes.service.QuizDataService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class IdeologyCountryMappingTest {
    @Autowired
    private QuizDataService dataService;

    @Autowired
    private CountryResolverService countryResolverService;

    @Test
    void everyIdeologyLinksToAnExistingCountry() {
        assertThat(dataService.getIdeologies())
                .isNotEmpty()
                .allSatisfy(ideology -> {
                    assertThat(ideology.countryId())
                            .as("Ideologia %s precisa de um countryId", ideology.id())
                            .isNotBlank();
                    assertThat(dataService.getCountryById(ideology.countryId()))
                            .as("countryId de %s deve resolver para um país existente: %s",
                                    ideology.id(), ideology.countryId())
                            .isNotNull();
                });
    }

    @Test
    void resolvedCountryMatchesTheChosenIdeology() {
        dataService.getIdeologies().forEach(ideology -> {
            IdeologyMatch top = new IdeologyMatch(
                    ideology.id(), ideology.name(), ideology.category(),
                    ideology.description(), ideology.description(), 87.3);

            CountryMatch country = countryResolverService.resolveFor(top);

            assertThat(country.countryId())
                    .as("País retornado deve ser o atrelado à ideologia %s", ideology.id())
                    .isEqualTo(ideology.countryId());
            assertThat(country.compatibility())
                    .as("Compatibilidade do país espelha a da ideologia")
                    .isEqualTo(87.3);
        });
    }

    @Test
    void everyCountryFlagIsAValidRasterAsset() {
        assertThat(dataService.getCountries())
                .hasSize(70)
                .allSatisfy(country -> {
                    assertThat(country.flagPath()).startsWith("/countries/flags/");
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
}
