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
        // Economia e controle em 50 com comercio muito protecionista: o mais proximo e o nacionalismo economico.
        assertThat(value.valueId()).isEqualTo("nacionalismo-economico");
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

                // Valor restrito a uma religiao (ex.: pan-islamismo) so e candidato a quem a escolheu.
                String religion = value.get("religions") instanceof java.util.List<?> religions && !religions.isEmpty()
                        ? religions.getFirst().toString() : null;
                PoliticalValue resolved = pick(service.resolve(axes(overrides, 50), "pt", religion), category.get("id"));

                assertThat(resolved.valueId()).as("perfil de %s", value.get("id")).isEqualTo(value.get("id"));
                checked++;
            }
        }
        assertThat(checked).isGreaterThanOrEqualTo(20);
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
        assertThat(foreign(Map.of()).valueId()).isEqualTo("realismo-politico");
        assertThat(foreign(Map.of()).neutral()).isTrue();
        assertThat(foreign(Map.of("diplomacia", 89.0, "intervencao", 13.0, "moral", 28.0)).valueId()).isEqualTo("imperialismo");
        assertThat(foreign(Map.of("diplomacia", 10.0, "intervencao", 77.0)).valueId()).isEqualTo("pacifismo");
        assertThat(foreign(Map.of("diplomacia", 29.0, "intervencao", 72.0, "moral", 34.0)).valueId()).isEqualTo("nao-intervencionismo");
        assertThat(foreign(Map.of("diplomacia", 45.0, "intervencao", 66.0, "imigracao", 76.0)).valueId()).isEqualTo("isolacionismo");
        assertThat(foreign(Map.of("diplomacia", 72.0, "intervencao", 24.0, "imigracao", 56.0)).valueId()).isEqualTo("intervencionismo");
        assertThat(foreign(Map.of("diplomacia", 28.0, "intervencao", 55.0, "economia", 52.0)).valueId()).isEqualTo("globalismo");
    }

    @Test
    void foreignPolicyExtraAxesSeparateNeighbours() {
        // Nacionalismo exige comercio protecionista e fronteira fechada; messianismo e colonialismo exigem religiao forte.
        assertThat(foreign(Map.of("diplomacia", 65.0, "intervencao", 38.0, "comercio", 72.0, "imigracao", 73.0)).valueId()).isEqualTo("nacionalismo");
        assertThat(foreign(Map.of("diplomacia", 83.0, "intervencao", 18.0, "religiao", 6.0, "moral", 11.0)).valueId()).isEqualTo("messianismo");
        assertThat(foreign(Map.of("diplomacia", 89.0, "intervencao", 11.0, "religiao", 1.0, "imigracao", 87.0)).valueId()).isEqualTo("colonialismo");
        assertThat(foreign(Map.of("diplomacia", 41.0, "intervencao", 68.0, "comercio", 38.0)).valueId()).isEqualTo("neutralidade-armada");
        assertThat(foreign(Map.of("diplomacia", 9.0, "intervencao", 55.0, "comercio", 21.0, "religiao", 80.0)).valueId()).isEqualTo("internacionalismo");
    }

    @Test
    void technologyValuesFollowTheTechnologyAxis() {
        // Tecnologia: 100 = pro-tecnologia, 0 = pro-natureza e biologia. Cada valor pode ter um eixo de nuance.
        assertThat(tech(Map.of("tecnologia", 0.0)).valueId()).isEqualTo("primitivismo");
        assertThat(tech(Map.of("tecnologia", 18.0, "moral", 81.0)).valueId()).isEqualTo("ambientalismo");
        assertThat(tech(Map.of("tecnologia", 15.0, "moral", 35.0)).valueId()).isEqualTo("agrarianismo");
        assertThat(tech(Map.of("tecnologia", 68.0, "comercio", 77.0)).valueId()).isEqualTo("industrialismo-nacional");
        assertThat(tech(Map.of("tecnologia", 64.0, "economia", 28.0)).valueId()).isEqualTo("industrialismo-capitalista");
        assertThat(tech(Map.of("tecnologia", 70.0, "economia", 88.0)).valueId()).isEqualTo("industrialismo-socialista");
        assertThat(tech(Map.of("tecnologia", 60.0, "moral", 67.0)).valueId()).isEqualTo("modernismo");
        assertThat(tech(Map.of("tecnologia", 71.0, "economia", 29.0)).valueId()).isEqualTo("tecnocapitalismo");
        assertThat(tech(Map.of("tecnologia", 98.0)).valueId()).isEqualTo("aceleracionismo");
        assertThat(tech(Map.of("tecnologia", 90.0, "economia", 87.0)).valueId()).isEqualTo("cybercomunismo");
        assertThat(tech(Map.of("tecnologia", 91.0, "moral", 74.0)).valueId()).isEqualTo("transhumanismo");
        assertThat(tech(Map.of("tecnologia", 54.0)).valueId()).isEqualTo("neutralidade-tecnologica");
        assertThat(tech(Map.of("tecnologia", 54.0)).neutral()).isTrue();
    }

    private PoliticalValue tech(Map<String, Double> overrides) {
        return pick(service.resolve(axes(overrides, 50), "pt"), "tecnologicos");
    }

    @Test
    void economicsValuesFollowEconomyControlAndTrade() {
        // Economia, Controle, Comercio em % do polo esquerdo (100 = publico, planejamento, protecionismo).
        assertThat(economic(axes(Map.of("economia", 94.0, "controle", 96.0, "comercio", 80.0), 50), "pt").valueId()).isEqualTo("socialismo-estatal");
        assertThat(economic(axes(Map.of("economia", 54.0, "controle", 75.0, "comercio", 83.0, "representacao", 17.0), 50), "pt").valueId()).isEqualTo("corporativismo");
        assertThat(economic(axes(Map.of("economia", 66.0, "controle", 76.0, "comercio", 66.0), 50), "pt").valueId()).isEqualTo("desenvolvimentismo");
        assertThat(economic(axes(Map.of("economia", 4.0, "controle", 4.0, "comercio", 4.0), 50), "pt").valueId()).isEqualTo("liberalismo-austriaco");
        assertThat(economic(axes(Map.of("economia", 18.0, "controle", 12.0, "comercio", 14.0), 50), "pt").valueId()).isEqualTo("liberalismo-classico");
        assertThat(economic(axes(Map.of("economia", 83.0, "controle", 74.0, "comercio", 31.0), 50), "pt").valueId()).isEqualTo("socialismo-internacionalista");
        assertThat(economic(axes(Map.of("economia", 29.0, "controle", 37.0, "comercio", 78.0), 50), "pt").valueId()).isEqualTo("protecionismo");
        assertThat(economic(axes(Map.of("economia", 50.0, "controle", 61.0, "comercio", 78.0), 50), "pt").valueId()).isEqualTo("nacionalismo-economico");
        assertThat(economic(axes(Map.of("economia", 71.0, "controle", 76.0, "comercio", 78.0), 50), "pt").valueId()).isEqualTo("trabalhismo");
    }

    private PoliticalValue territorial(Map<String, Double> overrides) {
        return pick(service.resolve(axes(overrides, 50), "pt"), "territorial");
    }

    @Test
    void territorialOrganizationFollowsTheStructureAxis() {
        assertThat(territorial(Map.of("estrutura", 3.0, "poder", 95.0)).valueId()).isEqualTo("hipercentralismo");
        assertThat(territorial(Map.of("estrutura", 26.0)).valueId()).isEqualTo("centralismo");
        assertThat(territorial(Map.of("estrutura", 70.0)).valueId()).isEqualTo("federalismo");
        assertThat(territorial(Map.of("estrutura", 80.0)).valueId()).isEqualTo("confederalismo");
        assertThat(territorial(Map.of("estrutura", 93.0)).valueId()).isEqualTo("municipalismo");
        // Descentralizacao maxima com economia publica: comunalismo (e nao municipalismo).
        assertThat(territorial(Map.of("estrutura", 93.0, "economia", 86.0)).valueId()).isEqualTo("comunalismo");
        // Cidades-estado privadas e economia de mercado: patchwork (e nao municipalismo).
        assertThat(territorial(Map.of("estrutura", 97.0, "economia", 8.0)).valueId()).isEqualTo("patchwork");
    }

    private PoliticalValue socialControl(Map<String, Double> overrides) {
        return pick(service.resolve(axes(overrides, 50), "pt"), "controle-social");
    }

    @Test
    void socialControlFollowsThePowerAxis() {
        assertThat(socialControl(Map.of("poder", 4.0)).valueId()).isEqualTo("libertarianismo");
        assertThat(socialControl(Map.of("poder", 34.0)).valueId()).isEqualTo("liberalismo-social-civil");
        // Lei imposta pela religiao: moralismo.
        assertThat(socialControl(Map.of("poder", 79.0, "religiao", 4.0)).valueId()).isEqualTo("moralismo");
        // Ordem e punicao dentro das instituicoes: securitismo.
        assertThat(socialControl(Map.of("poder", 69.0, "moral", 33.0, "representacao", 56.0)).valueId()).isEqualTo("securitismo");
        // Sociedade disciplinada e sem participacao: regimentalismo.
        assertThat(socialControl(Map.of("poder", 80.0, "representacao", 14.0)).valueId()).isEqualTo("regimentalismo");
        // Controle de todas as esferas, inclusive a economia: totalismo.
        assertThat(socialControl(Map.of("poder", 94.0, "controle", 87.0)).valueId()).isEqualTo("totalismo");
    }

    private PoliticalValue nation(Map<String, Double> overrides, String religion) {
        return pick(service.resolve(axes(overrides, 50), "pt", religion), "nacao");
    }

    @Test
    void nationValuesDefineTheirOwnAxes() {
        assertThat(nation(Map.of("imigracao", 11.0, "diplomacia", 6.0), null).valueId()).isEqualTo("cosmopolitismo");
        assertThat(nation(Map.of("imigracao", 95.0, "moral", 7.0), null).valueId()).isEqualTo("nacionalismo-etnico");
        // Individualismo: poder baixo e nao intervencao.
        assertThat(nation(Map.of("poder", 6.0, "intervencao", 78.0), null).valueId()).isEqualTo("individualismo");
    }

    @Test
    void nationPatriotismAnticolonialismAndSocialism() {
        assertThat(nation(Map.of("representacao", 63.0, "imigracao", 75.0, "moral", 34.0), null).valueId()).isEqualTo("patriotismo");
        assertThat(nation(Map.of("imigracao", 28.0, "economia", 87.0, "intervencao", 56.0), null).valueId()).isEqualTo("nacionalismo-anticolonial");
        assertThat(nation(Map.of("economia", 84.0, "imigracao", 22.0, "diplomacia", 30.0), null).valueId()).isEqualTo("socialismo");
        // Socialismo de Estado: economia publica, Estado unitario e muito poder.
        assertThat(nation(Map.of("economia", 87.0, "estrutura", 9.0, "poder", 90.0), null).valueId()).isEqualTo("socialismo-de-estado");
    }

    @Test
    void panIslamismIsOnlyForMuslims() {
        Map<String, Double> profile = Map.of("moral", 5.0, "religiao", 5.0, "intervencao", 31.0);
        assertThat(nation(profile, "islam").valueId()).isEqualTo("pan-islamismo");
        assertThat(nation(profile, null).valueId()).isNotEqualTo("pan-islamismo");
        assertThat(nation(profile, "catholic").valueId()).isNotEqualTo("pan-islamismo");
    }

    @Test
    void socialControlIsLegalismAtTheCenter() {
        PoliticalValue center = socialControl(Map.of());
        assertThat(center.valueId()).isEqualTo("legalismo");
        assertThat(center.neutral()).isTrue();
    }

    @Test
    void territorialOrganizationIsRegionalismAtTheCenter() {
        PoliticalValue center = territorial(Map.of());
        assertThat(center.valueId()).isEqualTo("regionalismo");
        assertThat(center.neutral()).isTrue();
    }

    @Test
    void economicsPrivateLeaningFreeMarketWithNeutralTrade() {
        // Perfil real: economia 39,5 / controle 13,8 / comercio 43,7 (mercado livre, comercio neutro).
        assertThat(economic(axes(Map.of("economia", 39.5, "controle", 13.8, "comercio", 43.7), 50), "pt").valueId())
                .isEqualTo("mutualismo");
        // Claramente pro-mercado com comercio moderado.
        assertThat(economic(axes(Map.of("economia", 17.2, "controle", 21.8, "comercio", 39.9), 50), "pt").valueId())
                .isEqualTo("nacional-liberalismo");
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

        assertThat(pt.valueId()).isEqualTo("socialismo-estatal");
        assertThat(en.valueId()).isEqualTo("socialismo-estatal");
        assertThat(en.description()).isNotEqualTo(pt.description());
        assertThat(en.categoryLabel()).isEqualTo("Economy");
        assertThat(unknown.name()).isEqualTo(pt.name());
        assertThat(unknown.description()).isEqualTo(pt.description());
    }

    @Test
    void societyValuesFollowMoralReligionAndImmigration() {
        // Moral 100 = progressista, Religiao 100 = irreligioso, Imigracao 100 = assimilacionista.
        assertThat(society(Map.of()).valueId()).isEqualTo("moderado");
        assertThat(society(Map.of()).neutral()).isTrue();
        assertThat(society(Map.of("moral", 8.0, "religiao", 2.0, "imigracao", 74.0, "poder", 81.0, "representacao", 26.0)).valueId())
                .isEqualTo("tradicionalismo-religioso");
        assertThat(society(Map.of("moral", 11.0, "religiao", 21.0, "imigracao", 79.0)).valueId()).isEqualTo("paleoconservadorismo");
        assertThat(society(Map.of("moral", 24.0, "religiao", 23.0, "imigracao", 62.0, "economia", 18.0)).valueId())
                .isEqualTo("liberalismo-conservador");
        assertThat(society(Map.of("moral", 50.0, "religiao", 92.0, "imigracao", 35.0)).valueId()).isEqualTo("secularismo");
        assertThat(society(Map.of("moral", 27.0, "religiao", 72.0, "imigracao", 65.0)).valueId()).isEqualTo("conservadorismo-secular");
        assertThat(society(Map.of("moral", 22.0, "religiao", 10.0, "imigracao", 25.0)).valueId()).isEqualTo("tradicionalismo-universalista");
        assertThat(society(Map.of("moral", 70.0, "religiao", 82.0, "imigracao", 75.0)).valueId()).isEqualTo("progressismo-assimilacionista");
        assertThat(society(Map.of("moral", 74.0, "religiao", 28.0, "imigracao", 18.0)).valueId()).isEqualTo("progressismo-religioso");
        // Filosofias com perfil cruzado, que cobrem lacunas da Sociedade.
        assertThat(society(Map.of("moral", 60.0, "religiao", 73.0, "imigracao", 45.0, "poder", 28.0, "representacao", 63.0, "economia", 40.0)).valueId()).isEqualTo("iluminismo");
        assertThat(society(Map.of("moral", 67.0, "religiao", 88.0, "imigracao", 35.0, "poder", 14.0, "economia", 8.0)).valueId()).isEqualTo("objetivismo");
        assertThat(society(Map.of("moral", 41.0, "religiao", 71.0, "imigracao", 29.0, "representacao", 16.0)).valueId()).isEqualTo("nietzschianismo");
        assertThat(society(Map.of("moral", 74.0, "religiao", 88.0, "imigracao", 21.0, "economia", 89.0)).valueId()).isEqualTo("marxismo");
        // Modernismo reacionario e neorreacionarismo se apoiam na tecnologia.
        assertThat(society(Map.of("moral", 15.0, "religiao", 45.0, "imigracao", 86.0, "tecnologia", 82.0)).valueId()).isEqualTo("modernismo-reacionario");
        assertThat(society(Map.of("representacao", 14.0, "imigracao", 79.0, "moral", 35.0, "tecnologia", 89.0, "economia", 19.0)).valueId()).isEqualTo("neorreacionarismo");
    }

    @Test
    void representationValuesResolveFromRepresentationAndNuances() {
        assertThat(politics(Map.of("representacao", 23.0, "religiao", 2.0)).valueId()).isEqualTo("teocracia");
        assertThat(politics(Map.of("representacao", 10.0, "poder", 84.0)).valueId()).isEqualTo("monarquismo-absoluto");
        assertThat(politics(Map.of("representacao", 13.0, "poder", 90.0, "imigracao", 91.0, "comercio", 89.0)).valueId()).isEqualTo("fascismo");
        // Autocrata que prefere liberdade civil (poder baixo) não cai mais no fascismo: ele exige o Estado que controla a vida.
        assertThat(politics(Map.of("representacao", 10.0, "poder", 29.0, "imigracao", 96.0, "comercio", 64.0)).valueId()).isNotEqualTo("fascismo");
        assertThat(politics(Map.of("representacao", 13.0, "poder", 78.0)).valueId()).isEqualTo("autocracia");
        assertThat(politics(Map.of("representacao", 92.0, "estrutura", 89.0, "poder", 8.0)).valueId()).isEqualTo("anarquismo");
        assertThat(politics(Map.of("representacao", 20.0, "poder", 88.0, "controle", 89.0)).valueId()).isEqualTo("partocracia");
        assertThat(politics(Map.of("representacao", 71.0, "economia", 47.0, "estrutura", 40.0)).valueId()).isEqualTo("democracia");
        assertThat(politics(Map.of("representacao", 90.0, "estrutura", 83.0)).valueId()).isEqualTo("democracia-direta");
        assertThat(politics(Map.of("estrutura", 73.0, "representacao", 88.0, "economia", 88.0)).valueId()).isEqualTo("conselhos");
        assertThat(politics(Map.of("representacao", 79.0, "tecnologia", 83.0)).valueId()).isEqualTo("democracia-digital");
        assertThat(politics(Map.of("representacao", 81.0, "poder", 12.0, "controle", 14.0)).valueId()).isEqualTo("minarquismo");
        assertThat(politics(Map.of("representacao", 29.0, "controle", 57.0, "tecnologia", 70.0)).valueId()).isEqualTo("tecnocracia");
        assertThat(politics(Map.of("representacao", 13.0, "poder", 86.0, "diplomacia", 87.0)).valueId()).isEqualTo("stratocracia");
        assertThat(politics(Map.of("representacao", 36.0, "moral", 22.0, "poder", 59.0)).valueId()).isEqualTo("aristocracia");
        assertThat(politics(Map.of("representacao", 42.0, "poder", 13.0)).valueId()).isEqualTo("anarco-monarquismo");
        assertThat(politics(Map.of("representacao", 12.0, "economia", 19.0, "tecnologia", 85.0)).valueId()).isEqualTo("neocameralismo");
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
