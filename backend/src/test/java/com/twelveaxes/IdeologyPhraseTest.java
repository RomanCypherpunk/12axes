package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.service.QuizDataService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class IdeologyPhraseTest {
    // Medida da frase de referencia: 126 caracteres / 14 palavras.
    private static final int MAX_CHARS = 150;
    private static final int MAX_WORDS = 18;

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
        assertThat(dataService.getIdeologies()).allSatisfy(ideology -> assertThat(ideology.phrase())
                .as("Frase de %s precisa comecar em primeira pessoa", ideology.id())
                .startsWith("Quero uma sociedade")
                .endsWith("."));
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
