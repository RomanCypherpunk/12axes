package com.twelveaxes.service;

import com.twelveaxes.model.AnswerImpact;
import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.CountryMatch;
import com.twelveaxes.model.Disagreement;
import com.twelveaxes.model.PremiumRanking;
import com.twelveaxes.model.PremiumReport;
import com.twelveaxes.model.RankingRow;
import com.twelveaxes.model.ResultRequest;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class PremiumReportService {
    private static final int TOP_COUNTRIES = 10;

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
