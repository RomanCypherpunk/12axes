import type { CSSProperties } from 'react';
import { t } from '../../i18n';
import type { Axis, AxisResult } from '../../types/quiz';
import { PoleIcon } from '../AxisIcon';
import { pct } from '../editorial/primitives';

const BALANCED_COLOR = '#9C988C';

interface AxesSectionProps {
  axes: Axis[];
  results: Map<string, AxisResult>;
}

export function AxesSection({ axes, results }: AxesSectionProps) {
  return (
    <section className="e-panel" id="eixos-resultado" data-reveal>
      <p className="e-eyebrow">{t.axesSectionEyebrow}</p>
      <h2>{t.axesSectionTitle}</h2>
      <ul className="e-axes-list">
        {axes.map((axis) => {
          const result = results.get(axis.id);
          return result ? <AxisRow key={axis.id} axis={axis} result={result} /> : null;
        })}
      </ul>
    </section>
  );
}

function AxisRow({ axis, result }: { axis: Axis; result: AxisResult }) {
  const left = pct(result.leftPercent);
  const right = pct(result.rightPercent);
  // Mesma regra do backend (distância < 7.5 do centro) — independe do idioma do rótulo.
  const balanced = Math.abs(result.rightPercent - 50) < 7.5;
  const rightWins = !balanced && result.dominantPole === result.rightPole;
  const leftWins = !balanced && !rightWins;
  const accent = balanced ? BALANCED_COLOR : rightWins ? axis.rightColor : axis.leftColor;

  const style = { '--ac': accent, '--al': axis.leftColor, '--ar': axis.rightColor } as CSSProperties;

  return (
    <li className="e-axis-row" style={style}>
      <div className="e-axis-row-head">
        <h3>{result.label}</h3>
        <span className="e-itag">
          <span className="e-idot" />
          {balanced ? result.intensity : `${result.intensity} · ${result.dominantPole}`}
        </span>
      </div>
      <div className="e-axis-bar">
        <div className={leftWins ? 'e-pole e-left e-win' : 'e-pole e-left'}>
          <PoleIcon axisId={axis.id} side="left" className="e-ico" />
          <span>
            <b>{result.leftPole}</b>
            <em>{left}%</em>
          </span>
        </div>
        <div
          className="e-atrack"
          role="img"
          aria-label={`${result.label}: ${result.leftPole} ${left}%, ${result.rightPole} ${right}%`}
        >
          <div className="e-ahalf e-l">
            <i style={{ width: `${leftWins ? (result.leftPercent - 50) * 2 : 0}%` }} />
          </div>
          <div className="e-ahalf e-r">
            <i style={{ width: `${rightWins ? (result.rightPercent - 50) * 2 : 0}%` }} />
          </div>
          <span className="e-amid" />
          <span className="e-adot" style={{ left: `${Math.max(0, Math.min(100, result.rightPercent))}%` }} />
        </div>
        <div className={rightWins ? 'e-pole e-right e-win' : 'e-pole e-right'}>
          <span>
            <b>{result.rightPole}</b>
            <em>{right}%</em>
          </span>
          <PoleIcon axisId={axis.id} side="right" className="e-ico" />
        </div>
      </div>
    </li>
  );
}
