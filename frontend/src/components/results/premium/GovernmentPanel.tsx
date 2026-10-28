import { useState, type CSSProperties } from 'react';
import { Portrait } from '../PersonalitiesSection';
import type { GovernmentSeat } from '../../../types/quiz';
import { catStyle } from '../../../utils/ideologyColors';
import { ProfileSheet } from '../ProfileSheet';
import { P } from './premiumText';

type SeatKey = GovernmentSeat['seatKey'];

// Em volta da mesa, no sentido horário a partir do topo: o líder na cabeceira e o vice logo à direita dele.
export const ORDER: SeatKey[] = ['lider', 'vice', 'economia', 'educacao', 'estrategia', 'filosofia', 'social', 'industria', 'cultura'];

// A cena é desenhada numa grade de 1000 x 680 e escala junto com o painel.
export const CENTER = { x: 500, y: 340 };
export const TABLE_R = 124;
export const CHAIR_R = 172;
export const FACE_R = 248;

export const place = (index: number) => {
  const angle = ((-90 + (index * 360) / ORDER.length) * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  // Só o líder, no topo, leva o texto por cima; os dois de baixo abrem para lados opostos para não se esbarrarem.
  const side = cos > 0.3 ? 'right' : cos < -0.3 ? 'left' : 'top';
  return {
    degrees: (angle * 180) / Math.PI,
    side,
    chair: { x: CENTER.x + CHAIR_R * cos, y: CENTER.y + CHAIR_R * sin },
    face: { x: CENTER.x + FACE_R * cos, y: CENTER.y + FACE_R * sin }
  };
};

/** A cadeira olha para a mesa: o encosto (y negativo) aponta para fora, na direção do assento. */
function Chair({ x, y, degrees }: { x: number; y: number; degrees: number }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${degrees + 90})`}>
      <rect className="e-gov-chair-back" x="-19" y="-25" width="38" height="9" rx="4.5" />
      <rect className="e-gov-chair-seat" x="-18" y="-14" width="36" height="28" rx="9" />
    </g>
  );
}

/** O governo ideal numa mesa redonda: o rosto de cada um ao lado da sua cadeira, com o nome e o cargo por fora; clicar no rosto abre a ficha de quem é. */
export function GovernmentPanel({ seats, category }: { seats: GovernmentSeat[]; category: string }) {
  const [open, setOpen] = useState<SeatKey | null>(null);
  const byKey = new Map(seats.map((seat) => [seat.seatKey, seat]));
  const openSeat = open ? byKey.get(open) : undefined;

  return (
    <section className="e-panel e-prem" id="premium-governo" data-reveal>
      <h2>{P.governmentTitle}</h2>
      <div className="e-gov" style={catStyle(category) as CSSProperties}>
        <svg className="e-gov-scene" viewBox="0 0 1000 680" aria-hidden="true">
          <circle className="e-gov-table-edge" cx={CENTER.x} cy={CENTER.y} r={TABLE_R} />
          <circle className="e-gov-table-top" cx={CENTER.x} cy={CENTER.y} r={TABLE_R - 7} />
          <circle className="e-gov-table-ring" cx={CENTER.x} cy={CENTER.y} r={TABLE_R - 44} />
          {ORDER.map((key, index) => {
            const { chair, degrees } = place(index);
            return <Chair key={key} x={chair.x} y={chair.y} degrees={degrees} />;
          })}
        </svg>
        {ORDER.map((key, index) => {
          const seat = byKey.get(key);
          if (!seat) return null;
          const { face, side } = place(index);
          return (
            <button
              key={key}
              type="button"
              className={`e-gov-seat e-gov-${side}`}
              style={{ '--x': face.x.toFixed(1), '--y': face.y.toFixed(1) } as CSSProperties}
              aria-haspopup="dialog"
              onClick={() => setOpen(key)}
            >
              <Portrait match={seat.holder} className="e-gov-face" />
              <span className="e-gov-label">
                <span className="e-gov-name">{seat.holder.name}</span>
                <span className="e-gov-role">{P.seats[key]}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* No celular os nomes não cabem em volta da mesa: lista com o cargo e o nome. */}
      <ul className="e-gov-mlist">
        {ORDER.map((key) => {
          const seat = byKey.get(key);
          if (!seat) return null;
          return (
            <li key={key}>
              <button type="button" aria-haspopup="dialog" onClick={() => setOpen(key)}>
                <Portrait match={seat.holder} className="e-gov-mface" />
                <span>
                  <small>{P.seats[key]}</small>
                  <b>{seat.holder.name}</b>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {open && openSeat && (
        <ProfileSheet
          titleId="government-sheet-title"
          visual={<Portrait match={openSeat.holder} className="e-sheet-face" />}
          label={P.seats[open]}
          name={openSeat.holder.name}
          caption={[openSeat.holder.role, openSeat.holder.lifespan].filter(Boolean).join(' · ')}
          description={openSeat.holder.description}
          style={catStyle(category) as CSSProperties}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}
