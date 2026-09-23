import { t } from '../../i18n';
import type { AxisOutlier, AxisTension } from '../../types/quiz';

interface SignatureSectionProps {
  unusual: AxisOutlier;
  common: AxisOutlier;
  tension: AxisTension | null;
}

// Onde o perfil destoa do catalogo e onde ele se confunde com a media.
// A regua mostra a distancia — que e o proprio dado — em vez de so citar o numero.
export function SignatureSection({ unusual, common, tension }: SignatureSectionProps) {
  return (
    <section className="e-panel" id="assinatura" data-reveal>
      <h2>{t.signatureTitle}</h2>
      <div className="e-dist">
        <SignatureCard
          outlier={unusual}
          strong
          label={t.signatureUnusualLabel}
          lead={unusualLead(unusual)}
          note={t.signatureUnusualNote(unusual.label)}
        />
        <SignatureCard
          outlier={common}
          strong={false}
          label={t.signatureCommonLabel}
          lead={t.signatureCommonLead(common.label)}
          note={commonNote(common)}
        />
        {tension && <TensionCard tension={tension} />}
      </div>
    </section>
  );
}

// A combinacao de eixos que contraria o padrao do catalogo. Nem todo perfil tem
// uma: centristas e moderados nao pendem o bastante para contrariar nada.
function TensionCard({ tension }: { tension: AxisTension }) {
  const unique = tension.matchingIdeologies === 0;
  const details = [
    tension.examples.length > 0 ? t.tensionExamples(tension.examples.join(', ')) : '',
    t.tensionNote(tension.firstAxisLabel, tension.secondAxisLabel)
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className="e-tension">
      <div>
        <span className="e-tag e-tag-white">{t.tensionLabel}</span>
        <h3>{t.tensionCombo(tension.firstPole, tension.secondPole)}</h3>
      </div>
      <p>
        <b>{unique ? t.tensionUnique : t.tensionRare(tension.matchingIdeologies, tension.catalogSize)}</b>
        {details}
      </p>
    </article>
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
  strong: boolean;
  label: string;
  lead: string;
  note: string;
}

function SignatureCard({ outlier, strong, label, lead, note }: SignatureCardProps) {
  // A regua usa a escala real do eixo (0-100), entao a distancia entre os dois
  // marcadores e visualmente proporcional a diferenca de posicao.
  return (
    <article className={strong ? 'e-dcard e-strong' : 'e-dcard'}>
      <span className={strong ? 'e-tag e-tag-cat' : 'e-tag e-tag-neutral'}>{label}</span>
      <h3>{outlier.label}</h3>
      <p>{lead}</p>
      <div className="e-mbar" aria-hidden="true">
        <span className="e-mtrack" />
        <span className="e-mmed" style={{ left: `${clamp(outlier.catalogMedian)}%` }} />
        <span className={strong ? 'e-myou e-strong' : 'e-myou'} style={{ left: `${clamp(outlier.userPercent)}%` }} />
      </div>
      <div className="e-mlab">
        <span>
          {t.signatureMedian} {outlier.catalogMedian.toFixed(0)}
        </span>
        <b>
          {t.signatureYou} {outlier.userPercent.toFixed(0)}
        </b>
      </div>
      <p>{note}</p>
    </article>
  );
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}
