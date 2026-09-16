package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.service.IdeologyMatcherService;
import com.twelveaxes.service.QuizDataService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class IdeologyBottomMatchTest {
    @Autowired
    private QuizDataService dataService;

    @Autowired
    private IdeologyMatcherService matcherService;

    private List<AxisResult> axesDeTeste() {
        return dataService.getAxes().stream()
                .map(axis -> new AxisResult(
                        axis.id(), axis.label(), axis.leftPole(), axis.rightPole(),
                        72.0, 28.0, axis.leftPole(), "moderada"))
                .toList();
    }

    @Test
    void bottomMatchIsLessCompatibleThanEveryTopMatch() {
        var axes = axesDeTeste();
        var oposta = matcherService.findBottomMatch(axes, QuizDataService.LANG_PT);
        var topo = matcherService.findMatches(axes, QuizDataService.LANG_PT);

        assertThat(topo).isNotEmpty();
        assertThat(topo)
                .allSatisfy(match -> assertThat(oposta.compatibility())
                        .isLessThan(match.compatibility()));
    }

    // A secao de outras ideologias nao muda de tamanho.
    @Test
    void topMatchesStillReturnFour() {
        assertThat(matcherService.findMatches(axesDeTeste(), QuizDataService.LANG_PT)).hasSize(4);
    }
}
