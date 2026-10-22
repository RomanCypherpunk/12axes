package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.PoliticalValue;
import com.twelveaxes.service.PoliticalValuesService;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;

@SpringBootTest
class PoliticalValuesServiceTest {
    private static final List<String> AXIS_IDS = List.of("estrutura", "representacao", "poder", "imigracao",
            "diplomacia", "intervencao", "economia", "controle", "comercio", "religiao", "moral", "tecnologia");
    private static final String[] STATE_WORDS = {"estado", "governo", "state", "government"};

    @Autowired
    private PoliticalValuesService service;

    @Autowired
    private ObjectMapper objectMapper;

    private static List<AxisResult> axes(Map<String, Double> overrides, double fill) {
        List<AxisResult> axes = new ArrayList<>();
        for (String id : AXIS_IDS) {
            double left = overrides.getOrDefault(id, fill);
            axes.add(new AxisResult(id, id, "L", "R", left, 100 - left, "L", "balanced"));
        }
        return axes;
    }

    private static PoliticalValue pick(List<PoliticalValue> values, Object categoryId) {
        return values.stream().filter(value -> value.categoryId().equals(categoryId)).findFirst().orElseThrow();
    }

    private PoliticalValue economic(List<AxisResult> axes, String lang) {
        return pick(service.resolve(axes, lang), "economicos");
    }

    @Test
    void neutralWhenAllAxesAtCenter() {
        PoliticalValue value = economic(axes(Map.of(), 50), "pt");

        assertThat(value.valueId()).isEqualTo("pragmatismo");
        assertThat(value.neutral()).isTrue();
    }

    @Test
    void oneAxisOutsideBandLeavesNeutral() {
        PoliticalValue value = economic(axes(Map.of("comercio", 95.0), 50), "pt");

        assertThat(value.neutral()).isFalse();
        // Economia e controle em 50 com comercio protecionista: o mais proximo e o mercantilismo.
        assertThat(value.valueId()).isEqualTo("mercantilismo");
    }

    @Test
    void justInsideBandStaysNeutralAndJustOutsideDoesNot() {
        assertThat(economic(axes(Map.of("controle", 57.5), 50), "pt").valueId()).isEqualTo("pragmatismo");
        assertThat(economic(axes(Map.of("economia", 42.5, "controle", 57.5, "comercio", 50.0), 50), "pt").neutral())
                .isTrue();
    }

    @Test
    void everyNonNeutralPrototypeResolvesToItself() throws Exception {
        int checked = 0;
        for (Map<String, Object> category : readCategories()) {
            for (Map<String, Object> value : values(category)) {
                if (Boolean.TRUE.equals(value.get("neutral"))) {
                    continue;
                }
                @SuppressWarnings("unchecked")
                Map<String, Number> profile = (Map<String, Number>) value.get("profile");
                Map<String, Double> overrides = new HashMap<>();
                profile.forEach((axis, number) -> overrides.put(axis, number.doubleValue()));

                PoliticalValue resolved = pick(service.resolve(axes(overrides, 50), "pt"), category.get("id"));

                assertThat(resolved.valueId()).as("perfil de %s", value.get("id")).isEqualTo(value.get("id"));
                checked++;
            }
        }
        assertThat(checked).isGreaterThanOrEqualTo(20);
    }

    @Test
    void societyValuesFollowMoralAndReligion() {
        // Moral e Religiao em % do polo esquerdo: Moral 100 = progressista, Religiao 100 = irreligioso.
        assertThat(society(Map.of("moral", 50.0, "religiao", 50.0)).valueId()).isEqualTo("moderado");
        assertThat(society(Map.of("moral", 50.0, "religiao", 50.0)).neutral()).isTrue();
        assertThat(society(Map.of("moral", 8.0, "religiao", 10.0)).valueId()).isEqualTo("tradicionalismo-religioso");
        assertThat(society(Map.of("moral", 25.0, "religiao", 58.0)).valueId()).isEqualTo("conservadorismo-secular");
        assertThat(society(Map.of("moral", 88.0, "religiao", 92.0)).valueId()).isEqualTo("progressismo-irreligioso");
        assertThat(society(Map.of("moral", 75.0, "religiao", 15.0)).valueId()).isEqualTo("progressismo-religioso");
        // moral neutra, mas religiao num extremo: nao pode virar conservador nem progressista
        assertThat(society(Map.of("moral", 50.0, "religiao", 90.0)).valueId()).isEqualTo("moderado-irreligioso");
        assertThat(society(Map.of("moral", 50.0, "religiao", 12.0)).valueId()).isEqualTo("moderado-religioso");
    }

