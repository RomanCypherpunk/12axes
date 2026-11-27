package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.twelveaxes.controller.QuizController;
import com.twelveaxes.model.AxisOutlier;
import com.twelveaxes.model.AxisTension;
import com.twelveaxes.model.CountryMatch;
import com.twelveaxes.model.IdeologyMatch;
import com.twelveaxes.model.PartyMatch;
import com.twelveaxes.model.PersonalityMatch;
import com.twelveaxes.model.QuizResult;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Random;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Gabarito da cópia do cálculo de resultados que as páginas estáticas da wiki usam (frontend/src/wiki/engine): para cada
 * perfil do catálogo, e para vetores aleatórios, guarda ids e números do que /api/results/by-axes devolve. O teste de
 * paridade do front exige que a cópia em TypeScript chegue ao mesmo. Se este teste falhar, o backend mudou: regenere com
 * -Dwiki.fixture=true e ajuste a cópia em TypeScript até o teste do front passar.
 */
@SpringBootTest
class WikiParityFixtureTest {
    private static final Path FIXTURE = Path.of("..", "frontend", "test", "fixtures", "backend-results.json");
    private static final List<String> SELECTABLE = List.of("catholic", "protestant", "orthodox", "judaism", "islam", "buddhism", "hinduism");
    private static final String[][] CATALOGS = {
            {"personality", "personality-profiles.json", "personalityId", "personalities.json"},
            {"ideology", "ideology-profiles.json", "ideologyId", "ideologies.json"},
            {"country", "countries-profiles.json", "countryId", "countries.json"},
            {"party", "parties-profiles.json", "partyId", "parties.json"}
    };
    private static final int RANDOM_VECTORS = 60;
    private static final List<String> RANDOM_RELIGIONS = List.of("", "catholic", "islam", "other", "catholic,protestant");

    @Autowired
    private QuizController controller;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void fixtureMatchesBackend() throws Exception {
        ObjectMapper writer = objectMapper.copy().enable(SerializationFeature.INDENT_OUTPUT)
                .enable(SerializationFeature.ORDER_MAP_ENTRIES_BY_KEYS);
        ObjectNode root = writer.createObjectNode();
        List<String> axisIds = new ArrayList<>();
        readData("axes.json").forEach(axis -> axisIds.add(axis.get("id").asText()));

        for (String[] catalog : CATALOGS) {
            JsonNode metadata = readData(catalog[3]);
            for (JsonNode profile : readData(catalog[1])) {
                String id = profile.get(catalog[2]).asText();
                String religion = religionOf(metadata, id);
                String vector = vectorString(profile.get("vector"), axisIds);
                root.set(catalog[0] + ":" + id, entry(vector, religion, writer));
            }
        }
        Random random = new Random(12);
        for (int index = 0; index < RANDOM_VECTORS; index++) {
            List<String> values = new ArrayList<>();
            for (int axis = 0; axis < axisIds.size(); axis++) {
                double value = random.nextBoolean() ? random.nextInt(101) : 35 + random.nextInt(31) + random.nextInt(10) / 10.0;
                values.add(format(value));
            }
            String religion = RANDOM_RELIGIONS.get(index % RANDOM_RELIGIONS.size());
            root.set("random:" + index, entry(String.join(",", values), religion.isEmpty() ? null : religion, writer));
        }

        String fresh = writer.writeValueAsString(root).replace("\r\n", "\n") + "\n";
        if (Boolean.getBoolean("wiki.fixture")) {
            Files.createDirectories(FIXTURE.getParent());
            Files.writeString(FIXTURE, fresh, StandardCharsets.UTF_8);
        }
        String saved = Files.exists(FIXTURE) ? Files.readString(FIXTURE, StandardCharsets.UTF_8).replace("\r\n", "\n") : "";
        assertThat(saved)
                .as("backend-results.json desatualizado: rode ./mvnw -o test -Dtest=WikiParityFixtureTest -Dwiki.fixture=true")
                .isEqualTo(fresh);
    }

    // Religião com que a wiki calcula o resultado de um perfil: as religiões selecionáveis dele; sem nenhuma, "other" se
    // ele tiver só "other"; senão nenhuma.
    static String religionOf(JsonNode metadata, String id) {
        for (JsonNode item : metadata) {
            if (!item.get("id").asText().equals(id)) {
                continue;
            }
            List<String> religions = new ArrayList<>();
            item.path("religions").forEach(value -> religions.add(value.asText()));
            List<String> selectable = religions.stream().filter(SELECTABLE::contains).toList();
            if (!selectable.isEmpty()) {
                return String.join(",", selectable);
            }
            return religions.contains("other") ? "other" : null;
        }
        return null;
    }

