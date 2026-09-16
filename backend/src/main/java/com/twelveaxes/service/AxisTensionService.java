package com.twelveaxes.service;

import com.twelveaxes.model.Axis;
import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.AxisTension;
import com.twelveaxes.model.Ideology;
import com.twelveaxes.model.IdeologyProfile;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

/**
 * Encontra o par de eixos em que o usuario mais contraria o padrao do catalogo
 * de ideologias.
 *
 * No catalogo alguns eixos andam juntos: quem e federalista tende a ser
 * democratico (correlacao positiva), quem e militarista tende a ser
 * nacionalista, e assim por diante. Quando o usuario combina dois eixos
 * correlacionados de forma CONTRARIA a essa tendencia, a combinacao e incomum e
 * revela algo que nenhum eixo isolado revela.
 *
 * Nem todo perfil tem tensao, e isso e um resultado legitimo:
 *
 * - Centristas e moderados nao pendem o bastante para contrariar padrao nenhum.
 *   Precisam pender pelo menos MIN_LEAN de distancia do centro nos DOIS eixos.
 * - Perfis coerentes com alguma tradicao ideologica tambem podem nao ter tensao.
 *
 * Nesses casos o servico devolve null e a interface mostra outra coisa — nunca
 * uma tensao inventada.
 */
@Service
public class AxisTensionService {
    private static final double CENTER = 50.0;
    /** Correlacao minima no catalogo para o par ser considerado um padrao. */
    private static final double MIN_CORRELATION = 0.45;
    /** Quanto o usuario precisa pender em cada eixo para "ter lado" ali. */
    private static final double MIN_LEAN = 15.0;
    /** Limiar mais frouxo para contar ideologias com a mesma combinacao. */
    private static final double CATALOG_LEAN = 10.0;
    private static final int MAX_EXAMPLES = 3;

    private final QuizDataService dataService;

    public AxisTensionService(QuizDataService dataService) {
        this.dataService = dataService;
    }

    /** A tensao mais marcante do perfil, ou null se o perfil nao tiver nenhuma. */
    public AxisTension findStrongest(List<AxisResult> axisResults, String lang) {
        String normalizedLang = QuizDataService.normalizeLang(lang);
        Map<String, Double> user = new LinkedHashMap<>();
        axisResults.forEach(result -> user.put(result.axisId(), result.leftPercent()));

        List<IdeologyProfile> profiles = List.copyOf(dataService.getIdeologyProfiles().values());
        List<Axis> axes = dataService.getAxes(normalizedLang);
        if (profiles.isEmpty() || axes.isEmpty()) {
            return null;
        }

        Map<String, Ideology> ideologies = new LinkedHashMap<>();
        dataService.getIdeologies(normalizedLang).forEach(ideology -> ideologies.put(ideology.id(), ideology));

        AxisTension best = null;
        double bestScore = 0.0;

        for (int i = 0; i < axes.size(); i++) {
            for (int j = i + 1; j < axes.size(); j++) {
                Axis first = axes.get(i);
                Axis second = axes.get(j);

                Double userFirst = user.get(first.id());
                Double userSecond = user.get(second.id());
                if (userFirst == null || userSecond == null) {
                    continue;
                }

                double leanFirst = userFirst - CENTER;
                double leanSecond = userSecond - CENTER;
                if (Math.abs(leanFirst) < MIN_LEAN || Math.abs(leanSecond) < MIN_LEAN) {
                    continue;
                }

                double correlation = correlation(profiles, first.id(), second.id());
                if (Math.abs(correlation) < MIN_CORRELATION) {
                    continue;
                }

                // Segue o padrao do catalogo? Entao nao ha tensao.
                boolean sameDirection = leanFirst * leanSecond > 0;
                if (sameDirection == (correlation > 0)) {
                    continue;
                }

                int firstSide = side(leanFirst);
                int secondSide = side(leanSecond);
                List<String> examples = new ArrayList<>();
                int matching = 0;
                for (IdeologyProfile profile : profiles) {
                    Double a = profile.vector().get(first.id());
                    Double b = profile.vector().get(second.id());
                    if (a == null || b == null) {
                        continue;
                    }
                    if (catalogSide(a) == firstSide && catalogSide(b) == secondSide) {
                        matching++;
                        Ideology ideology = ideologies.get(profile.ideologyId());
                        if (ideology != null && examples.size() < MAX_EXAMPLES) {
                            examples.add(ideology.name());
                        }
                    }
                }

                // Quanto mais forte o padrao contrariado e mais rara a
                // combinacao, mais a tensao diz sobre o perfil.
                double rarity = 1.0 - (double) matching / profiles.size();
                double score = Math.abs(correlation) * rarity;
                if (score > bestScore) {
                    bestScore = score;
                    best = new AxisTension(
                            first.label(),
                            leanFirst > 0 ? first.leftPole() : first.rightPole(),
                            second.label(),
                            leanSecond > 0 ? second.leftPole() : second.rightPole(),
                            matching,
                            profiles.size(),
                            List.copyOf(examples)
                    );
                }
            }
        }

        return best;
    }

    private int side(double lean) {
        return lean > 0 ? 1 : -1;
    }

    private int catalogSide(double value) {
        double lean = value - CENTER;
        if (Math.abs(lean) < CATALOG_LEAN) {
            return 0;
        }
        return lean > 0 ? 1 : -1;
    }

    /** Correlacao de Pearson entre dois eixos no catalogo de ideologias. */
    private double correlation(List<IdeologyProfile> profiles, String firstAxis, String secondAxis) {
        List<Double> xs = new ArrayList<>();
        List<Double> ys = new ArrayList<>();
        for (IdeologyProfile profile : profiles) {
            Double x = profile.vector().get(firstAxis);
            Double y = profile.vector().get(secondAxis);
            if (x != null && y != null) {
                xs.add(x);
                ys.add(y);
            }
        }
        if (xs.size() < 2) {
            return 0.0;
        }

        double meanX = xs.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        double meanY = ys.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);

        double numerator = 0.0;
        double sumSqX = 0.0;
        double sumSqY = 0.0;
        for (int i = 0; i < xs.size(); i++) {
            double dx = xs.get(i) - meanX;
            double dy = ys.get(i) - meanY;
            numerator += dx * dy;
            sumSqX += dx * dx;
            sumSqY += dy * dy;
        }

        double denominator = Math.sqrt(sumSqX * sumSqY);
        return denominator == 0.0 ? 0.0 : numerator / denominator;
    }
}
