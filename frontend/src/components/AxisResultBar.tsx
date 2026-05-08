import type { Axis, AxisResult } from '../types/quiz';

interface AxisResultBarProps {
  axis: Axis;
  result: AxisResult;
}

export function AxisResultBar({ axis, result }: AxisResultBarProps) {
  return (
    <article className="axis-row">
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
        />
        <span
          className="axis-fill-right"
          style={{
            width: `${result.rightPercent}%`,
            background: axis.rightColor
          }}
        />
      </div>
      <div className="axis-poles">
        <span>{result.leftPole}</span>
        <span>{result.rightPole}</span>
      </div>
    </article>
  );
}
