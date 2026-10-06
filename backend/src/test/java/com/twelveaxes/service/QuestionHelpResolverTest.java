package com.twelveaxes.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.twelveaxes.model.GlossaryEntry;
import com.twelveaxes.model.Pole;
import com.twelveaxes.model.Question;
import com.twelveaxes.model.QuestionHelp;
import com.twelveaxes.model.QuestionHelpEntry;
import java.util.List;
import org.junit.jupiter.api.Test;

class QuestionHelpResolverTest {
    private static final Question QUESTION = new Question(
            "controle_03", "controle", "O Banco Central deve obedecer ao governo.", Pole.LEFT, 1, null);
    private static final List<GlossaryEntry> GLOSSARY = List.of(
            new GlossaryEntry("banco_central", "Banco Central", "Cuida da moeda."));
    private static final QuestionHelp.Example EXAMPLE = new QuestionHelp.Example("Sim.", "Não.");

    private static QuestionHelpEntry entry(String simple, QuestionHelp.Example example, String termId, String match) {
        return new QuestionHelpEntry("controle_03", simple, example,
                List.of(new QuestionHelpEntry.TermRef(termId, match)));
    }

    @Test
    void attachesHelpWithGlossaryDefinitionInlined() {
        List<Question> result = QuestionHelpResolver.attach(
                List.of(QUESTION), List.of(entry("Simples.", EXAMPLE, "banco_central", "banco central")), GLOSSARY, "t");

        QuestionHelp help = result.get(0).help();
        assertThat(help.simple()).isEqualTo("Simples.");
        assertThat(help.example()).isEqualTo(EXAMPLE);
        assertThat(help.terms()).containsExactly(
                new QuestionHelp.Term("banco central", "Banco Central", "Cuida da moeda."));
    }

    @Test
    void questionWithoutEntryHasNoHelp() {
        Question withStaleHelp = QUESTION.withHelp(new QuestionHelp("x", null, List.of()));

        List<Question> result = QuestionHelpResolver.attach(List.of(withStaleHelp), List.of(), GLOSSARY, "t");

        assertThat(result.get(0).help()).isNull();
    }

    @Test
    void exampleIsOptional() {
        List<Question> result = QuestionHelpResolver.attach(
                List.of(QUESTION), List.of(entry("Simples.", null, "banco_central", "Banco Central")), GLOSSARY, "t");

        assertThat(result.get(0).help().example()).isNull();
    }

    @Test
    void rejectsOneSidedExample() {
        QuestionHelp.Example oneSided = new QuestionHelp.Example("Sim.", " ");

        assertThatThrownBy(() -> QuestionHelpResolver.attach(
                List.of(QUESTION), List.of(entry("Simples.", oneSided, "banco_central", "Banco Central")), GLOSSARY, "t"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("agree");
    }

    @Test
    void rejectsMissingSimpleText() {
        assertThatThrownBy(() -> QuestionHelpResolver.attach(
                List.of(QUESTION), List.of(entry("", EXAMPLE, "banco_central", "Banco Central")), GLOSSARY, "t"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("simple");
    }

    @Test
    void rejectsMatchThatIsNotInQuestionText() {
        assertThatThrownBy(() -> QuestionHelpResolver.attach(
                List.of(QUESTION), List.of(entry("Simples.", EXAMPLE, "banco_central", "juros")), GLOSSARY, "t"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("juros");
    }

    @Test
    void rejectsUnknownGlossaryTerm() {
        assertThatThrownBy(() -> QuestionHelpResolver.attach(
                List.of(QUESTION), List.of(entry("Simples.", EXAMPLE, "tarifa", "Banco Central")), GLOSSARY, "t"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("tarifa");
    }

    @Test
    void rejectsHelpForUnknownQuestion() {
        QuestionHelpEntry orphan = new QuestionHelpEntry("nao_existe", "Simples.", null, List.of());

        assertThatThrownBy(() -> QuestionHelpResolver.attach(List.of(QUESTION), List.of(orphan), GLOSSARY, "t"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("nao_existe");
    }

    @Test
    void rejectsDuplicateHelpEntries() {
        QuestionHelpEntry help = entry("Simples.", null, "banco_central", "Banco Central");

        assertThatThrownBy(() -> QuestionHelpResolver.attach(List.of(QUESTION), List.of(help, help), GLOSSARY, "t"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("duplicada");
    }

    @Test
    void overlayGlossaryFallsBackToBaseText() {
        List<GlossaryEntry> base = List.of(
                new GlossaryEntry("banco_central", "Banco Central", "Cuida da moeda."),
                new GlossaryEntry("tarifa", "Tarifa", "Imposto de importação."));
        List<GlossaryEntry> overlay = List.of(new GlossaryEntry("banco_central", "Central bank", "Manages money."));

        assertThat(QuestionHelpResolver.overlayGlossary(base, overlay)).containsExactly(
                new GlossaryEntry("banco_central", "Central bank", "Manages money."),
                new GlossaryEntry("tarifa", "Tarifa", "Imposto de importação."));
    }
}
