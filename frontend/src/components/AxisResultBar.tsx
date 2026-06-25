import type { Axis, AxisResult } from '../types/quiz';
import { AxisIcon, PoleIcon } from './AxisIcon';

interface AxisResultBarProps {
  axis: Axis;
  result: AxisResult;
}

export function AxisResultBar({ axis, result }: AxisResultBarProps) {
  const leftPercent = clamp(result.leftPercent);
  const rightPercent = clamp(result.rightPercent);
  const isBalanced = result.intensity === 'Equilibrado';
  const leaningRight = rightPercent > leftPercent;
  const leftActive = !isBalanced && !leaningRight;
  const rightActive = !isBalanced && leaningRight;

  // Position of the marker across the track (0 = full left pole, 100 = full right pole).
  const position = rightPercent;
  const fillLeft = Math.min(position, 50);
  const fillWidth = isBalanced ? 0 : Math.abs(position - 50);

  const leaningText = isBalanced
    ? 'Equilibrado'
    : `${result.intensity} · ${result.dominantPole}`;

  return (
    <article className="axis-row">
      <header className="axis-row-head">
        <div className="axis-row-id">
          <span className="axis-row-icon" aria-hidden="true">
            <AxisIcon id={axis.id} />
          </span>
          <h3>{result.label}</h3>
        </div>
        <span className="axis-lean" data-balanced={isBalanced}>
          {leaningText}
        </span>
      </header>

      <div className="axis-meter">
        <div className={`axis-pole${leftActive ? ' is-active' : ''}`} data-side="left">
          <span className="axis-pole-icon" aria-hidden="true">
            <PoleIcon axisId={axis.id} side="left" />
          </span>
          <span className="axis-pole-text">
            <span className="axis-pole-name">{result.leftPole}</span>
            <span className="axis-pole-value">{leftPercent.toFixed(0)}%</span>
          </span>
        </div>

        <div
          className="axis-track"
          role="img"
          aria-label={`${result.label}: ${result.leftPole} ${leftPercent.toFixed(0)}%, ${result.rightPole} ${rightPercent.toFixed(0)}%`}
        >
          <span className="axis-track-center" aria-hidden="true" />
          {fillWidth > 0 && (
            <span
              className="axis-track-fill"
              style={{ left: `${fillLeft}%`, width: `${fillWidth}%` }}
              aria-hidden="true"
            />
          )}
          <span
            className="axis-track-thumb"
            style={{ left: `${position}%` }}
            data-balanced={isBalanced}
            aria-hidden="true"
          />
        </div>

        <div className={`axis-pole${rightActive ? ' is-active' : ''}`} data-side="right">
          <span className="axis-pole-text">
            <span className="axis-pole-name">{result.rightPole}</span>
            <span className="axis-pole-value">{rightPercent.toFixed(0)}%</span>
          </span>
          <span className="axis-pole-icon" aria-hidden="true">
            <PoleIcon axisId={axis.id} side="right" />
          </span>
        </div>
      </div>
    </article>
  );
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}