    @Test
    void societyHasNineteenValuesInBothLanguages() throws Exception {
        Map<String, Object> society = readCategories().stream()
                .filter(category -> category.get("id").equals("sociedade")).findFirst().orElseThrow();

        assertThat(values(society)).hasSize(19);
        assertThat(pick(service.resolve(axes(Map.of("moral", 8.0, "religiao", 10.0), 50), "en"), "sociedade").categoryLabel())
                .isEqualTo("Society");
    }

    private PoliticalValue society(Map<String, Double> overrides) {
        return pick(service.resolve(axes(overrides, 50), "pt"), "sociedade");
    }

    private PoliticalValue politics(Map<String, Double> overrides) {
        return pick(service.resolve(axes(overrides, 50), "pt"), "politicos");
    }

    @Test
    void politicsNeutralAtCenter() {
        assertThat(politics(Map.of()).valueId()).isEqualTo("neutralidade-politica");
        assertThat(politics(Map.of()).neutral()).isTrue();
    }

    @Test
    void politicsExtraAxesKeepAuthoritariansApart() {
        Map<String, Double> authoritarian = Map.of("estrutura", 17.0, "representacao", 28.0, "poder", 75.0);
        // Ditadura do proletariado exige economia publica: o autoritario capitalista fica com autocracia.
        assertThat(politics(with(authoritarian, "economia", 94.0)).valueId()).isEqualTo("ditadura-do-proletariado");
        // O autoritario capitalista nunca vira ditadura do proletariado (hoje cai em "governo forte", o valor mais proximo).
        assertThat(politics(with(authoritarian, "economia", 8.0)).valueId()).isNotEqualTo("ditadura-do-proletariado");

        // Socialista autoritario progressista nao vira monarquia absoluta nem aristocracia: elas exigem moral tradicionalista.
        Map<String, Double> absolutist = Map.of("estrutura", 1.0, "representacao", 6.0, "poder", 82.0);
        assertThat(politics(with(with(absolutist, "economia", 90.0), "moral", 70.0)).valueId())
                .isNotIn("monarquismo-absoluto", "aristocracia");
        assertThat(politics(with(absolutist, "moral", 8.0)).valueId()).isEqualTo("monarquismo-absoluto");
    }

    @Test
    void politicsFillsTheClusterGapsFoundInTheCatalog() {
        assertThat(politics(Map.of("estrutura", 72.0, "representacao", 28.0, "poder", 74.0)).valueId()).isEqualTo("federalismo-autoritario");
        assertThat(politics(Map.of("estrutura", 40.0, "representacao", 68.0, "poder", 55.0)).valueId()).isEqualTo("democracia-moderada");
        assertThat(politics(Map.of("estrutura", 24.0, "representacao", 42.0, "poder", 72.0)).valueId()).isEqualTo("governo-forte");
        assertThat(politics(Map.of("estrutura", 32.0, "representacao", 85.0, "poder", 24.0)).valueId()).isEqualTo("democracia-central");
    }

    @Test
    void politicsLibertariansAreMinarchistsAndNotAnarchists() {
        // Estado minimo com economia privada: minarquismo. Anarcocomunista (economia publica): continua anarquismo.
        Map<String, Double> libertarian = Map.of("estrutura", 88.0, "representacao", 84.0, "poder", 4.0, "economia", 8.0);
        Map<String, Double> classicalLiberal = Map.of("estrutura", 82.0, "representacao", 84.0, "poder", 6.0, "economia", 18.0);
        Map<String, Double> anarchoCommunist = Map.of("estrutura", 92.0, "representacao", 89.0, "poder", 8.0, "economia", 90.0);

        assertThat(politics(libertarian).valueId()).isEqualTo("minarquismo");
        assertThat(politics(classicalLiberal).valueId()).isEqualTo("minarquismo");
        assertThat(politics(anarchoCommunist).valueId()).isEqualTo("anarquismo");
    }

