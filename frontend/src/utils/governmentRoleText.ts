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
  subject: string | null = null
): SeatRole | null {
  if (!texts) return null;
  const labels = new Map(axes.map((axis) => [axis.id, axis.label]));
  const lines: SeatRoleLine[] = [];
  for (const [axisId, byside] of Object.entries(texts.axes)) {
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
