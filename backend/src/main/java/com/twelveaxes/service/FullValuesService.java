package com.twelveaxes.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.model.FullValue;
import com.twelveaxes.model.ValueTree;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * Valores completos do quiz de 240 perguntas: o usuario percorre uma arvore de escolhas por categoria e cada
 * categoria termina em UM valor fixo, sem intensidade. Cada valor tambem pontua em 1 a 3 eixos (com peso 2 no
 * ScoringService). O neutro ("equilibrado") nao tem efeito.
 *
 * As 8 categorias existem sempre, nesta ordem (e ela que define os espacos da chave do link). Uma categoria sem
 * valores esta "pendente": fica no catalogo, mas nao tem arvore e ninguem pode escolher valor nela.
 * Dados em data/full-values.json (portugues, fonte) e data/i18n/en/full-values.json; campo sem traducao usa o portugues.
 */
@Service
public class FullValuesService {
    /** Ordem fixa das categorias: cada uma e um espaco de 6 bits da chave `f` do link. */
    public static final List<String> CATEGORY_IDS = List.of(
            "politica", "tecnologia", "economia", "cultura", "controle_social", "politica_externa", "nacao",
            "organizacao_territorial");
    /** Indice 0 da chave significa "sem valor"; sobram 63 valores por categoria (6 bits). */
    static final int MAX_VALUES_PER_CATEGORY = 63;
    private static final int MAX_EFFECT_AXES = 3;

    private final List<Category> categories;
    private final Map<String, Map<String, String>> englishText;

    @Autowired
    public FullValuesService(ObjectMapper objectMapper) throws IOException {
        this(parse(objectMapper, read("data/full-values.json"), read("data/i18n/en/full-values.json")));
    }

    private FullValuesService(Loaded loaded) {
        this.categories = loaded.categories();
        this.englishText = loaded.englishText();
    }

    /** Monta o servico a partir de JSON ja lido; usado nos testes de dados invalidos. */
    public static FullValuesService fromJson(ObjectMapper objectMapper, String ptJson, String enJson) {
        try {
            return new FullValuesService(parse(objectMapper, ptJson, enJson));
        } catch (IOException exception) {
            throw new IllegalStateException("Valores completos: JSON ilegivel", exception);
        }
    }

    /** As 8 categorias, na ordem fixa. */
    public List<String> categoryIds() {
        return categories.stream().map(Category::id).toList();
    }

    /** Arvores das categorias que ja tem conteudo, na ordem das categorias. */
    public List<ValueTree.View> trees(String lang) {
        String normalized = QuizDataService.normalizeLang(lang);
        List<ValueTree.View> views = new ArrayList<>();
        for (Category category : categories) {
            if (category.pending()) {
                continue;
            }
            List<ValueTree.NodeView> nodes = new ArrayList<>();
            for (ValueTree.Node node : category.nodes()) {
                List<ValueTree.OptionView> options = new ArrayList<>();
                for (int i = 0; i < node.options().size(); i++) {
                    ValueTree.Option option = node.options().get(i);
                    options.add(new ValueTree.OptionView(String.valueOf(i),
                            text(normalized, node.id() + "." + i, "text", option.text()), option.next(), option.value()));
                }
                nodes.add(new ValueTree.NodeView(node.id(), text(normalized, node.id(), "text", node.text()), options));
            }
            views.add(new ValueTree.View(category.id(), text(normalized, category.id(), "label", category.label()),
                    category.root(), nodes));
        }
        return views;
    }