    @Test
    void politicsLibertarianMonarchistIsNotAMinarchist() {
        Map<String, Double> minarchist = Map.of("estrutura", 92.0, "representacao", 76.0, "poder", 5.0, "economia", 11.0, "moral", 62.0);
        Map<String, Double> monarchist = Map.of("estrutura", 91.0, "representacao", 44.0, "poder", 9.0, "economia", 8.0, "moral", 22.0);

        assertThat(politics(minarchist).valueId()).isEqualTo("minarquismo");
        assertThat(politics(monarchist).valueId()).isEqualTo("monarquismo-libertario");
        assertThat(politics(Map.of("estrutura", 30.0, "representacao", 79.0, "poder", 75.0)).valueId())
                .isEqualTo("democracia-securitaria");

        // Corporacao governamental (Yarvin, neorreacionarismo, aceleracionismo) nao se confunde com o neocameralismo.
        Map<String, Double> patchwork = Map.of("estrutura", 77.0, "representacao", 17.0, "poder", 46.0, "economia", 22.0, "tecnologia", 87.0);
        Map<String, Double> neocameralist = Map.of("estrutura", 42.0, "representacao", 5.0, "poder", 66.0, "economia", 16.0);
        assertThat(politics(patchwork).valueId()).isEqualTo("corporacao-governamental");
        assertThat(politics(neocameralist).valueId()).isEqualTo("neocameralismo");
    }

    private static Map<String, Double> with(Map<String, Double> base, String axis, double value) {
        Map<String, Double> copy = new HashMap<>(base);
        copy.put(axis, value);
        return copy;
    }

    private PoliticalValue foreign(Map<String, Double> overrides) {
        return pick(service.resolve(axes(overrides, 50), "pt"), "externa");
    }

    @Test
    void foreignPolicyValuesFollowDiplomacyAndIntervention() {
        // Diplomacia: 100 = militarista. Intervencao: 100 = nao intervencionista, 0 = projeta poder no exterior.
        assertThat(foreign(Map.of()).valueId()).isEqualTo("neutralidade");
        assertThat(foreign(Map.of()).neutral()).isTrue();
        assertThat(foreign(Map.of("diplomacia", 91.0, "intervencao", 9.0)).valueId()).isEqualTo("imperialismo");
        assertThat(foreign(Map.of("diplomacia", 85.0, "intervencao", 18.0)).valueId()).isEqualTo("expansionismo");
        assertThat(foreign(Map.of("diplomacia", 70.0, "intervencao", 85.0)).valueId()).isEqualTo("neutralidade-armada");
        assertThat(foreign(Map.of("diplomacia", 5.0, "intervencao", 92.0)).valueId()).isEqualTo("pacifismo");
        assertThat(foreign(Map.of("diplomacia", 60.0, "intervencao", 42.0)).valueId()).isEqualTo("realismo-politico");
        assertThat(foreign(Map.of("diplomacia", 30.0, "intervencao", 28.0)).valueId()).isEqualTo("intervencionismo-humanitario");
    }

    @Test
    void foreignPolicyTradeAxisSeparatesIsolationistsAndInternationalists() {
        // Isolacionismo exige comercio protecionista; internacionalismo exige comercio aberto.
        assertThat(foreign(Map.of("diplomacia", 40.0, "intervencao", 88.0, "comercio", 80.0)).valueId()).isEqualTo("isolacionismo");
        assertThat(foreign(Map.of("diplomacia", 40.0, "intervencao", 88.0, "comercio", 20.0)).valueId()).isNotEqualTo("isolacionismo");
        assertThat(foreign(Map.of("diplomacia", 15.0, "intervencao", 56.0, "comercio", 21.0)).valueId()).isEqualTo("internacionalismo");
        assertThat(foreign(Map.of("diplomacia", 15.0, "intervencao", 56.0, "comercio", 90.0)).valueId()).isNotEqualTo("internacionalismo");
        assertThat(foreign(Map.of("diplomacia", 71.0, "intervencao", 30.0, "comercio", 77.0)).valueId()).isEqualTo("nacionalismo");
    }

    @Test
    void technologyValuesFollowTheTechnologyAxis() {
        // Tecnologia: 100 = pro-tecnologia, 0 = pro-natureza e biologia.
        Object[][] expected = {
                {3.0, "primitivismo"}, {15.0, "naturalismo"}, {28.0, "ambientalismo"}, {38.0, "cautela-tecnologica"},
                {50.0, "equilibrio-tecnologico"}, {68.0, "modernismo-tecnologico"}, {77.0, "industrialismo"},
                {83.0, "otimismo-tecnologico"}, {91.0, "futurismo"}, {97.0, "aceleracionismo"}};
        for (Object[] row : expected) {
            PoliticalValue value = pick(service.resolve(axes(Map.of("tecnologia", (Double) row[0]), 50), "pt"), "tecnologicos");
            assertThat(value.valueId()).as("tecnologia %s", row[0]).isEqualTo(row[1]);
        }
        assertThat(pick(service.resolve(axes(Map.of("tecnologia", 54.0), 50), "pt"), "tecnologicos").neutral()).isTrue();
        assertThat(pick(service.resolve(axes(Map.of("tecnologia", 63.0), 50), "pt"), "tecnologicos").valueId())
                .isEqualTo("modernismo-tecnologico");
    }

