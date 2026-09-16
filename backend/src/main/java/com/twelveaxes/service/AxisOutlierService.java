package com.twelveaxes.service;

import com.twelveaxes.model.Axis;
import com.twelveaxes.model.AxisOutlier;
import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.IdeologyProfile;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 * Compara a posicao do usuario em cada eixo com a distribuicao do catalogo de
 * ideologias, para apontar onde ele mais destoa e onde mais se parece com o
 * conjunto.
 *
 * O catalogo de ideologias e a base de comparacao porque e o unico conjunto
 * amplo e curado de posicoes que o projeto tem — nao ha banco de respostas de
 * usuarios.
 */
@Service
public class AxisOutlierService {
    private static final double CENTER = 50.0;

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
                    .filter(java.util.Objects::nonNull)
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

            double user = result.leftPercent();
            double median = median(catalogValues);
            boolean leansLeft = user >= CENTER;
            String pole = leansLeft ? axis.leftPole() : axis.rightPole();

            // Quanto do catalogo o usuario supera NA DIRECAO do polo dominante:
            // pendendo a esquerda conta quem tem valor menor; a direita, maior.
            long behind = leansLeft
                    ? catalogValues.stream().filter(value -> value < user).count()
                    : catalogValues.stream().filter(value -> value > user).count();

            outliers.add(new AxisOutlier(
                    axis.id(),
                    axis.label(),
                    round1(user),
                    round1(median),
                    round1(Math.abs(user - median)),
                    pole,
                    round1(100.0 * behind / catalogValues.size())
            ));
        }

        return outliers.stream()
                .sorted(Comparator.comparingDouble(AxisOutlier::distanceFromMedian).reversed()
                        .thenComparing(AxisOutlier::label))
                .toList();
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
