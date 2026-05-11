package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Ideology;
import com.twelveaxes.model.IdeologyMatch;
import com.twelveaxes.model.IdeologyProfile;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class IdeologyMatcherService {
    private static final List<String> AXIS_IDS = List.of(
            "estrutura",
            "representacao",
            "poder",
            "imigracao",
            "diplomacia",
            "intervencao",
            "economia",
            "controle",
            "comercio",
            "religiao",
            "moral",
            "tecnologia"
    );

    private static final Map<String, Double> AXIS_WEIGHTS = Map.ofEntries(
            Map.entry("estrutura", 0.75),
            Map.entry("representacao", 1.20),
            Map.entry("poder", 1.10),
            Map.entry("imigracao", 1.00),
            Map.entry("diplomacia", 0.90),
            Map.entry("intervencao", 0.80),
            Map.entry("economia", 1.15),
            Map.entry("controle", 1.15),
            Map.entry("comercio", 0.80),
            Map.entry("religiao", 0.90),
            Map.entry("moral", 1.20),
            Map.entry("tecnologia", 0.90)
    );

    private static final double AXIS_SIMILARITY_SPREAD = 55.0;
    private static final double DISTANCE_DECAY_SPREAD = 35.0;
    private static final double OPPOSITE_SIDE_FACTOR = 0.55;

    private static final int TOP_MATCHES = 4;

    private final QuizDataService dataService;

    public IdeologyMatcherService(QuizDataService dataService) {
        this.dataService = dataService;
    }

    public List<IdeologyMatch> findMatches(List<AxisResult> axisResults) {
        Map<String, Double> userVector = axisResults.stream()
                .collect(HashMap::new, (map, axis) -> map.put(axis.axisId(), axis.leftPercent()), HashMap::putAll);

        Comparator<IdeologyMatch> byScore = Comparator.comparingDouble(IdeologyMatch::compatibility).reversed();
        Comparator<IdeologyMatch> byName = Comparator.comparing(IdeologyMatch::name);

        return dataService.getIdeologies().stream()
                .map(ideology -> toMatch(ideology, userVector))
                .sorted(byScore.thenComparing(byName))
                .limit(TOP_MATCHES)
                .toList();
    }

    private IdeologyMatch toMatch(Ideology ideology, Map<String, Double> userVector) {
        Map<String, Double> targetVector = targetVectorFor(ideology);
        MatchScore score = score(userVector, targetVector, ideology);
        String shortDescription = shortDescription(ideology.description());
        String longDescription = longDescription(ideology.description());
        double compatibility = round(score.compatibility());
        if (compatibility == 100.0 && score.weightedRmse() != 0.0) {
            compatibility = 99.9;
        }
        if (compatibility == 0.0 && score.weightedRmse() == 0.0) {
            compatibility = 100.0;
        }
        return new IdeologyMatch(
                ideology.id(),
                ideology.name(),
                ideology.category(),
                shortDescription,
                longDescription,
                compatibility
        );
    }

    private MatchScore score(Map<String, Double> userVector, Map<String, Double> targetVector, Ideology ideology) {
        double weightedAxisSimilarity = weightedAxisSimilarity(userVector, targetVector);
        double weightedRmse = weightedRmse(userVector, targetVector);
        double distanceSimilarity = 100.0 * Math.exp(-Math.pow(weightedRmse / DISTANCE_DECAY_SPREAD, 1.8));
        double compatibility = (weightedAxisSimilarity * 0.65) + (distanceSimilarity * 0.35);
        compatibility -= profileCautionPenalty(ideology, weightedRmse);
        return new MatchScore(Math.max(0.0, Math.min(100.0, compatibility)), weightedRmse);
    }

    private double weightedAxisSimilarity(Map<String, Double> userVector, Map<String, Double> targetVector) {
        double totalSimilarity = 0.0;
        double totalWeight = 0.0;
        for (String axisId : AXIS_IDS) {
            double userValue = userVector.getOrDefault(axisId, 50.0);
            double targetValue = targetVector.getOrDefault(axisId, 50.0);
            double diff = Math.abs(userValue - targetValue);
            double similarity = Math.max(0.0, 1.0 - Math.pow(diff / AXIS_SIMILARITY_SPREAD, 2));

            double userSide = Math.abs(userValue - 50.0);
            double targetSide = Math.abs(targetValue - 50.0);
            if ((userValue - 50.0) * (targetValue - 50.0) < 0.0 && userSide >= 20.0 && targetSide >= 15.0) {
                similarity *= OPPOSITE_SIDE_FACTOR;
            }

            double weight = AXIS_WEIGHTS.getOrDefault(axisId, 1.0);
            totalSimilarity += weight * similarity;
            totalWeight += weight;
        }

        return totalWeight == 0.0 ? 0.0 : 100.0 * totalSimilarity / totalWeight;
    }

    private double weightedRmse(Map<String, Double> userVector, Map<String, Double> targetVector) {
        double sumOfSquares = 0.0;
        double totalWeight = 0.0;
        for (String axisId : AXIS_IDS) {
            double diff = userVector.getOrDefault(axisId, 50.0) - targetVector.getOrDefault(axisId, 50.0);
            double weight = AXIS_WEIGHTS.getOrDefault(axisId, 1.0);
            sumOfSquares += weight * diff * diff;
            totalWeight += weight;
        }

        return totalWeight == 0.0 ? 0.0 : Math.sqrt(sumOfSquares / totalWeight);
    }

    private double profileCautionPenalty(Ideology ideology, double weightedRmse) {
        String text = (ideology.name() + " " + cleanDescription(ideology.description())).toLowerCase(Locale.ROOT);
        double distanceFactor = Math.min(1.0, weightedRmse / 25.0);
        double penalty = 0.0;
        if (containsAny(text, "meme", "contradit", "irônic", "ironico")) {
            penalty += 12.0;
        }
        if (text.contains("transversal")) {
            penalty += 4.0;
        }
        return penalty * distanceFactor;
    }

    private Map<String, Double> targetVectorFor(Ideology ideology) {
        IdeologyProfile profile = dataService.getIdeologyProfiles().get(ideology.id());
        if (profile != null && profile.vector() != null && !profile.vector().isEmpty()) {
            return profile.vector();
        }
        if (ideology.vector() != null && !ideology.vector().isEmpty()) {
            return ideology.vector();
        }
        // All ideologies should have explicit profiles. Fallback to neutral.
        Map<String, Double> neutral = new HashMap<>();
        AXIS_IDS.forEach(axisId -> neutral.put(axisId, 50.0));
        return neutral;
    }

    private String shortDescription(String rawDescription) {
        DescriptionParts parts = splitDescription(cleanDescription(rawDescription));
        String[] sentences = parts.summary().split("(?<=[.!?])\\s+");
        String summary = sentences.length == 0 ? parts.summary() : sentences[0];
        if (sentences.length > 1 && summary.length() < 140) {
            summary = summary + " " + sentences[1];
        }
        return abbreviate(summary, 230);
    }

    private String longDescription(String rawDescription) {
        DescriptionParts parts = splitDescription(cleanDescription(rawDescription));
        StringBuilder description = new StringBuilder(parts.summary());
        if (!parts.summary().endsWith(".")) {
            description.append(".");
        }
        if (!parts.isEmpty()) {
            description.append(" Em termos práticos: valores políticos e forma de governo tendem a ")
                    .append("ser ")
                    .append(parts.political())
                    .append("; economia tende a ser ")
                    .append(parts.economic())
                    .append("; normas sociais tendem a ser ")
                    .append(parts.social())
                    .append(".");
        }
        description.append(" A compatibilidade é calculada pela proximidade do seu vetor percentual nos 12 eixos, ")
                .append("penalizando divergências fortes em dimensões centrais como representação, economia, moral e poder.");
        return description.toString();
    }

    private DescriptionParts splitDescription(String cleanDescription) {
        String[] split = cleanDescription.split("\\s+Politicamente:", 2);
        String summary = split[0].trim();
        if (split.length == 1) {
            return new DescriptionParts(summary, "", "", "");
        }

        String[] fields = split[1].split("\\s+\\|\\s+");
        String political = fields.length > 0 ? fields[0].trim() : "";
        String economic = fields.length > 1 ? fields[1].replaceFirst("^Economicamente:\\s*", "").trim() : "";
        String social = fields.length > 2 ? fields[2].replaceFirst("^Socialmente:\\s*", "").trim() : "";
        return new DescriptionParts(summary, normalizeProfileField(political), normalizeProfileField(economic), normalizeProfileField(social));
    }

    private String normalizeProfileField(String value) {
        if (value == null || value.isBlank()) {
            return "variável conforme o contexto";
        }
        return value.substring(0, 1).toLowerCase(Locale.ROOT) + value.substring(1);
    }

    private String cleanDescription(String rawDescription) {
        String description = rawDescription == null ? "" : rawDescription.trim().replaceAll("\\s+", " ");
        int noteIndex = description.indexOf("NOTA METODOLÓGICA");
        if (noteIndex >= 0) {
            description = description.substring(0, noteIndex).trim();
        }
        return description;
    }

    private String abbreviate(String value, int maxLength) {
        if (value.length() <= maxLength) {
            return value;
        }
        int cut = value.lastIndexOf(' ', maxLength - 1);
        if (cut < maxLength / 2) {
            cut = maxLength - 1;
        }
        return value.substring(0, cut).trim() + "...";
    }

    private boolean containsAny(String text, String... needles) {
        for (String needle : needles) {
            if (text.contains(needle)) {
                return true;
            }
        }
        return false;
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }

    private record MatchScore(double compatibility, double weightedRmse) {
    }

    private record DescriptionParts(String summary, String political, String economic, String social) {
        private boolean isEmpty() {
            return political.isBlank() && economic.isBlank() && social.isBlank();
        }
    }
}
