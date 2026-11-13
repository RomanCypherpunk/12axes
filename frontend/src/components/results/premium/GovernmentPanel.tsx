import { Fragment, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { LANG, t } from '../../../i18n';
import { Portrait } from '../PersonalitiesSection';
import type { GovernmentSeat, PersonalityMatch } from '../../../types/quiz';
import { buildSeatRole, holderPositions, selectRoleAxes, type RoleTexts } from '../../../utils/governmentRoleText';
import { catStyle } from '../../../utils/ideologyColors';
import { useUserAxes } from '../MatchInsight';
import { displacedSwap, swapOptions } from '../../../utils/governmentSwaps';
import { ProfileSheet } from '../ProfileSheet';
import { GovernmentSwapSheet } from './GovernmentSwapSheet';
import { SeatIcon } from './SeatIcon';
import { P } from './premiumText';

export type SeatKey = GovernmentSeat['seatKey'];

// O mesmo desenho do botão "Trocar" do quiz: duas setas opostas.
function SwapIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M14.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L16.586 8H5a1 1 0 0 1 0-2h11.586l-2.293-2.293a1 1 0 0 1 0-1.414m-4.586 10a1 1 0 0 1 0 1.414L7.414 16H19a1 1 0 1 1 0 2H7.414l2.293 2.293a1 1 0 0 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0"
      />
    </svg>
  );
}

// O texto de cada cargo em cada espectro (72 por idioma) vem de um arquivo à parte, baixado só por quem abre o governo ideal.
const ROLE_FILES: Record<string, () => Promise<{ default: RoleTexts }>> = {
  pt: () => import('./governmentRoles.pt.json'),
  en: () => import('./governmentRoles.en.json'),
  es: () => import('./governmentRoles.es.json'),
  de: () => import('./governmentRoles.de.json'),
  it: () => import('./governmentRoles.it.json')
};

