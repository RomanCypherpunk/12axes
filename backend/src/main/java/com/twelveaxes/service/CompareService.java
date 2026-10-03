package com.twelveaxes.service;

import com.twelveaxes.model.CompareDetail;
import com.twelveaxes.model.CompareItem;
import com.twelveaxes.model.Country;
import com.twelveaxes.model.Ideology;
import com.twelveaxes.model.Personality;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * Comparacao do usuario com um perfil escolhido por ele (personalidade, pais ou ideologia).
 *
 * A compatibilidade usa o mesmo {@link ProfileMatchScorer} das demais secoes do resultado,
 * entao o percentual mostrado aqui e o mesmo que o perfil teria no ranking.
 */
@Service
public class CompareService {
    public static final String PERSONALITY = "personality";
    public static final String COUNTRY = "country";
    public static final String IDEOLOGY = "ideology";

    private static final int CATALOG_CACHE_ENTRIES = 32;

    private final QuizDataService dataService;
    private final ProfileMatchScorer scorer;
    private final BoundedCache<String, List<CompareItem>> catalogCache = new BoundedCache<>(CATALOG_CACHE_ENTRIES);

    public CompareService(QuizDataService dataService, ProfileMatchScorer scorer) {
        this.dataService = dataService;
        this.scorer = scorer;
    }

    /** Todos os perfis pesquisaveis, ja filtrados pela religiao do usuario (mesma regra do resultado). */
    public List<CompareItem> catalog(String lang, String religion) {
        String normalizedLang = QuizDataService.normalizeLang(lang);
        String key = normalizedLang + "|" + religion;
        return catalogCache.get(key, () -> buildCatalog(normalizedLang, religion));
    }

    private List<CompareItem> buildCatalog(String lang, String religion) {
        List<CompareItem> items = new ArrayList<>();
        for (Personality personality : dataService.getPersonalities(lang)) {
            if (ReligionFilter.allows(personality.religions(), religion)) {
                items.add(personalityItem(personality));
            }
        }
        for (Country country : dataService.getCountries(lang)) {
            if (ReligionFilter.allows(country.religions(), religion)) {
                items.add(countryItem(country));
            }
        }
        for (Ideology ideology : dataService.getIdeologies(lang)) {
            if (ReligionFilter.allows(ideology.religions(), religion)) {
                items.add(ideologyItem(ideology));
            }
        }
        return List.copyOf(items);
    }

    public CompareDetail compare(String type, String id, Map<String, Double> userVector, String lang) {
        String normalizedLang = QuizDataService.normalizeLang(lang);
        return switch (type == null ? "" : type) {
            case PERSONALITY -> {
                Personality personality = require(dataService.getPersonalityById(id, normalizedLang), type, id);
                var profile = dataService.getPersonalityProfiles().get(id);
                yield detail(personalityItem(personality), personality.description(), userVector,
                        profile == null ? null : profile.vector());
            }
            case COUNTRY -> {
                Country country = require(dataService.getCountryById(id, normalizedLang), type, id);
                var profile = dataService.getCountryProfiles().get(id);
                yield detail(countryItem(country), country.description(), userVector,
                        profile == null ? null : profile.vector());
            }
            case IDEOLOGY -> {
                Ideology ideology = require(dataService.getIdeologyById(id, normalizedLang), type, id);
                var profile = dataService.getIdeologyProfiles().get(id);
                yield detail(ideologyItem(ideology), ideology.description(), userVector,
                        profile == null ? null : profile.vector());
            }
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tipo de comparação inválido");
        };
    }

    private CompareDetail detail(CompareItem item, String description, Map<String, Double> userVector,
                                 Map<String, Double> vector) {
        Map<String, Double> target = vector == null || vector.isEmpty() ? scorer.neutralVector() : vector;
        return new CompareDetail(item, description, scorer.compatibility(userVector, target), target);
    }

    private static <T> T require(T value, String type, String id) {
        if (value == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Perfil não encontrado: " + type + "/" + id);
        }
        return value;
    }

    private static CompareItem personalityItem(Personality personality) {
        return new CompareItem(PERSONALITY, personality.id(), personality.name(), personality.role(),
                personality.imagePath(), personality.category(), false);
    }

    private static CompareItem countryItem(Country country) {
        String caption = country.historical() && country.period() != null && !country.period().isBlank()
                ? country.period()
                : country.category();
        return new CompareItem(COUNTRY, country.id(), country.name(), caption, country.flagPath(),
                country.category(), country.historical());
    }

    private static CompareItem ideologyItem(Ideology ideology) {
        return new CompareItem(IDEOLOGY, ideology.id(), ideology.name(), ideology.category(), null,
                ideology.category(), false);
    }
}
