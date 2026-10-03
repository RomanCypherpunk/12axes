package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.model.PersonalityMatch;
import com.twelveaxes.model.QuizResult;
import com.twelveaxes.service.QuizDataService;
import com.twelveaxes.service.ReligionFilter;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ReligionFilterTest {
    // Vetor muito religioso (religiao = 11.3 no polo irreligioso).
    private static final String RELIGIOUS_VECTOR = "88.8,13.8,40,87.5,68.8,41.3,20,25,41.3,11.3,10,82.5";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private QuizDataService dataService;

    // ---------- catalogos ----------

    @Test
    void everyProfileHasOnlyAllowedReligions() {
        catalogReligions().forEach((id, religions) -> assertThat(religions)
                .as("%s precisa do campo religions (use [] se nao houver vinculo)", id)
                .isNotNull()
                .allSatisfy(religion -> assertThat(religion).isIn(ReligionFilter.ALLOWED))
                .doesNotHaveDuplicates());
    }

    // Perfil inclinado ao polo religioso precisa dizer qual tradicao representa.
    // O valor vem de pesquisa, nunca do vetor: o vetor so torna o campo obrigatorio.
    @Test
    void religiousProfilesDeclareAtLeastOneReligion() {
        Map<String, Map<String, Double>> vectors = Stream.of(
                        dataService.getPersonalityProfiles().entrySet().stream()
                                .collect(Collectors.toMap(e -> "personality:" + e.getKey(), e -> e.getValue().vector())),
                        dataService.getCountryProfiles().entrySet().stream()
                                .collect(Collectors.toMap(e -> "country:" + e.getKey(), e -> e.getValue().vector())),
                        dataService.getIdeologyProfiles().entrySet().stream()
                                .collect(Collectors.toMap(e -> "ideology:" + e.getKey(), e -> e.getValue().vector())))
                .flatMap(map -> map.entrySet().stream())
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        catalogReligions().forEach((id, religions) -> {
            Map<String, Double> vector = vectors.get(id);
            if (vector != null && vector.get("religiao") <= ReligionFilter.RELIGIOUS_THRESHOLD) {
                assertThat(religions)
                        .as("%s tem religiao=%.1f (<= %.0f) e precisa de ao menos uma religiao",
                                id, vector.get("religiao"), ReligionFilter.RELIGIOUS_THRESHOLD)
                        .isNotEmpty();
            }
        });
    }

    // "only" exige ao menos uma religiao selecionavel ao lado dele.
    @Test
    void onlyMarkerComesWithASelectableReligion() {
        catalogReligions().forEach((id, religions) -> {
            if (religions.contains(ReligionFilter.ONLY)) {
                assertThat(religions)
                        .as("%s usa 'only' sem uma religiao selecionavel (ou 'other', para xintoismo e afins)", id)
                        .anyMatch(r -> ReligionFilter.SELECTABLE.contains(r) || r.equals("other"));
            }
        });
    }

    @Test
    void englishCatalogKeepsTheSameReligions() {
        var pt = dataService.getPersonalities(QuizDataService.LANG_PT);
        var en = dataService.getPersonalities(QuizDataService.LANG_EN);
        for (int i = 0; i < pt.size(); i++) {
            assertThat(en.get(i).religions()).isEqualTo(pt.get(i).religions());
        }
    }

    // ---------- regra do filtro ----------

    @Test
    void filterExcludesOnlyOtherSelectableReligions() {
        assertThat(ReligionFilter.allows(List.of("islam"), "catholic")).isFalse();
        assertThat(ReligionFilter.allows(List.of("islam", "other"), "catholic")).isFalse();
        assertThat(ReligionFilter.allows(List.of("catholic", "judaism"), "judaism")).isTrue();
        assertThat(ReligionFilter.allows(List.of(), "catholic")).isTrue();
        // "other" sozinho (Aristoteles, Confucio...) continua aparecendo para qualquer religiao.
        assertThat(ReligionFilter.allows(List.of("other"), "islam")).isTrue();
        assertThat(ReligionFilter.allows(List.of("islam"), null)).isTrue();
    }

    @Test
    void onlyMarkerShowsTheProfileSolelyToItsReligion() {
        List<String> zionism = List.of("judaism", ReligionFilter.ONLY);
        assertThat(ReligionFilter.allows(zionism, "judaism")).isTrue();
        assertThat(ReligionFilter.allows(zionism, "catholic")).isFalse();
        assertThat(ReligionFilter.allows(zionism, "islam")).isFalse();
        // "nenhuma" e sem escolha: o perfil exclusivo some.
        assertThat(ReligionFilter.allows(zionism, null)).isFalse();
        // Varias religioes listadas: aparece para qualquer uma delas.
        List<String> shared = List.of("catholic", "judaism", ReligionFilter.ONLY);
        assertThat(ReligionFilter.allows(shared, "judaism")).isTrue();
        assertThat(ReligionFilter.allows(shared, "catholic")).isTrue();
        assertThat(ReligionFilter.allows(shared, "islam")).isFalse();
        assertThat(ReligionFilter.allows(shared, null)).isFalse();
    }

    @Test
    void unknownOrMissingPreferenceMeansNoFilter() {
        assertThat(ReligionFilter.normalize(null)).isNull();
        assertThat(ReligionFilter.normalize("xyz")).isNull();
        assertThat(ReligionFilter.normalize("other")).isNull();
        assertThat(ReligionFilter.normalize(" Catholic ")).isEqualTo("catholic");
        // Links antigos com religion=christianity continuam valendo (qualquer denominacao crista).
        assertThat(ReligionFilter.normalize(" Christianity ")).isEqualTo("christianity");
    }

    @Test
    void denominationFilterSeparatesCatholicProtestantAndOrthodox() {
        List<String> luther = List.of("protestant");
        List<String> aquinas = List.of("catholic");
        List<String> dostoevsky = List.of("orthodox");
        List<String> anglican = List.of("protestant", "catholic");

        assertThat(ReligionFilter.allows(luther, "catholic")).isFalse();
        assertThat(ReligionFilter.allows(luther, "protestant")).isTrue();
        assertThat(ReligionFilter.allows(aquinas, "protestant")).isFalse();
        assertThat(ReligionFilter.allows(aquinas, "orthodox")).isFalse();
        assertThat(ReligionFilter.allows(dostoevsky, "orthodox")).isTrue();
        // Perfil ambiguo (duas denominacoes) aparece para as duas.
        assertThat(ReligionFilter.allows(anglican, "catholic")).isTrue();
        assertThat(ReligionFilter.allows(anglican, "protestant")).isTrue();
        assertThat(ReligionFilter.allows(anglican, "orthodox")).isFalse();
        // Sem religiao escolhida (ou outra religiao), nenhum perfil cristao e escondido pelas denominacoes.
        assertThat(ReligionFilter.allows(luther, null)).isTrue();
        assertThat(ReligionFilter.allows(luther, "islam")).isFalse();
    }

    @Test
    void otherPlusOnlyHidesFromEveryReligionButShowsToNoReligion() {
        List<String> shinto = List.of("other", ReligionFilter.ONLY);
        for (String religion : ReligionFilter.SELECTABLE) {
            assertThat(ReligionFilter.allows(shinto, religion)).as(religion).isFalse();
        }
        assertThat(ReligionFilter.allows(shinto, "christianity")).isFalse();
        assertThat(ReligionFilter.allows(shinto, null)).isTrue();
        // Sem o "only", "other" segue sendo curinga.
        assertThat(ReligionFilter.allows(List.of("other"), "catholic")).isTrue();
    }

    @Test
    void legacyChristianityPreferenceAcceptsAnyDenomination() {
        assertThat(ReligionFilter.allows(List.of("protestant"), "christianity")).isTrue();
        assertThat(ReligionFilter.allows(List.of("orthodox"), "christianity")).isTrue();
        assertThat(ReligionFilter.allows(List.of("islam"), "christianity")).isFalse();
        assertThat(ReligionFilter.allows(List.of("judaism", ReligionFilter.ONLY), "christianity")).isFalse();
    }

    // ---------- endpoint ----------

    @Test
    void linkWithoutReligionShowsTheGeneralRanking() throws Exception {
        QuizResult none = fetch(null);
        QuizResult unknown = fetch("xyz");

        assertThat(unknown.personalityMatches()).isEqualTo(none.personalityMatches());
        assertThat(unknown.matches()).isEqualTo(none.matches());
        assertThat(unknown.topCountryMatches()).isEqualTo(none.topCountryMatches());
    }

    @Test
    void preferenceHidesProfilesOfOtherReligionsAndKeepsCompatibility() throws Exception {
        QuizResult general = fetch(null);
        for (String religion : ReligionFilter.SELECTABLE) {
            QuizResult filtered = fetch(religion);
            Map<String, List<String>> religions = catalogReligions();

            Stream.of(
                            filtered.personalityMatches().stream().map(m -> "personality:" + m.personalityId()),
                            filtered.categoryBestMatches().stream().map(m -> "personality:" + m.personalityId()),
                            filtered.matches().stream().map(m -> "ideology:" + m.ideologyId()),
                            filtered.topCountryMatches().stream().map(m -> "country:" + m.countryId()),
                            Stream.of("country:" + filtered.topCountryMatch().countryId(),
                                    "country:" + filtered.topHistoricalCountryMatch().countryId()))
                    .flatMap(Function.identity())
                    .forEach(id -> assertThat(ReligionFilter.allows(religions.get(id), religion))
                            .as("%s nao deveria aparecer com religion=%s", id, religion)
                            .isTrue());

            // A porcentagem nao muda: o filtro so escolhe quem aparece.
            Map<String, Double> before = general.personalityMatches().stream()
                    .collect(Collectors.toMap(PersonalityMatch::personalityId, PersonalityMatch::compatibility));
            filtered.personalityMatches().stream()
                    .filter(m -> before.containsKey(m.personalityId()))
                    .forEach(m -> assertThat(m.compatibility()).isEqualTo(before.get(m.personalityId())));
        }
    }

    @Test
    void christianPreferenceChangesARealRanking() throws Exception {
        QuizResult general = fetch(null);
        QuizResult christian = fetch("catholic");
        Map<String, List<String>> religions = catalogReligions();

        boolean generalHadExcluded = Stream.concat(
                        general.personalityMatches().stream().map(m -> "personality:" + m.personalityId()),
                        Stream.concat(general.matches().stream().map(m -> "ideology:" + m.ideologyId()),
                                general.topCountryMatches().stream().map(m -> "country:" + m.countryId())))
                .anyMatch(id -> !ReligionFilter.allows(religions.get(id), "catholic"));
        assertThat(generalHadExcluded)
                .as("o vetor de teste deveria trazer ao menos um perfil nao cristao no ranking geral")
                .isTrue();
        assertThat(christian.personalityMatches()).hasSize(general.personalityMatches().size());
    }

    private QuizResult fetch(String religion) throws Exception {
        var request = get("/api/results/by-axes").param("v", RELIGIOUS_VECTOR);
        if (religion != null) {
            request = request.param("religion", religion);
        }
        String body = mockMvc.perform(request)
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        return objectMapper.readValue(body, QuizResult.class);
    }

    private Map<String, List<String>> catalogReligions() {
        Map<String, List<String>> all = new java.util.HashMap<>();
        dataService.getPersonalities().forEach(p -> all.put("personality:" + p.id(), p.religions()));
        dataService.getCountries().forEach(c -> all.put("country:" + c.id(), c.religions()));
        dataService.getIdeologies().forEach(i -> all.put("ideology:" + i.id(), i.religions()));
        return all;
    }
}
