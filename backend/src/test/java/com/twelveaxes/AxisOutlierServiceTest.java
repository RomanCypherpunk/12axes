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

    private List<AxisResult> axesCom(List<Double> valores) {
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

    // Perfil extremo em estrutura (96.3 = fortemente federal) e quase no centro
    // em intervencao (52.5).
    private List<AxisResult> axesDeTeste() {
        return axesCom(List.of(96.3, 18.8, 43.8, 75.0, 57.5, 52.5, 15.0, 12.5, 20.0, 63.7, 8.8, 76.3));
    }

    // Todas as respostas neutras: nenhum eixo tem polo dominante.
    private List<AxisResult> axesNeutros() {
        return axesCom(java.util.Collections.nCopies(12, 50.0));
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

        assertThat(incomum.balanced()).isFalse();
        assertThat(incomum.dominantPole())
                .isEqualTo(incomum.userPercent() > 50 ? axis.leftPole() : axis.rightPole());
    }

    // Um perfil todo em 50 nao pende para polo nenhum: dizer que ele e "mais
    // democracia" ou "mais seguranca" seria arbitrario.
    @Test
    void neutralProfileHasNoDominantPole() {
        var incomum = outlierService.findMostUnusual(axesNeutros(), QuizDataService.LANG_PT);
        var comum = outlierService.findMostCommon(axesNeutros(), QuizDataService.LANG_PT);

        assertThat(incomum.balanced()).isTrue();
        assertThat(incomum.dominantPole()).isNull();
        assertThat(comum.balanced()).isTrue();
        assertThat(comum.dominantPole()).isNull();
    }

    // O polo citado na comparacao segue a posicao do usuario EM RELACAO A
    // MEDIANA. Num eixo cuja mediana e ~67, quem responde 50 esta do lado
    // direito (autocracia), nao do esquerdo.
    @Test
    void abovePoleFollowsThePositionRelativeToTheMedian() {
        var neutro = outlierService.findMostUnusual(axesNeutros(), QuizDataService.LANG_PT);
        var axis = dataService.getAxes().stream()
                .filter(candidate -> candidate.id().equals(neutro.axisId()))
                .findFirst()
                .orElseThrow();

        String esperado = neutro.userPercent() >= neutro.catalogMedian() ? axis.leftPole() : axis.rightPole();
        assertThat(neutro.abovePole()).isEqualTo(esperado);
    }

    @Test
    void abovePercentIsAPercentage() {
        var incomum = outlierService.findMostUnusual(axesDeTeste(), QuizDataService.LANG_PT);
        var comum = outlierService.findMostCommon(axesDeTeste(), QuizDataService.LANG_PT);

        assertThat(incomum.abovePercent()).isBetween(0.0, 100.0);
        assertThat(comum.abovePercent()).isBetween(0.0, 100.0);
    }

    // Uma posicao extrema tem de superar boa parte do catalogo naquele polo.
    @Test
    void extremePositionBeatsMostOfTheCatalog() {
        var incomum = outlierService.findMostUnusual(axesDeTeste(), QuizDataService.LANG_PT);

        assertThat(incomum.abovePercent()).isGreaterThan(70.0);
    }

    @Test
    void englishLabelsComeFromTheEnglishCatalog() {
        var pt = outlierService.findMostUnusual(axesDeTeste(), QuizDataService.LANG_PT);
        var en = outlierService.findMostUnusual(axesDeTeste(), QuizDataService.LANG_EN);

        assertThat(en.axisId()).isEqualTo(pt.axisId());
        assertThat(en.label()).isNotBlank();
    }
}
