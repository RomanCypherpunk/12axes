package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.model.AnswerImpact;
import com.twelveaxes.model.AnswerValue;
import com.twelveaxes.model.AxisAnalysis;
import com.twelveaxes.model.AxisLevel;
import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.PremiumRanking;
import com.twelveaxes.model.PremiumReport;
import com.twelveaxes.model.RankingRow;
import com.twelveaxes.model.ResultRequest;
import com.twelveaxes.model.SubmittedAnswer;
import com.twelveaxes.service.PremiumReportService;
import com.twelveaxes.service.QuizDataService;
import com.twelveaxes.service.ReligionFilter;
import com.twelveaxes.service.ScoringService;
import java.io.InputStream;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class AxisAnalysisServiceTest {
    private static final List<String> LEVEL_KEYS = List.of(
            "left.muito_forte", "left.forte", "left.inclinado", "balanced", "right.inclinado", "right.forte", "right.muito_forte");

    @Autowired
    private PremiumReportService premiumReportService;

    @Autowired
    private ScoringService scoringService;

    @Autowired
    private QuizDataService dataService;

    @Autowired
    private ObjectMapper objectMapper;

    private Map<String, String> texts(String path) throws Exception {
        try (InputStream in = getClass().getResourceAsStream(path)) {
            assertThat(in).as(path).isNotNull();
            return objectMapper.readValue(in, objectMapper.getTypeFactory().constructMapType(Map.class, String.class, String.class));
        }
    }

    @Test
    void oneAnalysisPerAxisInAxesOrder() {
        ResultRequest request = TestAnswers.mixed(dataService);

        PremiumReport report = premiumReportService.report(request, "pt", null);

        List<AxisResult> axes = scoringService.score(request, "pt");
        assertThat(report.axisAnalysis()).extracting(AxisAnalysis::axisId)
                .containsExactlyElementsOf(axes.stream().map(AxisResult::axisId).toList());
        for (int i = 0; i < axes.size(); i++) {
            AxisAnalysis analysis = report.axisAnalysis().get(i);
            assertThat(analysis.userLeftPercent()).isEqualTo(axes.get(i).leftPercent());
            AxisLevel level = AxisLevel.of(axes.get(i).leftPercent());
            assertThat(analysis.side()).isEqualTo(level.side());
            assertThat(analysis.level()).isEqualTo(level.level());
        }
    }

    @Test
    void impactsAreAtMostFivePerAxisOrderedByAbsoluteImpactAndNeverNeutral() {
        ResultRequest request = TestAnswers.mixed(dataService);
        Set<String> neutralIds = request.answers().stream()
                .filter(answer -> answer.answer() == AnswerValue.NEUTRAL)
                .map(SubmittedAnswer::questionId)
                .collect(Collectors.toSet());
        assertThat(neutralIds).isNotEmpty();

        PremiumReport report = premiumReportService.report(request, "pt", null);

        for (AxisAnalysis analysis : report.axisAnalysis()) {
            assertThat(analysis.impacts().size()).isBetween(1, 5);
            assertThat(analysis.impacts()).extracting(impact -> Math.abs(impact.impact()))
                    .isSortedAccordingTo(Comparator.reverseOrder());
            assertThat(analysis.impacts()).extracting(AnswerImpact::questionId).doesNotContainAnyElementsOf(neutralIds);
        }
    }

    @Test
    void positionsOfTheThreeTopProfilesComeFromTheDisagreements() {
        PremiumReport report = premiumReportService.report(TestAnswers.mixed(dataService), "pt", null);

        for (AxisAnalysis analysis : report.axisAnalysis()) {
            assertThat(analysis.ideologyLeftPercent()).isNotNull().isBetween(0.0, 100.0);
            assertThat(analysis.personalityLeftPercent()).isNotNull().isBetween(0.0, 100.0);
            assertThat(analysis.countryLeftPercent()).isNotNull().isBetween(0.0, 100.0);
        }
    }

    @Test
    void textIsFoundForTheAxesAlreadyWrittenAndStaysNullForTheOthers() {
        PremiumReport report = premiumReportService.report(TestAnswers.mixed(dataService), "pt", null);

        report.axisAnalysis().forEach(analysis -> {
            if ("estrutura".equals(analysis.axisId())) {
                assertThat(analysis.text()).isNotBlank();
            }
        });
    }

    @Test
    void everyWrittenAxisHasTheSevenTextsInPortugueseAndEnglish() throws Exception {
        Map<String, String> pt = texts("/data/axis-analysis.json");
        Map<String, String> en = texts("/data/i18n/en/axis-analysis.json");

        assertThat(new TreeSet<>(en.keySet())).isEqualTo(new TreeSet<>(pt.keySet()));
        Set<String> axisIds = pt.keySet().stream().map(key -> key.substring(0, key.indexOf('.'))).collect(Collectors.toSet());
        assertThat(axisIds).isNotEmpty();
        for (String axisId : axisIds) {
            for (String levelKey : LEVEL_KEYS) {
                assertThat(pt).as("PT %s.%s", axisId, levelKey).containsKey(axisId + "." + levelKey);
            }
        }
        assertThat(pt.values()).allSatisfy(text -> assertThat(text).isNotBlank());
        assertThat(en.values()).allSatisfy(text -> assertThat(text).isNotBlank());
    }

    // Os quatro lotes de textos estao escritos: 12 eixos x 7 inclinacoes, em PT e EN.
    @Test
    void allTwelveAxesAreCovered() throws Exception {
        Map<String, String> pt = texts("/data/axis-analysis.json");
        Map<String, String> en = texts("/data/i18n/en/axis-analysis.json");

        for (var axis : dataService.getAxes("pt")) {
            for (String levelKey : LEVEL_KEYS) {
                assertThat(pt).containsKey(axis.id() + "." + levelKey);
                assertThat(en).containsKey(axis.id() + "." + levelKey);
            }
        }
        assertThat(pt).hasSize(84);
        assertThat(en).hasSize(84);
    }

    @Test
    void rankingIsCompleteSortedAndSlim() {
        PremiumReport report = premiumReportService.report(TestAnswers.mixed(dataService), "pt", null);

        PremiumRanking ranking = report.ranking();
        assertThat(ranking.ideologies()).hasSize((int) dataService.getIdeologies("pt").stream()
                .filter(ideology -> ReligionFilter.allows(ideology.religions(), null)).count());
        assertThat(ranking.personalities()).hasSize((int) dataService.getPersonalities("pt").stream()
                .filter(personality -> ReligionFilter.allows(personality.religions(), null)).count());
        assertThat(ranking.countries()).isNotEmpty();
        for (List<RankingRow> rows : List.of(ranking.ideologies(), ranking.personalities(), ranking.countries(), ranking.parties())) {
            assertThat(rows).extracting(RankingRow::compatibility).isSortedAccordingTo(Comparator.reverseOrder());
            assertThat(rows).extracting(RankingRow::id).doesNotHaveDuplicates();
            assertThat(rows).allSatisfy(row -> assertThat(row.name()).isNotBlank());
        }
        assertThat(ranking.countries()).anyMatch(RankingRow::historical).anyMatch(row -> !row.historical());
    }
}
