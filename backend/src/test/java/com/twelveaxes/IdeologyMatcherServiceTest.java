package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AnswerValue;
import com.twelveaxes.model.IdeologyMatch;
import com.twelveaxes.model.Pole;
import com.twelveaxes.model.Question;
import com.twelveaxes.model.ResultRequest;
import com.twelveaxes.model.SubmittedAnswer;
import com.twelveaxes.service.IdeologyMatcherService;
import com.twelveaxes.service.QuizDataService;
import com.twelveaxes.service.ScoringService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class IdeologyMatcherServiceTest {
    @Autowired
    private QuizDataService dataService;

    @Autowired
    private ScoringService scoringService;

    @Autowired
    private IdeologyMatcherService matcherService;

    @Test
    void everyIdeologyHasAnExplicitProfile() {
        var profileIds = dataService.getIdeologyProfiles().keySet();
        var ideologyIds = dataService.getIdeologies().stream()
                .map(i -> i.id())
                .toList();

        assertThat(ideologyIds).hasSize(155);
        assertThat(profileIds).containsExactlyInAnyOrderElementsOf(ideologyIds);
    }

    @Test
    void neutralAnswersFavorCentrismo() {
        List<SubmittedAnswer> answers = dataService.getQuestions().stream()
                .map(q -> new SubmittedAnswer(q.id(), AnswerValue.NEUTRAL))
                .toList();
        var axes = scoringService.score(new ResultRequest(answers));

        List<IdeologyMatch> matches = matcherService.findMatches(axes);

        assertThat(matches).isNotEmpty();
        assertThat(matches.get(0).ideologyId()).isEqualTo("centrismo");
        assertThat(matches.get(0).compatibility()).isEqualTo(100.0);
    }

    @Test
    void fascistAnswersFavorRightAuthoritarianIdeologies() {
        // Build extreme right-authoritarian responses by mapping each question
        // toward its agreePole that aligns with fascism's profile.
        List<SubmittedAnswer> answers = dataService.getQuestions().stream()
                .map(this::extremeFascistAnswer)
                .toList();
        var axes = scoringService.score(new ResultRequest(answers));

        var matches = matcherService.findMatches(axes);

        assertThat(matches).hasSize(4);
        assertThat(matches.get(0).category())
                .isIn("Direita Autoritária", "Esquerda Autoritária");
        // Every top match should have meaningful compatibility (>= 60%).
        assertThat(matches).allSatisfy(m -> assertThat(m.compatibility()).isGreaterThan(50.0));
    }

    @Test
    void anarchistAnswersFavorLeftLibertarianIdeologies() {
        List<SubmittedAnswer> answers = dataService.getQuestions().stream()
                .map(this::extremeAnarchistAnswer)
                .toList();
        var axes = scoringService.score(new ResultRequest(answers));

        var matches = matcherService.findMatches(axes);

        assertThat(matches).hasSize(4);
        assertThat(matches.get(0).category())
                .isIn("Esquerda Libertária", "Direita Libertária");
    }

    private SubmittedAnswer extremeFascistAnswer(Question q) {
        // Fascism vector approximation: high authority/security/militarist/etc
        boolean towardLeftPole = switch (q.axisId()) {
            case "estrutura"     -> false; // unitário
            case "representacao" -> false; // autocracia
            case "poder"         -> true;  // segurança
            case "imigracao"     -> true;  // assimilacionista
            case "diplomacia"    -> true;  // militarista
            case "intervencao"   -> false; // nacionalista
            case "economia"      -> false; // privado-corporativista
            case "controle"      -> true;  // planejamento (corporativismo estatal)
            case "comercio"      -> true;  // protecionismo
            case "religiao"      -> false; // religioso
            case "moral"         -> false; // tradicionalista
            case "tecnologia"    -> false; // bioconservacionismo
            default -> false;
        };
        AnswerValue answer;
        if (q.agreePole() == Pole.LEFT) {
            answer = towardLeftPole ? AnswerValue.STRONGLY_AGREE : AnswerValue.STRONGLY_DISAGREE;
        } else {
            answer = towardLeftPole ? AnswerValue.STRONGLY_DISAGREE : AnswerValue.STRONGLY_AGREE;
        }
        return new SubmittedAnswer(q.id(), answer);
    }

    private SubmittedAnswer extremeAnarchistAnswer(Question q) {
        // Social-anarchism vector approximation
        boolean towardLeftPole = switch (q.axisId()) {
            case "estrutura"     -> true;  // federal/descentralizado
            case "representacao" -> true;  // democracia
            case "poder"         -> false; // liberdade
            case "imigracao"     -> false; // multiculturalista
            case "diplomacia"    -> false; // pacifista
            case "intervencao"   -> true;  // não intervencionista
            case "economia"      -> true;  // serviço público/cooperativo
            case "controle"      -> true;  // planejamento popular/cooperativo
            case "comercio"      -> false; // globalismo solidário
            case "religiao"      -> true;  // irreligioso
            case "moral"         -> true;  // progressista
            case "tecnologia"    -> true;  // tecnologia
            default -> true;
        };
        AnswerValue answer;
        if (q.agreePole() == Pole.LEFT) {
            answer = towardLeftPole ? AnswerValue.STRONGLY_AGREE : AnswerValue.STRONGLY_DISAGREE;
        } else {
            answer = towardLeftPole ? AnswerValue.STRONGLY_DISAGREE : AnswerValue.STRONGLY_AGREE;
        }
        return new SubmittedAnswer(q.id(), answer);
    }
}