    @Test
    void immigrationValuesFollowTheImmigrationAxis() {
        // Imigracao: 100 = assimilacao, 0 = multiculturalismo.
        Object[][] expected = {
                {5.0, "cosmopolitismo"}, {18.0, "multiculturalismo"}, {30.0, "pluralismo"}, {40.0, "integracao-civica"},
                {50.0, "equilibrio-migratorio"}, {62.0, "integracao-cultural"}, {75.0, "assimilacionismo"},
                {86.0, "preservacionismo-cultural"}, {95.0, "nacionalismo-etnico"}};
        for (Object[] row : expected) {
            PoliticalValue value = pick(service.resolve(axes(Map.of("imigracao", (Double) row[0]), 50), "pt"), "imigracao");
            assertThat(value.valueId()).as("imigracao %s", row[0]).isEqualTo(row[1]);
        }
        assertThat(pick(service.resolve(axes(Map.of("imigracao", 54.0), 50), "pt"), "imigracao").neutral()).isTrue();
    }

    @Test
    void economicsFillsTheClusterGapsFoundInTheCatalog() {
        // Economia, Controle, Comercio em % do polo esquerdo (100 = publico, planejamento, protecionismo).
        assertThat(economic(axes(Map.of("economia", 86.0, "controle", 82.0, "comercio", 35.0), 50), "pt").valueId())
                .isEqualTo("socialismo-internacionalista");
        assertThat(economic(axes(Map.of("economia", 28.0, "controle", 35.0, "comercio", 74.0), 50), "pt").valueId())
                .isEqualTo("capitalismo-protecionista");
        assertThat(economic(axes(Map.of("economia", 40.0, "controle", 66.0, "comercio", 72.0), 50), "pt").valueId())
                .isEqualTo("dirigismo");
        // Protecionismo: comercio muito protecionista com economia e controle altos (fascismo, falangismo, varguismo)
        assertThat(economic(axes(Map.of("economia", 73.0, "controle", 87.0, "comercio", 97.0), 50), "pt").valueId())
                .isEqualTo("protecionismo");
        assertThat(economic(axes(Map.of("economia", 72.0, "controle", 85.0, "comercio", 95.0), 50), "pt").valueId())
                .isEqualTo("protecionismo");
    }

    @Test
    void societyFillsTheClusterGapsFoundInTheCatalog() {
        // Religiao como heranca cultural (nem fe forte nem secular), progressista moderado sem religiao, moderado secular.
        assertThat(society(Map.of("moral", 18.0, "religiao", 40.0)).valueId()).isEqualTo("tradicionalismo-cultural");
        assertThat(society(Map.of("moral", 68.0, "religiao", 90.0)).valueId()).isEqualTo("progressismo-moderado-irreligioso");
        assertThat(society(Map.of("moral", 50.0, "religiao", 72.0)).valueId()).isEqualTo("moderado-secular");
    }

    @Test
    void foreignPolicyFillsTheClusterGapsFoundInTheCatalog() {
        // Diplomacia: 100 = militarista. Intervencao: 100 = nao intervencionista.
        assertThat(foreign(Map.of("diplomacia", 48.0, "intervencao", 74.0)).valueId()).isEqualTo("nao-alinhamento");
        assertThat(foreign(Map.of("diplomacia", 20.0, "intervencao", 80.0)).valueId()).isEqualTo("nao-intervencionismo");
        assertThat(foreign(Map.of("diplomacia", 77.0, "intervencao", 45.0)).valueId()).isEqualTo("militarismo");
    }

    @Test
    void politicsDirectDemocracyIsDistinctFromFederalism() {
        // Democracia direta (plebiscitos e referendos): descentralizada, muito democratica, pouco securitaria.
        assertThat(politics(Map.of("estrutura", 78.0, "representacao", 91.0, "poder", 33.0)).valueId()).isEqualTo("democracia-direta");
        assertThat(politics(Map.of("estrutura", 80.0, "representacao", 79.0, "poder", 25.0)).valueId()).isEqualTo("federalismo");
    }

