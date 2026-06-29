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

    private final ObjectMapper objectMapper;
    private List<Axis> axes;
    private List<Question> poolQuestions;
    private List<Ideology> ideologies;
    private Map<String, Ideology> ideologiesById;
    private Map<String, IdeologyProfile> ideologyProfiles;
    private List<Country> countries;
    private Map<String, Country> countriesById;
    private Map<String, CountryProfile> countryProfiles;
    private List<Personality> personalities;
    private Map<String, Personality> personalitiesById;

    public QuizDataService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    void loadData() throws IOException {
        axes = readJson("data/axes.json", new TypeReference<>() {});
        poolQuestions = readJson("data/questions-pool.json", new TypeReference<>() {});
        ideologies = readJson("data/ideologies.json", new TypeReference<>() {});
        ideologiesById = ideologies.stream()
                .collect(Collectors.toUnmodifiableMap(Ideology::id, Function.identity()));
        List<IdeologyProfile> profiles = readJson("data/ideology-profiles.json", new TypeReference<>() {});
        ideologyProfiles = profiles.stream()
                .collect(Collectors.toUnmodifiableMap(IdeologyProfile::ideologyId, Function.identity()));
        countries = readJson("data/countries.json", new TypeReference<>() {});
        countriesById = countries.stream()
                .collect(Collectors.toUnmodifiableMap(Country::id, Function.identity()));
        List<CountryProfile> countryProfileList = readJson("data/countries-profiles.json", new TypeReference<>() {});
        countryProfiles = countryProfileList.stream()
                .collect(Collectors.toUnmodifiableMap(CountryProfile::countryId, Function.identity()));
        personalities = readJson("data/personalities.json", new TypeReference<>() {});
        personalitiesById = personalities.stream()
                .collect(Collectors.toUnmodifiableMap(Personality::id, Function.identity()));

        validateIdeologyCountryLinks();
        validateIdeologyPersonalityLinks();
    }

    private void validateIdeologyCountryLinks() {
        List<String> broken = ideologies.stream()
                .filter(ideology -> ideology.countryId() == null
                        || ideology.countryId().isBlank()
                        || !countriesById.containsKey(ideology.countryId()))
                .map(ideology -> ideology.id() + " -> " + ideology.countryId())
                .toList();
        if (!broken.isEmpty()) {
            throw new IllegalStateException(
                    "Toda ideologia precisa de um countryId que resolva para um país existente. Inválidos: " + broken
            );
        }
    }

    private void validateIdeologyPersonalityLinks() {
        List<String> broken = ideologies.stream()
                .filter(ideology -> ideology.personalityId() == null
                        || ideology.personalityId().isBlank()
                        || !personalitiesById.containsKey(ideology.personalityId()))
                .map(ideology -> ideology.id() + " -> " + ideology.personalityId())
                .toList();
        if (!broken.isEmpty()) {
            throw new IllegalStateException(
                    "Toda ideologia precisa de um personalityId que resolva para uma personalidade existente. Inválidos: " + broken
            );
        }
    }

    public QuizPayload getQuiz() {
        return getQuiz(SHORT_VARIANT);
    }

    public QuizPayload getQuiz(String variant) {
        String normalizedVariant = normalizeVariant(variant);
        int questionsPerAxis = switch (normalizedVariant) {
            case EXTREME_VARIANT -> 0;
            case EXTENDED_VARIANT -> 5;
            default -> 3;
        };
        int questionCount = normalizedVariant.equals(EXTREME_VARIANT)
                ? poolQuestions.size()
                : questionsPerAxis * axes.size();
        return new QuizPayload(
                "12 Axes",
                "Um quiz de " + questionCount + " perguntas para estimar sua posição nos 12 eixos políticos.",
                normalizedVariant,
                questionCount,
                questionsPerAxis,
                axes,
                poolQuestions,
                answerOptions()
        );
    }

    public List<Axis> getAxes() {
        return axes;
    }

    public List<Question> getQuestions() {
        return poolQuestions;
    }

    public List<Question> getQuestions(String variant) {
        normalizeVariant(variant);
        return poolQuestions;
    }

    public List<Ideology> getIdeologies() {
        return ideologies;
    }

    public Ideology getIdeologyById(String id) {
        return ideologiesById.get(id);
    }

    public Country getCountryById(String id) {
        return countriesById.get(id);
    }

    public List<Personality> getPersonalities() {
        return personalities;
    }

    public Personality getPersonalityById(String id) {
        return personalitiesById.get(id);
    }

    public Map<String, IdeologyProfile> getIdeologyProfiles() {
        return ideologyProfiles;
    }

    public List<Country> getCountries() {
        return countries;
    }

    public Map<String, CountryProfile> getCountryProfiles() {
        return countryProfiles;
    }

    private List<AnswerOption> answerOptions() {
        return Arrays.stream(AnswerValue.values())
                .map(value -> new AnswerOption(value, labelFor(value), value.scoreTowardAgreement()))
                .toList();
    }

    private String labelFor(AnswerValue value) {
        return switch (value) {
            case STRONGLY_AGREE -> "Concordo totalmente";
            case AGREE -> "Concordo";
            case NEUTRAL -> "Neutro / Inseguro";
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
