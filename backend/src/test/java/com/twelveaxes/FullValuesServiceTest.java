package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.model.FullValue;
import com.twelveaxes.model.ValueTree;
import com.twelveaxes.service.FullValuesService;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/** Catalogo dos valores completos: carga, traducao e as regras de validacao (sem Spring). */
class FullValuesServiceTest {
    private static final ObjectMapper MAPPER = new ObjectMapper();
    static final List<String> IDS = List.of(
            "politica", "tecnologia", "economia", "cultura", "controle_social", "politica_externa", "nacao",
            "organizacao_territorial");

    /** Categoria Politica minima e valida: 2 niveis, 2 valores com efeito e o neutro. */
    static final String POLITICA = """
            {"id":"politica","label":"Política","axes":["estrutura","representacao","poder"],"root":"p1",
             "nodes":[
              {"id":"p1","text":"Quem decide?","options":[
                {"text":"Especialistas","value":"tecnocracia"},
                {"text":"Eleitos","next":"p2"}]},
              {"id":"p2","text":"Com que limites?","options":[
                {"text":"Constituição","value":"democracia"},
                {"text":"Equilíbrio","value":"equilibrado"}]}],
             "values":[
              {"id":"tecnocracia","name":"Tecnocracia","description":"d1","neutral":false,"effects":{"poder":70,"representacao":30},"icon":null},
              {"id":"democracia","name":"Democracia","description":"d2","neutral":false,"effects":{"representacao":90},"icon":{"file":"democracia.svg","sourceUrl":"https://example.org/f","author":"Fulano","license":"CC BY 3.0","modified":true}},
              {"id":"equilibrado","name":"Equilibrado","description":"d3","neutral":true,"effects":{},"icon":null}]}
            """;

    static final String EN = """
            [{"id":"politica","label":"Politics"},
             {"id":"p1","text":"Who decides?"},
             {"id":"p1.0","text":"Experts"},
             {"id":"tecnocracia","name":"Technocracy","description":"e1"},
             {"id":"equilibrado","name":"Balanced","description":"e3"}]
            """;

    /** Arquivo completo: as 8 categorias, so a Politica com conteudo (as outras sao "pendentes", vazias). */
    static String file(String politica) {
        StringBuilder out = new StringBuilder("[");
        for (int i = 0; i < IDS.size(); i++) {
            if (i > 0) {
                out.append(',');
            }
            if (IDS.get(i).equals("politica")) {
                out.append(politica);
            } else {
                out.append("{\"id\":\"").append(IDS.get(i)).append("\",\"label\":\"").append(IDS.get(i))
                        .append("\",\"axes\":[\"poder\"],\"root\":null,\"nodes\":[],\"values\":[]}");
            }
        }
        return out.append(']').toString();
    }

    static FullValuesService service(String politica) {
        return FullValuesService.fromJson(MAPPER, file(politica), EN);
    }

    private static void rejects(String politica, String expectedPart) {
        assertThatThrownBy(() -> service(politica))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining(expectedPart);
    }

    @Test
    void loadsTheSeedAndKeepsTheEightCategoriesInFixedOrder() {
        FullValuesService service = service(POLITICA);
        assertThat(service.categoryIds()).containsExactlyElementsOf(IDS);
    }

    @Test
    void servesOnlyCategoriesThatHaveContent() {
        List<ValueTree.View> trees = service(POLITICA).trees("pt");
        assertThat(trees).hasSize(1);
        assertThat(trees.getFirst().categoryId()).isEqualTo("politica");
        assertThat(trees.getFirst().root()).isEqualTo("p1");
        assertThat(trees.getFirst().nodes()).hasSize(2);
    }

    @Test
    void translatesAndFallsBackToPortuguesePerField() {
        ValueTree.View en = service(POLITICA).trees("en").getFirst();
        assertThat(en.label()).isEqualTo("Politics");
        ValueTree.NodeView p1 = en.nodes().getFirst();
        assertThat(p1.text()).isEqualTo("Who decides?");
        assertThat(p1.options().get(0).text()).isEqualTo("Experts");
        // sem traducao da opcao 1: cai no portugues
        assertThat(p1.options().get(1).text()).isEqualTo("Eleitos");
        assertThat(p1.options().get(0).id()).isEqualTo("0");
        assertThat(p1.options().get(0).value()).isEqualTo("tecnocracia");
        assertThat(p1.options().get(1).next()).isEqualTo("p2");
    }

