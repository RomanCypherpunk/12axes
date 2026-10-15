package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.service.PartyDimensionMatcherService;
import com.twelveaxes.service.PartyMatcherService;
import com.twelveaxes.service.QuizDataService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class PartyDimensionMatcherServiceTest {
    @Autowired
    private QuizDataService dataService;

    @Autowired
    private PartyDimensionMatcherService partyDimensionMatcherService;

    @Autowired
    private PartyMatcherService partyMatcherService;

    private List<AxisResult> profileUnderTest() {
        List<Double> leftPercents = List.of(96.3, 18.8, 43.8, 75.0, 57.5, 52.5,
                15.0, 12.5, 20.0, 63.7, 8.8, 76.3);
        var axes = dataService.getAxes();
        return java.util.stream.IntStream.range(0, axes.size())
                .mapToObj(index -> {
                    var axis = axes.get(index);
                    double left = leftPercents.get(index);
                    return new AxisResult(axis.id(), axis.label(), axis.leftPole(), axis.rightPole(),
                            left, 100.0 - left,
                            left >= 50 ? axis.leftPole() : axis.rightPole(), "Moderada");
                })
                .toList();
    }

    @Test
    void returnsOneUniquePartyForEachProfileDimension() {
        var axes = profileUnderTest();
        var top = partyMatcherService.findTopMatches(axes, QuizDataService.LANG_PT, null);
        var firstId = top.getFirst().partyId();
        var matches = partyDimensionMatcherService.findAll(
                axes, QuizDataService.LANG_PT, List.of(firstId));

        assertThat(matches).hasSize(3);
        assertThat(matches).extracting(match -> match.dimension())
                .containsExactly("political", "social", "economic");
        assertThat(matches).extracting(match -> match.match().partyId())
                .doesNotContain(firstId)
                .doesNotHaveDuplicates();
        assertThat(matches).allSatisfy(match ->
                assertThat(match.match().compatibility()).isBetween(0.0, 100.0));
    }
}

