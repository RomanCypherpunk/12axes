import type { CSSProperties } from 'react';
import { t } from '../../i18n';
import type { Axis, AxisResult } from '../../types/quiz';
import { PoleIcon } from '../AxisIcon';
import type { Religion } from '../../utils/religion';
import { pct } from '../editorial/primitives';

// Ordem de exibição em duas colunas (leitura por linhas): esquerda | direita.
export const DISPLAY_ORDER = [
  'estrutura', 'economia',
  'representacao', 'controle',
  'poder', 'comercio',
  'imigracao', 'religiao',
  'diplomacia', 'moral',
  'intervencao', 'tecnologia'
];

// Posicao na grade de duas colunas (desktop); no mobile vale a ordem original.
export function displayRank(axisId: string) {
  const index = DISPLAY_ORDER.indexOf(axisId);
  return index === -1 ? DISPLAY_ORDER.length : index;
}

const BALANCED_COLOR = '#9C988C';

interface AxesSectionProps {
  axes: Axis[];
  results: Map<string, AxisResult>;
  religion?: Religion | null;
  /** Quando a pessoa tem as respostas guardadas neste navegador, abre a edição delas. */
  onEditAnswers?: () => void;
}

export function AxesSection({ axes, results, religion, onEditAnswers }: AxesSectionProps) {
  return (
    <section className="e-panel" id="eixos-resultado" data-reveal>
      <h2 className="e-sec-title">
        {t.axesSectionTitle}
      </h2>
      <ul className="e-axes-list">
        {axes.map((axis) => {
          const result = results.get(axis.id);
          return result ? (
            <AxisRow key={axis.id} axis={axis} result={result} religion={religion} />
          ) : null;
        })}
      </ul>
      {onEditAnswers && (
        <div className="e-axes-edit">
          <button className="e-axes-edit-btn" type="button" onClick={onEditAnswers}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8"
              />
            </svg>
            {t.editAnswersButton}
          </button>
        </div>
      )}
    </section>
  );
}

// Mesma regra do backend (distância < 7.5 do centro) — independe do idioma do rótulo.
export function axisLeaning(axis: Axis, result: AxisResult) {
  const balanced = Math.abs(result.rightPercent - 50) < 7.5;
  const rightWins = !balanced && result.dominantPole === result.rightPole;
  const leftWins = !balanced && !rightWins;
  const accent = balanced ? BALANCED_COLOR : rightWins ? axis.rightColor : axis.leftColor;
  return { balanced, rightWins, leftWins, accent };
}

export function AxisRow({
  axis,
  result,
  religion
}: {
  axis: Axis;
  result: AxisResult;
  religion?: Religion | null;
}) {
  const { balanced, rightWins, leftWins, accent } = axisLeaning(axis, result);
  const winnerPct = pct(rightWins ? result.rightPercent : result.leftPercent);
  const dotAt = Math.max(0, Math.min(100, result.rightPercent));

  const style = { '--ac': accent, '--al': axis.leftColor, '--ar': axis.rightColor, '--rank': displayRank(axis.id) } as CSSProperties;

  return (
    <li className="e-axis-row" style={style}>
      <div className="e-axis-row-head">
        <h3>{result.label}</h3>
        <span className="e-axis-value">{balanced ? result.intensity : `${winnerPct}% ${result.dominantPole}`}</span>
      </div>
      <div
        className="e-atrack"
        role="img"
        aria-label={`${result.label}: ${result.leftPole} ${pct(result.leftPercent)}%, ${result.rightPole} ${pct(result.rightPercent)}%`}
      >
        <i className="e-afill" style={{ left: `${Math.min(dotAt, 50)}%`, width: `${Math.abs(dotAt - 50)}%` }} />
        <span className="e-amid" />
        <span className="e-adot" style={{ left: `${dotAt}%` }} />
      </div>
      <div className="e-axis-poles">
        <div className={leftWins ? 'e-pole e-left e-win' : 'e-pole e-left'}>
          <PoleIcon axisId={axis.id} side="left" className="e-ico" />
          <b>{result.leftPole}</b>
        </div>
        <div className={rightWins ? 'e-pole e-right e-win' : 'e-pole e-right'}>
          <b>{result.rightPole}</b>
          <PoleIcon axisId={axis.id} side="right" className="e-ico" religion={religion} />
        </div>
      </div>
    </li>
  );
}
