package com.twelveaxes.service;

import com.twelveaxes.model.Question;
import com.twelveaxes.model.QuestionHelp;
import com.twelveaxes.model.QuestionHelpEntry;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Junta question-help.json às perguntas de um idioma. Pergunta sem entrada fica sem ajuda
 * (o painel mostra só a explicação do eixo); dado malformado derruba o startup.
 */
public final class QuestionHelpResolver {
    private QuestionHelpResolver() {}

    public static List<Question> attach(List<Question> questions, List<QuestionHelpEntry> entries, String source) {
        Map<String, QuestionHelpEntry> byId = new LinkedHashMap<>();
        Set<String> duplicates = new HashSet<>();
        for (QuestionHelpEntry entry : entries) {
            if (byId.put(entry.id(), entry) != null) {
                duplicates.add(entry.id());
            }
            if (isBlank(entry.agree()) || isBlank(entry.disagree())) {
                throw new IllegalStateException(source + ": " + entry.id() + " precisa de 'agree' e 'disagree'");
            }
        }
        if (!duplicates.isEmpty()) {
            throw new IllegalStateException(source + ": ajuda duplicada para: " + duplicates);
        }
        Set<String> questionIds = questions.stream().map(Question::id).collect(Collectors.toSet());
        List<String> unknown = byId.keySet().stream().filter(id -> !questionIds.contains(id)).toList();
        if (!unknown.isEmpty()) {
            throw new IllegalStateException(source + ": ajuda para perguntas inexistentes: " + unknown);
        }
        return questions.stream().map(question -> {
            QuestionHelpEntry entry = byId.get(question.id());
            if (entry == null) {
                return question.withHelp(null);
            }
            return question.withHelp(new QuestionHelp(entry.agree(), entry.disagree(), orNull(entry.note()),
                    orNull(entry.agreeExample()), orNull(entry.disagreeExample())));
        }).toList();
    }

    private static String orNull(String value) {
        return isBlank(value) ? null : value;
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
