import type { Axis, AxisResult } from '../types/quiz';
import { PoleIcon } from './AxisIcon';

interface AxisResultBarProps {
  axis: Axis;
  result: AxisResult;
}

export function AxisResultBar({ axis, result }: AxisResultBarProps) {
  const leftInk = readableInk(axis.leftColor);
  const rightInk = readableInk(axis.rightColor);
  const isBalanced = result.intensity === 'Equilibrado';
  const leaningText = isBalanced
    ? 'Equilibrado'
    : `${result.intensity} para ${result.dominantPole}`;

  const statusColor = isBalanced
    ? 'var(--accent)'
    : result.dominantPole === result.leftPole
      ? axis.leftColor
      : axis.rightColor;

  return (
    <article className="axis-row">
      <header className="axis-row-title">
        <h3>
          {result.label}: <span style={{ color: statusColor }}>{leaningText}</span>
        </h3>
      </header>

      <div className="axis-row-body">
        <div
          className="pole-card pole-card-left"
          style={{
            ['--pole-color' as string]: axis.leftColor,
            ['--pole-ink' as string]: leftInk
          }}
        >
          <PoleIcon axisId={axis.id} side="left" />
          <span>{result.leftPole}</span>
        </div>

        <div
          className="axis-scale"
          aria-label={`${result.label}: ${result.leftPole} ${result.leftPercent.toFixed(1)}%, ${result.rightPole} ${result.rightPercent.toFixed(1)}%`}
        >
          <span
            className="axis-fill-left"
            style={{
              width: `${result.leftPercent}%`,
              ['--bar-color' as string]: axis.leftColor,
              color: leftInk
            }}
          >
            <strong>{result.leftPercent.toFixed(1)}%</strong>
          </span>
          <span
            className="axis-fill-right"
            style={{
              width: `${result.rightPercent}%`,
              ['--bar-color' as string]: axis.rightColor,
              color: rightInk
            }}
          >
            <strong>{result.rightPercent.toFixed(1)}%</strong>
          </span>
        </div>

        <div
          className="pole-card pole-card-right"
          style={{
            ['--pole-color' as string]: axis.rightColor,
            ['--pole-ink' as string]: rightInk
          }}
        >
          <PoleIcon axisId={axis.id} side="right" />
          <span>{result.rightPole}</span>
        </div>
      </div>
    </article>
  );
}

function readableInk(hexColor: string) {
  const normalized = hexColor.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((part) => part + part).join('')
    : normalized;
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luminance > 0.62 ? '#111111' : '#ffffff';
}
