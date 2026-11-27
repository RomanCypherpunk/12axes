import type { IdeologyColorKey } from './ideologyColors';

/** Os 12 eixos, na ordem dos pesos de src/data/compassModel.json. */
export const AXIS_IDS = ['estrutura', 'representacao', 'poder', 'imigracao', 'diplomacia', 'intervencao', 'economia', 'controle', 'comercio', 'religiao', 'moral', 'tecnologia'] as const;

/** Centro de cada região na bússola (direita, autoritário): o alvo do ajuste dos pesos (scripts/compass-model.mjs). */
export const REGION_ANCHORS: Record<IdeologyColorKey, [number, number]> = {
  'esq-radical': [16, 84],
  terceira: [50, 84],
  'ext-direita': [84, 84],
  esquerda: [16, 50],
  centro: [50, 50],
  direita: [84, 50],
  anarquismo: [22, 12],
  libertario: [78, 12]
};

/** Pesos: para cada quadrante (cima-esquerda, cima-direita, baixo-esquerda, baixo-direita), constante + um peso por eixo. */
export interface CompassModel {
  wx: number[];
  wy: number[];
}

const clamp100 = (value: number): number => Math.max(0, Math.min(100, value));

/** Quanto cada quadrante conta na posição (x, y): mistura bilinear, soma 1. */
export function quadrantShares(right: number, authoritarian: number): [number, number, number, number] {
  const up = clamp100(authoritarian) / 100;
  const side = clamp100(right) / 100;
  return [up * (1 - side), up * side, (1 - up) * (1 - side), (1 - up) * side];
}

/**
 * Posição na bússola: X e Y = soma ponderada dos 12 eixos (centrados em 50), com os pesos de cada quadrante misturados
 * pela própria posição. Parte da média dos quatro quadrantes e refina quatro vezes. Sem esticar: só limita a 0-100.
 */
export function compassModelPosition(vector: Record<string, number>, model: CompassModel): { right: number; authoritarian: number } {
  const features = [1, ...AXIS_IDS.map((axis) => (vector[axis] - 50) / 50)];
  const n = features.length;
  const dot = (weights: number[], shares: number[]) =>
    shares.reduce((sum, share, q) => sum + share * features.reduce((s, f, i) => s + f * weights[q * n + i], 0), 0);
  let right = dot(model.wx, [0.25, 0.25, 0.25, 0.25]);
  let up = dot(model.wy, [0.25, 0.25, 0.25, 0.25]);
  for (let it = 0; it < 4; it++) {
    const shares = quadrantShares(right, up);
    [right, up] = [dot(model.wx, shares), dot(model.wy, shares)];
  }
  return { right: clamp100(right), authoritarian: clamp100(up) };
}
