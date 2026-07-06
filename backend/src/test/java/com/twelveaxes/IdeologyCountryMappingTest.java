package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.CountryMatch;
import com.twelveaxes.service.CountryMatcherService;
import com.twelveaxes.service.QuizDataService;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class IdeologyCountryMappingTest {
    @Autowired
    private QuizDataService dataService;

    @Autowired
    private CountryMatcherService countryMatcherService;

    @Test
    void everyCountryHasAnExplicitProfile() {
        var profileIds = dataService.getCountryProfiles().keySet();
        var countryIds = dataService.getCountries().stream()
                .map(country -> country.id())
                .toList();

        assertThat(dataService.getCountries()).hasSizeGreaterThan(100);
        assertThat(profileIds).containsExactlyInAnyOrderElementsOf(countryIds);
    }

    @Test
    void everyCountryProfileUsesTheTwelveKnownAxes() {
        var axisIds = dataService.getAxes().stream()
                .map(axis -> axis.id())
                .toList();

        assertThat(dataService.getCountryProfiles().values())
                .allSatisfy(profile -> {
                    assertThat(profile.vector().keySet())
                            .as("Country profile %s must define exactly the known axes", profile.countryId())
                            .containsExactlyInAnyOrderElementsOf(axisIds);
                    assertThat(profile.vector().values())
                            .as("Country profile %s values must be percentages", profile.countryId())
                            .allSatisfy(value -> assertThat(value).isBetween(0.0, 100.0));
                });
    }

    @Test
    void countryMatchIsDrivenPurelyByVectorProximity() {
        var countryProfile = dataService.getCountryProfiles().get("islandia-medieval");
        CountryMatch country = countryMatcherService.findTopMatch(
                axisResults(countryProfile.vector())
        );

        assertThat(country.countryId()).isEqualTo("islandia-medieval");
        assertThat(country.compatibility()).isGreaterThan(99.0);
    }

    @Test
    void everyCountryFlagIsAValidRasterAsset() {
        assertThat(dataService.getCountries())
                .hasSizeGreaterThan(100)
                .allSatisfy(country -> {
                    assertThat(country.flagPath()).startsWith("/countries/flags/");
                    assertThat(country.flagPath()).matches(".+\\.(gif|png|jpg|jpeg|webp)$");
                    assertThat(country.description()).isNotBlank();
                    if (country.historical()) {
                        assertThat(country.flagSourceName()).isEqualTo("Wikimedia Commons");
                        assertThat(country.flagSourceUrl()).startsWith("https://commons.wikimedia.org/wiki/");
                        assertThat(country.flagKind()).isNotBlank();
                    }
                });
    }

    @Test
    void everyCountryFlagPathPointsToAPublicAsset() {
        Path frontendPublic = frontendPublicPath();

        assertThat(dataService.getCountries())
                .isNotEmpty()
                .allSatisfy(country -> {
                    String relativePath = country.flagPath().replaceFirst("^/+", "");
                    Path imagePath = frontendPublic.resolve(relativePath).normalize();

                    assertThat(imagePath)
                            .as("Flag for %s must exist in frontend/public: %s", country.id(), country.flagPath())
                            .isRegularFile();
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

    private Path frontendPublicPath() {
        Path cwd = Path.of(System.getProperty("user.dir")).toAbsolutePath();
        Path fromBackend = cwd.resolve("../frontend/public").normalize();
        if (fromBackend.toFile().isDirectory()) {
            return fromBackend;
        }
        return cwd.resolve("frontend/public").normalize();
    }
}
