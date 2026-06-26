import type { CSSProperties } from 'react';
import type { Axis, AxisResult } from '../types/quiz';
import { PoleIcon } from './AxisIcon';

interface AxisResultBarProps {
  axis: Axis;
  result: AxisResult;
}

const BALANCED_COLOR = '#94A3B8';

export function AxisResultBar({ axis, result }: AxisResultBarProps) {
  const leftPercent = clamp(result.leftPercent);
  const rightPercent = clamp(result.rightPercent);
  const isBalanced = result.intensity === 'Equilibrado';
  const leaningRight = result.dominantPole === result.rightPole;
  const leftActive = !isBalanced && !leaningRight;
  const rightActive = !isBalanced && leaningRight;

  const dominantColor = isBalanced ? BALANCED_COLOR : leaningRight ? axis.rightColor : axis.leftColor;

  // Backend scores store the left pole as 100 - rightPercent, so the visual axis
  // coordinate is rightPercent: 0 = left pole, 50 = center, 100 = right pole.
  const position = rightPercent;
  const fillLeft = Math.min(position, 50);
  const fillWidth = isBalanced ? 0 : Math.abs(position - 50);
  const leanDirection = isBalanced ? 'balanced' : leaningRight ? 'right' : 'left';

  const leaningText = isBalanced ? 'Equilibrado' : `${result.intensity} - ${result.dominantPole}`;

  const rowStyle = {
    ['--axis-left']: axis.leftColor,
    ['--axis-right']: axis.rightColor,
    ['--axis-dom']: dominantColor,
    ['--axis-dom-ink']: readableInk(dominantColor)
  } as CSSProperties;

  const leftPoleStyle = { ['--pole']: axis.leftColor, ['--pole-ink']: readableInk(axis.leftColor) } as CSSProperties;
  const rightPoleStyle = { ['--pole']: axis.rightColor, ['--pole-ink']: readableInk(axis.rightColor) } as CSSProperties;
  const trackStyle = {
    ['--axis-position']: `${position}%`,
    ['--axis-fill-left']: `${fillLeft}%`,
    ['--axis-fill-width']: `${fillWidth}%`
  } as CSSProperties;

  return (
    <article className="axis-row axis-vector-card" style={rowStyle}>
      <header className="axis-row-head">
        <div className="axis-row-id">
          <h3>{result.label}</h3>
        </div>
        <span className="axis-lean" data-balanced={isBalanced}>
          {leaningText}
        </span>
      </header>

      <div className="axis-meter">
        <div className={`axis-pole${leftActive ? ' is-active' : ''}`} data-side="left" style={leftPoleStyle}>
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
          data-lean={leanDirection}
          role="img"
          aria-label={`${result.label}: ${result.leftPole} ${leftPercent.toFixed(0)}%, ${result.rightPole} ${rightPercent.toFixed(0)}%`}
          style={trackStyle}
        >
          <span className="axis-track-center" aria-hidden="true" />
          <span className="axis-track-fill" aria-hidden="true" />
          <span
            className="axis-track-thumb"
            data-balanced={isBalanced}
            aria-hidden="true"
          />
        </div>

        <div className={`axis-pole${rightActive ? ' is-active' : ''}`} data-side="right" style={rightPoleStyle}>
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

function readableInk(hexColor: string) {
  const normalized = hexColor.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((part) => part + part)
          .join('')
      : normalized;
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luminance > 0.62 ? '#0B1020' : '#ffffff';
}
