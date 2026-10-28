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
export function premiumPanels(report: PremiumReport, axes: Axis[], results: Map<string, AxisResult>): { id: string; node: ReactNode }[] {
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
        />
      )
    },
    { id: 'tempo', node: <TimelinePanel timeline={report.timeline} axes={axes} results={results} /> },
    { id: 'paises', node: <TopCountriesPanel countries={report.topCountries} axes={axes} results={results} /> }
  ];
}
