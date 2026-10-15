import type { CSSProperties, ReactNode } from 'react';
import { t } from '../../i18n';
import type { Axis, AxisResult } from '../../types/quiz';
import { AxisTrackRow, TrackPin, YouPin } from './AxisTrack';

// Eixos que mais aproximam o usuário de um perfil (personalidade ou país): menor
// distância entre os dois valores, preferindo eixos em que o usuário tem posição definida.
const CLOSENESS_AXES = 3;
const BALANCED_DISTANCE = 7.5;
const BALANCED_PENALTY = 15;

interface ClosenessProps {
  /** Vetor de 12 eixos (leftPercent) do perfil comparado. */
  vector?: Record<string, number>;
  name: string;
  /** Miniatura do perfil no marcador (retrato ou bandeira). */
  face: ReactNode;
  axes: Axis[];
  results: Map<string, AxisResult>;
}

export function Closeness({ vector, name, face, axes, results }: ClosenessProps) {
  if (!vector) return null;
  const rows = axes
    .map((axis) => {
      const result = results.get(axis.id);
      const target = vector[axis.id];
      if (!result || target === undefined) return null;
      const user = result.leftPercent;
      const balanced = Math.abs(user - 50) < BALANCED_DISTANCE;
      return { axis, result, user, target, rank: Math.abs(user - target) + (balanced ? BALANCED_PENALTY : 0) };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, CLOSENESS_AXES);
  if (rows.length === 0) return null;

  return (
    <div className="e-close">
      <p className="e-close-title">{t.closenessTitle}</p>
      <ul>
        {rows.map(({ axis, result, user, target }) => {
          const color = user >= 50 ? axis.leftColor : axis.rightColor;
          return (
            <AxisTrackRow
              key={axis.id}
              label={result.label}
              aside={user >= 50 ? result.leftPole : result.rightPole}
              leftPole={result.leftPole}
              rightPole={result.rightPole}
              ariaLabel={`${result.label}: ${t.closenessYou} ${Math.round(user)}% ${result.leftPole}, ${name} ${Math.round(target)}% ${result.leftPole}`}
              style={{ '--ac': color } as CSSProperties}
            >
              <TrackPin leftPercent={target} title={name}>
                {face}
              </TrackPin>
              <YouPin leftPercent={user} />
            </AxisTrackRow>
          );
        })}
      </ul>
    </div>
  );
}
