import { AxisResultBar } from '../AxisResultBar';
import { SummaryCountryCard } from './SummaryCountryCard';
import { SummaryPersonalityCard } from './SummaryPersonalityCard';
import { CountUpValue } from './CountUpValue';
import { t } from '../../i18n';
import type { Axis, AxisResult, CountryMatch, IdeologyMatch, PersonalityMatch } from '../../types/quiz';

const SUMMARY_AXIS_IDS = ['representacao', 'economia', 'moral'];

interface SummarySectionProps {
  topIdeology: IdeologyMatch;
  topPersonalities: PersonalityMatch[];
  topCountries: CountryMatch[];
  axes: Axis[];
  axisResults: AxisResult[];
}

// Fecho da pagina: um resumo compacto do resultado, pensado para ser lido
// (ou compartilhado) sozinho, sem precisar rolar pelas secoes acima.
export function SummarySection({ topIdeology, topPersonalities, topCountries, axes, axisResults }: SummarySectionProps) {
  const resultByAxisId = new Map(axisResults.map((result) => [result.axisId, result]));
  const summaryAxes = SUMMARY_AXIS_IDS.map((axisId) => {
    const axis = axes.find((candidate) => candidate.id === axisId);
    const result = resultByAxisId.get(axisId);
    return axis && result ? { axis, result } : null;
  }).filter((entry): entry is { axis: Axis; result: AxisResult } => Boolean(entry));

  return (
    <section className="results-section" id="resumo">
      <div className="section-heading">
        <span className="eyebrow">{t.summaryEyebrow}</span>
        <h2>{t.summaryTitle}</h2>
      </div>

      <div className="summary-headline">
        <span className="summary-headline-name">{topIdeology.name}</span>
        <span className="summary-headline-score">
          <CountUpValue value={topIdeology.compatibility} decimals={0} />
        </span>
      </div>

      <div className="summary-grid">
        {topPersonalities.map((match) => (
          <SummaryPersonalityCard key={match.personalityId} match={match} />
        ))}
        {topCountries.map((match) => (
          <SummaryCountryCard key={match.countryId} match={match} />
        ))}
      </div>

      {summaryAxes.length > 0 && (
        <div className="summary-axes">
          <div className="axis-rows">
            {summaryAxes.map(({ axis, result }) => (
              <AxisResultBar key={axis.id} axis={axis} result={result} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
