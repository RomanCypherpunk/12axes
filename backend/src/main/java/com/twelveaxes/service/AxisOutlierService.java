package com.twelveaxes.service;

import com.twelveaxes.model.Axis;
import com.twelveaxes.model.AxisOutlier;
import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.IdeologyProfile;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import org.springframework.stereotype.Service;

/**
 * Compara a posicao do usuario em cada eixo com a distribuicao do catalogo de
 * ideologias, para apontar onde ele mais destoa e onde mais se parece com o
 * conjunto.
 *
 * O catalogo de ideologias e a base de comparacao porque e o unico conjunto
 * amplo e curado de posicoes que o projeto tem — nao ha banco de respostas de
 * usuarios.
 *
 * Duas distincoes importam aqui:
 *
 * 1. "Longe da mediana" nao e o mesmo que "extremo". Um perfil pode estar longe
 *    da mediana por ser mais CENTRISTA que o catalogo — e o caso de quem
 *    responde 50 em tudo num eixo cuja mediana e 67. Por isso o texto exibido
 *    precisa saber a direcao, nao so a distancia.
 *
 * 2. Perto do centro nao ha polo dominante. Usa-se o mesmo limiar do resto do
 *    projeto (distancia < 7.5 do centro = equilibrado, ver ScoringService), para
 *    que a secao concorde com o que as barras de eixo mostram.
 */
@Service
public class AxisOutlierService {
    private static final double CENTER = 50.0;
    private static final double BALANCED_THRESHOLD = 7.5;

    private final QuizDataService dataService;

    public AxisOutlierService(QuizDataService dataService) {
        this.dataService = dataService;
    }

    /** O eixo em que o usuario mais se afasta da mediana do catalogo. */
    public AxisOutlier findMostUnusual(List<AxisResult> axisResults, String lang) {
        return rank(axisResults, lang).stream().findFirst().orElse(null);
    }

    /** O eixo em que o usuario mais se aproxima da mediana do catalogo. */
    public AxisOutlier findMostCommon(List<AxisResult> axisResults, String lang) {
        List<AxisOutlier> ranking = rank(axisResults, lang);
        return ranking.isEmpty() ? null : ranking.getLast();
    }

    /** Eixos ordenados do mais atipico ao mais tipico. */
    private List<AxisOutlier> rank(List<AxisResult> axisResults, String lang) {
        List<IdeologyProfile> profiles = List.copyOf(dataService.getIdeologyProfiles().values());
        if (profiles.isEmpty()) {
            return List.of();
        }

        String normalizedLang = QuizDataService.normalizeLang(lang);
        List<Axis> axes = dataService.getAxes(normalizedLang);

        List<AxisOutlier> outliers = new ArrayList<>();
        for (AxisResult result : axisResults) {
            List<Double> catalogValues = profiles.stream()
                    .map(profile -> profile.vector().get(result.axisId()))
                    .filter(Objects::nonNull)
                    .sorted()
                    .toList();
            if (catalogValues.isEmpty()) {
                continue;
            }

            Axis axis = axes.stream()
                    .filter(candidate -> candidate.id().equals(result.axisId()))
                    .findFirst()
                    .orElse(null);
            if (axis == null) {
                continue;
            }

            outliers.add(toOutlier(axis, result.leftPercent(), catalogValues));
        }

        return outliers.stream()
                .sorted(Comparator.comparingDouble(AxisOutlier::distanceFromMedian).reversed()
                        .thenComparing(AxisOutlier::label))
                .toList();
    }

    private AxisOutlier toOutlier(Axis axis, double user, List<Double> catalogValues) {
        double median = median(catalogValues);
        boolean balanced = Math.abs(user - CENTER) < BALANCED_THRESHOLD;

        // O polo dominante so existe fora da faixa neutra.
        String dominantPole = balanced ? null : (user > CENTER ? axis.leftPole() : axis.rightPole());

        // A frase exibida compara o usuario com o catalogo na direcao em que ele
        // esta EM RELACAO A MEDIANA — nao na direcao do polo dominante. Sao
        // coisas diferentes: alguem em 50 num eixo de mediana 67 pende para
        // "democracia" pelo valor absoluto, mas esta do lado AUTOCRATICO do
        // catalogo. O texto tem de refletir a segunda leitura.
        boolean aboveMedian = user >= median;
        String abovePole = aboveMedian ? axis.leftPole() : axis.rightPole();
        long behind = aboveMedian
                ? catalogValues.stream().filter(value -> value < user).count()
                : catalogValues.stream().filter(value -> value > user).count();

        return new AxisOutlier(
                axis.id(),
                axis.label(),
                round1(user),
                round1(median),
                round1(Math.abs(user - median)),
                dominantPole,
                balanced,
                abovePole,
                round1(100.0 * behind / catalogValues.size())
        );
    }

    private double median(List<Double> sorted) {
        int size = sorted.size();
        if (size % 2 == 1) {
            return sorted.get(size / 2);
        }
        return (sorted.get(size / 2 - 1) + sorted.get(size / 2)) / 2.0;
    }

    private double round1(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
