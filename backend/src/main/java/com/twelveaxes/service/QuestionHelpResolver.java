package com.twelveaxes.service;

import com.twelveaxes.model.GlossaryEntry;
import com.twelveaxes.model.Question;
import com.twelveaxes.model.QuestionHelp;
import com.twelveaxes.model.QuestionHelpEntry;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Junta question-help.json e glossary.json às perguntas de um idioma.
 * Qualquer erro de dados derruba o startup: um termo que não aparece no texto
 * ou um exemplo só com um lado sumiria em silêncio na tela.
 */
public final class QuestionHelpResolver {
    private QuestionHelpResolver() {}

    /**
     * Devolve cópias das perguntas com a ajuda deste idioma; pergunta sem entrada fica com {@code help} nulo.
     *
     * @param questions perguntas do idioma (o texto já traduzido é onde os trechos são procurados)
     * @param entries   entradas de question-help.json do idioma
     * @param glossary  glossário do idioma, já com fallback aplicado
     * @param source    nome do arquivo, usado nas mensagens de erro
     * @throws IllegalStateException se houver id duplicado ou desconhecido, texto simples vazio,
     *                               exemplo com um lado só, termo inexistente ou trecho ausente do texto
     */
    public static List<Question> attach(
            List<Question> questions,
            List<QuestionHelpEntry> entries,
            List<GlossaryEntry> glossary,
            String source
    ) {
        Map<String, GlossaryEntry> glossaryById = indexGlossary(glossary, source);
        Map<String, QuestionHelpEntry> entriesById = indexEntries(entries, source);

        Set<String> questionIds = questions.stream().map(Question::id).collect(Collectors.toSet());
        List<String> unknown = entriesById.keySet().stream().filter(id -> !questionIds.contains(id)).toList();
        if (!unknown.isEmpty()) {
            throw new IllegalStateException(source + ": ajuda para perguntas inexistentes: " + unknown);
        }

        return questions.stream().map(question -> {
            QuestionHelpEntry entry = entriesById.get(question.id());
            if (entry == null) {
                return question.withHelp(null);
            }
            return question.withHelp(resolve(question, entry, glossaryById, source));
        }).toList();
    }

    /**
     * Aplica o overlay de um idioma ao glossário base: cada campo usa o texto traduzido quando
     * existe e não está em branco, senão mantém o da base. Termos só do overlay são ignorados.
     */
    public static List<GlossaryEntry> overlayGlossary(List<GlossaryEntry> base, List<GlossaryEntry> overlay) {
        Map<String, GlossaryEntry> overlayById = overlay.stream()
                .collect(Collectors.toMap(GlossaryEntry::id, Function.identity(), (a, b) -> b));
        return base.stream().map(entry -> {
            GlossaryEntry tr = overlayById.get(entry.id());
            if (tr == null) {
                return entry;
            }
            return new GlossaryEntry(
                    entry.id(),
                    isBlank(tr.term()) ? entry.term() : tr.term(),
                    isBlank(tr.definition()) ? entry.definition() : tr.definition()
            );
        }).toList();
    }

    private static QuestionHelp resolve(
            Question question,
            QuestionHelpEntry entry,
            Map<String, GlossaryEntry> glossaryById,
            String source
    ) {
        String where = source + "/" + question.id();
        if (isBlank(entry.simple())) {
            throw new IllegalStateException(where + ": 'simple' é obrigatório");
        }
        QuestionHelp.Example example = entry.example();
        if (example != null && (isBlank(example.agree()) || isBlank(example.disagree()))) {
            throw new IllegalStateException(where + ": exemplo precisa de 'agree' e 'disagree'");
        }

        String haystack = question.text().toLowerCase(Locale.ROOT);
        List<QuestionHelp.Term> terms = new ArrayList<>();
        for (QuestionHelpEntry.TermRef ref : entry.terms() == null ? List.<QuestionHelpEntry.TermRef>of() : entry.terms()) {
            GlossaryEntry glossaryEntry = glossaryById.get(ref.termId());
            if (glossaryEntry == null) {
                throw new IllegalStateException(where + ": termo inexistente no glossário: " + ref.termId());
            }
            if (isBlank(ref.match()) || !haystack.contains(ref.match().toLowerCase(Locale.ROOT))) {
                throw new IllegalStateException(where + ": trecho '" + ref.match() + "' não aparece no texto da pergunta");
            }
            terms.add(new QuestionHelp.Term(ref.match(), glossaryEntry.term(), glossaryEntry.definition()));
        }
        return new QuestionHelp(entry.simple(), example, List.copyOf(terms));
    }

    private static Map<String, GlossaryEntry> indexGlossary(List<GlossaryEntry> glossary, String source) {
        Map<String, GlossaryEntry> byId = new LinkedHashMap<>();
        for (GlossaryEntry entry : glossary) {
            if (isBlank(entry.term()) || isBlank(entry.definition())) {
                throw new IllegalStateException(source + ": termo de glossário incompleto: " + entry.id());
            }
            if (byId.put(entry.id(), entry) != null) {
                throw new IllegalStateException(source + ": id duplicado no glossário: " + entry.id());
            }
        }
        return byId;
    }

    private static Map<String, QuestionHelpEntry> indexEntries(List<QuestionHelpEntry> entries, String source) {
        Map<String, QuestionHelpEntry> byId = new LinkedHashMap<>();
        Set<String> duplicates = new HashSet<>();
        for (QuestionHelpEntry entry : entries) {
            if (byId.put(entry.id(), entry) != null) {
                duplicates.add(entry.id());
            }
        }
        if (!duplicates.isEmpty()) {
            throw new IllegalStateException(source + ": ajuda duplicada para: " + duplicates);
        }
        return byId;
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
