package com.twelveaxes.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import java.util.Map;

public record ResultRequest(
        @NotEmpty List<@Valid SubmittedAnswer> answers,
        String variant,
        // Perguntas de arquétipo do fim do quiz: id da pergunta -> id da alternativa.
        // Opcional: quem pula (ou clientes antigos) manda nulo ou vazio.
        Map<String, String> archetype,
        // Valores completos do quiz de 240 perguntas: id da categoria -> id do valor (um por categoria).
        // Opcional: só o quiz de 240 com a árvore de valores envia; nulo ou vazio = como antes.
        Map<String, String> values
) {
    public ResultRequest(List<SubmittedAnswer> answers) {
        this(answers, "short", null, null);
    }

    public ResultRequest(List<SubmittedAnswer> answers, String variant) {
        this(answers, variant, null, null);
    }

    public ResultRequest(List<SubmittedAnswer> answers, String variant, Map<String, String> archetype) {
        this(answers, variant, archetype, null);
    }
}
