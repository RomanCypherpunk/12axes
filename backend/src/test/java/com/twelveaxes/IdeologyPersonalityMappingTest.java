package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.PersonalityMatch;
import com.twelveaxes.service.PersonalityMatcherService;
import com.twelveaxes.service.QuizDataService;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class IdeologyPersonalityMappingTest {
    @Autowired
    private QuizDataService dataService;

    @Autowired
    private PersonalityMatcherService personalityMatcherService;

    @Test
    void everyIdeologyLinksToAnExistingPersonality() {
        assertThat(dataService.getIdeologies())
                .isNotEmpty()
                .allSatisfy(ideology -> {
                    assertThat(ideology.personalityId())
                            .as("Ideology %s must have a personalityId", ideology.id())
                            .isNotBlank();
                    assertThat(dataService.getPersonalityById(ideology.personalityId()))
                            .as("personalityId for %s must resolve to an existing personality: %s",
                                    ideology.id(), ideology.personalityId())
                            .isNotNull();
                });
    }

    @Test
    void everyPersonalityHasAnExplicitProfile() {
        var profileIds = dataService.getPersonalityProfiles().keySet();
        var personalityIds = dataService.getPersonalities().stream()
                .map(personality -> personality.id())
                .toList();

        assertThat(personalityIds).hasSizeGreaterThan(100);
        assertThat(profileIds).containsExactlyInAnyOrderElementsOf(personalityIds);
    }

    @Test
    void everyPersonalityProfileUsesTheTwelveKnownAxes() {
        var axisIds = dataService.getAxes().stream()
                .map(axis -> axis.id())
                .toList();

        assertThat(dataService.getPersonalityProfiles().values())
                .allSatisfy(profile -> {
                    assertThat(profile.vector().keySet())
                            .as("Profile %s must define exactly the known axes", profile.personalityId())
                            .containsExactlyInAnyOrderElementsOf(axisIds);
                    assertThat(profile.vector().values())
                            .as("Profile %s values must be percentages", profile.personalityId())
                            .allSatisfy(value -> assertThat(value).isBetween(0.0, 100.0));
                });
    }

    @Test
    void canonicalPersonalityVectorsMatchTheirOwnPersonalities() {
        List.of(
                "lenin",
                "mao-zedong",
                "adam-smith",
                "hayek",
                "bookchin",
                "hoppe"
        ).forEach(personalityId -> {
            var profile = dataService.getPersonalityProfiles().get(personalityId);

            assertThat(profile)
                    .as("Canonical personality profile must exist for %s", personalityId)
                    .isNotNull();

            PersonalityMatch topMatch = personalityMatcherService.findTopMatch(axisResults(profile.vector()));

            assertThat(topMatch.personalityId())
                    .as("Canonical personality vector for %s must return itself", personalityId)
                    .isEqualTo(personalityId);
            assertThat(topMatch.compatibility())
                    .as("Canonical personality vector for %s must have perfect compatibility", personalityId)
                    .isEqualTo(100.0);
        });
    }

    @Test
    void everyPersonalityHasValidMetadata() {
        assertThat(dataService.getPersonalities())
                .isNotEmpty()
                .allSatisfy(personality -> {
                    assertThat(personality.name()).isNotBlank();
                    assertThat(personality.role()).isNotBlank();
                    assertThat(personality.description()).isNotBlank();
                    assertThat(personality.imagePath()).startsWith("/personalities/portraits/");
                    assertThat(personality.imageSourceUrl()).startsWith("https://");
                });
    }

    @Test
    void everyPersonalityImagePathPointsToAPublicAsset() {
        Path frontendPublic = frontendPublicPath();

        assertThat(dataService.getPersonalities())
                .isNotEmpty()
                .allSatisfy(personality -> {
                    String relativePath = personality.imagePath().replaceFirst("^/+", "");
                    Path imagePath = frontendPublic.resolve(relativePath).normalize();

                    assertThat(imagePath)
                            .as("Image for %s must exist in frontend/public: %s",
                                    personality.id(), personality.imagePath())
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
