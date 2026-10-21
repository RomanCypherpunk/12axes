package com.twelveaxes.service;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.CompareDetail;
import com.twelveaxes.model.CompareItem;
import com.twelveaxes.model.CompareNearest;
import com.twelveaxes.model.ComparePair;
import com.twelveaxes.model.CompareProfile;
import com.twelveaxes.model.CompareProfiles;
import com.twelveaxes.model.Country;
import com.twelveaxes.model.CountryMatch;
import com.twelveaxes.model.Ideology;
import com.twelveaxes.model.IdeologyMatch;
import com.twelveaxes.model.Party;
import com.twelveaxes.model.PartyMatch;
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

    public static final int MIN_PROFILES = 1;
    public static final int MAX_PROFILES = 3;

    private static final int CATALOG_CACHE_ENTRIES = 32;

    private static final int NEAREST_CANDIDATES = 4;

    private final QuizDataService dataService;
    private final ProfileMatchScorer scorer;
    private final ScoringService scoringService;
    private final IdeologyMatcherService ideologyMatcher;
    private final CountryMatcherService countryMatcher;
    private final PartyMatcherService partyMatcher;
    private final BoundedCache<String, List<CompareItem>> catalogCache = new BoundedCache<>(CATALOG_CACHE_ENTRIES);

    public CompareService(
            QuizDataService dataService,
            ProfileMatchScorer scorer,
            ScoringService scoringService,
            IdeologyMatcherService ideologyMatcher,
            CountryMatcherService countryMatcher,
            PartyMatcherService partyMatcher
    ) {
        this.dataService = dataService;
        this.scorer = scorer;
        this.scoringService = scoringService;
        this.ideologyMatcher = ideologyMatcher;
        this.countryMatcher = countryMatcher;
        this.partyMatcher = partyMatcher;
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
     * Compara de 1 a 3 perfis (com 1, so o perfil e seus vizinhos, sem pares; link compartilhado, sem quiz). O filtro de religiao nao se aplica:
     * ids explicitos sempre resolvem. Os pares seguem a ordem do pedido (i &lt; j).
     *
     * @param itemsParam tokens "tipo:id" separados por virgula
     */
    public CompareProfiles compareProfiles(String itemsParam, String lang) {
        String normalizedLang = QuizDataService.normalizeLang(lang);
        List<String[]> refs = parseItems(itemsParam);
        List<Resolved> resolved = new ArrayList<>();
        for (String[] ref : refs) {
            resolved.add(resolve(ref[0], ref[1], normalizedLang));
        }
        List<CompareProfile> profiles = new ArrayList<>();
        for (int i = 0; i < resolved.size(); i++) {
            Resolved current = resolved.get(i);
            profiles.add(new CompareProfile(current.item(), current.vector(),
                    nearest(refs.get(i), current.vector(), normalizedLang)));
        }
        List<ComparePair> pairs = new ArrayList<>();
        for (int i = 0; i < profiles.size(); i++) {
            for (int j = i + 1; j < profiles.size(); j++) {
                pairs.add(new ComparePair(i, j,
                        scorer.compatibility(profiles.get(i).vector(), profiles.get(j).vector())));
            }
        }
        return new CompareProfiles(List.copyOf(profiles), List.copyOf(pairs),
                commonIdeology(refs, resolved, normalizedLang));
    }

    /** Ideologia, pais e partido mais proximos do vetor, sem o proprio perfil. */
    private CompareNearest nearest(String[] self, Map<String, Double> vector, String lang) {
        List<AxisResult> axes = axisResults(vector, lang);
        IdeologyMatch ideology = ideologyMatcher.findMatches(axes, lang).stream()
                .filter(match -> !isSelf(self, IDEOLOGY, match.ideologyId()))
                .findFirst().orElse(null);
        CountryMatch country = countryMatcher.findTopMatchesAny(axes, lang).stream()
                .filter(match -> !isSelf(self, COUNTRY, match.countryId()))
                .findFirst().orElse(null);
        PartyMatch party = partyMatcher.findTopMatches(axes, lang, null).stream()
                .filter(match -> !isSelf(self, PARTY, match.partyId()))
                .findFirst().orElse(null);
        return new CompareNearest(ideology, country, party);
    }

    /** A ideologia mais proxima da media dos vetores, ignorando as ideologias que ja estao na comparacao. */
    private IdeologyMatch commonIdeology(List<String[]> refs, List<Resolved> resolved, String lang) {
        Map<String, Double> mean = new java.util.LinkedHashMap<>();
        for (var axis : dataService.getAxes(lang)) {
            mean.put(axis.id(), resolved.stream()
                    .mapToDouble(profile -> profile.vector().getOrDefault(axis.id(), 50.0))
                    .average().orElse(50.0));
        }
        Set<String> inComparison = new HashSet<>();
        for (String[] ref : refs) {
            if (IDEOLOGY.equals(ref[0])) {
                inComparison.add(ref[1]);
            }
        }
        return ideologyMatcher.findMatches(axisResults(mean, lang), lang).stream()
                .filter(match -> !inComparison.contains(match.ideologyId()))
                .findFirst().orElse(null);
    }

    private List<AxisResult> axisResults(Map<String, Double> vector, String lang) {
        List<Double> leftPercents = dataService.getAxes(lang).stream()
                .map(axis -> vector.getOrDefault(axis.id(), 50.0))
                .toList();
        return scoringService.scoreFromLeftPercents(leftPercents, lang);
    }

    private static boolean isSelf(String[] self, String type, String id) {
        return self[0].equals(type) && self[1].equals(id);
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
