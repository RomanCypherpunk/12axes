package com.twelveaxes.model;

/** Entrada de data/glossary.json (e do overlay i18n/en/glossary.json). */
public record GlossaryEntry(
        String id,
        String term,
        String definition
) {
}