export function useRoleTexts(): RoleTexts | null {
  const [texts, setTexts] = useState<RoleTexts | null>(null);
  useEffect(() => {
    let alive = true;
    ROLE_FILES[LANG]().then(
      (module) => alive && setTexts(module.default),
      () => alive && setTexts(null)
    );
    return () => {
      alive = false;
    };
  }, []);
  return texts;
}

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
function Chair({ x, y, degrees, style }: { x: number; y: number; degrees: number; style?: CSSProperties }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${degrees + 90})`} style={style}>
      <rect className="e-gov-chair-back" x="-19" y="-25" width="38" height="9" rx="4.5" />
      <rect className="e-gov-chair-seat" x="-18" y="-14" width="36" height="28" rx="9" />
    </g>
  );
}

/** Onde cada rosto fica em volta da mesa, como as variáveis de posição do CSS (`--x`, `--y`). */
export const seatPosition = (face: { x: number; y: number }): CSSProperties => ({ '--x': face.x.toFixed(1), '--y': face.y.toFixed(1) }) as CSSProperties;

/**
 * A mesa redonda com as nove cadeiras. Cada cadeira recebe o rosto de `seat` (ou nada), e `children` entra por cima da cena (o
 * convite da compra põe ali o botão que abre o pagamento). Compartilhada pelo relatório e pelo convite, para os dois terem o mesmo desenho.
 */
export function GovernmentScene({
  category,
  seat,
  chairStyle,
  children
}: {
  category: string;
  seat: (key: SeatKey, face: { x: number; y: number }, side: string) => ReactNode;
  /** Cor própria de cada cadeira (as variáveis `--cat`); sem isto todas seguem a cor da mesa. */
  chairStyle?: (key: SeatKey) => CSSProperties | undefined;
  children?: ReactNode;
}) {
  return (
    <div className="e-gov" style={catStyle(category) as CSSProperties}>
      <svg className="e-gov-scene" viewBox="0 0 1000 680" aria-hidden="true">
        <circle className="e-gov-table-edge" cx={CENTER.x} cy={CENTER.y} r={TABLE_R} />
        <circle className="e-gov-table-top" cx={CENTER.x} cy={CENTER.y} r={TABLE_R - 7} />
        <circle className="e-gov-table-ring" cx={CENTER.x} cy={CENTER.y} r={TABLE_R - 44} />
        {ORDER.map((key, index) => {
          const { chair, degrees } = place(index);
          return <Chair key={key} x={chair.x} y={chair.y} degrees={degrees} style={chairStyle?.(key)} />;
        })}
      </svg>
      {ORDER.map((key, index) => {
        const { face, side } = place(index);
        return seat(key, face, side);
      })}
      {children}
    </div>
  );
}

/** O governo ideal numa mesa redonda: o rosto de cada um ao lado da sua cadeira, com o nome e o cargo por fora; clicar no rosto abre a ficha de quem é. */
export function GovernmentPanel({
  seats,
  category,
  footer,
  swaps = {},
  onSwap
}: {
  seats: GovernmentSeat[];
  category: string;
  footer?: ReactNode;
  /** Cargos que o usuário trocou (cargo -> id da escolhida). */
  swaps?: Record<string, string>;
  /** Troca quem ocupa um cargo; `null` volta à sugestão. Sem isto o governo não é trocável (o convite e o PDF). */
  onSwap?: (seatKey: SeatKey, personalityId: string | null, found?: PersonalityMatch, others?: Record<string, string>) => void;
}) {
  const [swapping, setSwapping] = useState<SeatKey | null>(null);
  const [open, setOpen] = useState<SeatKey | null>(null);
  const byKey = new Map(seats.map((seat) => [seat.seatKey, seat]));
  const openSeat = open ? byKey.get(open) : undefined;
  const roles = useRoleTexts();
  const user = useUserAxes();
  // Cada cadeira, rosto e botão leva a cor do espectro de quem a ocupa (a mesa segue o do usuário).
  const spectrumStyle = (key: SeatKey): CSSProperties | undefined => {
    const spectrum = byKey.get(key)?.holder.spectrum;
    return spectrum ? (catStyle(spectrum) as CSSProperties) : undefined;
  };
  const roleAxes = roles && user ? selectRoleAxes(seats.map((seat) => ({ seatKey: seat.seatKey, vector: seat.holder.vector })), roles, user.results) : null;

  return (
    <section className="e-panel e-prem" id="premium-governo" data-reveal>
      <h2>{P.governmentTitle}</h2>
      {/* A mesa só no computador; no celular a grade abaixo ocupa o lugar dela. */}
      <div className="e-gov-desktop">
        <GovernmentScene
          category={category}
          chairStyle={spectrumStyle}
          seat={(key, face, side) => {
            const seat = byKey.get(key);
            if (!seat) return null;
            return (
              <Fragment key={key}>
                <button type="button" className={`e-gov-seat e-gov-${side}`} style={{ ...seatPosition(face), ...spectrumStyle(key) }} aria-haspopup="dialog" onClick={() => setOpen(key)}>
                  <Portrait match={seat.holder} className="e-gov-face" />
                  <span className="e-gov-label">
                    <span className="e-gov-name">{seat.holder.name}</span>
                    <span className="e-gov-role">{P.seats[key]}</span>
                  </span>
                </button>
                {onSwap && seat.candidates.length > 1 && (
                  <button
                    type="button"
                    className={swaps[key] ? 'e-gov-swap is-swapped' : 'e-gov-swap'}
                    style={{ ...seatPosition(face), ...spectrumStyle(key) }}
                    aria-haspopup="dialog"
                    aria-label={P.governmentSwap.aria(P.seats[key])}
                    title={P.governmentSwap.aria(P.seats[key])}
                    onClick={() => setSwapping(key)}
                  >
                    <SwapIcon />
                  </button>
                )}
              </Fragment>
            );
          }}
        />
      </div>

      {/* No celular, uma grade de 3 por 3 (a mesma do cartão de compartilhamento): o ícone do cargo, o cargo, o rosto e o nome. */}
      <ul className="e-gov-grid" style={catStyle(category) as CSSProperties}>
        {ORDER.map((key) => {
          const seat = byKey.get(key);
          if (!seat) return null;
          return (
            <li key={key} style={spectrumStyle(key)}>
              <button type="button" className="e-gov-gcell" aria-haspopup="dialog" onClick={() => setOpen(key)}>
                <SeatIcon seatKey={key} />
                <small>{P.seats[key]}</small>
                <Portrait match={seat.holder} className="e-gov-gface" />
                <b>{seat.holder.name}</b>
              </button>
              {onSwap && seat.candidates.length > 1 && (
                <button
                  type="button"
                  className={swaps[key] ? 'e-gov-gswap is-swapped' : 'e-gov-gswap'}
                  aria-haspopup="dialog"
                  aria-label={P.governmentSwap.aria(P.seats[key])}
                  title={P.governmentSwap.aria(P.seats[key])}
                  onClick={() => setSwapping(key)}
                >
                  <SwapIcon />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {roles && user && (
        <div className="e-gov-roles">
          <h3>{P.governmentRolesTitle}</h3>
          <p className="e-gov-roles-lead">{P.governmentRolesLead}</p>
          <ol>
            {ORDER.map((key) => {
              const seat = byKey.get(key);
              const role = seat && buildSeatRole(roles[key], user.axes, holderPositions(seat.holder.vector, user.results), seat.holder.name, P.roleSubject, roleAxes?.get(key));
              if (!seat || !role) return null;
              return (
                <li key={key}>
                  <Portrait match={seat.holder} className="e-gov-rface" />
                  <div>
                    <p className="e-gov-rhead">
                      <strong>{P.seats[key]}</strong> · {seat.holder.name}
                    </p>
                    <p>{role.intro}</p>
                    {role.lines.map((line) => (
                      <p key={line.axisId} className="e-gov-rline">
                        {P.roleAxis[line.axisId]} {line.text}
                      </p>
                    ))}
                    <p className="e-gov-rwhy">
                      {swaps[key]
                        ? P.governmentWhySwapped(Math.round(seat.holder.compatibility))
                        : P.governmentWhy(t.personalityCategories[seat.category as keyof typeof t.personalityCategories] ?? seat.category, Math.round(seat.holder.compatibility))}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {footer}

      {swapping && byKey.get(swapping) && onSwap && (
        <GovernmentSwapSheet
          seat={byKey.get(swapping) as GovernmentSeat}
          options={swapOptions(seats, swapping)}
          swapped={Boolean(swaps[swapping])}
          category={category}
          heldBy={Object.fromEntries(seats.map((item) => [item.holder.personalityId, { seatKey: item.seatKey, holder: item.holder }]))}
          userPercents={user ? user.axes.map((axis) => user.results.get(axis.id)?.leftPercent ?? 50) : null}
          onPick={(id, found) => {
            // Quem já ocupa outra cadeira muda de lugar, e a cadeira que ele deixa passa à próxima figura mais compatível.
            onSwap(swapping, id, found, displacedSwap(seats, swapping, id));
            setSwapping(null);
          }}
          onClose={() => setSwapping(null)}
        />
      )}

      {open && openSeat && (
        <ProfileSheet
          titleId="government-sheet-title"
          visual={<Portrait match={openSeat.holder} className="e-sheet-face" />}
          label={P.seats[open]}
          name={openSeat.holder.name}
          caption={[openSeat.holder.role, openSeat.holder.lifespan].filter(Boolean).join(' · ')}
          description={openSeat.holder.description}
          vector={openSeat.holder.vector}
          style={catStyle(category) as CSSProperties}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}
