package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.model.AnswerValue;
import com.twelveaxes.model.QuizPayload;
import com.twelveaxes.model.QuizResult;
import com.twelveaxes.model.ResultRequest;
import com.twelveaxes.model.SubmittedAnswer;
import com.twelveaxes.model.ValueTree;
import com.twelveaxes.service.FullValuesKey;
import com.twelveaxes.service.FullValuesService;
import com.twelveaxes.service.QuizDataService;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/** API dos valores completos: arvores no quiz de 240, valores e chave no resultado, `f` no link compartilhado. */
@SpringBootTest
@AutoConfigureMockMvc
class FullValuesApiTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private QuizDataService dataService;
    @Autowired
    private FullValuesService fullValuesService;

    /** Valores finais da Politica na arvore real (nao depende de quais sao). */
    private List<String> politicaLeaves() {
        ValueTree.View politica = fullValuesService.trees("pt").stream()
                .filter(tree -> tree.categoryId().equals("politica")).findFirst().orElseThrow();
        return politica.nodes().stream().flatMap(node -> node.options().stream())
                .map(ValueTree.OptionView::value).filter(java.util.Objects::nonNull)
                .collect(Collectors.toCollection(LinkedHashSet::new)).stream().toList();
    }

    private QuizResult postResult(Map<String, String> values) throws Exception {
        List<SubmittedAnswer> answers = dataService.getQuestions().stream()
                .map(question -> new SubmittedAnswer(question.id(), AnswerValue.NEUTRAL)).toList();
        String body = objectMapper.writeValueAsString(new ResultRequest(answers, "extreme", null, values));
        String response = mockMvc.perform(post("/api/results").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        return objectMapper.readValue(response, QuizResult.class);
    }

    private QuizResult byAxes(QuizResult source, String key) throws Exception {
        String vector = source.axes().stream().map(axis -> String.valueOf(axis.leftPercent()))
                .collect(Collectors.joining(","));
        var request = get("/api/results/by-axes").param("v", vector);
        if (key != null) {
            request = request.param("f", key);
        }
        String response = mockMvc.perform(request).andExpect(status().isOk()).andReturn().getResponse()
                .getContentAsString(StandardCharsets.UTF_8);
        return objectMapper.readValue(response, QuizResult.class);
    }

    @Test
    void extremeQuizCarriesTheTreesAndOtherVariantsDoNot() throws Exception {
        String extreme = mockMvc.perform(get("/api/quiz").param("variant", "extreme")).andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        QuizPayload payload = objectMapper.readValue(extreme, QuizPayload.class);
        assertThat(payload.valueTrees()).extracting(ValueTree.View::categoryId).contains("politica");
        assertThat(payload.valueTrees()).allSatisfy(tree -> assertThat(tree.nodes()).isNotEmpty());

        for (String variant : List.of("short", "extended")) {
            String other = mockMvc.perform(get("/api/quiz").param("variant", variant)).andExpect(status().isOk())
                    .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
            assertThat(objectMapper.readValue(other, QuizPayload.class).valueTrees()).isEmpty();
        }
    }

    @Test
    void postWithValuesReturnsThemWithAKeyThatRebuildsThemFromTheLink() throws Exception {
        String leaf = politicaLeaves().getFirst();
        QuizResult result = postResult(Map.of("politica", leaf));

        assertThat(result.fullValues()).hasSize(1);
        assertThat(result.fullValues().getFirst().categoryId()).isEqualTo("politica");
        assertThat(result.fullValues().getFirst().valueId()).isEqualTo(leaf);
        assertThat(result.fullValuesKey()).hasSize(10);

        QuizResult rebuilt = byAxes(result, result.fullValuesKey());
        assertThat(rebuilt.fullValues()).isEqualTo(result.fullValues());
        assertThat(rebuilt.fullValuesKey()).isEqualTo(result.fullValuesKey());
    }

    @Test
    void sameVectorWithDifferentKeysNeverLeaksValuesBetweenRequests() throws Exception {
        List<String> leaves = politicaLeaves();
        QuizResult base = postResult(Map.of());
        String keyA = fullValuesService.encodeKey(Map.of("politica", leaves.get(0))).orElseThrow();
        String keyB = fullValuesService.encodeKey(Map.of("politica", leaves.get(1))).orElseThrow();

        QuizResult a = byAxes(base, keyA);
        QuizResult b = byAxes(base, keyB);
        QuizResult none = byAxes(base, null);

        assertThat(a.fullValues().getFirst().valueId()).isEqualTo(leaves.get(0));
        assertThat(b.fullValues().getFirst().valueId()).isEqualTo(leaves.get(1));
        assertThat(none.fullValues()).isNull();
        assertThat(none.fullValuesKey()).isNull();
    }

    @Test
    void anInvalidKeyFallsBackToTheDerivedValuesNeverAnError() throws Exception {
        QuizResult base = postResult(Map.of());
        String outOfCatalog = FullValuesKey.encode(new int[] {63, 0, 0, 0, 0, 0, 0, 0});
        for (String key : List.of("lixo", "1AAAAAAAAA", outOfCatalog, "", "%20")) {
            QuizResult result = byAxes(base, key);
            assertThat(result.fullValues()).as("f=%s", key).isNull();
            assertThat(result.politicalValues()).as("f=%s", key).isNotEmpty();
        }
    }

    @Test
    void withoutValuesTheResultIsLikeBefore() throws Exception {
        QuizResult result = postResult(Map.of());
        assertThat(result.fullValues()).isNull();
        assertThat(result.fullValuesKey()).isNull();
        assertThat(result.politicalValues()).hasSize(6);
    }
}
