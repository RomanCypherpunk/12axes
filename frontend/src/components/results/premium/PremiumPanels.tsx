import type { ReactNode } from 'react';
import type { Axis, AxisResult, PremiumReport } from '../../../types/quiz';
import { AxisAnalysisPanel } from './AxisAnalysisPanel';
import { DisagreementPanel } from './DisagreementPanel';
import { GovernmentPanel } from './GovernmentPanel';
import { TimelinePanel } from './TimelinePanel';
import { TopCountriesPanel } from './TopListsPanel';

/**
 * As seções do Relatório completo, na ordem da página. A página e o PDF usam as MESMAS seções (o PDF as imprime com o
 * layout da tela), por isso a lista fica aqui e os dois a consomem.
 */
export function premiumPanels(
  report: PremiumReport,
  axes: Axis[],
  results: Map<string, AxisResult>,
  /** O botão de compartilhar o cartão de cada seção que tem um (só na página; o PDF não passa nada). */
  shareButton?: (kind: 'government' | 'timeline' | 'living') => ReactNode
): { id: string; node: ReactNode }[] {
  return [
    {
      id: 'eixos',
      node: (
        <AxisAnalysisPanel
          analysis={report.axisAnalysis}
          axes={axes}
          results={results}
          disagreements={report.disagreements}
          countries={report.topCountries}
          personalities={report.personalitiesByArea}
        />
      )
    },
    {
      id: 'discorda',
      node: (
        <DisagreementPanel
          disagreements={report.disagreements}
          results={results}
          countries={report.topCountries}
          personalities={report.personalitiesByArea}
        />
      )
    },
    {
      id: 'governo',
      node: (
        <GovernmentPanel
          seats={report.idealGovernment}
          category={report.disagreements.find((item) => item.kind === 'ideology')?.ideologyCategory ?? ''}
          footer={shareButton?.('government')}
        />
      )
    },
    { id: 'tempo', node: <TimelinePanel timeline={report.timeline} axes={axes} results={results} footer={shareButton?.('timeline')} /> },
    { id: 'paises', node: <TopCountriesPanel countries={report.topCountries} axes={axes} results={results} footer={shareButton?.('living')} /> }
  ];
}
