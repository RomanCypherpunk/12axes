package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.DimensionMatch;
import com.twelveaxes.service.DimensionMatcherService;
import com.twelveaxes.service.PersonalityMatcherService;
import com.twelveaxes.service.QuizDataService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DimensionMatcherServiceTest {
    @Autowired
    private QuizDataService dataService;

    @Autowired
    private DimensionMatcherService dimensionMatcherService;

    @Autowired
    private PersonalityMatcherService personalityMatcherService;

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

    private List<AxisResult> perfilDeTeste() {
        return axesCom(List.of(96.3, 18.8, 43.8, 75.0, 57.5, 52.5, 15.0, 12.5, 20.0, 63.7, 8.8, 76.3));
    }

    @Test
    void dimensionsUseTheExpectedAxisGroups() {
        assertThat(DimensionMatcherService.POLITICAL_AXES).containsExactly(
                "estrutura", "representacao", "poder", "diplomacia", "imigracao",
                "intervencao", "tecnologia", "controle", "comercio", "religiao",
                "economia", "moral");
        assertThat(DimensionMatcherService.SOCIAL_AXES).containsExactly(
                "representacao", "moral", "religiao", "economia", "controle", "comercio",
                "imigracao", "poder", "tecnologia");
        assertThat(DimensionMatcherService.ECONOMIC_AXES).containsExactly(
                "economia", "controle", "comercio");
    }

    @Test
    void returnsThePoliticalSocialAndEconomicDimensions() {
        var dimensoes = dimensionMatcherService.findAll(perfilDeTeste(), QuizDataService.LANG_PT);

        assertThat(dimensoes).hasSize(3);
        assertThat(dimensoes).extracting(DimensionMatch::dimension)
                .containsExactly("political", "social", "economic");
        assertThat(dimensoes).allSatisfy(dimensao -> {
            assertThat(dimensao.match()).isNotNull();
            assertThat(dimensao.match().name()).isNotBlank();
            assertThat(dimensao.match().compatibility()).isBetween(0.0, 100.0);
        });
    }

    // A pergunta "com quem combino economicamente" e diferente de "com quem
    // combino no geral": restringir os eixos tem de poder mudar a resposta.
    @Test
    void dimensionScoresDifferFromTheOverallScore() {
        var axes = perfilDeTeste();
        var geral = personalityMatcherService.findTopMatch(axes, QuizDataService.LANG_PT);
        var dimensoes = dimensionMatcherService.findAll(axes, QuizDataService.LANG_PT);

        assertThat(dimensoes)
                .as("ao menos uma dimensao deve dar nota diferente da geral")
                .anySatisfy(dimensao -> assertThat(dimensao.match().compatibility())
                        .isNotEqualTo(geral.compatibility()));
    }

    // A secao se chama "tambem proximos": repetir quem ja aparece como destaque
    // nao acrescenta nada ao leitor.
    @Test
    void dimensionMatchesNeverRepeatTheTopMatch() {
        var axes = perfilDeTeste();
        var top = personalityMatcherService.findTopMatch(axes, QuizDataService.LANG_PT);
        var dimensoes = dimensionMatcherService.findAll(axes, QuizDataService.LANG_PT, top.personalityId());

        assertThat(dimensoes)
                .isNotEmpty()
                .noneMatch(dimensao -> dimensao.match().personalityId().equals(top.personalityId()));
    }

    @Test
    void dimensionMatchesNeverRepeatEachOther() {
        var dimensoes = dimensionMatcherService.findAll(perfilDeTeste(), QuizDataService.LANG_PT);

        assertThat(dimensoes)
                .extracting(dimensao -> dimensao.match().personalityId())
                .doesNotHaveDuplicates();
    }

    @Test
    void everyDimensionMatchCarriesCategoryAndPortrait() {
        var dimensoes = dimensionMatcherService.findAll(perfilDeTeste(), QuizDataService.LANG_PT);

        assertThat(dimensoes).allSatisfy(dimensao -> {
            assertThat(dimensao.match().category()).isNotBlank();
            assertThat(dimensao.match().imagePath()).isNotBlank();
        });
    }

    // Todas as areas de atuacao aparecem, nao so tres.
    @Test
    void bestPerCategoryCoversEveryCategoryInTheCatalog() {
        var porCategoria = personalityMatcherService.findBestPerCategory(
                perfilDeTeste(), QuizDataService.LANG_PT);
        var categoriasDoCatalogo = dataService.getPersonalities().stream()
                .map(personality -> personality.category())
                .distinct()
                .toList();

        assertThat(porCategoria).hasSameSizeAs(categoriasDoCatalogo);
        assertThat(porCategoria).extracting(match -> match.category())
                .containsExactlyInAnyOrderElementsOf(categoriasDoCatalogo)
                .doesNotHaveDuplicates();
    }

    @Test
    void bestPerCategoryIsSortedByCompatibility() {
        var porCategoria = personalityMatcherService.findBestPerCategory(
                perfilDeTeste(), QuizDataService.LANG_PT);

        assertThat(porCategoria).isSortedAccordingTo(
                java.util.Comparator.comparingDouble(
                        (com.twelveaxes.model.PersonalityMatch match) -> match.compatibility()).reversed());
    }

    @Test
    void englishCatalogReturnsTheSameDimensions() {
        var en = dimensionMatcherService.findAll(perfilDeTeste(), QuizDataService.LANG_EN);

        assertThat(en).hasSize(3);
        assertThat(en).allSatisfy(dimensao -> assertThat(dimensao.match().name()).isNotBlank());
    }
}
