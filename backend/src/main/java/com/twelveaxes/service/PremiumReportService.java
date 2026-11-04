package com.twelveaxes.service;

import com.twelveaxes.model.AnswerImpact;
import com.twelveaxes.model.AxisAnalysis;
import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.CountryMatch;
import com.twelveaxes.model.Disagreement;
import com.twelveaxes.model.GovernmentSeat;
import com.twelveaxes.model.PremiumRanking;
import com.twelveaxes.model.PremiumReport;
import com.twelveaxes.model.RankingRow;
import com.twelveaxes.model.ReportPreview;
import com.twelveaxes.model.ResultRequest;
import com.twelveaxes.model.TimelineEra;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class PremiumReportService {
    private static final int TOP_COUNTRIES = 10;
    /** Quanto do texto de um eixo sai no convite: poucas palavras, e nunca mais que a metade do texto. */
    private static final int PREVIEW_CHARS = 56;
    /** Os cargos do governo ideal que o convite mostra: o resto fica atras do token. */
    private static final Set<String> PREVIEW_SEATS = Set.of("lider", "vice");

    private final ScoringService scoringService;
    private final IdeologyMatcherService ideologyMatcherService;
    private final PersonalityMatcherService personalityMatcherService;
    private final CountryMatcherService countryMatcherService;
    private final PartyMatcherService partyMatcherService;
    private final DisagreementService disagreementService;
    private final IdealGovernmentService idealGovernmentService;
    private final AxisAnalysisService axisAnalysisService;
    private final TimelineService timelineService;

    public PremiumReportService(
            ScoringService scoringService,
            IdeologyMatcherService ideologyMatcherService,
            PersonalityMatcherService personalityMatcherService,
            CountryMatcherService countryMatcherService,
            PartyMatcherService partyMatcherService,
            DisagreementService disagreementService,
            IdealGovernmentService idealGovernmentService,
            AxisAnalysisService axisAnalysisService,
            TimelineService timelineService
    ) {
        this.scoringService = scoringService;
        this.ideologyMatcherService = ideologyMatcherService;
        this.personalityMatcherService = personalityMatcherService;
        this.countryMatcherService = countryMatcherService;
        this.partyMatcherService = partyMatcherService;
        this.disagreementService = disagreementService;
        this.idealGovernmentService = idealGovernmentService;
        this.axisAnalysisService = axisAnalysisService;
        this.timelineService = timelineService;
    }

    /** A partir das respostas: o resultado vem delas e o relatorio inclui o que mais pesou em cada eixo. */
    public PremiumReport report(ResultRequest request, String lang, String religion) {
        return report(scoringService.score(request, lang), scoringService.answerImpacts(request, lang), lang, religion);
    }

    /** So com os 12 valores: o mesmo relatorio, sem o detalhe das respostas (que nao existem neste caso). */
    public PremiumReport report(List<AxisResult> axes, String lang, String religion) {
        return report(axes, Map.of(), lang, religion);
    }

    private PremiumReport report(List<AxisResult> axes, Map<String, List<AnswerImpact>> impacts, String lang, String religion) {
        List<Disagreement> disagreements = disagreementService.compute(axes, lang, religion);
        List<CountryMatch> countries = countryMatcherService.findAll(axes, lang, religion);
        return new PremiumReport(
                axisAnalysisService.analyze(axes, impacts, disagreements, lang),
                countries.stream().filter(country -> !country.historical()).limit(TOP_COUNTRIES).toList(),
                personalityMatcherService.findBestPerCategory(axes, lang, religion),
                disagreements,
                idealGovernmentService.build(axes, lang, religion),
                timelineService.build(axes, lang, religion, true),
                ranking(axes, countries, lang, religion)
        );
    }

    /**
     * O comecinho do relatorio para quem ainda nao pagou: o eixo mais forte (o que mais se afasta do centro) com so o inicio do texto,
     * o lider e o vice do governo ideal e a primeira era da linha do tempo. O resto do relatorio continua atras do token.
     */
    public ReportPreview preview(List<AxisResult> axes, String lang, String religion) {
        List<Disagreement> disagreements = disagreementService.compute(axes, lang, religion);
        AxisAnalysis strongest = axisAnalysisService.analyze(axes, Map.of(), disagreements, lang).stream()
                .max(Comparator.comparingDouble((AxisAnalysis analysis) -> Math.abs(analysis.userLeftPercent() - 50.0)))
                .orElseThrow();
        AxisAnalysis teaser = new AxisAnalysis(
                strongest.axisId(), strongest.label(), strongest.userLeftPercent(), strongest.side(), strongest.level(),
                startOf(strongest.text()), List.of(),
                strongest.ideologyLeftPercent(), strongest.personalityLeftPercent(), strongest.countryLeftPercent());
        List<Disagreement> profiles = disagreements.stream()
                .map(item -> new Disagreement(item.kind(), item.profileId(), item.profileName(), item.ideologyCategory(), List.of()))
                .toList();
        List<GovernmentSeat> government = idealGovernmentService.build(axes, lang, religion).stream()
                .filter(seat -> PREVIEW_SEATS.contains(seat.seatKey()))
                .toList();
        // Da primeira era so a lista (os 2 perfis): a compatibilidade e o cartao da epoca mais compativel ficam no relatorio.
        List<TimelineEra> timeline = timelineService.build(axes, lang, religion, true).stream()
                .limit(1)
                .map(era -> new TimelineEra(era.key(), era.fromYear(), era.toYear(), 0.0, List.of(), era.highlights()))
                .toList();
        return new ReportPreview(teaser, profiles, government, timeline);
    }

    // So o comeco, cortado numa palavra inteira; sem texto escrito (ou curto demais para ter um comeco) nao sai nada.
    static String startOf(String text) {
        if (text == null || text.isBlank()) {
            return null;
        }
        String trimmed = text.strip();
        String head = trimmed.substring(0, Math.min(PREVIEW_CHARS, trimmed.length() / 2));
        int lastSpace = head.lastIndexOf(' ');
        return lastSpace > 0 ? head.substring(0, lastSpace) : null;
    }

    // Todo o catalogo visivel ao filtro de religiao, em formato enxuto.
    private PremiumRanking ranking(List<AxisResult> axes, List<CountryMatch> countries, String lang, String religion) {
        return new PremiumRanking(
                ideologyMatcherService.findAll(axes, lang, religion).stream()
                        .map(match -> new RankingRow(match.ideologyId(), match.name(), match.category(), false, match.compatibility()))
                        .toList(),
                personalityMatcherService.findAll(axes, lang, religion).stream()
                        .map(match -> new RankingRow(match.personalityId(), match.name(), match.category(), false, match.compatibility()))
                        .toList(),
                countries.stream()
                        .map(match -> new RankingRow(match.countryId(), match.name(), match.category(), match.historical(), match.compatibility()))
                        .toList(),
                partyMatcherService.findAll(axes, lang, religion).stream()
                        .map(match -> new RankingRow(match.partyId(), match.name(), match.category(), match.historical(), match.compatibility()))
                        .toList()
        );
    }
}
