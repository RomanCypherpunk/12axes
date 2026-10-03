import type { Axis, AxisResult } from '../types/quiz';

export interface CompareAxisRow {
  axis: Axis;
  result: AxisResult;
  /** leftPercent do usuário e do perfil comparado. */
  user: number;
  target: number;
  /** Distância absoluta entre os dois, em pontos percentuais. */
  distance: number;
}

export interface CompareSummary {
  rows: CompareAxisRow[];
  closest: CompareAxisRow | null;
  farthest: CompareAxisRow | null;
}

// Os 12 eixos com a distância entre o usuário e o perfil, mais o eixo que mais
// aproxima (menor distância) e o mais distante (maior). Em empate, vale a ordem dos eixos.
export function compareAxes(
  axes: Axis[],
  results: Map<string, AxisResult>,
  vector: Record<string, number> | undefined
): CompareSummary {
  const rows: CompareAxisRow[] = [];
  for (const axis of axes) {
    const result = results.get(axis.id);
    const target = vector?.[axis.id];
    if (!result || target === undefined) continue;
    rows.push({ axis, result, user: result.leftPercent, target, distance: Math.abs(result.leftPercent - target) });
  }
  let closest: CompareAxisRow | null = null;
  let farthest: CompareAxisRow | null = null;
  for (const row of rows) {
    if (!closest || row.distance < closest.distance) closest = row;
    if (!farthest || row.distance > farthest.distance) farthest = row;
  }
  return { rows, closest, farthest };
}

// Limites para as frases do resumo não mentirem: "compatível" só até 20 pontos de
// distância e "distante" só a partir de 20; abaixo de 1 ponto em todos os eixos, idênticos.
const IDENTICAL_MAX_DISTANCE = 1;
const CLOSE_MAX_DISTANCE = 20;
const FAR_MIN_DISTANCE = 20;

export interface CompareSummaryKinds {
  /** Nenhum eixo difere (mesmo vetor): vale uma frase só. */
  identical: boolean;
  /** "close": o eixo mais próximo é de fato próximo; "nearest": é só o menos distante. */
  closest: 'close' | 'nearest';
  /** "far": há um eixo realmente distante; "none": nenhum eixo passa do limite. */
  farthest: 'far' | 'none';
}

export function summaryKinds(summary: CompareSummary): CompareSummaryKinds {
  const closestDistance = summary.closest?.distance ?? Infinity;
  const farthestDistance = summary.farthest?.distance ?? 0;
  return {
    identical: summary.rows.length > 0 && farthestDistance < IDENTICAL_MAX_DISTANCE,
    closest: closestDistance <= CLOSE_MAX_DISTANCE ? 'close' : 'nearest',
    farthest: farthestDistance >= FAR_MIN_DISTANCE ? 'far' : 'none'
  };
}
