package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Country;
import com.twelveaxes.model.CountryMatch;
import com.twelveaxes.model.CountryProfile;
import com.twelveaxes.model.IdeologyMatch;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class CountryMatcherService {
    private static final Map<String, List<String>> REQUIRED_TAGS_BY_ID = requiredTagsById();

    private final QuizDataService dataService;
    private final ProfileMatchScorer profileMatchScorer;

    public CountryMatcherService(QuizDataService dataService, ProfileMatchScorer profileMatchScorer) {
        this.dataService = dataService;
        this.profileMatchScorer = profileMatchScorer;
    }

    public CountryMatch findTopMatch(List<AxisResult> axisResults, IdeologyMatch topIdeology) {
        Map<String, Double> userVector = profileMatchScorer.userVectorFor(axisResults);
        List<String> requiredTags = requiredTagsFor(topIdeology);

        Comparator<CountryCandidate> byCompatibility =
                Comparator.comparingDouble(CountryCandidate::compatibility).reversed();
        Comparator<CountryCandidate> byName = Comparator.comparing(candidate -> candidate.country().name());

        return candidatesFor(requiredTags).stream()
                .map(country -> toCandidate(country, userVector))
                .sorted(byCompatibility.thenComparing(byName))
                .findFirst()
                .map(this::toMatch)
                .orElseThrow(() -> new IllegalStateException("Nenhum pais disponivel para matching"));
    }

    private List<Country> candidatesFor(List<String> requiredTags) {
        if (requiredTags.isEmpty()) {
            return dataService.getCountries();
        }

        List<Country> strictMatches = dataService.getCountries().stream()
                .filter(country -> tagsFor(country).containsAll(requiredTags))
                .toList();
        if (!strictMatches.isEmpty()) {
            return strictMatches;
        }

        List<Country> partialMatches = dataService.getCountries().stream()
                .filter(country -> tagsFor(country).stream().anyMatch(requiredTags::contains))
                .toList();
        return partialMatches.isEmpty() ? dataService.getCountries() : partialMatches;
    }

    private CountryCandidate toCandidate(Country country, Map<String, Double> userVector) {
        CountryProfile profile = dataService.getCountryProfiles().get(country.id());
        Map<String, Double> targetVector = targetVectorFor(country, profile);
        List<String> tags = profile == null ? List.of() : profile.tags();
        double compatibility = profileMatchScorer.compatibility(userVector, targetVector);
        return new CountryCandidate(country, tags, compatibility);
    }

    private CountryMatch toMatch(CountryCandidate candidate) {
        Country country = candidate.country();
        return new CountryMatch(
                country.id(),
                country.name(),
                country.category(),
                country.description(),
                country.flagPath(),
                country.flagKind(),
                country.flagSourceName(),
                country.flagSourceUrl(),
                country.flagNote(),
                country.historical(),
                country.period(),
                candidate.tags(),
                candidate.compatibility()
        );
    }

    private Map<String, Double> targetVectorFor(Country country, CountryProfile profile) {
        if (profile != null && profile.vector() != null && !profile.vector().isEmpty()) {
            return profile.vector();
        }
        if (country.vector() != null && !country.vector().isEmpty()) {
            return country.vector();
        }
        return profileMatchScorer.neutralVector();
    }

    private List<String> tagsFor(Country country) {
        CountryProfile profile = dataService.getCountryProfiles().get(country.id());
        return profile == null ? List.of() : profile.tags();
    }

    private List<String> requiredTagsFor(IdeologyMatch ideology) {
        if (ideology == null || ideology.ideologyId() == null || ideology.ideologyId().isBlank()) {
            return List.of();
        }

        String id = ideology.ideologyId().toLowerCase(Locale.ROOT);
        List<String> explicit = REQUIRED_TAGS_BY_ID.get(id);
        if (explicit != null) {
            return explicit;
        }

        if (id.contains("monarqu")) {
            return List.of("monarquia");
        }
        if (isAnarchist(id)) {
            return List.of("anarquia");
        }
        if (isSocialist(id)) {
            return List.of("socialismo");
        }
        if (isFascist(id)) {
            return List.of("ditadura", "fascismo");
        }
        if (id.contains("tecnocracia") || id.startsWith("tecno-") || id.contains("cameralismo")) {
            return List.of("tecnocracia");
        }
        if (isMarketLibertarian(id) || id.contains("capitalismo")) {
            return List.of("capitalismo");
        }
        if (id.contains("democracia") || id.contains("republicanismo")) {
            return List.of("democracia");
        }

        String category = ideology.category() == null ? "" : ideology.category().toLowerCase(Locale.ROOT);
        if (category.contains("autorit")) {
            return List.of("ditadura");
        }
        if (category.contains("libert")) {
            return category.contains("direita") ? List.of("capitalismo") : List.of("anarquia");
        }
        if (category.contains("centro")) {
            return List.of("democracia");
        }
        return List.of();
    }

    private boolean isAnarchist(String id) {
        return id.contains("anarc")
                || id.contains("anarqu")
                || id.equals("agorismo")
                || id.equals("criptoanarquismo")
                || id.equals("panarchismo");
    }

    private boolean isSocialist(String id) {
        return id.contains("marxismo")
                || id.contains("socialismo")
                || id.contains("socialista")
                || id.contains("comunismo")
                || id.contains("bolchevismo")
                || id.equals("maoismo")
                || id.equals("stalinismo")
                || id.equals("trotskismo")
                || id.equals("luxemburguismo")
                || id.equals("dengismo")
                || id.equals("pol-potismo");
    }

    private boolean isFascist(String id) {
        return id.contains("fascismo")
                || id.equals("nacional-socialismo")
                || id.equals("falangismo")
                || id.equals("strasserismo")
                || id.equals("integralismo-brasileiro");
    }

    private boolean isMarketLibertarian(String id) {
        return id.contains("libertarianismo")
                || id.equals("minarquismo")
                || id.equals("austrolibertarianismo")
                || id.equals("paleolibertarianismo")
                || id.equals("hoppeanismo")
                || id.equals("objetivismo")
                || id.equals("geolibertarianismo")
                || id.equals("liberaltarianismo");
    }

    private static Map<String, List<String>> requiredTagsById() {
        Map<String, List<String>> tags = new HashMap<>();

        tags.put("monarquia-federativa", List.of("monarquia", "federacao"));
        tags.put("monarquismo-absoluto", List.of("monarquia", "ditadura"));
        tags.put("monarquismo-constitucional", List.of("monarquia", "democracia"));
        tags.put("monarquismo-libertario", List.of("monarquia", "libertario"));
        tags.put("tecno-monarquismo", List.of("monarquia", "tecnocracia"));

        tags.put("anarcocapitalismo", List.of("anarquia", "capitalismo"));
        tags.put("agorismo", List.of("anarquia", "capitalismo"));
        tags.put("criptoanarquismo", List.of("anarquia", "capitalismo"));
        tags.put("anarcoindividualismo", List.of("anarquia", "capitalismo"));
        tags.put("anarcoconservadorismo", List.of("anarquia", "capitalismo"));
        tags.put("anarcocomunismo", List.of("anarquia", "socialismo"));
        tags.put("anarcocoletivismo", List.of("anarquia", "socialismo"));
        tags.put("anarcossindicalismo", List.of("anarquia", "socialismo"));
        tags.put("anarquismo-agrario", List.of("anarquia", "socialismo"));
        tags.put("anarquismo-verde", List.of("anarquia", "ambientalismo"));
        tags.put("anarcofeminismo", List.of("anarquia", "progressismo"));
        tags.put("anarquismo-queer", List.of("anarquia", "progressismo"));
        tags.put("anarquismo-cristao", List.of("anarquia", "religiao"));
        tags.put("anarcodistributismo", List.of("anarquia", "religiao"));
        tags.put("anarco-transhumanismo", List.of("anarquia", "tecnocracia"));

        tags.put("marxismo-leninismo", List.of("socialismo", "ditadura"));
        tags.put("stalinismo", List.of("socialismo", "ditadura"));
        tags.put("maoismo", List.of("socialismo", "ditadura"));
        tags.put("pol-potismo", List.of("socialismo", "ditadura"));
        tags.put("dengismo", List.of("socialismo", "tecnocracia"));
        tags.put("socialismo-de-estado", List.of("socialismo", "ditadura"));
        tags.put("nacional-bolchevismo", List.of("socialismo", "ditadura"));
        tags.put("socialismo-de-mercado", List.of("socialismo"));
        tags.put("socialismo-de-mercado-libertario", List.of("socialismo", "anarquia"));

        tags.put("fascismo", List.of("ditadura", "fascismo"));
        tags.put("nacional-socialismo", List.of("ditadura", "fascismo"));
        tags.put("falangismo", List.of("ditadura", "fascismo"));
        tags.put("strasserismo", List.of("ditadura", "fascismo"));
        tags.put("integralismo-brasileiro", List.of("ditadura", "fascismo"));
        tags.put("tecno-fascismo", List.of("ditadura", "fascismo"));

        tags.put("fundamentalismo-religioso", List.of("teocracia"));
        tags.put("fascismo-clerical", List.of("ditadura", "religiao"));
        tags.put("democracia-crista", List.of("democracia", "religiao"));
        tags.put("conservadorismo-cristao", List.of("democracia", "religiao"));
        tags.put("progressismo-cristao", List.of("democracia", "religiao"));

        tags.put("tecnocracia", List.of("tecnocracia"));
        tags.put("tecnocracia-de-direita", List.of("tecnocracia", "capitalismo"));
        tags.put("tecnocracia-de-esquerda", List.of("tecnocracia", "socialismo"));
        tags.put("tecno-socialismo", List.of("socialismo", "tecnocracia"));
        tags.put("autoritarismo-modernizador", List.of("ditadura", "desenvolvimentismo"));
        tags.put("desenvolvimentismo-de-estado", List.of("desenvolvimentismo"));
        tags.put("neocameralismo", List.of("tecnocracia", "capitalismo"));
        tags.put("cameralismo", List.of("tecnocracia", "desenvolvimentismo"));

        tags.put("federalismo-privado", List.of("federacao", "capitalismo"));
        tags.put("republicanismo", List.of("republica", "democracia"));
        tags.put("democracia-nacional", List.of("democracia", "nacionalismo"));
        tags.put("atlantismo", List.of("democracia", "globalismo"));

        return Map.copyOf(tags);
    }

    private record CountryCandidate(Country country, List<String> tags, double compatibility) {
    }
}
