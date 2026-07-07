package com.twelveaxes.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.model.AnswerOption;
import com.twelveaxes.model.AnswerValue;
import com.twelveaxes.model.Axis;
import com.twelveaxes.model.Country;
import com.twelveaxes.model.CountryProfile;
import com.twelveaxes.model.Ideology;
import com.twelveaxes.model.IdeologyProfile;
import com.twelveaxes.model.Personality;
import com.twelveaxes.model.PersonalityProfile;
import com.twelveaxes.model.Question;
import com.twelveaxes.model.QuizPayload;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class QuizDataService {
    public static final String SHORT_VARIANT = "short";
    public static final String EXTENDED_VARIANT = "extended";
    public static final String EXTREME_VARIANT = "extreme";

    public static final String LANG_PT = "pt";
    public static final String LANG_EN = "en";

    private final ObjectMapper objectMapper;
    private Map<String, LocaleBundle> bundles;
    private Map<String, IdeologyProfile> ideologyProfiles;
    private Map<String, CountryProfile> countryProfiles;
    private Map<String, PersonalityProfile> personalityProfiles;

    // Textos por locale: profiles/vetores são independentes de idioma e ficam fora do bundle.
    private record LocaleBundle(
            List<Axis> axes,
            List<Question> questions,
            List<Ideology> ideologies,
            Map<String, Ideology> ideologiesById,
            List<Country> countries,
            Map<String, Country> countriesById,
            List<Personality> personalities,
            Map<String, Personality> personalitiesById
    ) {
        static LocaleBundle of(
                List<Axis> axes,
                List<Question> questions,
                List<Ideology> ideologies,
                List<Country> countries,
                List<Personality> personalities
        ) {
            return new LocaleBundle(
                    axes,
                    questions,
                    ideologies,
                    ideologies.stream().collect(Collectors.toUnmodifiableMap(Ideology::id, Function.identity())),
                    countries,
                    countries.stream().collect(Collectors.toUnmodifiableMap(Country::id, Function.identity())),
                    personalities,
                    personalities.stream().collect(Collectors.toUnmodifiableMap(Personality::id, Function.identity()))
            );
        }
    }

    public QuizDataService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    void loadData() throws IOException {
        List<Axis> axes = readJson("data/axes.json", new TypeReference<>() {});
        List<Question> questions = readJson("data/questions-pool.json", new TypeReference<>() {});
        List<Ideology> ideologies = readJson("data/ideologies.json", new TypeReference<>() {});
        List<Country> countries = readJson("data/countries.json", new TypeReference<>() {});
        List<Personality> personalities = readJson("data/personalities.json", new TypeReference<>() {});

        List<IdeologyProfile> profiles = readJson("data/ideology-profiles.json", new TypeReference<>() {});
        ideologyProfiles = profiles.stream()
                .collect(Collectors.toUnmodifiableMap(IdeologyProfile::ideologyId, Function.identity()));
        List<CountryProfile> countryProfileList = readJson("data/countries-profiles.json", new TypeReference<>() {});
        countryProfiles = countryProfileList.stream()
                .collect(Collectors.toUnmodifiableMap(CountryProfile::countryId, Function.identity()));
        List<PersonalityProfile> personalityProfileList = readJson("data/personality-profiles.json", new TypeReference<>() {});
        personalityProfiles = personalityProfileList.stream()
                .collect(Collectors.toUnmodifiableMap(PersonalityProfile::personalityId, Function.identity()));

        LocaleBundle pt = LocaleBundle.of(axes, questions, ideologies, countries, personalities);
        LocaleBundle en = buildEnglishBundle(pt);
        bundles = Map.of(LANG_PT, pt, LANG_EN, en);

        validateCountryProfiles(pt);
        validateIdeologyProfiles(pt);
        validateIdeologyPersonalityLinks(pt);
        validatePersonalityProfiles(pt);
    }

    // Overlays em data/i18n/en/*.json trazem só os campos de texto, chaveados por id.
    // Item sem tradução (ou arquivo ausente) cai no texto PT — nada quebra.
    private LocaleBundle buildEnglishBundle(LocaleBundle pt) throws IOException {
        Map<String, Map<String, String>> axesTr = readOverlay("data/i18n/en/axes.json");
        Map<String, Map<String, String>> questionsTr = readOverlay("data/i18n/en/questions.json");
        Map<String, Map<String, String>> ideologiesTr = readOverlay("data/i18n/en/ideologies.json");
        Map<String, Map<String, String>> countriesTr = readOverlay("data/i18n/en/countries.json");
        Map<String, Map<String, String>> personalitiesTr = readOverlay("data/i18n/en/personalities.json");

        List<Axis> axes = pt.axes().stream().map(axis -> {
            Map<String, String> tr = axesTr.get(axis.id());
            if (tr == null) return axis;
            return new Axis(
                    axis.id(),
                    tr.getOrDefault("label", axis.label()),
                    tr.getOrDefault("leftPole", axis.leftPole()),
                    tr.getOrDefault("rightPole", axis.rightPole()),
                    axis.leftColor(),
                    axis.rightColor()
            );
        }).toList();

        List<Question> questions = pt.questions().stream().map(question -> {
            Map<String, String> tr = questionsTr.get(question.id());
            if (tr == null || tr.get("text") == null) return question;
            return new Question(question.id(), question.axisId(), tr.get("text"), question.agreePole(), question.weight());
        }).toList();

        List<Ideology> ideologies = pt.ideologies().stream().map(ideology -> {
            Map<String, String> tr = ideologiesTr.get(ideology.id());
            if (tr == null) return ideology;
            return new Ideology(
                    ideology.id(),
                    tr.getOrDefault("name", ideology.name()),
                    tr.getOrDefault("category", ideology.category()),
                    tr.getOrDefault("description", ideology.description()),
                    ideology.countryId(),
                    ideology.personalityId(),
                    ideology.vector()
            );
        }).toList();

        List<Country> countries = pt.countries().stream().map(country -> {
            Map<String, String> tr = countriesTr.get(country.id());
            if (tr == null) return country;
            return new Country(
                    country.id(),
                    tr.getOrDefault("name", country.name()),
                    tr.getOrDefault("category", country.category()),
                    tr.getOrDefault("description", country.description()),
                    country.flagPath(),
                    country.flagKind(),
                    country.flagSourceName(),
                    country.flagSourceUrl(),
                    country.flagNote(),
                    country.historical(),
                    country.period(),
                    country.vector()
            );
        }).toList();

        List<Personality> personalities = pt.personalities().stream().map(personality -> {
            Map<String, String> tr = personalitiesTr.get(personality.id());
            if (tr == null) return personality;
            return new Personality(
                    personality.id(),
                    tr.getOrDefault("name", personality.name()),
                    tr.getOrDefault("role", personality.role()),
                    personality.lifespan(),
                    tr.getOrDefault("description", personality.description()),
                    personality.imagePath(),
                    personality.imageSourceName(),
                    personality.imageSourceUrl(),
                    personality.imageNote()
            );
        }).toList();

        return LocaleBundle.of(axes, questions, ideologies, countries, personalities);
    }

    private Map<String, Map<String, String>> readOverlay(String path) throws IOException {
        ClassPathResource resource = new ClassPathResource(path);
        if (!resource.exists()) {
            return Map.of();
        }
        List<Map<String, String>> items;
        try (InputStream input = resource.getInputStream()) {
            items = objectMapper.readValue(input, new TypeReference<>() {});
        }
        return items.stream().collect(Collectors.toUnmodifiableMap(item -> item.get("id"), Function.identity()));
    }

    public static String normalizeLang(String lang) {
        if (lang == null) {
            return LANG_PT;
        }
        return switch (lang.trim().toLowerCase()) {
            case LANG_EN, "en-us", "en-gb" -> LANG_EN;
            default -> LANG_PT;
        };
    }

    private LocaleBundle bundle(String lang) {
        return bundles.get(normalizeLang(lang));
    }

    private void validateCountryProfiles(LocaleBundle pt) {
        List<String> missing = pt.countries().stream()
                .map(Country::id)
                .filter(id -> !countryProfiles.containsKey(id))
                .toList();
        if (!missing.isEmpty()) {
            throw new IllegalStateException(
                    "Todo pais precisa de um perfil em countries-profiles.json. Faltando: " + missing
            );
        }

        List<String> unknown = countryProfiles.keySet().stream()
                .filter(id -> !pt.countriesById().containsKey(id))
                .toList();
        if (!unknown.isEmpty()) {
            throw new IllegalStateException(
                    "countries-profiles.json aponta para paises inexistentes: " + unknown
            );
        }
    }

    private void validateIdeologyProfiles(LocaleBundle pt) {
        List<String> missing = pt.ideologies().stream()
                .map(Ideology::id)
                .filter(id -> !ideologyProfiles.containsKey(id))
                .toList();
        if (!missing.isEmpty()) {
            throw new IllegalStateException(
                    "Toda ideologia precisa de um perfil em ideology-profiles.json. Faltando: " + missing
            );
        }
    }

    private void validateIdeologyPersonalityLinks(LocaleBundle pt) {
        List<String> broken = pt.ideologies().stream()
                .filter(ideology -> ideology.personalityId() == null
                        || ideology.personalityId().isBlank()
                        || !pt.personalitiesById().containsKey(ideology.personalityId()))
                .map(ideology -> ideology.id() + " -> " + ideology.personalityId())
                .toList();
        if (!broken.isEmpty()) {
            throw new IllegalStateException(
                    "Toda ideologia precisa de um personalityId que resolva para uma personalidade existente. Inválidos: " + broken
            );
        }
    }

    private void validatePersonalityProfiles(LocaleBundle pt) {
        List<String> missing = pt.personalities().stream()
                .map(Personality::id)
                .filter(id -> !personalityProfiles.containsKey(id))
                .toList();
        if (!missing.isEmpty()) {
            throw new IllegalStateException(
                    "Toda personalidade precisa de um perfil em personality-profiles.json. Faltando: " + missing
            );
        }
    }

    public QuizPayload getQuiz() {
        return getQuiz(SHORT_VARIANT);
    }

    public QuizPayload getQuiz(String variant) {
        return getQuiz(variant, LANG_PT);
    }

    public QuizPayload getQuiz(String variant, String lang) {
        String normalizedVariant = normalizeVariant(variant);
        String normalizedLang = normalizeLang(lang);
        LocaleBundle data = bundle(normalizedLang);
        int questionsPerAxis = switch (normalizedVariant) {
            case EXTREME_VARIANT -> 0;
            case EXTENDED_VARIANT -> 5;
            default -> 3;
        };
        int questionCount = normalizedVariant.equals(EXTREME_VARIANT)
                ? data.questions().size()
                : questionsPerAxis * data.axes().size();
        String description = normalizedLang.equals(LANG_EN)
                ? "A quiz of " + questionCount + " questions to estimate your position on the 12 political axes."
                : "Um quiz de " + questionCount + " perguntas para estimar sua posição nos 12 eixos políticos.";
        return new QuizPayload(
                "12 Axes",
                description,
                normalizedVariant,
                questionCount,
                questionsPerAxis,
                data.axes(),
                data.questions(),
                answerOptions(normalizedLang)
        );
    }

    public List<Axis> getAxes() {
        return getAxes(LANG_PT);
    }

    public List<Axis> getAxes(String lang) {
        return bundle(lang).axes();
    }

    public List<Question> getQuestions() {
        return bundle(LANG_PT).questions();
    }

    public List<Question> getQuestions(String variant) {
        normalizeVariant(variant);
        return bundle(LANG_PT).questions();
    }

    public List<Question> getQuestionsForLang(String lang) {
        return bundle(lang).questions();
    }

    public List<Ideology> getIdeologies() {
        return getIdeologies(LANG_PT);
    }

    public List<Ideology> getIdeologies(String lang) {
        return bundle(lang).ideologies();
    }

    public Ideology getIdeologyById(String id) {
        return getIdeologyById(id, LANG_PT);
    }

    public Ideology getIdeologyById(String id, String lang) {
        return bundle(lang).ideologiesById().get(id);
    }

    public Country getCountryById(String id) {
        return getCountryById(id, LANG_PT);
    }

    public Country getCountryById(String id, String lang) {
        return bundle(lang).countriesById().get(id);
    }

    public List<Personality> getPersonalities() {
        return getPersonalities(LANG_PT);
    }

    public List<Personality> getPersonalities(String lang) {
        return bundle(lang).personalities();
    }

    public Personality getPersonalityById(String id) {
        return getPersonalityById(id, LANG_PT);
    }

    public Personality getPersonalityById(String id, String lang) {
        return bundle(lang).personalitiesById().get(id);
    }

    public Map<String, IdeologyProfile> getIdeologyProfiles() {
        return ideologyProfiles;
    }

    public List<Country> getCountries() {
        return getCountries(LANG_PT);
    }

    public List<Country> getCountries(String lang) {
        return bundle(lang).countries();
    }

    public Map<String, CountryProfile> getCountryProfiles() {
        return countryProfiles;
    }

    public Map<String, PersonalityProfile> getPersonalityProfiles() {
        return personalityProfiles;
    }

    private List<AnswerOption> answerOptions(String lang) {
        return Arrays.stream(AnswerValue.values())
                .map(value -> new AnswerOption(value, labelFor(value, lang), value.scoreTowardAgreement()))
                .toList();
    }

    private String labelFor(AnswerValue value, String lang) {
        if (LANG_EN.equals(lang)) {
            return switch (value) {
                case STRONGLY_AGREE -> "Strongly agree";
                case AGREE -> "Agree";
                case NEUTRAL -> "Neutral or It depends";
                case DISAGREE -> "Disagree";
                case STRONGLY_DISAGREE -> "Strongly disagree";
            };
        }
        return switch (value) {
            case STRONGLY_AGREE -> "Concordo totalmente";
            case AGREE -> "Concordo";
            case NEUTRAL -> "Neutro ou Depende";
            case DISAGREE -> "Discordo";
            case STRONGLY_DISAGREE -> "Discordo totalmente";
        };
    }

    private String normalizeVariant(String variant) {
        if (variant == null || variant.isBlank()) {
            return SHORT_VARIANT;
        }
        return switch (variant.trim().toLowerCase()) {
            case SHORT_VARIANT, "curta" -> SHORT_VARIANT;
            case EXTENDED_VARIANT, "extensa" -> EXTENDED_VARIANT;
            case EXTREME_VARIANT, "extrema", "240", "240questions" -> EXTREME_VARIANT;
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Versão de quiz inválida");
        };
    }

    private <T> T readJson(String path, TypeReference<T> type) throws IOException {
        ClassPathResource resource = new ClassPathResource(path);
        try (InputStream input = resource.getInputStream()) {
            return objectMapper.readValue(input, type);
        }
    }
}
