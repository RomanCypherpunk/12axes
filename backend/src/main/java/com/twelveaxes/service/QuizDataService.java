package com.twelveaxes.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.model.AnswerOption;
import com.twelveaxes.model.AnswerValue;
import com.twelveaxes.model.Axis;
import com.twelveaxes.model.Ideology;
import com.twelveaxes.model.IdeologyProfile;
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

    private final ObjectMapper objectMapper;
    private List<Axis> axes;
    private List<Question> shortQuestions;
    private List<Question> extendedQuestions;
    private List<Ideology> ideologies;
    private Map<String, IdeologyProfile> ideologyProfiles;

    public QuizDataService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    void loadData() throws IOException {
        axes = readJson("data/axes.json", new TypeReference<>() {});
        shortQuestions = readJson("data/questions.json", new TypeReference<>() {});
        extendedQuestions = readJson("data/questions-extended.json", new TypeReference<>() {});
        ideologies = readJson("data/ideologies.json", new TypeReference<>() {});
        List<IdeologyProfile> profiles = readJson("data/ideology-profiles.json", new TypeReference<>() {});
        ideologyProfiles = profiles.stream()
                .collect(Collectors.toUnmodifiableMap(IdeologyProfile::ideologyId, Function.identity()));
    }

    public QuizPayload getQuiz() {
        return getQuiz(SHORT_VARIANT);
    }

    public QuizPayload getQuiz(String variant) {
        String normalizedVariant = normalizeVariant(variant);
        List<Question> selectedQuestions = getQuestions(normalizedVariant);
        return new QuizPayload(
                "12 Axes",
                "Um quiz de " + selectedQuestions.size() + " perguntas para estimar sua posição nos 12 eixos políticos.",
                normalizedVariant,
                selectedQuestions.size(),
                axes,
                selectedQuestions,
                answerOptions()
        );
    }

    public List<Axis> getAxes() {
        return axes;
    }

    public List<Question> getQuestions() {
        return shortQuestions;
    }

    public List<Question> getQuestions(String variant) {
        return switch (normalizeVariant(variant)) {
            case SHORT_VARIANT -> shortQuestions;
            case EXTENDED_VARIANT -> extendedQuestions;
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Versão de quiz inválida");
        };
    }

    public List<Ideology> getIdeologies() {
        return ideologies;
    }

    public Map<String, IdeologyProfile> getIdeologyProfiles() {
        return ideologyProfiles;
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
