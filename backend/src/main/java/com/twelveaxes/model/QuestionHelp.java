package com.twelveaxes.model;

import java.util.List;

/**
 * Ajuda de leitura de uma pergunta, já resolvida para um idioma.
 *
 * @param simple  a pergunta reescrita em linguagem simples
 * @param example par de cenários do dia a dia (concordar / discordar); null quando a pergunta não tem exemplo
 * @param terms   termos do glossário a destacar no texto da pergunta, com a definição embutida
 */
public record QuestionHelp(
        String simple,
        Example example,
        List<Term> terms
) {
    /** Sempre os dois lados, para nenhum parecer favorecido. */
    public record Example(String agree, String disagree) {}

    /**
     * @param match      trecho exato (sem diferenciar maiúsculas) do texto da pergunta a sublinhar
     * @param term       nome do termo no glossário
     * @param definition definição curta exibida no tooltip
     */
    public record Term(String match, String term, String definition) {}
}
