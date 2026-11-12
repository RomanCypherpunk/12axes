package com.twelveaxes.model;

import java.util.List;

/**
 * Arvore de decisao de uma categoria dos valores completos: cada no e uma pergunta e cada opcao leva a outro no
 * ({@code next}) ou a um valor final ({@code value}); exatamente um dos dois.
 */
public record ValueTree(String categoryId, String label, String root, List<Node> nodes) {
    public record Option(String text, String next, String value) {}

    public record Node(String id, String text, List<Option> options) {}

    /** Versao enviada ao frontend: textos no idioma pedido; o id da opcao e a posicao dela no no. */
    public record View(String categoryId, String label, String root, List<NodeView> nodes) {}

    public record NodeView(String id, String text, List<OptionView> options) {}

    public record OptionView(String id, String text, String next, String value) {}
}
