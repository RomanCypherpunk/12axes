package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.Party;
import com.twelveaxes.model.PartyMatch;
import com.twelveaxes.service.PartyMatcherService;
import com.twelveaxes.service.QuizDataService;
import com.twelveaxes.service.ScoringService;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/** Catalogo de partidos, movimentos, casas dinasticas e organizacoes. */
@SpringBootTest
class PartyCatalogTest {
    @Autowired
    private QuizDataService dataService;

    @Autowired
    private PartyMatcherService partyMatcherService;

    @Autowired
    private ScoringService scoringService;

    @Test
    void everyPartyHasAnExplicitProfile() {
        var profileIds = dataService.getPartyProfiles().keySet();
        var partyIds = dataService.getParties().stream().map(Party::id).toList();

        assertThat(partyIds).isNotEmpty().doesNotHaveDuplicates();
        assertThat(profileIds).containsExactlyInAnyOrderElementsOf(partyIds);
    }

    @Test
    void everyPartyProfileUsesTheTwelveKnownAxes() {
        var axisIds = dataService.getAxes().stream().map(axis -> axis.id()).toList();

        assertThat(dataService.getPartyProfiles().values()).allSatisfy(profile -> {
            assertThat(profile.vector().keySet())
                    .as("Party profile %s must define exactly the known axes", profile.partyId())
                    .containsExactlyInAnyOrderElementsOf(axisIds);
            assertThat(profile.vector().values())
                    .as("Party profile %s values must be percentages", profile.partyId())
                    .allSatisfy(value -> assertThat(value).isBetween(0.0, 100.0));
        });
    }

    @Test
    void everyPartyHasValidCategoryAndAnExistingCountry() {
        assertThat(dataService.getParties()).allSatisfy(party -> {
            assertThat(Party.CATEGORIES)
                    .as("Categoria de %s", party.id())
                    .contains(party.category());
            assertThat(dataService.getCountryById(party.countryId()))
                    .as("countryId de %s (%s)", party.id(), party.countryId())
                    .isNotNull();
            assertThat(party.countryName())
                    .as("O nome do pais de %s deve vir resolvido no idioma da resposta", party.id())
                    .isEqualTo(dataService.getCountryById(party.countryId()).name());
            assertThat(party.countryFlagPath())
                    .as("A bandeira do pais de %s deve vir resolvida", party.id())
                    .isEqualTo(dataService.getCountryById(party.countryId()).flagPath())
                    .isNotBlank();
            assertThat(party.description()).isNotBlank();
            assertThat(party.description().split("\\s+").length)
                    .as("Descricao de %s: teto de 45 palavras", party.id())
                    .isLessThanOrEqualTo(45);
        });
    }

    @Test
    void historicalPartiesDeclareAPeriod() {
        assertThat(dataService.getParties()).allSatisfy(party -> {
            if (party.historical()) {
                assertThat(party.period()).as("period de %s", party.id()).isNotBlank();
            }
        });
    }

    @Test
    void englishOverlayTranslatesTextAndResolvesTheCountryNameInEnglish() {
        List<Party> pt = dataService.getParties(QuizDataService.LANG_PT);
        List<Party> en = dataService.getParties(QuizDataService.LANG_EN);

        assertThat(en).hasSameSizeAs(pt);
        for (int i = 0; i < pt.size(); i++) {
            assertThat(en.get(i).id()).isEqualTo(pt.get(i).id());
            assertThat(en.get(i).countryId()).isEqualTo(pt.get(i).countryId());
            assertThat(en.get(i).religions()).isEqualTo(pt.get(i).religions());
            assertThat(en.get(i).countryName())
                    .isEqualTo(dataService.getCountryById(pt.get(i).countryId(), QuizDataService.LANG_EN).name());
            assertThat(en.get(i).category())
                    .as("EN category de %s traduzida", pt.get(i).id())
                    .isNotEqualTo(pt.get(i).category());
        }
    }