    /** O valor da categoria, ou 400 se a categoria ou o valor nao existem (ou a categoria esta pendente). */
    public Value value(String categoryId, String valueId) {
        Category category = categories.stream().filter(candidate -> candidate.id().equals(categoryId)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Categoria de valor desconhecida: " + categoryId));
        return category.values().stream().filter(candidate -> candidate.id().equals(valueId)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Valor desconhecido na categoria " + categoryId + ": " + valueId));
    }

    /** Os valores escolhidos (categoria -> valor) ja no idioma pedido, na ordem das categorias. */
    public List<FullValue> resolve(Map<String, String> chosen, String lang) {
        String normalized = QuizDataService.normalizeLang(lang);
        List<FullValue> result = new ArrayList<>();
        for (Category category : categories) {
            String valueId = chosen.get(category.id());
            if (valueId == null) {
                continue;
            }
            Value value = value(category.id(), valueId);
            result.add(new FullValue(
                    category.id(),
                    text(normalized, category.id(), "label", category.label()),
                    value.id(),
                    text(normalized, value.id(), "name", value.name()),
                    text(normalized, value.id(), "description", value.description()),
                    value.neutral(),
                    value.icon()));
        }
        return result;
    }

    /**
     * Chave `f` dos valores escolhidos, ou vazio se nao ha nenhum. O indice de cada valor e a posicao dele (1-based)
     * em {@code values} da categoria; por isso a ordem dos valores nunca muda (so se acrescenta no fim).
     */
    public Optional<String> encodeKey(Map<String, String> chosen) {
        if (chosen == null || chosen.isEmpty()) {
            return Optional.empty();
        }
        int[] slots = new int[CATEGORY_IDS.size()];
        boolean any = false;
        for (int i = 0; i < categories.size(); i++) {
            Category category = categories.get(i);
            String valueId = chosen.get(category.id());
            if (valueId == null) {
                continue;
            }
            Value value = value(category.id(), valueId);
            slots[i] = category.values().indexOf(value) + 1;
            any = true;
        }
        return any ? Optional.of(FullValuesKey.encode(slots)) : Optional.empty();
    }

    /** Os valores da chave (categoria -> valor), ou vazio se a chave e invalida, nao tem valor ou cita um indice que nao existe. */
    public Optional<Map<String, String>> decodeKey(String key) {
        Optional<int[]> slots = FullValuesKey.decode(key);
        if (slots.isEmpty()) {
            return Optional.empty();
        }
        Map<String, String> chosen = new LinkedHashMap<>();
        for (int i = 0; i < categories.size(); i++) {
            int index = slots.get()[i];
            if (index == 0) {
                continue;
            }
            List<Value> values = categories.get(i).values();
            if (index > values.size()) {
                return Optional.empty();
            }
            chosen.put(categories.get(i).id(), values.get(index - 1).id());
        }
        return chosen.isEmpty() ? Optional.empty() : Optional.of(chosen);
    }

    private String text(String lang, String id, String field, String portuguese) {
        if (QuizDataService.LANG_PT.equals(lang)) {
            return portuguese;
        }
        Map<String, String> entry = englishText.get(id);
        String value = entry == null ? null : entry.get(field);
        return isBlank(value) ? portuguese : value;
    }

    private static Loaded parse(ObjectMapper objectMapper, String ptJson, String enJson) throws IOException {
        List<Category> categories = objectMapper.readValue(ptJson, new TypeReference<>() {});
        List<Map<String, String>> overlay = objectMapper.readValue(enJson, new TypeReference<>() {});
        Map<String, Map<String, String>> english = new LinkedHashMap<>();
        overlay.forEach(item -> english.put(item.get("id"), item));

        List<String> ids = categories.stream().map(Category::id).toList();
        if (!ids.equals(CATEGORY_IDS)) {
            throw new IllegalStateException("Valores completos: as categorias devem ser " + CATEGORY_IDS + ", na ordem; veio " + ids);
        }
        Set<String> knownAxes = new HashSet<>();
        List<Map<String, Object>> axisList = objectMapper.readValue(read("data/axes.json"), new TypeReference<>() {});
        axisList.forEach(axis -> knownAxes.add((String) axis.get("id")));
        categories.forEach(category -> validate(category, knownAxes));
        return new Loaded(List.copyOf(categories), Map.copyOf(english));
    }

    private static void validate(Category category, Set<String> knownAxes) {
        String where = "Valores completos, categoria " + category.id() + ": ";
        if (category.axes() == null || category.axes().isEmpty() || !knownAxes.containsAll(category.axes())) {
            throw new IllegalStateException(where + "eixo desconhecido ou ausente em " + category.axes());
        }
        if (category.pending()) {
            return;
        }
        List<Value> values = category.values();
        if (values.size() > MAX_VALUES_PER_CATEGORY) {
            throw new IllegalStateException(where + "mais de " + MAX_VALUES_PER_CATEGORY + " valores (" + values.size() + ")");
        }
        Set<String> valueIds = new HashSet<>();
        for (Value value : values) {
            if (!valueIds.add(value.id())) {
                throw new IllegalStateException(where + "id de valor duplicado " + value.id());
            }
            validateEffects(where, category, value, knownAxes);
        }
        validateTree(where, category, valueIds);
    }

    private static void validateEffects(String where, Category category, Value value, Set<String> knownAxes) {
        Map<String, Double> effects = value.effects() == null ? Map.of() : value.effects();
        if (value.neutral()) {
            if (!effects.isEmpty()) {
                throw new IllegalStateException(where + "valor neutro " + value.id() + " nao tem efeitos");
            }
            return;
        }
        if (effects.isEmpty() || effects.size() > MAX_EFFECT_AXES) {
            throw new IllegalStateException(where + value.id() + " precisa de 1 a " + MAX_EFFECT_AXES + " efeitos");
        }
        for (Map.Entry<String, Double> effect : effects.entrySet()) {
            if (!knownAxes.contains(effect.getKey()) || !category.axes().contains(effect.getKey())) {
                throw new IllegalStateException(where + "eixo desconhecido no efeito de " + value.id() + ": " + effect.getKey());
            }
            if (effect.getValue() == null || effect.getValue() < 0 || effect.getValue() > 100) {
                throw new IllegalStateException(where + "efeito fora de 0 a 100 em " + value.id());
            }
        }
    }

    private static void validateTree(String where, Category category, Set<String> valueIds) {
        if (category.root() == null || category.nodes() == null || category.nodes().isEmpty()) {
            throw new IllegalStateException(where + "tem valores mas nao tem arvore");
        }
        Map<String, ValueTree.Node> nodes = new HashMap<>();
        for (ValueTree.Node node : category.nodes()) {
            if (nodes.put(node.id(), node) != null) {
                throw new IllegalStateException(where + "id de no duplicado " + node.id());
            }
        }
        if (!nodes.containsKey(category.root())) {
            throw new IllegalStateException(where + "root inexistente " + category.root());
        }
        for (ValueTree.Node node : category.nodes()) {
            if (node.options() == null || node.options().isEmpty()) {
                throw new IllegalStateException(where + "no sem opcoes " + node.id());
            }
            for (ValueTree.Option option : node.options()) {
                if ((option.next() == null) == (option.value() == null)) {
                    throw new IllegalStateException(where + "cada opcao de " + node.id() + " precisa de next ou value, nao dos dois");
                }
                if (option.next() != null && !nodes.containsKey(option.next())) {
                    throw new IllegalStateException(where + "next inexistente em " + node.id() + ": " + option.next());
                }
                if (option.value() != null && !valueIds.contains(option.value())) {
                    throw new IllegalStateException(where + "value inexistente em " + node.id() + ": " + option.value());
                }
            }
        }
        Set<String> reachedNodes = new HashSet<>();
        Set<String> reachedValues = new HashSet<>();
        walk(where, category.root(), nodes, new HashSet<>(), reachedNodes, reachedValues);
        if (reachedNodes.size() != nodes.size()) {
            throw new IllegalStateException(where + "no inalcancavel a partir de " + category.root());
        }
        if (!reachedValues.equals(valueIds)) {
            Set<String> missing = new HashSet<>(valueIds);
            missing.removeAll(reachedValues);
            throw new IllegalStateException(where + "valor inalcancavel pela arvore: " + missing);
        }
    }

    private static void walk(String where, String nodeId, Map<String, ValueTree.Node> nodes, Set<String> path,
            Set<String> reachedNodes, Set<String> reachedValues) {
        if (!path.add(nodeId)) {
            throw new IllegalStateException(where + "ciclo na arvore em " + nodeId);
        }
        reachedNodes.add(nodeId);
        for (ValueTree.Option option : nodes.get(nodeId).options()) {
            if (option.value() != null) {
                reachedValues.add(option.value());
            } else {
                walk(where, option.next(), nodes, path, reachedNodes, reachedValues);
            }
        }
        path.remove(nodeId);
    }

    private static String read(String path) throws IOException {
        try (InputStream input = new ClassPathResource(path).getInputStream()) {
            return new String(input.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    private static boolean isBlank(String text) {
        return text == null || text.isBlank();
    }

    private record Loaded(List<Category> categories, Map<String, Map<String, String>> englishText) {
    }

    /** Valor final de uma categoria; {@code effects} e o leftPercent (0-100) que ele soma a cada eixo. */
    public record Value(String id, String name, String description, boolean neutral, Map<String, Double> effects,
            FullValue.Icon icon) {
    }

    private record Category(String id, String label, List<String> axes, String root, List<ValueTree.Node> nodes,
            List<Value> values) {
        // Campo omitido no JSON (categoria pendente) vira lista vazia: nada abaixo precisa checar nulo.
        Category {
            nodes = nodes == null ? List.of() : List.copyOf(nodes);
            values = values == null ? List.of() : List.copyOf(values);
        }

        boolean pending() {
            return values.isEmpty();
        }
    }
}