    @Test
    void economicsFreeMarketWithMixedOwnershipAndNeutralTradeIsNotMutualism() {
        // Perfil real que caia em Mutualismo: economia 39,5 / controle 13,8 / comercio 43,7.
        assertThat(economic(axes(Map.of("economia", 39.5, "controle", 13.8, "comercio", 43.7), 50), "pt").valueId())
                .isEqualTo("livre-mercado-moderado");
        assertThat(economic(axes(Map.of("economia", 40.0, "controle", 20.0, "comercio", 45.0), 50), "pt").valueId())
                .isEqualTo("livre-mercado-moderado");
        // Mutualismo (propriedade cooperativa) continua no seu proprio perfil.
        assertThat(economic(axes(Map.of("economia", 55.0, "controle", 23.0, "comercio", 36.0), 50), "pt").valueId())
                .isEqualTo("mutualismo");
    }

    @Test
    void economicsCoversTheRadiusGapsFoundBySimulation() {
        // Valores adicionados para nenhuma ideologia ficar longe demais de um valor economico.
        assertThat(economic(axes(Map.of("economia", 80.0, "controle", 54.0, "comercio", 42.0), 50), "pt").valueId()).isEqualTo("coletivismo");
        assertThat(economic(axes(Map.of("economia", 31.0, "controle", 39.0, "comercio", 52.0), 50), "pt").valueId()).isEqualTo("liberalismo-pragmatico");
        assertThat(economic(axes(Map.of("economia", 43.0, "controle", 11.0, "comercio", 5.0), 50), "pt").valueId()).isEqualTo("libertarianismo-social");
        assertThat(economic(axes(Map.of("economia", 14.0, "controle", 13.0, "comercio", 41.0), 50), "pt").valueId()).isEqualTo("liberalismo-nacional");
    }

    @Test
    void radiusCoverageValuesResolveToTheirOwnProfiles() {
        // Valores adicionados para nenhuma ideologia ficar a mais de ~11 pontos de um valor.
        assertThat(foreign(Map.of("diplomacia", 29.0, "intervencao", 59.0)).valueId()).isEqualTo("diplomacia-moderada");
        assertThat(foreign(Map.of("diplomacia", 66.0, "intervencao", 60.0)).valueId()).isEqualTo("militarismo-defensivo");
        assertThat(society(Map.of("moral", 43.0, "religiao", 28.0)).valueId()).isEqualTo("conservadorismo-moderado-religioso");
        assertThat(society(Map.of("moral", 69.0, "religiao", 71.0)).valueId()).isEqualTo("progressismo-moderado-secular");
        assertThat(politics(Map.of("estrutura", 28.0, "representacao", 63.0, "poder", 34.0)).valueId()).isEqualTo("democracia-social");
        assertThat(politics(Map.of("estrutura", 49.0, "representacao", 16.0, "poder", 82.0)).valueId()).isEqualTo("autoritarismo-misto");
    }

    @Test
    void developmentalistAuthoritarianismRequiresAPlannedEconomy() {
        Map<String, Double> unitaryAuthoritarian = Map.of("estrutura", 10.0, "representacao", 26.0, "poder", 82.0);
        // Com controle alto (economia planejada) e o valor desenvolvimentista; com mercado livre, nao.
        assertThat(politics(with(unitaryAuthoritarian, "controle", 80.0)).valueId()).isEqualTo("autoritarismo-desenvolvimentista");
        assertThat(politics(with(unitaryAuthoritarian, "controle", 20.0)).valueId()).isNotEqualTo("autoritarismo-desenvolvimentista");
    }

    @Test
    void extremesAlwaysResolveOnePerCategory() throws Exception {
        int categories = readCategories().size();

        assertThat(service.resolve(axes(Map.of(), 0), "pt")).hasSize(categories);
        assertThat(service.resolve(axes(Map.of(), 100), "pt")).hasSize(categories);
    }

    @Test
    void englishReturnsEnglishTextAndUnknownLangFallsBackToPortuguese() {
        List<AxisResult> planned = axes(Map.of("economia", 94.0, "controle", 96.0, "comercio", 80.0), 50);

        PoliticalValue pt = economic(planned, "pt");
        PoliticalValue en = economic(planned, "en");
        PoliticalValue unknown = economic(planned, "xx");

        assertThat(pt.valueId()).isEqualTo("socialismo-planificado");
        assertThat(en.valueId()).isEqualTo("socialismo-planificado");
        assertThat(en.description()).isNotEqualTo(pt.description());
        assertThat(en.categoryLabel()).isEqualTo("Economy");
        assertThat(unknown.name()).isEqualTo(pt.name());
        assertThat(unknown.description()).isEqualTo(pt.description());
    }

