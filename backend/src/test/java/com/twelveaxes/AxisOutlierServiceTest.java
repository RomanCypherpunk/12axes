package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.service.AxisOutlierService;
import com.twelveaxes.service.QuizDataService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class AxisOutlierServiceTest {
    @Autowired
    private QuizDataService dataService;

    @Autowired
    private AxisOutlierService outlierService;

    // Perfil extremo em estrutura (96.3 = fortemente federal) e praticamente no
    // centro em intervencao (52.5) — o incomum e o comum sao previsiveis.
    private List<AxisResult> axesDeTeste() {
        List<Double> valores = List.of(96.3, 18.8, 43.8, 75.0, 57.5, 52.5, 15.0, 12.5, 20.0, 63.7, 8.8, 76.3);
        var axes = dataService.getAxes();
        return java.util.stream.IntStream.range(0, axes.size())
                .mapToObj(i -> {
                    var axis = axes.get(i);
                    double left = valores.get(i);
                    return new AxisResult(
                            axis.id(), axis.label(), axis.leftPole(), axis.rightPole(),
                            left, 100.0 - left,
                            left >= 50 ? axis.leftPole() : axis.rightPole(), "moderada");
                })
                .toList();
    }

    @Test
    void mostUnusualIsTheAxisFurthestFromTheCatalogMedian() {
        var incomum = outlierService.findMostUnusual(axesDeTeste(), QuizDataService.LANG_PT);
        var comum = outlierService.findMostCommon(axesDeTeste(), QuizDataService.LANG_PT);

        assertThat(incomum).isNotNull();
        assertThat(comum).isNotNull();
        assertThat(incomum.distanceFromMedian()).isGreaterThan(comum.distanceFromMedian());
    }

    @Test
    void dominantPoleFollowsTheUserPosition() {
        var incomum = outlierService.findMostUnusual(axesDeTeste(), QuizDataService.LANG_PT);
        var axis = dataService.getAxes().stream()
                .filter(candidate -> candidate.id().equals(incomum.axisId()))
                .findFirst()
                .orElseThrow();

        String esperado = incomum.userPercent() >= 50 ? axis.leftPole() : axis.rightPole();
        assertThat(incomum.dominantPole()).isEqualTo(esperado);
    }

    @Test
    void strongerThanPercentIsAPercentage() {
        var incomum = outlierService.findMostUnusual(axesDeTeste(), QuizDataService.LANG_PT);
        var comum = outlierService.findMostCommon(axesDeTeste(), QuizDataService.LANG_PT);

        assertThat(incomum.strongerThanPercent()).isBetween(0.0, 100.0);
        assertThat(comum.strongerThanPercent()).isBetween(0.0, 100.0);
    }

    // Uma posicao extrema tem de superar boa parte do catalogo naquele polo.
    @Test
    void extremePositionBeatsMostOfTheCatalog() {
        var incomum = outlierService.findMostUnusual(axesDeTeste(), QuizDataService.LANG_PT);

        assertThat(incomum.strongerThanPercent()).isGreaterThan(70.0);
    }

    @Test
    void englishLabelsComeFromTheEnglishCatalog() {
        var pt = outlierService.findMostUnusual(axesDeTeste(), QuizDataService.LANG_PT);
        var en = outlierService.findMostUnusual(axesDeTeste(), QuizDataService.LANG_EN);

        assertThat(en.axisId()).isEqualTo(pt.axisId());
        assertThat(en.label()).isNotBlank();
    }
}
