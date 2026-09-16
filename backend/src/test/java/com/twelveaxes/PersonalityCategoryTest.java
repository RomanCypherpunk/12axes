package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.service.QuizDataService;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class PersonalityCategoryTest {
    private static final Set<String> CATEGORIAS_VALIDAS = Set.of(
            "politico", "religioso", "economista", "filosofo",
            "teorico", "empresario", "intelectual", "ativista"
    );

    @Autowired
    private QuizDataService dataService;

    @Test
    void everyPersonalityHasAValidCategory() {
        assertThat(dataService.getPersonalities())
                .isNotEmpty()
                .allSatisfy(personality -> assertThat(personality.category())
                        .as("Personalidade %s precisa de categoria valida", personality.id())
                        .isIn(CATEGORIAS_VALIDAS));
    }

    @Test
    void everyCategoryHasAtLeastOnePersonality() {
        var usadas = dataService.getPersonalities().stream()
                .map(personality -> personality.category())
                .distinct()
                .toList();

        assertThat(usadas).containsExactlyInAnyOrderElementsOf(CATEGORIAS_VALIDAS);
    }

    // O catalogo EN traduz nome, papel e descricao, mas a categoria e a mesma:
    // ela classifica a figura historica, nao o texto exibido.
    @Test
    void englishCatalogKeepsTheSameCategories() {
        var pt = dataService.getPersonalities(QuizDataService.LANG_PT);
        var en = dataService.getPersonalities(QuizDataService.LANG_EN);

        assertThat(en).hasSameSizeAs(pt);
        assertThat(en).allSatisfy(personality -> assertThat(personality.category())
                .as("Personalidade %s precisa de categoria no catalogo EN", personality.id())
                .isIn(CATEGORIAS_VALIDAS));
    }
}
