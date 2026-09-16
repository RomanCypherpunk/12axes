package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.service.AxisTensionService;
import com.twelveaxes.service.QuizDataService;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class AxisTensionServiceTest {
    @Autowired
    private QuizDataService dataService;

    @Autowired
    private AxisTensionService tensionService;

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

    // Federalismo maximo com autocracia forte: no catalogo esses eixos andam
    // juntos na direcao oposta, entao a combinacao e rara.
    private List<AxisResult> perfilExtremo() {
        return axesCom(List.of(96.3, 18.8, 43.8, 75.0, 57.5, 52.5, 15.0, 12.5, 20.0, 63.7, 8.8, 76.3));
    }

    @Test
    void extremeProfileHasATension() {
        var tensao = tensionService.findStrongest(perfilExtremo(), QuizDataService.LANG_PT);

        assertThat(tensao).isNotNull();
        assertThat(tensao.firstAxisLabel()).isNotBlank();
        assertThat(tensao.secondAxisLabel()).isNotBlank();
        assertThat(tensao.firstPole()).isNotBlank();
        assertThat(tensao.secondPole()).isNotBlank();
        assertThat(tensao.firstAxisLabel()).isNotEqualTo(tensao.secondAxisLabel());
    }

    // Um perfil todo no centro nao contraria padrao nenhum: nao ha tensao a
    // mostrar, e inventar uma seria pior que nao mostrar nada.
    @Test
    void neutralProfileHasNoTension() {
        var tensao = tensionService.findStrongest(
                axesCom(Collections.nCopies(12, 50.0)), QuizDataService.LANG_PT);

        assertThat(tensao).isNull();
    }

    // Inclinacoes leves (menos de 15 pontos do centro) tambem nao bastam.
    @Test
    void moderateProfileHasNoTension() {
        var tensao = tensionService.findStrongest(
                axesCom(List.of(58.0, 55.0, 46.0, 53.0, 47.0, 52.0, 44.0, 57.0, 49.0, 53.0, 45.0, 56.0)),
                QuizDataService.LANG_PT);

        assertThat(tensao).isNull();
    }

    @Test
    void matchingCountIsWithinTheCatalog() {
        var tensao = tensionService.findStrongest(perfilExtremo(), QuizDataService.LANG_PT);

        assertThat(tensao.catalogSize()).isGreaterThan(100);
        assertThat(tensao.matchingIdeologies())
                .isGreaterThanOrEqualTo(0)
                .isLessThanOrEqualTo(tensao.catalogSize());
        assertThat(tensao.examples()).hasSizeLessThanOrEqualTo(3);
    }

    // A combinacao apontada tem de ser rara: se metade do catalogo a tem, nao e
    // tensao nenhuma.
    @Test
    void theTensionIsActuallyUncommon() {
        var tensao = tensionService.findStrongest(perfilExtremo(), QuizDataService.LANG_PT);

        double fracao = (double) tensao.matchingIdeologies() / tensao.catalogSize();
        assertThat(fracao).isLessThan(0.25);
    }

    @Test
    void englishLabelsComeFromTheEnglishCatalog() {
        var pt = tensionService.findStrongest(perfilExtremo(), QuizDataService.LANG_PT);
        var en = tensionService.findStrongest(perfilExtremo(), QuizDataService.LANG_EN);

        assertThat(en).isNotNull();
        assertThat(en.firstAxisLabel()).isNotBlank();
        assertThat(en.matchingIdeologies()).isEqualTo(pt.matchingIdeologies());
    }
}
