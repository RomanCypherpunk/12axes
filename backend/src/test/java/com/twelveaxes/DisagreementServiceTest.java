package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.within;

import com.twelveaxes.model.AxisDivergence;
import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.CountryMatch;
import com.twelveaxes.model.Disagreement;
import com.twelveaxes.model.IdeologyMatch;
import com.twelveaxes.model.PersonalityMatch;
import com.twelveaxes.model.ResultRequest;
import com.twelveaxes.service.CountryMatcherService;
import com.twelveaxes.service.DisagreementService;
import com.twelveaxes.service.IdeologyMatcherService;
import com.twelveaxes.service.PersonalityMatcherService;
import com.twelveaxes.service.QuizDataService;
import com.twelveaxes.service.ScoringService;
import java.util.Comparator;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DisagreementServiceTest {
    @Autowired
    private DisagreementService disagreementService;

    @Autowired
    private ScoringService scoringService;

    @Autowired
    private IdeologyMatcherService ideologyMatcherService;

    @Autowired
    private PersonalityMatcherService personalityMatcherService;

    @Autowired
    private CountryMatcherService countryMatcherService;

    @Autowired
    private QuizDataService dataService;

    private List<AxisResult> axes(String lang) {
        ResultRequest request = TestAnswers.mixed(dataService);
        return scoringService.score(request, lang);
    }

    @Test
    void comparesAgainstTheTopProfileOfEachKind() {
        List<AxisResult> axes = axes("pt");

        List<Disagreement> result = disagreementService.compute(axes, "pt", null);

        IdeologyMatch ideology = ideologyMatcherService.findMatches(axes, "pt", null).getFirst();
        PersonalityMatch personality = personalityMatcherService.findMatches(axes, "pt", null).getFirst();
        CountryMatch country = countryMatcherService.findTopMatch(axes, "pt", null);
        assertThat(result).extracting(Disagreement::kind).containsExactly("ideology", "personality", "country");
        assertThat(result.get(0).profileId()).isEqualTo(ideology.ideologyId());
        assertThat(result.get(1).profileId()).isEqualTo(personality.personalityId());
        assertThat(result.get(2).profileId()).isEqualTo(country.countryId());
    }

    @Test
    void eachKindCarriesTheCategoryOfTheIdeologyClosestToThatProfile() {
        List<AxisResult> axes = axes("pt");

        List<Disagreement> result = disagreementService.compute(axes, "pt", null);

        IdeologyMatch ideology = ideologyMatcherService.findMatches(axes, "pt", null).getFirst();
        assertThat(result.get(0).ideologyCategory()).isEqualTo(ideology.category());
        for (Disagreement disagreement : result) {
            assertThat(disagreement.ideologyCategory()).isNotBlank();
        }
        // A personalidade e o pais tem o seu proprio vizinho: a categoria vem da ideologia mais proxima do vetor DELES.
        PersonalityMatch personality = personalityMatcherService.findMatches(axes, "pt", null).getFirst();
        List<AxisResult> personalityAxes = scoringService.scoreFromLeftPercents(
                axes.stream().map(axis -> personality.vector().getOrDefault(axis.axisId(), 50.0)).toList(), "pt");
        assertThat(result.get(1).ideologyCategory())
                .isEqualTo(ideologyMatcherService.findMatches(personalityAxes, "pt", null).getFirst().category());
    }

    @Test
    void everyKindListsTheTwelveAxesSortedByAbsoluteDifference() {
        List<Disagreement> result = disagreementService.compute(axes("pt"), "pt", null);

        assertThat(result).allSatisfy(disagreement -> {
            assertThat(disagreement.axes()).hasSize(12);
            assertThat(disagreement.axes())
                    .extracting(divergence -> Math.abs(divergence.difference()))
                    .isSortedAccordingTo(Comparator.reverseOrder());
        });
    }

    @Test
    void differenceIsUserMinusProfile() {
        List<Disagreement> result = disagreementService.compute(axes("pt"), "pt", null);

        assertThat(result).flatExtracting(Disagreement::axes).allSatisfy((AxisDivergence divergence) ->
                assertThat(divergence.difference())
                        .isCloseTo(divergence.userLeftPercent() - divergence.profileLeftPercent(), within(0.05)));
    }

    @Test
    void worksInEnglishWithTheSameProfiles() {
        List<Disagreement> pt = disagreementService.compute(axes("pt"), "pt", null);
        List<Disagreement> en = disagreementService.compute(axes("en"), "en", null);

        assertThat(en).extracting(Disagreement::kind).containsExactlyElementsOf(pt.stream().map(Disagreement::kind).toList());
        assertThat(en.getFirst().axes().getFirst().axisId()).isEqualTo(pt.getFirst().axes().getFirst().axisId());
    }
}
