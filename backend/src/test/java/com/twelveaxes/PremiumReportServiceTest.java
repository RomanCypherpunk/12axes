package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.CountryMatch;
import com.twelveaxes.model.PersonalityMatch;
import com.twelveaxes.model.PremiumReport;
import com.twelveaxes.model.QuizResult;
import com.twelveaxes.model.ResultRequest;
import com.twelveaxes.service.PremiumReportService;
import com.twelveaxes.service.QuizDataService;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class PremiumReportServiceTest {
    @Autowired
    private PremiumReportService premiumReportService;

    @Autowired
    private QuizDataService dataService;

    @Test
    void topCountriesAreTheTenMostCompatibleCurrentCountriesSorted() {
        PremiumReport report = premiumReportService.report(TestAnswers.mixed(dataService), "pt", null);

        assertThat(report.topCountries()).hasSize(10).allMatch(country -> !country.historical());
        assertThat(report.topCountries())
                .extracting(CountryMatch::compatibility)
                .isSortedAccordingTo(Comparator.reverseOrder());
    }

    @Test
    void personalitiesByAreaHaveOneMostCompatiblePerCategoryAndAreSorted() {
        PremiumReport report = premiumReportService.report(TestAnswers.mixed(dataService), "pt", null);

        List<String> categories = report.personalitiesByArea().stream().map(PersonalityMatch::category).toList();
        assertThat(categories).doesNotHaveDuplicates();
        assertThat(categories).containsExactlyInAnyOrderElementsOf(
                dataService.getPersonalities("pt").stream().map(personality -> personality.category())
                        .filter(category -> category != null).collect(Collectors.toSet()));
        assertThat(report.personalitiesByArea())
                .extracting(PersonalityMatch::compatibility)
                .isSortedAccordingTo(Comparator.reverseOrder());
    }

    @Test
    void reportCarriesTheDisagreementsAndTheIdealGovernment() {
        PremiumReport report = premiumReportService.report(TestAnswers.mixed(dataService), "pt", null);

        assertThat(report.disagreements()).extracting(disagreement -> disagreement.kind())
                .containsExactly("ideology", "personality", "country");
        assertThat(report.idealGovernment()).hasSize(9);
    }

    @Test
    void timelineIsPartOfPremiumReportButNotOfFreeResult() {
        PremiumReport report = premiumReportService.report(TestAnswers.mixed(dataService), "pt", null);

        assertThat(report.timeline()).extracting(era -> era.key())
                .containsExactly("antiguidade", "medieval", "moderna", "xix", "xx", "xxi");
        assertThat(report.timeline()).allSatisfy(era -> assertThat(era.entries()).hasSize(4));
        // o resultado livre nao carrega a linha do tempo
        assertThat(QuizResult.class.getRecordComponents()).extracting(component -> component.getName())
                .doesNotContain("timeline");
    }

    @Test
    void sameAnswersGiveTheSameStructureInEnglish() {
        ResultRequest request = TestAnswers.mixed(dataService);

        PremiumReport pt = premiumReportService.report(request, "pt", null);
        PremiumReport en = premiumReportService.report(request, "en", null);

        assertThat(en.topCountries()).extracting(CountryMatch::compatibility)
                .containsExactlyElementsOf(pt.topCountries().stream().map(CountryMatch::compatibility).toList());
        assertThat(en.idealGovernment()).extracting(seat -> seat.seatKey())
                .containsExactlyElementsOf(pt.idealGovernment().stream().map(seat -> seat.seatKey()).toList());
    }
}
