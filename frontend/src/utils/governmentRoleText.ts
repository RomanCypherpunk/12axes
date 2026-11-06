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

/**
 * Monta o papel de um cargo a partir da posição do próprio usuário nos eixos daquele cargo (não do espectro dele):
 * eixo sem texto ou sem resultado simplesmente fica de fora. O nome aparece no primeiro parágrafo; nos outros o texto
 * segue sem repeti-lo (`subject` entra no lugar dele nos idiomas que não omitem o sujeito, como "they").
 */
export function buildSeatRole(
  texts: SeatRoleTexts | undefined,
  axes: Axis[],
  results: ReadonlyMap<string, AxisResult>,
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
