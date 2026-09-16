import type { CSSProperties } from 'react';
import { t } from '../../i18n';
import type { AxisOutlier } from '../../types/quiz';
import { CountUpValue } from './CountUpValue';

interface SignatureSectionProps {
  unusual: AxisOutlier;
  common: AxisOutlier;
}

// Onde o perfil destoa do catalogo e onde ele se confunde com a media.
// A regua mostra a distancia — que e o proprio dado — em vez de so citar o numero.
export function SignatureSection({ unusual, common }: SignatureSectionProps) {
  return (
    <section className="results-section" id="assinatura">
      <div className="section-heading">
        <h2>{t.signatureTitle}</h2>
      </div>

      <div className="signature-grid">
        <SignatureCard
          outlier={unusual}
          variant="unusual"
          label={t.signatureUnusualLabel}
          lead={unusualLead(unusual)}
          note={t.signatureUnusualNote(unusual.label)}
        />
        <SignatureCard
          outlier={common}
          variant="common"
          label={t.signatureCommonLabel}
          lead={t.signatureCommonLead(common.label)}
          note={commonNote(common)}
        />
      </div>
    </section>
  );
}

// Quem esta na faixa neutra nao pende para polo nenhum: dizer "voce e mais
// democracia" seria arbitrario. Nesse caso o texto compara o centro do usuario
// com a inclinacao do catalogo, que e o que de fato o distingue.
function unusualLead(outlier: AxisOutlier): string {
  if (outlier.balanced) {
    return t.signatureUnusualLeadBalanced(outlier.label, outlier.abovePole, outlier.abovePercent);
  }
  // "mais que 100% das ideologias" soa errado: no extremo do catalogo a frase
  // vira uma afirmacao direta.
  if (outlier.abovePercent >= 99.5) {
    return t.signatureUnusualLeadMax(outlier.abovePole);
  }
  return t.signatureUnusualLead(outlier.abovePole, outlier.abovePercent);
}

function commonNote(outlier: AxisOutlier): string {
  if (outlier.balanced) {
    return t.signatureCommonNoteBalanced(outlier.label);
  }
  return t.signatureCommonNote(outlier.dominantPole ?? outlier.abovePole);
}

interface SignatureCardProps {
  outlier: AxisOutlier;
  variant: 'unusual' | 'common';
  label: string;
  lead: string;
  note: string;
}

function SignatureCard({ outlier, variant, label, lead, note }: SignatureCardProps) {
  // A regua usa a escala real do eixo (0-100), entao a distancia entre os dois
  // marcadores e visualmente proporcional a diferenca de posicao.
  const style = {
    ['--you']: `${clamp(outlier.userPercent)}%`,
    ['--median']: `${clamp(outlier.catalogMedian)}%`,
  } as CSSProperties;

  return (
    <article className="signature-card" data-variant={variant}>
      <span className="signature-label">{label}</span>
      <h3>{outlier.label}</h3>
      <p className="signature-lead">{lead}</p>

      <div className="signature-track" style={style} aria-hidden="true">
        <span className="signature-median" />
        <span className="signature-you" />
      </div>
      <div className="signature-legend" aria-hidden="true">
        <span className="signature-legend-median">
          {t.signatureMedian} {outlier.catalogMedian.toFixed(0)}
        </span>
        <span className="signature-legend-you">
          {t.signatureYou} <CountUpValue value={outlier.userPercent} decimals={0} suffix="" />
        </span>
      </div>

      <p className="signature-note">{note}</p>
    </article>
  );
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}
