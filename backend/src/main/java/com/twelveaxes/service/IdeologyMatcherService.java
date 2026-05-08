package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Ideology;
import com.twelveaxes.model.IdeologyMatch;
import com.twelveaxes.model.IdeologyProfile;
import java.text.Normalizer;
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

    private final QuizDataService dataService;

    public IdeologyMatcherService(QuizDataService dataService) {
        this.dataService = dataService;
    }

    public List<IdeologyMatch> findMatches(List<AxisResult> axisResults) {
        Map<String, Double> userVector = axisResults.stream()
                .collect(HashMap::new, (map, axis) -> map.put(axis.axisId(), axis.leftPercent()), HashMap::putAll);
        Comparator<IdeologyMatch> byScore = Comparator.comparingDouble(IdeologyMatch::compatibility).reversed();
        Comparator<IdeologyMatch> byExplicitProfile = Comparator.comparing(match ->
                dataService.getIdeologyProfiles().containsKey(match.ideologyId()) ? 0 : 1
        );

        return dataService.getIdeologies().stream()
                .map(ideology -> toMatch(ideology, userVector))
                .sorted(byScore.thenComparing(byExplicitProfile).thenComparing(IdeologyMatch::name))
                .limit(5)
                .toList();
    }

    private IdeologyMatch toMatch(Ideology ideology, Map<String, Double> userVector) {
        Map<String, Double> targetVector = targetVectorFor(ideology);
        double totalDistance = 0.0;
        for (String axisId : AXIS_IDS) {
            totalDistance += Math.abs(userVector.getOrDefault(axisId, 50.0) - targetVector.getOrDefault(axisId, 50.0));
        }
        double compatibility = round(Math.max(0.0, 100.0 - (totalDistance / AXIS_IDS.size())));
        return new IdeologyMatch(
                ideology.id(),
                ideology.name(),
                ideology.category(),
                ideology.description(),
                compatibility
        );
    }

    private Map<String, Double> targetVectorFor(Ideology ideology) {
        IdeologyProfile override = dataService.getIdeologyProfiles().get(ideology.id());
        if (override != null && override.vector() != null && !override.vector().isEmpty()) {
            return override.vector();
        }
        if (ideology.vector() != null && !ideology.vector().isEmpty()) {
            return ideology.vector();
        }
        return heuristicVector(ideology);
    }

    private Map<String, Double> heuristicVector(Ideology ideology) {
        Map<String, Double> vector = baseVector(ideology.category());
        String text = normalize(ideology.name() + " " + ideology.description() + " " + ideology.category());

        if (containsAny(text, "anarqu", "libertar", "voluntar", "agorismo")) {
            put(vector, "estrutura", 75);
            put(vector, "representacao", 88);
            put(vector, "poder", 18);
        }
        if (containsAny(text, "fasc", "nacional-social", "falang", "legionar", "pinochet", "totalitario")) {
            put(vector, "representacao", 10);
            put(vector, "poder", 90);
            put(vector, "diplomacia", 85);
            put(vector, "intervencao", 12);
            put(vector, "moral", 18);
        }
        if (containsAny(text, "autoritar", "ditatorial", "partido unico", "partido-unico")) {
            put(vector, "representacao", Math.min(vector.get("representacao"), 24));
            put(vector, "poder", Math.max(vector.get("poder"), 76));
        }
        if (containsAny(text, "democr", "parlamentar", "constitucional")) {
            put(vector, "representacao", Math.max(vector.get("representacao"), 74));
        }
        if (containsAny(text, "marx", "comun", "socialismo", "coletiv", "planific", "mao", "stalin", "trotsk")) {
            put(vector, "economia", 88);
            put(vector, "controle", 88);
            put(vector, "comercio", 70);
        }
        if (containsAny(text, "capitalismo", "mercado", "austro", "chicago", "privad", "minarqu")) {
            put(vector, "economia", 18);
            put(vector, "controle", 15);
            put(vector, "comercio", 25);
        }
        if (containsAny(text, "relig", "clerical", "teocrat", "catolic", "crista", "islam", "monarqu")) {
            put(vector, "religiao", 18);
            put(vector, "moral", Math.min(vector.get("moral"), 30));
        }
        if (containsAny(text, "secular", "ate", "irrelig")) {
            put(vector, "religiao", 82);
        }
        if (containsAny(text, "progress", "femin", "queer", "social liberal")) {
            put(vector, "moral", 82);
        }
        if (containsAny(text, "conserv", "tradicional", "paleo", "reacion")) {
            put(vector, "moral", 25);
        }
        if (containsAny(text, "pacif")) {
            put(vector, "diplomacia", 18);
        }
        if (containsAny(text, "militar", "imperial", "expansion")) {
            put(vector, "diplomacia", 82);
            put(vector, "intervencao", 25);
        }
        if (containsAny(text, "nacional", "patriot", "identitario")) {
            put(vector, "intervencao", 22);
            put(vector, "imigracao", 28);
        }
        if (containsAny(text, "global", "internacional", "cosmopol")) {
            put(vector, "comercio", 25);
            put(vector, "imigracao", 72);
        }
        if (containsAny(text, "transhuman", "aceleracion", "pirat", "cripto", "tecnolog")) {
            put(vector, "tecnologia", 85);
        }
        if (containsAny(text, "primitiv", "naturalismo", "bioconserv")) {
            put(vector, "tecnologia", 20);
        }

        return vector;
    }

    private Map<String, Double> baseVector(String category) {
        Map<String, Double> vector = new HashMap<>();
        switch (normalize(category)) {
            case "esquerda autoritaria" -> {
                put(vector, "estrutura", 30);
                put(vector, "representacao", 18);
                put(vector, "poder", 82);
                put(vector, "imigracao", 55);
                put(vector, "diplomacia", 70);
                put(vector, "intervencao", 38);
                put(vector, "economia", 88);
                put(vector, "controle", 88);
                put(vector, "comercio", 70);
                put(vector, "religiao", 78);
                put(vector, "moral", 62);
                put(vector, "tecnologia", 66);
            }
            case "direita autoritaria" -> {
                put(vector, "estrutura", 28);
                put(vector, "representacao", 16);
                put(vector, "poder", 86);
                put(vector, "imigracao", 25);
                put(vector, "diplomacia", 78);
                put(vector, "intervencao", 18);
                put(vector, "economia", 34);
                put(vector, "controle", 58);
                put(vector, "comercio", 66);
                put(vector, "religiao", 25);
                put(vector, "moral", 22);
                put(vector, "tecnologia", 48);
            }
            case "esquerda libertaria" -> {
                put(vector, "estrutura", 70);
                put(vector, "representacao", 86);
                put(vector, "poder", 22);
                put(vector, "imigracao", 78);
                put(vector, "diplomacia", 24);
                put(vector, "intervencao", 72);
                put(vector, "economia", 84);
                put(vector, "controle", 62);
                put(vector, "comercio", 46);
                put(vector, "religiao", 76);
                put(vector, "moral", 86);
                put(vector, "tecnologia", 70);
            }
            case "direita libertaria" -> {
                put(vector, "estrutura", 68);
                put(vector, "representacao", 78);
                put(vector, "poder", 18);
                put(vector, "imigracao", 55);
                put(vector, "diplomacia", 28);
                put(vector, "intervencao", 72);
                put(vector, "economia", 20);
                put(vector, "controle", 14);
                put(vector, "comercio", 22);
                put(vector, "religiao", 46);
                put(vector, "moral", 48);
                put(vector, "tecnologia", 68);
            }
            default -> AXIS_IDS.forEach(axisId -> put(vector, axisId, 50));
        }
        return vector;
    }

    private boolean containsAny(String text, String... needles) {
        for (String needle : needles) {
            if (text.contains(needle)) {
                return true;
            }
        }
        return false;
    }

    private String normalize(String value) {
        String normalized = Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return normalized.toLowerCase(Locale.ROOT);
    }

    private void put(Map<String, Double> vector, String axisId, double value) {
        vector.put(axisId, Math.max(0.0, Math.min(100.0, value)));
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
