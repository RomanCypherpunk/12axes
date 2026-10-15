import type { CSSProperties, ReactNode } from 'react';
import { t } from '../../i18n';

interface AxisTrackRowProps {
  label: string;
  /** Texto à direita do nome do eixo (o polo do usuário, na proximidade do resultado). */
  aside?: string;
  leftPole: string;
  rightPole: string;
  /** Leitura da trilha para leitores de tela, com o valor de cada marcador. */
  ariaLabel: string;
  style?: CSSProperties;
  /** Marcadores da trilha (TrackPin, YouPin). */
  children: ReactNode;
}

/** Um eixo como trilha entre os dois polos (classes e-close), com um marcador por perfil. */
export function AxisTrackRow({ label, aside, leftPole, rightPole, ariaLabel, style, children }: AxisTrackRowProps) {
  return (
    <li style={style}>
      <div className="e-close-head">
        <b>{label}</b>
        {aside && <span>{aside}</span>}
      </div>
      <div className="e-close-track" role="img" aria-label={ariaLabel}>
        <span className="e-close-mid" />
        {children}
      </div>
      <div className="e-close-poles">
        <span>{leftPole}</span>
        <span>{rightPole}</span>
      </div>
    </li>
  );
}

// leftPercent alto = polo esquerdo; na trilha o polo esquerdo fica à esquerda.
const pinLeft = (leftPercent: number): string => `${100 - leftPercent}%`;

/** Marcador de um perfil na trilha, com a miniatura (retrato, bandeira ou ponto de cor). */
export function TrackPin({
  leftPercent,
  title,
  className,
  style,
  children
}: {
  leftPercent: number;
  title: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <span
      className={className ? `e-close-pin e-close-them ${className}` : 'e-close-pin e-close-them'}
      style={{ left: pinLeft(leftPercent), ...style }}
      title={title}
    >
      {children}
    </span>
  );
}

/** Marcador "você" na trilha. */
export function YouPin({ leftPercent }: { leftPercent: number }) {
  return (
    <span className="e-close-pin e-close-you" style={{ left: pinLeft(leftPercent) }} title={t.closenessYou}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
      </svg>
    </span>
  );
}
