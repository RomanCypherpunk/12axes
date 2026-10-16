package com.twelveaxes.service;

import com.twelveaxes.model.CompareDetail;
import com.twelveaxes.model.CompareItem;
import com.twelveaxes.model.ComparePair;
import com.twelveaxes.model.CompareProfile;
import com.twelveaxes.model.CompareProfiles;
import com.twelveaxes.model.Country;
import com.twelveaxes.model.Ideology;
import com.twelveaxes.model.Party;
import com.twelveaxes.model.Personality;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
    public static final String PARTY = "party";

    public static final int MIN_PROFILES = 2;
    public static final int MAX_PROFILES = 3;

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
        for (Party party : dataService.getParties(lang)) {
            if (ReligionFilter.allows(party.religions(), religion)) {
                items.add(partyItem(party));
            }
        }
        return List.copyOf(items);
    }

    public CompareDetail compare(String type, String id, Map<String, Double> userVector, String lang) {
        Resolved target = resolve(type, id, QuizDataService.normalizeLang(lang));
        return new CompareDetail(target.item(), target.description(),
                scorer.compatibility(userVector, target.vector()), target.vector());
    }

    /**
     * Compara de 2 a 3 perfis entre si (link compartilhado, sem quiz). O filtro de religiao nao se aplica:
     * ids explicitos sempre resolvem. Os pares seguem a ordem do pedido (i &lt; j).
     *
     * @param itemsParam tokens "tipo:id" separados por virgula
     */
    public CompareProfiles compareProfiles(String itemsParam, String lang) {
        String normalizedLang = QuizDataService.normalizeLang(lang);
        List<String[]> refs = parseItems(itemsParam);
        List<CompareProfile> profiles = new ArrayList<>();
        for (String[] ref : refs) {
            Resolved resolved = resolve(ref[0], ref[1], normalizedLang);
            profiles.add(new CompareProfile(resolved.item(), resolved.vector()));
        }
        List<ComparePair> pairs = new ArrayList<>();
        for (int i = 0; i < profiles.size(); i++) {
            for (int j = i + 1; j < profiles.size(); j++) {
                pairs.add(new ComparePair(i, j,
                        scorer.compatibility(profiles.get(i).vector(), profiles.get(j).vector())));
            }
        }
        return new CompareProfiles(List.copyOf(profiles), List.copyOf(pairs));
    }

    private static List<String[]> parseItems(String itemsParam) {
        List<String[]> refs = new ArrayList<>();
        Set<String> seen = new HashSet<>();
        for (String token : (itemsParam == null ? "" : itemsParam).split(",", -1)) {
            String trimmed = token.trim();
            int colon = trimmed.indexOf(':');
            String type = colon < 0 ? "" : trimmed.substring(0, colon).trim();
            String id = colon < 0 ? "" : trimmed.substring(colon + 1).trim();
            if (type.isEmpty() || id.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item de comparação inválido: " + trimmed);
            }
            if (!seen.add(type + ":" + id)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item de comparação repetido: " + trimmed);
            }
            refs.add(new String[] {type, id});
        }
        if (refs.size() < MIN_PROFILES || refs.size() > MAX_PROFILES) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Informe de " + MIN_PROFILES + " a " + MAX_PROFILES + " perfis para comparar");
        }
        return refs;
    }

    /** Item, descricao e vetor (neutro quando o perfil nao tem vetor) de um perfil do catalogo. */
    private Resolved resolve(String type, String id, String lang) {
        return switch (type == null ? "" : type) {
            case PERSONALITY -> {
                Personality personality = require(dataService.getPersonalityById(id, lang), type, id);
                var profile = dataService.getPersonalityProfiles().get(id);
                yield resolved(personalityItem(personality), personality.description(),
                        profile == null ? null : profile.vector());
            }
            case COUNTRY -> {
                Country country = require(dataService.getCountryById(id, lang), type, id);
                var profile = dataService.getCountryProfiles().get(id);
                yield resolved(countryItem(country), country.description(),
                        profile == null ? null : profile.vector());
            }
            case IDEOLOGY -> {
                Ideology ideology = require(dataService.getIdeologyById(id, lang), type, id);
                var profile = dataService.getIdeologyProfiles().get(id);
                yield resolved(ideologyItem(ideology), ideology.description(),
                        profile == null ? null : profile.vector());
            }
            case PARTY -> {
                Party party = require(dataService.getPartyById(id, lang), type, id);
                var profile = dataService.getPartyProfiles().get(id);
                yield resolved(partyItem(party), party.description(),
                        profile == null ? null : profile.vector());
            }
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tipo de comparação inválido");
        };
    }

    private Resolved resolved(CompareItem item, String description, Map<String, Double> vector) {
        return new Resolved(item, description, vector == null || vector.isEmpty() ? scorer.neutralVector() : vector);
    }

    private record Resolved(CompareItem item, String description, Map<String, Double> vector) {
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

    // Legenda: pais associado (e o periodo, quando historico), para o front mostrar "Partido, Pais".
    private static CompareItem partyItem(Party party) {
        String country = party.countryName() == null ? "" : party.countryName();
        String caption = party.historical() && party.period() != null && !party.period().isBlank()
                ? country + " · " + party.period()
                : country;
        return new CompareItem(PARTY, party.id(), party.name(), caption, party.logoPath(),
                party.category(), party.historical());
    }

    private static CompareItem ideologyItem(Ideology ideology) {
        return new CompareItem(IDEOLOGY, ideology.id(), ideology.name(), ideology.category(), null,
                ideology.category(), false);
    }
}
