import type { Axis, AxisResult } from '../types/quiz';
import { insightSide } from './matchInsight';

/** O texto de um cargo: a frase do que ele cuida e, para cada eixo do cargo, o que a posição do usuário significa ali. */
export interface SeatRoleTexts {
  intro: string;
  axes: Record<string, { left: string; right: string; balanced: string }>;
}

export type RoleTexts = Record<string, SeatRoleTexts>;

export interface SeatRoleLine {
  axisId: string;
  label: string;
  /** Já com `{name}` trocado: o nome no primeiro parágrafo e, nos seguintes, o sujeito omitido (ou `subject`, se o idioma pede um). */
  text: string;
}

export interface SeatRole {
  intro: string;
  lines: SeatRoleLine[];
}

const fill = (text: string, name: string): string => text.split('{name}').join(name);

type AxisPosition = Pick<AxisResult, 'leftPercent'>;

/**
 * As posições de quem ocupa o cargo, a partir do vetor da personalidade; sem vetor, as do usuário (`fallback`), para o
 * texto nunca ficar vazio.
 */
export function holderPositions(vector: Record<string, number> | undefined, fallback: ReadonlyMap<string, AxisPosition>): ReadonlyMap<string, AxisPosition> {
  const entries = Object.entries(vector ?? {}).filter(([, value]) => Number.isFinite(value));
  return entries.length > 0 ? new Map(entries.map(([id, leftPercent]) => [id, { leftPercent }])) : fallback;
}

/** Quantos eixos cada cargo comenta, e quantas vezes o mesmo eixo pode aparecer no governo inteiro. */
export const ROLE_AXES_PER_SEAT = 2;
export const ROLE_AXIS_CAP = 3;

/**
 * Escolhe, para cada cargo, os eixos (entre os que ele sabe comentar) em que o titular mais se aproxima do usuário: o texto
 * do cargo fica coerente com o que o usuário respondeu. Um eixo comenta no máximo `ROLE_AXIS_CAP` cargos; se o limite deixar
 * um cargo sem seus eixos, ele completa com os melhores que sobraram. Empate na distância vai para o eixo em que o titular
 * tem posição mais marcada (um texto "equilibrado" diz menos). O resultado vem na ordem do mais para o menos próximo.
 */
export function selectRoleAxes(
  seats: readonly { seatKey: string; vector?: Record<string, number> }[],
  roles: RoleTexts,
  user: ReadonlyMap<string, AxisPosition>
): Map<string, string[]> {
  const pairs: { seatKey: string; axisId: string; gap: number; strength: number; order: number }[] = [];
  for (const seat of seats) {
    const texts = roles[seat.seatKey];
    if (!texts) continue;
    const holder = holderPositions(seat.vector, user);
    for (const axisId of Object.keys(texts.axes)) {
      const mine = user.get(axisId);
      const theirs = holder.get(axisId);
      if (!mine || !theirs) continue;
      pairs.push({ seatKey: seat.seatKey, axisId, gap: Math.abs(mine.leftPercent - theirs.leftPercent), strength: Math.abs(theirs.leftPercent - 50), order: pairs.length });
    }
  }
  pairs.sort((a, b) => a.gap - b.gap || b.strength - a.strength || a.order - b.order);
  const chosen = new Map<string, string[]>();
  const used = new Map<string, number>();
  const take = (pair: (typeof pairs)[number]) => {
    chosen.set(pair.seatKey, [...(chosen.get(pair.seatKey) ?? []), pair.axisId]);
    used.set(pair.axisId, (used.get(pair.axisId) ?? 0) + 1);
  };
  const has = (pair: (typeof pairs)[number]) => (chosen.get(pair.seatKey) ?? []).includes(pair.axisId);
  for (const pair of pairs) {
    if ((chosen.get(pair.seatKey)?.length ?? 0) < ROLE_AXES_PER_SEAT && (used.get(pair.axisId) ?? 0) < ROLE_AXIS_CAP) take(pair);
  }
  // O limite deixou o cargo sem eixos suficientes: completa com os melhores que sobraram, mesmo acima do limite.
  for (const pair of pairs) {
    if ((chosen.get(pair.seatKey)?.length ?? 0) < ROLE_AXES_PER_SEAT && !has(pair)) take(pair);
  }
  return chosen;
}

/**
 * Monta o papel de um cargo a partir da posição de quem o ocupa nos eixos daquele cargo (e não a do usuário, nem o
 * espectro dele): eixo sem texto ou sem posição simplesmente fica de fora. O nome aparece no primeiro parágrafo; nos
 * outros o texto segue sem repeti-lo (`subject` entra no lugar dele nos idiomas que não omitem o sujeito, como "they").
 */
export function buildSeatRole(
  texts: SeatRoleTexts | undefined,
  axes: Axis[],
  results: ReadonlyMap<string, AxisPosition>,
  name: string,
  subject: string | null = null,
  only?: readonly string[]
): SeatRole | null {
  if (!texts) return null;
  const labels = new Map(axes.map((axis) => [axis.id, axis.label]));
  const lines: SeatRoleLine[] = [];
  const wanted = only ? only.filter((axisId) => texts.axes[axisId]) : Object.keys(texts.axes);
  for (const axisId of wanted) {
    const byside = texts.axes[axisId];
    const result = results.get(axisId);
    const label = labels.get(axisId);
    if (!result || !label) continue;
    const raw = byside[insightSide(result.leftPercent)];
    const leading = '{name} ';
    const text = lines.length > 0 && raw.startsWith(leading) ? fill(`${subject ? `${subject} ` : ''}${raw.slice(leading.length)}`, name) : fill(raw, name);
    lines.push({ axisId, label, text });
  }
  return { intro: fill(texts.intro, name), lines };
}
