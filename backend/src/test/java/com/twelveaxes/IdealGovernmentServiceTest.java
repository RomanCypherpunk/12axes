package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.GovernmentSeat;
import com.twelveaxes.model.PersonalityMatch;
import com.twelveaxes.service.IdealGovernmentService;
import com.twelveaxes.service.PersonalityMatcherService;
import com.twelveaxes.service.QuizDataService;
import com.twelveaxes.service.ScoringService;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class IdealGovernmentServiceTest {
    @Autowired
    private IdealGovernmentService idealGovernmentService;

    @Autowired
    private PersonalityMatcherService personalityMatcherService;

    @Autowired
    private ScoringService scoringService;

    @Autowired
    private QuizDataService dataService;

    private List<AxisResult> axes() {
        return scoringService.score(TestAnswers.mixed(dataService), "pt");
    }

    @Test
    void nineSeatsInFixedOrder() {
        List<GovernmentSeat> seats = idealGovernmentService.build(axes(), "pt", null);

        assertThat(seats).extracting(GovernmentSeat::seatKey).containsExactly(
                "lider", "vice", "economia", "educacao", "estrategia", "filosofia", "social", "industria", "cultura");
        assertThat(seats).extracting(GovernmentSeat::category).containsExactly(
                "politico", "politico", "economista", "intelectual", "teorico", "filosofo", "ativista", "empresario", "religioso");
    }

    @Test
    void holderIsTheMostCompatibleOfThatCategory() {
        List<AxisResult> axes = axes();
        List<PersonalityMatch> ranking = personalityMatcherService.findAll(axes, "pt", null);

        List<GovernmentSeat> seats = idealGovernmentService.build(axes, "pt", null);

        Map<String, GovernmentSeat> bySeat = seats.stream().collect(Collectors.toMap(GovernmentSeat::seatKey, Function.identity()));
        for (String seatKey : List.of("economia", "educacao", "estrategia", "filosofia", "social", "industria", "cultura")) {
            GovernmentSeat seat = bySeat.get(seatKey);
            PersonalityMatch best = ranking.stream().filter(match -> seat.category().equals(match.category())).findFirst().orElseThrow();
            assertThat(seat.holder().personalityId()).as(seatKey).isEqualTo(best.personalityId());
        }
    }

    @Test
    void leaderIsTheTopPoliticoAndViceIsTheSecond() {
        List<AxisResult> axes = axes();
        List<PersonalityMatch> politicos = personalityMatcherService.findAll(axes, "pt", null).stream()
                .filter(match -> "politico".equals(match.category())).toList();

        List<GovernmentSeat> seats = idealGovernmentService.build(axes, "pt", null);

        assertThat(seats.get(0).holder().personalityId()).isEqualTo(politicos.get(0).personalityId());
        assertThat(seats.get(1).holder().personalityId()).isEqualTo(politicos.get(1).personalityId());
    }

    @Test
    void noPersonRepeats() {
        List<GovernmentSeat> seats = idealGovernmentService.build(axes(), "pt", null);

        assertThat(seats).extracting(seat -> seat.holder().personalityId()).doesNotHaveDuplicates();
    }

    @Test
    void sameSeatsInEnglish() {
        List<GovernmentSeat> pt = idealGovernmentService.build(axes(), "pt", null);
        List<GovernmentSeat> en = idealGovernmentService.build(
                scoringService.score(TestAnswers.mixed(dataService), "en"), "en", null);

        assertThat(en).extracting(seat -> seat.holder().personalityId())
                .containsExactlyElementsOf(pt.stream().map(seat -> seat.holder().personalityId()).toList());
    }
}
