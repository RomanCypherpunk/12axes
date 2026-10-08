import type { CSSProperties } from 'react';
import { t } from '../../i18n';
import type { Axis, AxisOutlier, AxisResult, AxisTension } from '../../types/quiz';

interface SignatureSectionProps {
  unusual: AxisOutlier;
  common: AxisOutlier;
  tension: AxisTension | null;
  axes: Axis[];
  results: Map<string, AxisResult>;
}

// Onde o perfil destoa do catalogo e onde ele se confunde com a media.
// A regua mostra a distancia — que e o proprio dado — em vez de so citar o numero.
export function SignatureSection({ unusual, common, tension, axes, results }: SignatureSectionProps) {
  return (
    <section className="e-panel" id="assinatura" data-reveal>
      <div className="e-sec-head">
        <h2 className="e-sec-title">
          {t.signatureTitle}
        </h2>
        <p className="e-mleg" aria-hidden="true">
          <span>
            <i className="e-k-m" />
            {t.signatureMedian}
          </span>
          <span>
            <i className="e-k-y" />
            {t.signatureYou}
          </span>
        </p>
      </div>
      <div className="e-dist">
        <SignatureCard outlier={unusual} strong label={t.signatureUnusualLabel} results={results} />
        <SignatureCard outlier={common} strong={false} label={t.signatureCommonLabel} results={results} />
        {tension && <TensionCard tension={tension} axes={axes} results={results} />}
      </div>
    </section>
  );
}

// Cor do polo que o usuario ocupa no eixo da tensao (undefined se nao achar).
function poleColor(axes: Axis[], results: Map<string, AxisResult>, axisLabel: string, pole: string): string | undefined {
  const axis = axes.find((candidate) => results.get(candidate.id)?.label === axisLabel);
  const result = axis ? results.get(axis.id) : undefined;
  if (!axis || !result) {
    return undefined;
  }
  return result.rightPole === pole ? axis.rightColor : axis.leftColor;
}

// A combinacao de eixos que contraria o padrao do catalogo. Nem todo perfil tem
// uma: centristas e moderados nao pendem o bastante para contrariar nada.
function TensionCard({ tension, axes, results }: { tension: AxisTension; axes: Axis[]; results: Map<string, AxisResult> }) {
  const unique = tension.matchingIdeologies === 0;
  const hidden = tension.matchingIdeologies - tension.examples.length;
  const first = poleColor(axes, results, tension.firstAxisLabel, tension.firstPole);
  const second = poleColor(axes, results, tension.secondAxisLabel, tension.secondPole);

  return (
    <article className="e-tension">
      <div>
        <span className="e-tag e-tag-white">{t.tensionLabel}</span>
        <div className="e-pair" aria-label={t.tensionCombo(tension.firstPole, tension.secondPole)}>
          <span style={{ '--c': first } as CSSProperties}>{tension.firstPole}</span>
          <em aria-hidden="true">+</em>
          <span style={{ '--c': second } as CSSProperties}>{tension.secondPole}</span>
        </div>
      </div>
      <div>
        <p>{unique ? t.tensionUnique : <b>{t.tensionRareShort(tension.matchingIdeologies, tension.catalogSize)}</b>}</p>
        {tension.examples.length > 0 && (
          <ul className="e-chips">
            {tension.examples.map((name) => (
              <li key={name}>{name}</li>
            ))}
            {hidden > 0 && <li className="e-chip-more">+{hidden}</li>}
          </ul>
        )}
      </div>
    </article>
  );
}

// Quem esta na faixa neutra nao pende para polo nenhum: dizer "voce e mais
// democracia" seria arbitrario. Nesse caso o texto compara o centro do usuario
// com a inclinacao do catalogo, que e o que de fato o distingue.
export function unusualLead(outlier: AxisOutlier): string {
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

export function commonNote(outlier: AxisOutlier): string {
  if (outlier.balanced) {
    return t.signatureCommonNoteBalanced(outlier.label);
  }
  return t.signatureCommonNote(outlier.dominantPole ?? outlier.abovePole);
}

interface SignatureCardProps {
  outlier: AxisOutlier;
  strong: boolean;
  label: string;
  results: Map<string, AxisResult>;
}

function SignatureCard({ outlier, strong, label, results }: SignatureCardProps) {
  // A regua usa a escala real do eixo (0-100), entao a distancia entre os dois
  // marcadores e visualmente proporcional a diferenca de posicao.
  const axisResult = results.get(outlier.axisId);
  // O backend manda a escala como % do polo ESQUERDO; a regua tem o polo
  // esquerdo na ponta esquerda, entao a posicao visual e o complemento.
  const median = clamp(100 - outlier.catalogMedian);
  const you = clamp(100 - outlier.userPercent);

  let big = '';
  let cap: string;
  if (strong) {
    big = outlier.balanced ? '' : String(outlier.abovePercent >= 99.5 ? 100 : Math.round(outlier.abovePercent));
    cap = outlier.balanced ? unusualLead(outlier) : t.signatureBigCap(outlier.abovePole);
  } else {
    big = outlier.balanced ? t.signatureAtCentre : t.signatureAtMedian;
    cap = commonNote(outlier);
  }

  return (
    <article className={strong ? 'e-dcard e-strong' : 'e-dcard'}>
      <div className="e-dcard-head">
        <span className={strong ? 'e-tag e-tag-white' : 'e-tag e-tag-cat'}>{label}</span>
        <h3>{outlier.label}</h3>
      </div>
      <div className="e-dcard-body">
        {big && (
          <p className="e-big">
            {big}
            {strong && <small>%</small>}
          </p>
        )}
        <p className="e-cap">{cap}</p>
      </div>
      <div className="e-mbar" aria-hidden="true">
        <span className="e-mtrack" />
        <span className="e-mfill" style={{ left: `${Math.min(median, you)}%`, width: `${Math.abs(you - median)}%` }} />
        <span className="e-mmed" style={{ left: `${median}%` }} />
        <span className={strong ? 'e-myou e-strong' : 'e-myou'} style={{ left: `${you}%` }} />
      </div>
      {axisResult && (
        <div className="e-mlab">
          <span>{axisResult.leftPole}</span>
          <span>{axisResult.rightPole}</span>
        </div>
      )}
    </article>
  );
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}