    private ObjectNode entry(String vector, String religion, ObjectMapper mapper) {
        QuizResult result = controller.resultsByAxes(vector, "pt", religion);
        ObjectNode node = mapper.createObjectNode();
        node.put("v", vector);
        node.put("religion", religion);
        node.set("ideologies", ideologies(result.matches().subList(0, Math.min(10, result.matches().size())), mapper));
        node.set("bottomIdeology", ideologies(List.of(result.bottomIdeologyMatch()), mapper));
        node.set("personalities", people(result.personalityMatches(), mapper));
        ArrayNode personDims = mapper.createArrayNode();
        result.dimensionMatches().forEach(dim -> personDims.add(dim.dimension() + ":" + dim.match().personalityId() + ":" + format(dim.match().compatibility())));
        node.set("personalityDims", personDims);
        node.set("bottomPersonalities", people(result.bottomPersonalityMatches(), mapper));
        node.set("countryTop", countries(List.of(result.topCountryMatch()), mapper));
        node.set("countryHistorical", countries(List.of(result.topHistoricalCountryMatch()), mapper));
        node.set("countries", countries(result.topCountryMatches(), mapper));
        ArrayNode countryDims = mapper.createArrayNode();
        result.countryDimensionMatches().forEach(dim -> countryDims.add(dim.dimension() + ":" + dim.match().countryId() + ":" + format(dim.match().compatibility())));
        node.set("countryDims", countryDims);
        node.set("bottomCountries", countries(result.bottomCountryMatches(), mapper));
        node.set("partyTop", parties(result.topPartyMatch() == null ? List.of() : List.of(result.topPartyMatch()), mapper));
        node.set("partyHistorical", parties(result.topHistoricalPartyMatch() == null ? List.of() : List.of(result.topHistoricalPartyMatch()), mapper));
        node.set("parties", parties(result.topPartyMatches(), mapper));
        ArrayNode partyDims = mapper.createArrayNode();
        result.partyDimensionMatches().forEach(dim -> partyDims.add(dim.dimension() + ":" + dim.match().partyId() + ":" + format(dim.match().compatibility())));
        node.set("partyDims", partyDims);
        node.set("bottomParties", parties(result.bottomPartyMatches(), mapper));
        ArrayNode values = mapper.createArrayNode();
        result.politicalValues().forEach(value -> values.add(value.categoryId() + ":" + value.valueId() + (value.neutral() ? ":neutral" : "")));
        node.set("values", values);
        node.set("unusual", outlier(result.mostUnusualAxis(), mapper));
        node.set("common", outlier(result.mostCommonAxis(), mapper));
        node.set("tension", tension(result.axisTension(), mapper));
        return node;
    }

    private static ArrayNode ideologies(List<IdeologyMatch> list, ObjectMapper mapper) {
        ArrayNode out = mapper.createArrayNode();
        list.forEach(match -> out.add(match.ideologyId() + ":" + format(match.compatibility()) + ":" + format(match.compatibilityPercentile())));
        return out;
    }

    private static ArrayNode people(List<PersonalityMatch> list, ObjectMapper mapper) {
        ArrayNode out = mapper.createArrayNode();
        list.forEach(match -> out.add(match.personalityId() + ":" + format(match.compatibility()) + ":" + format(match.compatibilityPercentile())));
        return out;
    }

    private static ArrayNode countries(List<CountryMatch> list, ObjectMapper mapper) {
        ArrayNode out = mapper.createArrayNode();
        list.forEach(match -> out.add(match.countryId() + ":" + format(match.compatibility()) + ":" + format(match.compatibilityPercentile())));
        return out;
    }

    private static ArrayNode parties(List<PartyMatch> list, ObjectMapper mapper) {
        ArrayNode out = mapper.createArrayNode();
        list.forEach(match -> out.add(match.partyId() + ":" + format(match.compatibility()) + ":" + format(match.compatibilityPercentile())));
        return out;
    }

    private static JsonNode outlier(AxisOutlier outlier, ObjectMapper mapper) {
        if (outlier == null) {
            return mapper.nullNode();
        }
        ObjectNode node = mapper.createObjectNode();
        node.put("axisId", outlier.axisId());
        node.put("userPercent", format(outlier.userPercent()));
        node.put("catalogMedian", format(outlier.catalogMedian()));
        node.put("distanceFromMedian", format(outlier.distanceFromMedian()));
        node.put("dominantPole", outlier.dominantPole());
        node.put("balanced", outlier.balanced());
        node.put("abovePole", outlier.abovePole());
        node.put("abovePercent", format(outlier.abovePercent()));
        return node;
    }

    private static JsonNode tension(AxisTension tension, ObjectMapper mapper) {
        if (tension == null) {
            return mapper.nullNode();
        }
        ObjectNode node = mapper.createObjectNode();
        node.put("first", tension.firstAxisLabel() + ":" + tension.firstPole());
        node.put("second", tension.secondAxisLabel() + ":" + tension.secondPole());
        node.put("matching", tension.matchingIdeologies());
        node.put("catalogSize", tension.catalogSize());
        ArrayNode examples = mapper.createArrayNode();
        tension.examples().forEach(examples::add);
        node.set("examples", examples);
        return node;
    }

    private static String vectorString(JsonNode vector, List<String> axisIds) {
        List<String> values = new ArrayList<>();
        axisIds.forEach(axis -> values.add(format(vector.get(axis).asDouble())));
        return String.join(",", values);
    }

    private static String format(double value) {
        return String.format(Locale.ROOT, "%.2f", value);
    }

    private JsonNode readData(String file) throws Exception {
        try (InputStream stream = getClass().getResourceAsStream("/data/" + file)) {
            return objectMapper.readTree(stream);
        }
    }
}
