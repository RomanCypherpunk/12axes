package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Ideology;
import com.twelveaxes.model.IdeologyMatch;
import com.twelveaxes.model.IdeologyProfile;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class IdeologyMatcherService {
    private static final int TOP_MATCHES = 4;

    private final QuizDataService dataService;
    private final ProfileMatchScorer profileMatchScorer;

    public IdeologyMatcherService(QuizDataService dataService, ProfileMatchScorer profileMatchScorer) {
        this.dataService = dataService;
        this.profileMatchScorer = profileMatchScorer;
    }

    public List<IdeologyMatch> findMatches(List<AxisResult> axisResults) {
        return findMatches(axisResults, QuizDataService.LANG_PT);
    }

    public List<IdeologyMatch> findMatches(List<AxisResult> axisResults, String lang) {
        return findRankedMatches(axisResults, lang);
    }

    List<IdeologyMatch> findRankedMatches(List<AxisResult> axisResults, String lang) {
        Map<String, Double> userVector = profileMatchScorer.userVectorFor(axisResults);
        String normalizedLang = QuizDataService.normalizeLang(lang);
        return rankCandidates(userVector, normalizedLang).stream()
                .limit(TOP_MATCHES)
                .map(candidate -> toMatch(candidate, normalizedLang))
                .toList();
    }

    private List<IdeologyCandidate> rankCandidates(Map<String, Double> userVector, String normalizedLang) {
        List<IdeologyCandidate> candidates = dataService.getIdeologies(normalizedLang).stream()
                .map(ideology -> toCandidate(ideology, userVector))
                .toList();
        List<Double> catalogScores = candidates.stream()
                .map(IdeologyCandidate::compatibility)
                .toList();
        return candidates.stream()
                .map(candidate -> withPercentile(candidate, catalogScores))
                .sorted(byScoreThenName())
                .toList();
    }

    private Comparator<IdeologyCandidate> byScoreThenName() {
        return Comparator.comparingDouble(IdeologyCandidate::compatibility)
                .reversed()
                .thenComparing(candidate -> candidate.ideology().name());
    }

    private IdeologyCandidate toCandidate(Ideology ideology, Map<String, Double> userVector) {
        Map<String, Double> targetVector = targetVectorFor(ideology);
        double compatibility = profileMatchScorer.compatibility(userVector, targetVector);
        return new IdeologyCandidate(ideology, targetVector, compatibility, 0.0);
    }

    private IdeologyCandidate withPercentile(IdeologyCandidate candidate, List<Double> catalogScores) {
        double percentile = profileMatchScorer.percentile(candidate.compatibility(), catalogScores);
        return new IdeologyCandidate(
                candidate.ideology(),
                candidate.targetVector(),
                candidate.compatibility(),
                percentile
        );
    }

    private IdeologyMatch toMatch(IdeologyCandidate candidate, String lang) {
        Ideology ideology = candidate.ideology();
        String shortDescription = shortDescription(ideology.description());
        String longDescription = longDescription(ideology.description(), lang);
        return new IdeologyMatch(
                ideology.id(),
                ideology.name(),
                ideology.category(),
                shortDescription,
                longDescription,
                candidate.compatibility(),
                candidate.compatibilityPercentile()
        );
    }

    private Map<String, Double> targetVectorFor(Ideology ideology) {
        IdeologyProfile profile = dataService.getIdeologyProfiles().get(ideology.id());
        if (profile != null && profile.vector() != null && !profile.vector().isEmpty()) {
            return profile.vector();
        }
        if (ideology.vector() != null && !ideology.vector().isEmpty()) {
            return ideology.vector();
        }
        return profileMatchScorer.neutralVector();
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

    private String longDescription(String rawDescription, String lang) {
        boolean en = QuizDataService.LANG_EN.equals(lang);
        DescriptionParts parts = splitDescription(cleanDescription(rawDescription));
        StringBuilder description = new StringBuilder(parts.summary());
        if (!parts.summary().endsWith(".")) {
            description.append(".");
        }
        description.append(en
                ? " Compatibility indicates how close your answers are to this profile."
                : " A compatibilidade indica proximidade entre suas respostas e esse perfil.");
        if (!parts.isEmpty()) {
            if (en) {
                description.append(" ")
                        .append("In practical terms: political values and form of government tend to ")
                        .append("be ")
                        .append(parts.political())
                        .append("; the economy tends to be ")
                        .append(parts.economic())
                        .append("; social norms tend to be ")
                        .append(parts.social())
                        .append(".");
            } else {
                description.append(" ")
                        .append("Em termos práticos: valores políticos e forma de governo tendem a ")
                        .append("ser ")
                        .append(parts.political())
                        .append("; economia tende a ser ")
                        .append(parts.economic())
                        .append("; normas sociais tendem a ser ")
                        .append(parts.social())
                        .append(".");
            }
        }
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

    private record DescriptionParts(String summary, String political, String economic, String social) {
        private boolean isEmpty() {
            return political.isBlank() && economic.isBlank() && social.isBlank();
        }
    }

    private record IdeologyCandidate(
            Ideology ideology,
            Map<String, Double> targetVector,
            double compatibility,
            double compatibilityPercentile
    ) {
    }
}