    // Cada logo tem de existir em frontend/public e ser quadrado 1:1 (PNG).
    @Test
    void everyLogoExistsAndIsSquare() throws IOException {
        Path publicDir = publicDir();
        for (Party party : dataService.getParties()) {
            assertThat(party.logoPath()).as("logoPath de %s", party.id()).startsWith("/parties/logos/");
            Path file = publicDir.resolve(party.logoPath().substring(1));
            assertThat(file).as("Logo de %s: %s", party.id(), party.logoPath()).exists();
            assertThat(party.logoSourceUrl()).as("logoSourceUrl de %s", party.id()).startsWith("https://");

            byte[] head = Files.readAllBytes(file);
            assertThat(head.length).isGreaterThan(24);
            // PNG: assinatura de 8 bytes, depois o chunk IHDR com largura e altura (4 bytes cada).
            assertThat(head[1]).isEqualTo((byte) 'P');
            long width = ((head[16] & 0xFFL) << 24) | ((head[17] & 0xFFL) << 16) | ((head[18] & 0xFFL) << 8) | (head[19] & 0xFFL);
            long height = ((head[20] & 0xFFL) << 24) | ((head[21] & 0xFFL) << 16) | ((head[22] & 0xFFL) << 8) | (head[23] & 0xFFL);
            assertThat(width).as("Logo de %s deve ser 1:1", party.id()).isEqualTo(height);
        }
    }

    // O perfil de um partido usado como resposta do usuario tem de devolver o proprio partido no topo.
    @Test
    void partyMatchIsDrivenPurelyByVectorProximity() {
        var profile = dataService.getPartyProfiles().get("vox");
        var axes = scoringService.scoreFromLeftPercents(
                dataService.getAxes().stream().map(axis -> profile.vector().get(axis.id())).toList(),
                QuizDataService.LANG_PT);

        List<PartyMatch> top = partyMatcherService.findTopMatches(axes, QuizDataService.LANG_PT, null);

        assertThat(top).hasSize(3);
        assertThat(top.getFirst().partyId()).isEqualTo("vox");
        assertThat(top.getFirst().compatibility()).isGreaterThan(99.0);
        assertThat(top.getFirst().countryName()).isEqualTo("Espanha");
    }

    @Test
    void historicalAndCurrentVersionsOfTheSameNameAreDistinctProfiles() {
        var current = dataService.getPartyProfiles().get("partido-republicano-eua").vector();
        var newDeal = dataService.getPartyProfiles().get("partido-republicano-eua-new-deal").vector();

        assertThat(current).isNotEqualTo(newDeal);
        assertThat(dataService.getPartyById("partido-republicano-eua-new-deal", QuizDataService.LANG_PT).historical())
                .isTrue();
        assertThat(dataService.getPartyById("partido-republicano-eua", QuizDataService.LANG_PT).historical())
                .isFalse();
    }

    @Test
    void religionFilterHidesPartiesMarkedOnlyWithAnotherReligion() {
        var axes = scoringService.scoreFromLeftPercents(
                dataService.getAxes().stream().map(axis -> 50.0).toList(), QuizDataService.LANG_PT);
        var all = partyMatcherService.findTopMatches(axes, QuizDataService.LANG_PT, null);
        assertThat(all).isNotEmpty();

        // Quem escolheu o judaismo nao ve a Al-Qaeda (marcada so com islam).
        var ranking = partyMatcherService.findBottomMatches(axes, QuizDataService.LANG_PT, "judaism");
        assertThat(ranking).extracting(PartyMatch::partyId).doesNotContain("al-qaeda");
    }

    private static Path publicDir() {
        Path cwd = Path.of(System.getProperty("user.dir")).toAbsolutePath();
        Path fromBackend = cwd.resolve("../frontend/public").normalize();
        if (Files.isDirectory(fromBackend)) {
            return fromBackend;
        }
        return cwd.resolve("frontend/public").normalize();
    }
}
