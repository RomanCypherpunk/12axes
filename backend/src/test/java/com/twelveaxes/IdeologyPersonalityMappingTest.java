package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.IdeologyMatch;
import com.twelveaxes.model.PersonalityMatch;
import com.twelveaxes.service.PersonalityResolverService;
import com.twelveaxes.service.QuizDataService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class IdeologyPersonalityMappingTest {
    @Autowired
    private QuizDataService dataService;

    @Autowired
    private PersonalityResolverService personalityResolverService;

    @Test
    void everyIdeologyLinksToAnExistingPersonality() {
        assertThat(dataService.getIdeologies())
                .isNotEmpty()
                .allSatisfy(ideology -> {
                    assertThat(ideology.personalityId())
                            .as("Ideologia %s precisa de um personalityId", ideology.id())
                            .isNotBlank();
                    assertThat(dataService.getPersonalityById(ideology.personalityId()))
                            .as("personalityId de %s deve resolver para uma personalidade existente: %s",
                                    ideology.id(), ideology.personalityId())
                            .isNotNull();
                });
    }

    @Test
    void resolvedPersonalityMatchesTheChosenIdeology() {
        dataService.getIdeologies().forEach(ideology -> {
            IdeologyMatch top = new IdeologyMatch(
                    ideology.id(), ideology.name(), ideology.category(),
                    ideology.description(), ideology.description(), 87.3);

            PersonalityMatch personality = personalityResolverService.resolveFor(top);

            assertThat(personality.personalityId())
                    .as("Personalidade retornada deve ser a atrelada à ideologia %s", ideology.id())
                    .isEqualTo(ideology.personalityId());
            assertThat(personality.compatibility())
                    .as("Compatibilidade da personalidade espelha a da ideologia")
                    .isEqualTo(87.3);
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
}
