package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.service.QuizDataService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class IdeologyPhraseTest {
    // A frase e livre na redacao, mas cabe num card: media observada 135
    // caracteres / 20 palavras.
    private static final int MAX_CHARS = 170;
    private static final int MAX_WORDS = 25;

    @Autowired
    private QuizDataService dataService;

    @Test
    void everyIdeologyHasAPhrase() {
        assertThat(dataService.getIdeologies())
                .isNotEmpty()
                .allSatisfy(ideology -> assertThat(ideology.phrase())
                        .as("Ideologia %s precisa de frase", ideology.id())
                        .isNotBlank());
    }

    // A frase e um card de destaque: passar do tamanho quebra o layout e destoa
    // das demais.
    @Test
    void everyPhraseFitsTheCardSize() {
        assertThat(dataService.getIdeologies()).allSatisfy(ideology -> {
            String phrase = ideology.phrase();
            assertThat(phrase.length())
                    .as("Frase de %s tem %d caracteres", ideology.id(), phrase.length())
                    .isLessThanOrEqualTo(MAX_CHARS);
            assertThat(phrase.split("\\s+").length)
                    .as("Frase de %s tem %d palavras", ideology.id(), phrase.split("\\s+").length)
                    .isLessThanOrEqualTo(MAX_WORDS);
        });
    }

    @Test
    void everyPhraseFollowsTheFirstPersonStructure() {
        assertThat(dataService.getIdeologies()).allSatisfy(ideology -> {
            assertThat(ideology.phrase())
                    .as("Frase de %s precisa comecar em primeira pessoa: %s", ideology.id(), ideology.phrase())
                    .startsWith("Quero");
            assertThat(ideology.phrase())
                    .as("Frase de %s precisa terminar com ponto: %s", ideology.id(), ideology.phrase())
                    .endsWith(".");
        });
    }

    // Frases repetidas entre ideologias nao distinguem nada.
    @Test
    void phrasesAreUniqueAcrossTheCatalog() {
        var frases = dataService.getIdeologies().stream()
                .map(ideology -> ideology.phrase())
                .toList();

        assertThat(frases).doesNotHaveDuplicates();
    }
}
