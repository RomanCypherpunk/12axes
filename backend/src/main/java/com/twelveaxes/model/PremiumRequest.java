package com.twelveaxes.model;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;

/**
 * Pedido do Relatorio Completo. O resultado e definido pelos 12 valores; as respostas sao opcionais e so servem para
 * mostrar, por eixo, quais perguntas mais pesaram. Sem elas (por exemplo, o link de um resultado aberto em outro
 * aparelho) o relatorio sai igual, apenas sem esse detalhe.
 *
 * @param v os 12 percentuais do polo esquerdo, separados por virgula, na ordem de axes.json
 * @param answers respostas do quiz que produziram esses valores (opcional)
 * @param archetype alternativas das perguntas de arquetipo (opcional)
 * @param values valores completos do quiz de 240 perguntas, categoria -> valor (opcional); com respostas, tem de
 *     acompanha-las, senao elas nao reproduzem o vetor
 */
public record PremiumRequest(
        @NotBlank String v,
        List<SubmittedAnswer> answers,
        Map<String, String> archetype,
        Map<String, String> values
) {
    public PremiumRequest(String v, List<SubmittedAnswer> answers, Map<String, String> archetype) {
        this(v, answers, archetype, null);
    }
}
