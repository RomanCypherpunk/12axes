package com.twelveaxes.model;

/** Entrada de data/question-help.json (e do overlay i18n/en/question-help.json). */
public record QuestionHelpEntry(String id, String agree, String disagree, String note,
                                String agreeExample, String disagreeExample) {
}
