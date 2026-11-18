package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.Election;
import com.twelveaxes.model.ElectionCandidate;
import com.twelveaxes.model.ElectionCandidateMatch;
import com.twelveaxes.model.ElectionResult;
import com.twelveaxes.service.ElectionService;
import com.twelveaxes.service.QuizDataService;
import com.twelveaxes.service.ScoringService;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ElectionServiceTest {
    @Autowired
    private ElectionService electionService;

    @Autowired
    private ScoringService scoringService;

    @Autowired
    private QuizDataService dataService;

    private static Election election(List<String> languages, Map<String, String> name) {
        return new Election("e1", "espanha", "2026-11-29", languages, null, name,
                List.of(new ElectionCandidate("pedro-sanchez", "psoe")));
    }

    private List<AxisResult> neutralAxes(String lang) {
        return scoringService.scoreFromLeftPercents(Collections.nCopies(12, 50.0), lang);
    }

    @Test
    void appliesToOnlyTheListedLanguages() {
        Election spain = election(List.of("es"), Map.of("en", "Spain"));

        assertThat(spain.appliesTo("es")).isTrue();
        assertThat(spain.appliesTo("ES")).isTrue();
        assertThat(spain.appliesTo("es-AR")).isTrue();
        assertThat(spain.appliesTo("pt")).isFalse();
        assertThat(spain.appliesTo("en")).isFalse();
    }

    @Test
    void emptyOrMissingLanguagesApplyToEveryLanguage() {
        assertThat(election(List.of(), Map.of("en", "x")).appliesTo("pt")).isTrue();
        assertThat(election(null, Map.of("en", "x")).appliesTo("ru")).isTrue();
    }

    @Test
    void nameFallsBackToEnglishThenPortuguese() {
        Election both = election(null, Map.of("pt", "Eleições", "en", "Elections", "es", "Elecciones"));
        assertThat(both.nameFor("es")).isEqualTo("Elecciones");
        assertThat(both.nameFor("de")).isEqualTo("Elections");

        Election onlyPt = election(null, Map.of("pt", "Eleições"));
        assertThat(onlyPt.nameFor("de")).isEqualTo("Eleições");
    }

    @Test
    void onlySpanishAndPortugueseSeeTheElectionsEachWithItsOwnCountryFirst() {
        List<ElectionResult> es = electionService.findActive(neutralAxes("es"), "es");
        assertThat(es.stream().map(ElectionResult::id)).containsExactly("espanha-2026-gerais", "brasil-2026-presidenciais");

        List<ElectionResult> pt = electionService.findActive(neutralAxes("pt"), "pt");
        assertThat(pt.stream().map(ElectionResult::id)).containsExactly("brasil-2026-presidenciais", "espanha-2026-gerais");
    }

    @Test
    void otherLanguagesSeeNoElection() {
        for (String lang : new String[] {"en", "de", "it", "ru", "fr"}) {
            assertThat(electionService.findActive(neutralAxes(lang), lang)).as(lang).isEmpty();
        }
    }

    @Test
    void spainElectionHasTheThreeCandidatesRankedByCompatibility() {
        ElectionResult spain = electionService.findActive(neutralAxes("es"), "es").getFirst();

        assertThat(spain.date()).isEqualTo("2026-11-29");
        assertThat(spain.name()).containsIgnoringCase("elecciones");
        assertThat(spain.candidates()).hasSize(3);
        assertThat(spain.candidates().stream().map(c -> c.candidate().personalityId()))
                .containsExactlyInAnyOrder("pedro-sanchez", "alberto-nunez-feijoo", "santiago-abascal");
        assertThat(spain.candidates().stream().map(c -> c.party().partyId()))
                .containsExactlyInAnyOrder("psoe", "partido-popular-espanha", "vox");
        List<Double> scores = spain.candidates().stream().map(c -> c.candidate().compatibility()).toList();
        assertThat(scores).isSortedAccordingTo(java.util.Comparator.reverseOrder());
        assertThat(spain.candidates()).allSatisfy((ElectionCandidateMatch c) -> {
            assertThat(c.candidate().name()).isNotBlank();
            assertThat(c.party().name()).isNotBlank();
        });
    }

    @Test
    void brazilElectionHasTheFiveCandidatesWithTheirParties() {
        ElectionResult brazil = electionService.findActive(neutralAxes("pt"), "pt").getFirst();

        assertThat(brazil.countryId()).isEqualTo("brasil");
        assertThat(brazil.date()).isEqualTo("2026-10-04");
        assertThat(brazil.name()).containsIgnoringCase("presidenciais");
        assertThat(brazil.candidates().stream().map(c -> c.candidate().personalityId()))
                .containsExactlyInAnyOrder("lula-da-silva", "flavio-bolsonaro", "renan-santos", "romeu-zema", "ronaldo-caiado");
        assertThat(brazil.candidates().stream().map(c -> c.party().partyId()))
                .containsExactlyInAnyOrder("partido-dos-trabalhadores", "partido-liberal-brasil", "partido-missao", "partido-novo", "psd");
        List<Double> scores = brazil.candidates().stream().map(c -> c.candidate().compatibility()).toList();
        assertThat(scores).isSortedAccordingTo(java.util.Comparator.reverseOrder());
    }

    @Test
    void electionsWithUnknownPersonalityOrPartyAreRejectedAtStartupWithTheOffendingId() {
        Set<String> personalities = Set.of("pedro-sanchez");
        Set<String> parties = Set.of("psoe");

        assertThatThrownBy(() -> QuizDataService.validateElections(
                List.of(new Election("e", "espanha", "2026-11-29", null, null, Map.of("en", "x"),
                        List.of(new ElectionCandidate("fulano-inexistente", "psoe")))),
                personalities, parties))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("fulano-inexistente");
        assertThatThrownBy(() -> QuizDataService.validateElections(
                List.of(new Election("e", "espanha", "2026-11-29", null, null, Map.of("en", "x"),
                        List.of(new ElectionCandidate("pedro-sanchez", "partido-fantasma")))),
                personalities, parties))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("partido-fantasma");
        QuizDataService.validateElections(
                List.of(new Election("e", "espanha", "2026-11-29", null, null, Map.of("en", "x"),
                        List.of(new ElectionCandidate("pedro-sanchez", "psoe")))),
                personalities, parties);
    }

    @Test
    void theShippedElectionsFileIsValidAgainstTheCatalog() {
        assertThat(dataService.getElections()).isNotEmpty();
        assertThat(dataService.getElections()).allSatisfy(e -> assertThat(e.candidates()).isNotEmpty());
    }
}
