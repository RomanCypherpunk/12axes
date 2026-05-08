import type { Axis, AxisResult } from '../types/quiz';
import { PoleIcon } from './AxisIcon';

interface AxisResultBarProps {
  axis: Axis;
  result: AxisResult;
}

export function AxisResultBar({ axis, result }: AxisResultBarProps) {
  return (
    <article className="axis-row">
      <div className="pole-card pole-card-left">
        <PoleIcon axisId={axis.id} side="left" />
        <span>{result.leftPole}</span>
      </div>
      <div className="axis-row-main">
        <div className="axis-row-header">
          <div>
            <span>{result.label}</span>
            <strong>{result.intensity}: {result.dominantPole}</strong>
          </div>
          <p>{result.leftPercent.toFixed(1)}% / {result.rightPercent.toFixed(1)}%</p>
        </div>
        <div className="axis-scale">
          <span
            className="axis-fill-left"
            style={{
              width: `${result.leftPercent}%`,
              background: axis.leftColor
            }}
          >
            {result.leftPercent >= 18 ? `${result.leftPercent.toFixed(0)}%` : ''}
          </span>
          <span
            className="axis-fill-right"
            style={{
              width: `${result.rightPercent}%`,
              background: axis.rightColor
            }}
          >
            {result.rightPercent >= 18 ? `${result.rightPercent.toFixed(0)}%` : ''}
          </span>
        </div>
      </div>
      <div className="pole-card pole-card-right">
        <PoleIcon axisId={axis.id} side="right" />
        <span>{result.rightPole}</span>
      </div>
    </article>
  );
}
