package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.CountryMatch;
import com.twelveaxes.model.IdeologyMatch;
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

        assertThat(dataService.getCountries()).hasSize(70);
        assertThat(profileIds).containsExactlyInAnyOrderElementsOf(countryIds);
    }

    @Test
    void everyCountryProfileUsesTheTwelveKnownAxesAndSystemTags() {
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
                    assertThat(profile.tags())
                            .as("Country profile %s must declare system tags", profile.countryId())
                            .isNotEmpty()
                            .allSatisfy(tag -> assertThat(tag).isNotBlank());
                });
    }

    @Test
    void monarchistFederativeProfileOnlyReturnsMonarchyFederationCandidates() {
        var ideologyProfile = dataService.getIdeologyProfiles().get("monarquia-federativa");
        CountryMatch country = countryMatcherService.findTopMatch(
                axisResults(ideologyProfile.vector()),
                ideologyMatch("monarquia-federativa", "Direita Libertaria", 91.0)
        );

        assertThat(country.tags()).contains("monarquia", "federacao");
    }

    @Test
    void anarchoCapitalistProfileOnlyReturnsAnarchistCapitalistCandidates() {
        var ideologyProfile = dataService.getIdeologyProfiles().get("anarcocapitalismo");
        CountryMatch country = countryMatcherService.findTopMatch(
                axisResults(ideologyProfile.vector()),
                ideologyMatch("anarcocapitalismo", "Direita Libertaria", 91.0)
        );

        assertThat(country.tags()).contains("anarquia", "capitalismo");
    }

    @Test
    void countryCompatibilityIsScoredIndependentlyFromIdeologyCompatibility() {
        var countryProfile = dataService.getCountryProfiles().get("islandia-medieval");
        CountryMatch country = countryMatcherService.findTopMatch(
                axisResults(countryProfile.vector()),
                ideologyMatch("anarcocapitalismo", "Direita Libertaria", 12.3)
        );

        assertThat(country.countryId()).isEqualTo("islandia-medieval");
        assertThat(country.compatibility()).isGreaterThan(99.0);
        assertThat(country.compatibility()).isNotEqualTo(12.3);
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

    private IdeologyMatch ideologyMatch(String id, String category, double compatibility) {
        return new IdeologyMatch(id, id, category, "", "", compatibility);
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