    @Test
    void lookupReturnsEffectsAndRejectsUnknownOrForeignValues() {
        FullValuesService service = service(POLITICA);
        assertThat(service.value("politica", "tecnocracia").effects()).isEqualTo(Map.of("poder", 70.0, "representacao", 30.0));
        assertThat(service.value("politica", "equilibrado").neutral()).isTrue();
        for (String[] bad : new String[][] {{"politica", "nao_existe"}, {"nao_existe", "tecnocracia"}, {"tecnologia", "tecnocracia"}}) {
            assertThatThrownBy(() -> service.value(bad[0], bad[1]))
                    .isInstanceOfSatisfying(ResponseStatusException.class,
                            e -> assertThat(e.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST));
        }
    }

    @Test
    void aPendingCategoryWithoutValuesFieldIsStillA400NotAnError() {
        // quem esquecer o campo "values" numa categoria pendente nao pode transformar um pedido ruim em 500
        String withoutValues = file(POLITICA).replace(",\"values\":[]", "");
        FullValuesService service = FullValuesService.fromJson(MAPPER, withoutValues, EN);
        assertThatThrownBy(() -> service.value("tecnologia", "qualquer"))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        e -> assertThat(e.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST));
        assertThat(service.decodeKey(com.twelveaxes.service.FullValuesKey.encode(new int[] {0, 1, 0, 0, 0, 0, 0, 0}))).isEmpty();
        assertThat(service.trees("pt")).hasSize(1);
    }

    @Test
    void resolveFollowsCategoryOrderAndCarriesIconAndLabels() {
        List<FullValue> resolved = service(POLITICA).resolve(Map.of("politica", "democracia"), "en");
        assertThat(resolved).hasSize(1);
        FullValue value = resolved.getFirst();
        assertThat(value.categoryId()).isEqualTo("politica");
        assertThat(value.categoryLabel()).isEqualTo("Politics");
        assertThat(value.name()).isEqualTo("Democracia"); // sem traducao do nome: portugues
        assertThat(value.icon().author()).isEqualTo("Fulano");
        assertThat(value.icon().license()).isEqualTo("CC BY 3.0");
        assertThat(value.icon().modified()).isTrue();
        assertThat(service(POLITICA).resolve(Map.of("politica", "equilibrado"), "pt").getFirst().neutral()).isTrue();
        assertThat(service(POLITICA).resolve(Map.of(), "pt")).isEmpty();
    }

    @Test
    void rejectsFilesThatDoNotHaveTheEightCategories() {
        assertThatThrownBy(() -> FullValuesService.fromJson(MAPPER, "[" + POLITICA + "]", EN))
                .isInstanceOf(IllegalStateException.class).hasMessageContaining("categorias");
    }

    @Test
    void rejectsInvalidEffects() {
        rejects(POLITICA.replace("\"poder\":70", "\"nao_existe\":70"), "eixo desconhecido");
        rejects(POLITICA.replace("\"poder\":70", "\"poder\":170"), "fora de 0 a 100");
        rejects(POLITICA.replace("\"effects\":{\"representacao\":90}", "\"effects\":{}"), "1 a 3 efeitos");
        rejects(POLITICA
                .replace("\"axes\":[\"estrutura\",\"representacao\",\"poder\"]", "\"axes\":[\"estrutura\",\"representacao\",\"poder\",\"economia\"]")
                .replace("\"effects\":{\"poder\":70,\"representacao\":30}", "\"effects\":{\"poder\":70,\"representacao\":30,\"estrutura\":50,\"economia\":50}"),
                "1 a 3 efeitos");
        rejects(POLITICA.replace("\"neutral\":true,\"effects\":{}", "\"neutral\":true,\"effects\":{\"poder\":50}"), "neutro");
    }

    @Test
    void rejectsBrokenTrees() {
        rejects(POLITICA.replace("{\"text\":\"Especialistas\",\"value\":\"tecnocracia\"}",
                "{\"text\":\"Especialistas\",\"value\":\"tecnocracia\",\"next\":\"p2\"}"), "next ou value");
        rejects(POLITICA.replace("{\"text\":\"Especialistas\",\"value\":\"tecnocracia\"}", "{\"text\":\"Especialistas\"}"),
                "next ou value");
        rejects(POLITICA.replace("\"next\":\"p2\"", "\"next\":\"zzz\""), "next inexistente");
        rejects(POLITICA.replace("\"value\":\"tecnocracia\"", "\"value\":\"zzz\""), "value inexistente");
        rejects(POLITICA.replace("{\"text\":\"Constituição\",\"value\":\"democracia\"}", "{\"text\":\"Constituição\",\"next\":\"p1\"}"),
                "ciclo");
        rejects(POLITICA
                .replace("{\"id\":\"p2\"", "{\"id\":\"p3\",\"text\":\"solto\",\"options\":[{\"text\":\"x\",\"value\":\"democracia\"}]},{\"id\":\"p2\""),
                "no inalcancavel");
        rejects(POLITICA.replace("\"values\":[", "\"values\":[{\"id\":\"orfao\",\"name\":\"O\",\"description\":\"d\",\"neutral\":false,\"effects\":{\"poder\":10},\"icon\":null},"),
                "valor inalcancavel");
        rejects(POLITICA.replace("{\"id\":\"p2\"", "{\"id\":\"p1\"").replace("\"next\":\"p2\"", "\"next\":\"p1\""), "duplicado");
        rejects(POLITICA.replace("\"values\":[", "\"values\":[{\"id\":\"tecnocracia\",\"name\":\"T\",\"description\":\"d\",\"neutral\":false,\"effects\":{\"poder\":10},\"icon\":null},"),
                "duplicado");
    }

    @Test
    void rejectsMoreThan63ValuesInACategory() {
        StringBuilder values = new StringBuilder();
        for (int i = 0; i < 64; i++) {
            values.append(i > 0 ? "," : "").append("{\"id\":\"v").append(i)
                    .append("\",\"name\":\"V\",\"description\":\"d\",\"neutral\":false,\"effects\":{\"poder\":50},\"icon\":null}");
        }
        String tooMany = "{\"id\":\"politica\",\"label\":\"P\",\"axes\":[\"poder\"],\"root\":\"p1\",\"nodes\":[],\"values\":["
                + values + "]}";
        rejects(tooMany, "mais de 63");
    }

    private static String resource(String path) throws IOException {
        return new String(new ClassPathResource(path).getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    }

    /** Maior numero de perguntas seguidas da raiz ate um valor final. */
    private static int depth(Map<String, JsonNode> nodes, String id) {
        int deepest = 0;
        for (JsonNode option : nodes.get(id).get("options")) {
            deepest = Math.max(deepest, option.has("next") && !option.get("next").isNull() ? depth(nodes, option.get("next").asText()) : 0);
        }
        return 1 + deepest;
    }

    /** Partocracia e UM partido dominando o Estado (nao varios partidos competindo): autoritaria e fora do ramo representativo. */
    @Test
    void partocracyIsOnePartyRuleNotAMultiPartyDemocracy() throws IOException {
        JsonNode politica = null;
        for (JsonNode category : MAPPER.readTree(resource("data/full-values.json"))) {
            if (category.get("id").asText().equals("politica")) {
                politica = category;
            }
        }
        assertThat(politica).isNotNull();
        JsonNode partocracia = null;
        for (JsonNode value : politica.get("values")) {
            if (value.get("id").asText().equals("partocracia")) {
                partocracia = value;
            }
        }
        assertThat(partocracia).isNotNull();
        // efeitos autoritarios: pouca representacao democratica, muito poder concentrado (e nada de economia presumida)
        assertThat(partocracia.get("effects").get("representacao").asDouble()).isLessThanOrEqualTo(20);
        assertThat(partocracia.get("effects").get("poder").asDouble()).isGreaterThanOrEqualTo(70);
        assertThat(partocracia.get("effects").has("economia")).isFalse();
        assertThat(partocracia.get("description").asText().toLowerCase()).contains("único partido");
        // o caminho ate ela passa por "forca", nunca por "elegendo representantes"
        String parentNode = null;
        for (JsonNode node : politica.get("nodes")) {
            for (JsonNode option : node.get("options")) {
                if (option.has("value") && option.get("value").asText().equals("partocracia")) {
                    parentNode = node.get("id").asText();
                }
            }
        }
        assertThat(parentNode).isEqualTo("politica_forca");
    }

    @Test
    void theRealPoliticaCategoryFollowsTheContentRules() throws IOException {
        String pt = resource("data/full-values.json");
        String en = resource("data/i18n/en/full-values.json");
        FullValuesService.fromJson(MAPPER, pt, en); // a validacao estrutural roda na carga

        JsonNode politica = null;
        for (JsonNode category : MAPPER.readTree(pt)) {
            if (category.get("id").asText().equals("politica")) {
                politica = category;
            }
        }
        assertThat(politica).isNotNull();
        JsonNode values = politica.get("values");
        assertThat(values.size()).isBetween(10, 20);
        long neutral = 0;
        for (JsonNode value : values) {
            neutral += value.get("neutral").asBoolean() ? 1 : 0;
        }
        assertThat(neutral).isEqualTo(1);
        Set<String> axes = new HashSet<>();
        politica.get("axes").forEach(axis -> axes.add(axis.asText()));
        assertThat(axes).containsExactlyInAnyOrder("estrutura", "representacao", "poder", "economia", "moral");

        Map<String, JsonNode> nodes = new java.util.HashMap<>();
        politica.get("nodes").forEach(node -> nodes.put(node.get("id").asText(), node));
        assertThat(depth(nodes, politica.get("root").asText())).isLessThanOrEqualTo(3);
        nodes.values().forEach(node -> assertThat(node.get("options").size()).isBetween(2, 4));

        // texto em ingles de tudo o que o usuario le (categoria, perguntas, alternativas, valores) e nenhum marcador de semente
        Map<String, JsonNode> english = new java.util.HashMap<>();
        MAPPER.readTree(en).forEach(item -> english.put(item.get("id").asText(), item));
        assertThat(english.get("politica").get("label").asText()).isNotBlank();
        nodes.forEach((id, node) -> {
            assertThat(english.get(id).get("text").asText()).as("en %s", id).isNotBlank();
            for (int i = 0; i < node.get("options").size(); i++) {
                assertThat(english.get(id + "." + i).get("text").asText()).as("en %s.%d", id, i).isNotBlank();
            }
        });
        for (JsonNode value : values) {
            String id = value.get("id").asText();
            assertThat(english.get(id).get("name").asText()).as("en nome %s", id).isNotBlank();
            assertThat(english.get(id).get("description").asText()).as("en descricao %s", id).isNotBlank();
        }
        // cada valor com imagem traz a fonte (pagina do arquivo, autor, licenca permitida) e o arquivo existe em frontend/public/values
        for (JsonNode value : values) {
            JsonNode icon = value.get("icon");
            if (icon == null || icon.isNull()) {
                continue;
            }
            String id = value.get("id").asText();
            assertThat(icon.get("sourceUrl").asText()).as("fonte de %s", id).startsWith("https://");
            assertThat(icon.get("author").asText()).as("autor de %s", id).isNotBlank();
            assertThat(icon.get("license").asText()).as("licenca de %s", id)
                    .matches("(?i)^(public domain|cc0|cc by(-sa)? [\\d.]+)$");
            assertThat(java.nio.file.Files.exists(java.nio.file.Path.of("..", "frontend", "public", "values", "politica", icon.get("file").asText())))
                    .as("arquivo do icone de %s", id).isTrue();
        }
        assertThat(pt).doesNotContain("(semente)");
        assertThat(en).doesNotContain("(seed)");
    }
}
