package com.twelveaxes.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.PoliticalValue;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

/**
 * Deriva dos percentuais dos eixos um valor politico nomeado por categoria
 * (economicos, politicos, ...), sem perguntas novas e sem entrar no matching.
 *
 * Cada valor tem um perfil nos eixos da categoria (percentual do polo esquerdo,
 * a mesma escala dos vetores do catalogo), e pode definir eixos EXTRAS alem
 * deles (por exemplo, a ditadura do proletariado exige economia publica, para
 * um autoritario capitalista nao cair nela). O usuario recebe o valor de perfil
 * mais proximo, como nos arquetipos; a distancia e a media dos quadrados sobre
 * os eixos que o valor define, para valores com mais eixos nao sairem em
 * desvantagem. Quem esta perto do centro em TODOS os eixos da categoria (so os
 * eixos base) recebe o valor neutro dela, para o centro nunca ganhar um rotulo
 * forte e enganoso.
 *
 * As categorias vivem em data/political-values.json e os textos em ingles em
 * data/i18n/en/political-values.json; incluir uma categoria nova nao exige codigo.
 */
@Service
public class PoliticalValuesService {
    private static final double CENTER = 50.0;
    /** Mesmo limiar do "equilibrado" do ScoringService: distancia do centro abaixo dele nao pende para lado nenhum. */
    static final double NEUTRAL_BAND = 7.5;

    private final List<Category> categories;
    private final Map<String, Map<String, String>> englishText;

    @Autowired
    public PoliticalValuesService(ObjectMapper objectMapper) throws IOException {
        this(parse(objectMapper, read("data/political-values.json"), read("data/i18n/en/political-values.json")));
    }

    private PoliticalValuesService(Loaded loaded) {
        this.categories = loaded.categories();
        this.englishText = loaded.englishText();
    }

    /** Monta o servico a partir de JSON ja lido; usado nos testes de dados invalidos. */
    public static PoliticalValuesService fromJson(ObjectMapper objectMapper, String ptJson, String enJson) {
        try {
            return new PoliticalValuesService(parse(objectMapper, ptJson, enJson));
        } catch (IOException exception) {
            throw new IllegalStateException("Valores politicos: JSON ilegivel", exception);
        }
    }

    /** Um valor por categoria, na ordem do JSON. */
    public List<PoliticalValue> resolve(List<AxisResult> axes, String lang) {
        boolean english = QuizDataService.LANG_EN.equals(QuizDataService.normalizeLang(lang));
        Map<String, Double> user = new LinkedHashMap<>();
        axes.forEach(axis -> user.put(axis.axisId(), axis.leftPercent()));

        List<PoliticalValue> result = new ArrayList<>();
        for (Category category : categories) {
            Value chosen = choose(category, user);
            String label = category.label();
            String name = chosen.name();
            String description = chosen.description();
            if (english) {
                label = englishText.get(category.id()).get("label");
                name = englishText.get(chosen.id()).get("name");
                description = englishText.get(chosen.id()).get("description");
            }
            result.add(new PoliticalValue(category.id(), label, chosen.id(), name, description, chosen.neutral()));
        }
        return result;
    }

    private static Value choose(Category category, Map<String, Double> user) {
        boolean nearCenter = category.axes().stream()
                .allMatch(axis -> Math.abs(user.getOrDefault(axis, CENTER) - CENTER) <= NEUTRAL_BAND);
        if (nearCenter) {
            return category.values().stream().filter(Value::neutral).findFirst().orElseThrow();
        }
        Value best = null;
        double bestDistance = Double.MAX_VALUE;
        for (Value value : category.values()) {
            double distance = 0;
            for (Map.Entry<String, Double> target : value.profile().entrySet()) {
                double delta = user.getOrDefault(target.getKey(), CENTER) - target.getValue();
                distance += delta * delta;
            }
            distance /= value.profile().size();
            if (distance < bestDistance) {
                bestDistance = distance;
                best = value;
            }
        }
        return best;
    }

    private static String read(String path) throws IOException {
        try (InputStream input = new ClassPathResource(path).getInputStream()) {
            return new String(input.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    private static Loaded parse(ObjectMapper objectMapper, String ptJson, String enJson) throws IOException {
        List<Category> categories = objectMapper.readValue(ptJson, new TypeReference<>() {});
        List<Map<String, String>> overlay = objectMapper.readValue(enJson, new TypeReference<>() {});
        Map<String, Map<String, String>> english = new LinkedHashMap<>();
        overlay.forEach(item -> english.put(item.get("id"), item));

        Set<String> knownAxes = new HashSet<>();
        List<Map<String, Object>> axisList = objectMapper.readValue(read("data/axes.json"), new TypeReference<>() {});
        axisList.forEach(axis -> knownAxes.add((String) axis.get("id")));

        for (Category category : categories) {
            validate(category, knownAxes, english);
        }
        return new Loaded(List.copyOf(categories), Map.copyOf(english));
    }

    private static void validate(Category category, Set<String> knownAxes, Map<String, Map<String, String>> english) {
        String where = "Valores politicos, categoria " + category.id() + ": ";
        if (category.axes() == null || category.axes().isEmpty() || !knownAxes.containsAll(category.axes())) {
            throw new IllegalStateException(where + "eixos ausentes ou desconhecidos " + category.axes());
        }
        if (english.get(category.id()) == null || isBlank(english.get(category.id()).get("label"))) {
            throw new IllegalStateException(where + "sem label em ingles");
        }
        long neutrals = category.values().stream().filter(Value::neutral).count();
        if (neutrals != 1) {
            throw new IllegalStateException(where + "precisa de exatamente 1 valor neutro, tem " + neutrals);
        }
        for (Value value : category.values()) {
            if (value.profile() == null || !value.profile().keySet().containsAll(category.axes())
                    || !knownAxes.containsAll(value.profile().keySet())) {
                throw new IllegalStateException(where + "perfil de " + value.id()
                        + " deve ter todos os eixos da categoria e so eixos conhecidos (extras sao opcionais)");
            }
            Map<String, String> text = english.get(value.id());
            if (isBlank(value.name()) || isBlank(value.description())
                    || text == null || isBlank(text.get("name")) || isBlank(text.get("description"))) {
                throw new IllegalStateException(where + "valor " + value.id() + " sem texto em portugues ou ingles");
            }
        }
    }

    private static boolean isBlank(String text) {
        return text == null || text.isBlank();
    }

    private record Loaded(List<Category> categories, Map<String, Map<String, String>> englishText) {
    }

    private record Category(String id, String label, List<String> axes, List<Value> values) {
    }

    private record Value(String id, String name, String description, boolean neutral, Map<String, Double> profile) {
    }
}
