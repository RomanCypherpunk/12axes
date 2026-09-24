package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.Ideology;
import com.twelveaxes.service.QuizDataService;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

// A categoria decide a cor do resultado e do card de compartilhamento
// (frontend/src/utils/ideologyColors.ts): grafia fora da lista cai no cinza do centro.
@SpringBootTest
class IdeologyCategoryTest {
    private static final Map<String, String> PT_TO_EN = Map.of(
            "Esquerda Radical", "Radical Left",
            "Esquerda", "Left",
            "Centro", "Center",
            "Direita", "Right",
            "Extrema Direita", "Far-Right",
            "Terceira Posição", "Third Position",
            "Libertário", "Libertarian",
            "Anarquismo", "Anarchist");

    @Autowired
    private QuizDataService dataService;

    @Test
    void everyPortugueseCategoryIsOneOfTheEight() {
        assertThat(dataService.getIdeologies("pt")).allSatisfy(ideology -> assertThat(PT_TO_EN)
                .as("Categoria de %s fora da lista: %s", ideology.id(), ideology.category())
                .containsKey(ideology.category()));
    }

    @Test
    void everyEnglishCategoryIsTheDirectEquivalentOfThePortugueseOne() {
        Map<String, Ideology> english = dataService.getIdeologies("en").stream()
                .collect(Collectors.toMap(Ideology::id, Function.identity()));

        assertThat(dataService.getIdeologies("pt")).allSatisfy(ideology -> assertThat(english.get(ideology.id()).category())
                .as("Categoria EN de %s", ideology.id())
                .isEqualTo(PT_TO_EN.get(ideology.category())));
    }
}
