package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.model.Pole;
import com.twelveaxes.model.Question;
import com.twelveaxes.model.QuestionHelpEntry;
import com.twelveaxes.service.QuestionHelpResolver;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

class QuestionHelpResolverTest {
    private static final ObjectMapper MAPPER = new ObjectMapper();

    private static Question question(String id) {
        return new Question(id, "axis", "texto", Pole.LEFT, 1, null, null);
    }

    private static QuestionHelpEntry entry(String id, String agree, String disagree, String note) {
        return new QuestionHelpEntry(id, agree, disagree, note, null, null);
    }

    @Test
    void attachesHelpAndTurnsBlankNoteIntoNull() {
        List<Question> result = QuestionHelpResolver.attach(
                List.of(question("a"), question("b"), question("c")),
                List.of(entry("a", "sim", "não", "aviso"), entry("b", "sim", "não", "  ")),
                "test");

        assertThat(result.get(0).help().note()).isEqualTo("aviso");
        assertThat(result.get(1).help().note()).isNull();
        assertThat(result.get(2).help()).isNull();
    }

    @Test
    void keepsExamplesAndTurnsBlankOnesIntoNull() {
        List<Question> result = QuestionHelpResolver.attach(
                List.of(question("a")),
                List.of(new QuestionHelpEntry("a", "sim", "não", null, "Suíça", " ")),
                "test");

        assertThat(result.get(0).help().agreeExample()).isEqualTo("Suíça");
        assertThat(result.get(0).help().disagreeExample()).isNull();
    }

    @Test
    void rejectsMalformedEntries() {
        List<Question> questions = List.of(question("a"));
        assertThatThrownBy(() -> QuestionHelpResolver.attach(questions, List.of(entry("a", "sim", " ", null)), "test"))
                .isInstanceOf(IllegalStateException.class);
        assertThatThrownBy(() -> QuestionHelpResolver.attach(questions,
                List.of(entry("a", "sim", "não", null), entry("a", "sim", "não", null)), "test"))
                .isInstanceOf(IllegalStateException.class);
        assertThatThrownBy(() -> QuestionHelpResolver.attach(questions, List.of(entry("x", "sim", "não", null)), "test"))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void everyShippedQuestionIsExplainedInBothLanguages() throws IOException {
        List<Question> questions = read("data/questions-pool.json", new TypeReference<>() {});
        List<QuestionHelpEntry> pt = read("data/question-help.json", new TypeReference<>() {});
        List<QuestionHelpEntry> en = read("data/i18n/en/question-help.json", new TypeReference<>() {});

        assertThat(QuestionHelpResolver.attach(questions, pt, "question-help.json")).allSatisfy(q -> assertThat(q.help()).isNotNull());
        assertThat(QuestionHelpResolver.attach(questions, en, "i18n/en/question-help.json")).allSatisfy(q -> assertThat(q.help()).isNotNull());
    }

    private static <T> T read(String path, TypeReference<T> type) throws IOException {
        try (InputStream input = new ClassPathResource(path).getInputStream()) {
            return MAPPER.readValue(input, type);
        }
    }
}
