package com.twelveaxes.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.model.AnswerImpact;
import com.twelveaxes.model.AxisAnalysis;
import com.twelveaxes.model.AxisDivergence;
import com.twelveaxes.model.AxisLevel;
import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Disagreement;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

/**
 * Analise eixo a eixo do relatorio pago. O texto de cada inclinacao e fixo (data/axis-analysis.json, e a versao em
 * ingles em data/i18n/en/axis-analysis.json), escolhido pela chave de {@link AxisLevel#textKey(String)}.
 */
@Service
public class AxisAnalysisService {
    private static final int IMPACTS_PER_AXIS = 5;
    private static final TypeReference<Map<String, String>> TEXTS = new TypeReference<>() {
    };

    private final Map<String, String> portugueseTexts;
    private final Map<String, String> englishTexts;

    public AxisAnalysisService(ObjectMapper objectMapper) {
        this.portugueseTexts = load(objectMapper, "/data/axis-analysis.json");
        this.englishTexts = load(objectMapper, "/data/i18n/en/axis-analysis.json");
    }

    /** disagreements traz a posicao da ideologia, da personalidade e do pais mais compativeis em cada eixo. */
    public List<AxisAnalysis> analyze(
            List<AxisResult> axes,
            Map<String, List<AnswerImpact>> impactsByAxis,
            List<Disagreement> disagreements,
            String lang
    ) {
        Map<String, String> texts = QuizDataService.LANG_EN.equals(QuizDataService.normalizeLang(lang)) ? englishTexts : portugueseTexts;
        return axes.stream()
                .map(axis -> {
                    AxisLevel level = AxisLevel.of(axis.leftPercent());
                    return new AxisAnalysis(
                            axis.axisId(),
                            axis.label(),
                            axis.leftPercent(),
                            level.side(),
                            level.level(),
                            texts.get(level.textKey(axis.axisId())),
                            topImpacts(impactsByAxis.getOrDefault(axis.axisId(), List.of())),
                            positionOf(disagreements, "ideology", axis.axisId()),
                            positionOf(disagreements, "personality", axis.axisId()),
                            positionOf(disagreements, "country", axis.axisId()));
                })
                .toList();
    }

    // As respostas de maior efeito no eixo. Neutras (impacto 0) nao puxam nada e ficam de fora.
    private List<AnswerImpact> topImpacts(List<AnswerImpact> impacts) {
        return impacts.stream()
                .filter(impact -> impact.impact() != 0.0)
                .sorted(Comparator.comparingDouble((AnswerImpact impact) -> Math.abs(impact.impact())).reversed())
                .limit(IMPACTS_PER_AXIS)
                .toList();
    }

    private Double positionOf(List<Disagreement> disagreements, String kind, String axisId) {
        return disagreements.stream()
                .filter(disagreement -> kind.equals(disagreement.kind()))
                .flatMap(disagreement -> disagreement.axes().stream())
                .filter(divergence -> axisId.equals(divergence.axisId()))
                .map(AxisDivergence::profileLeftPercent)
                .findFirst()
                .orElse(null);
    }

    private static Map<String, String> load(ObjectMapper objectMapper, String path) {
        try (InputStream in = AxisAnalysisService.class.getResourceAsStream(path)) {
            if (in == null) {
                throw new IllegalStateException("Arquivo de textos da analise nao encontrado: " + path);
            }
            return objectMapper.readValue(in, TEXTS);
        } catch (IOException e) {
            throw new UncheckedIOException("Nao foi possivel ler " + path, e);
        }
    }
}
