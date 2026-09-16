package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.service.CountryMatcherService;
import com.twelveaxes.service.QuizDataService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CountryMatchVariantsTest {
    @Autowired
    private QuizDataService dataService;

    @Autowired
    private CountryMatcherService matcherService;

    private List<AxisResult> axesDeTeste() {
        return dataService.getAxes().stream()
                .map(axis -> new AxisResult(
                        axis.id(), axis.label(), axis.leftPole(), axis.rightPole(),
                        72.0, 28.0, axis.leftPole(), "moderada"))
                .toList();
    }

    // O pais atual e o historico ficam em secoes separadas: cada um precisa
    // vir do seu proprio recorte do catalogo.
    @Test
    void topMatchIsAlwaysACurrentCountry() {
        var top = matcherService.findTopMatch(axesDeTeste(), QuizDataService.LANG_PT);

        assertThat(top.historical()).isFalse();
    }

    @Test
    void topHistoricalMatchIsAlwaysHistorical() {
        var top = matcherService.findTopHistoricalMatch(axesDeTeste(), QuizDataService.LANG_PT);

        assertThat(top.historical()).isTrue();
    }

    @Test
    void bottomMatchesAreTheLeastCompatibleInAscendingOrder() {
        var axes = axesDeTeste();
        var opostos = matcherService.findBottomMatches(axes, QuizDataService.LANG_PT);
        var top = matcherService.findTopMatch(axes, QuizDataService.LANG_PT);

        assertThat(opostos).hasSize(3);
        assertThat(opostos.get(0).compatibility()).isLessThanOrEqualTo(opostos.get(1).compatibility());
        assertThat(opostos.get(1).compatibility()).isLessThanOrEqualTo(opostos.get(2).compatibility());
        assertThat(opostos.get(2).compatibility()).isLessThan(top.compatibility());
    }
}