    @Test
    void economicTextNeverMentionsStateInEitherLanguage() throws Exception {
        // A regra vale so para a categoria economica; em Politica "governo" e "Estado" sao legitimos.
        List<String> texts = new ArrayList<>();
        List<String> economicIds = new ArrayList<>();
        for (Map<String, Object> value : values(readCategories().stream()
                .filter(category -> category.get("id").equals("economicos")).findFirst().orElseThrow())) {
            texts.add(value.get("name") + " " + value.get("description"));
            economicIds.add((String) value.get("id"));
        }
        try (InputStream input = new ClassPathResource("data/i18n/en/political-values.json").getInputStream()) {
            List<Map<String, String>> overlay = objectMapper.readValue(input, new TypeReference<>() {});
            overlay.stream()
                    .filter(item -> economicIds.contains(item.get("id")))
                    .forEach(item -> texts.add(item.getOrDefault("name", "") + " " + item.getOrDefault("description", "")));
        }

        assertThat(texts).hasSizeGreaterThanOrEqualTo(21);
        for (String text : texts) {
            assertThat(text.toLowerCase()).as(text).doesNotContain(STATE_WORDS);
        }
    }

    @Test
    void startupRejectsBrokenData() {
        ObjectMapper mapper = new ObjectMapper();
        String enOk = "[{\"id\":\"c\",\"label\":\"C\"},{\"id\":\"a\",\"name\":\"A\",\"description\":\"da\"},"
                + "{\"id\":\"n\",\"name\":\"N\",\"description\":\"dn\"}]";
        String ok = category("{\"economia\":10}", "{\"economia\":50}", true);

        // sanidade: o JSON minimo valido carrega, inclusive com um eixo extra conhecido no perfil
        PoliticalValuesService.fromJson(mapper, ok, enOk);
        PoliticalValuesService.fromJson(mapper, category("{\"economia\":10,\"moral\":20}", "{\"economia\":50}", true), enOk);

        assertThatThrownBy(() -> PoliticalValuesService.fromJson(mapper,
                category("{\"naoexiste\":10}", "{\"economia\":50}", true), enOk))
                .isInstanceOf(IllegalStateException.class);
        assertThatThrownBy(() -> PoliticalValuesService.fromJson(mapper,
                category("{\"economia\":10,\"naoexiste\":3}", "{\"economia\":50}", true), enOk))
                .isInstanceOf(IllegalStateException.class);
        assertThatThrownBy(() -> PoliticalValuesService.fromJson(mapper,
                category("{}", "{\"economia\":50}", true), enOk))
                .isInstanceOf(IllegalStateException.class);
        assertThatThrownBy(() -> PoliticalValuesService.fromJson(mapper,
                category("{\"economia\":10}", "{\"economia\":50}", false), enOk))
                .isInstanceOf(IllegalStateException.class);
        assertThatThrownBy(() -> PoliticalValuesService.fromJson(mapper, ok,
                "[{\"id\":\"c\",\"label\":\"C\"},{\"id\":\"a\",\"name\":\"A\",\"description\":\"da\"}]"))
                .isInstanceOf(IllegalStateException.class);
    }

    private static String category(String profileA, String profileN, boolean hasNeutral) {
        return "[{\"id\":\"c\",\"label\":\"Cat\",\"axes\":[\"economia\"],\"values\":["
                + "{\"id\":\"a\",\"name\":\"Aa\",\"description\":\"da\",\"profile\":" + profileA + "},"
                + "{\"id\":\"n\",\"name\":\"Nn\",\"description\":\"dn\","
                + (hasNeutral ? "\"neutral\":true," : "") + "\"profile\":" + profileN + "}"
                + "]}]";
    }

    private List<Map<String, Object>> readCategories() throws Exception {
        try (InputStream input = new ClassPathResource("data/political-values.json").getInputStream()) {
            return objectMapper.readValue(input, new TypeReference<>() {});
        }
    }

    @SuppressWarnings("unchecked")
    private static List<Map<String, Object>> values(Map<String, Object> category) {
        return (List<Map<String, Object>>) category.get("values");
    }
}
