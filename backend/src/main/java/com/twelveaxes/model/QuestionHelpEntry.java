package com.twelveaxes.model;

import java.util.List;

/**
 * Entrada de data/question-help.json (e do overlay i18n/en/question-help.json).
 * Os termos apontam para o glossário por id; o trecho a sublinhar é por idioma,
 * porque a mesma palavra muda de forma entre PT e EN.
 */
public record QuestionHelpEntry(
        String id,
        String simple,
        QuestionHelp.Example example,
        List<TermRef> terms
) {
    public record TermRef(String termId, String match) {}
}
