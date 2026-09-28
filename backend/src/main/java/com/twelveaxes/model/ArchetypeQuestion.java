package com.twelveaxes.model;

import java.util.List;
import java.util.Map;

/**
 * Pergunta de arquétipo exibida ao fim do quiz. Cada alternativa pontua em
 * mais de um eixo: {@code effects} guarda o leftPercent (0–100) que ela soma a
 * cada eixo, com o mesmo peso de uma pergunta comum. Textos em PT e EN no
 * mesmo arquivo ({@code data/archetype-questions.json}).
 */
public record ArchetypeQuestion(
        String id,
        Map<String, String> label,
        Map<String, String> text,
        List<Option> options
) {
    public record Option(String id, Map<String, String> text, Map<String, Double> effects) {}

    /** Versão enviada ao frontend: só os textos do idioma pedido, sem os efeitos. */
    public record View(String id, String label, String text, List<OptionView> options) {}

    public record OptionView(String id, String text) {}

    public View view(String lang) {
        return new View(
                id,
                localized(label, lang),
                localized(text, lang),
                options.stream().map(option -> new OptionView(option.id(), localized(option.text(), lang))).toList()
        );
    }

    private static String localized(Map<String, String> values, String lang) {
        return com.twelveaxes.service.QuizDataService.localized(values, lang);
    }
}
