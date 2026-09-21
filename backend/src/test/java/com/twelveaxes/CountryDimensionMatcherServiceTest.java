package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.service.CountryDimensionMatcherService;
import com.twelveaxes.service.CountryMatcherService;
import com.twelveaxes.service.QuizDataService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CountryDimensionMatcherServiceTest {
    @Autowired
    private QuizDataService dataService;

    @Autowired
    private CountryDimensionMatcherService countryDimensionMatcherService;

    @Autowired
    private CountryMatcherService countryMatcherService;

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
    void returnsOneUniqueCountryForEachProfileDimension() {
        var axes = profileUnderTest();
        var current = countryMatcherService.findTopMatch(axes, QuizDataService.LANG_PT);
        var historical = countryMatcherService.findTopHistoricalMatch(axes, QuizDataService.LANG_PT);
        var matches = countryDimensionMatcherService.findAll(
                axes, QuizDataService.LANG_PT, List.of(current.countryId(), historical.countryId()));

        assertThat(matches).hasSize(3);
        assertThat(matches).extracting(match -> match.dimension())
                .containsExactly("political", "social", "economic");
        assertThat(matches).extracting(match -> match.match().countryId())
                .doesNotContain(current.countryId(), historical.countryId())
                .doesNotHaveDuplicates();
        assertThat(matches).allSatisfy(match ->
                assertThat(match.match().compatibility()).isBetween(0.0, 100.0));
    }
}
