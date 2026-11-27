// Cópia fiel de backend/.../service/ProfileMatchScorer.java. Qualquer mudança lá precisa vir para cá: o teste de paridade
// (parity.test.ts) compara com o gabarito que o próprio backend grava (WikiParityFixtureTest).

export const AXIS_IDS = [
  'estrutura',
  'representacao',
  'poder',
  'imigracao',
  'diplomacia',
  'intervencao',
  'economia',
  'controle',
  'comercio',
  'religiao',
  'moral',
  'tecnologia'
] as const;

export type Vector = Record<string, number>;

const CENTER = 50;
const AXIS_SPREAD = 50;
const AXIS_WEIGHT = 0.42;
const DIRECTION_WEIGHT = 0.33;
const MAGNITUDE_WEIGHT = 0.18;
const OUTLIER_WEIGHT = 0.07;
const OPPOSITE_SIDE_MAX_PENALTY = 0.45;
const OPPOSITE_SIDE_SPREAD = 25;
const OUTLIER_FULL_SPREAD = 100;
const OUTLIER_EXPONENT = 2.5;
const DIRECTION_AUGMENT_RADIUS = 8;

/** Math.round do Java (meio para cima) com uma casa: igual ao round1 do backend. */
export function round1(value: number): number {
  return Math.floor(value * 10 + 0.5) / 10;
}

const at = (vector: Vector, axis: string): number => vector[axis] ?? CENTER;
const clamp = (value: number): number => Math.max(0, Math.min(100, value));

function oppositeSideFactor(user: number, target: number): number {
  const penalty =
    OPPOSITE_SIDE_MAX_PENALTY *
    Math.tanh(Math.abs(user - CENTER) / OPPOSITE_SIDE_SPREAD) *
    Math.tanh(Math.abs(target - CENTER) / OPPOSITE_SIDE_SPREAD);
  return 1 - penalty;
}

function singleAxisSimilarity(user: number, target: number): number {
  const diff = Math.abs(user - target);
  let similarity = Math.max(0, 1 - Math.pow(diff / AXIS_SPREAD, 2));
  if ((user - CENTER) * (target - CENTER) < 0) similarity *= oppositeSideFactor(user, target);
  return similarity;
}

/** Compatibilidade de 0 a 100 com uma casa, nos eixos pedidos (todos os 12 por padrão). */
export function compatibility(user: Vector, target: Vector, axisIds: readonly string[] = AXIS_IDS): number {
  let similarity = 0;
  let dot = 0;
  let userNorm = 0;
  let targetNorm = 0;
  let userIntensity = 0;
  let targetIntensity = 0;
  let maxDiff = 0;
  for (const axis of axisIds) {
    const u = at(user, axis);
    const t = at(target, axis);
    similarity += singleAxisSimilarity(u, t);
    const cu = u - CENTER;
    const ct = t - CENTER;
    dot += cu * ct;
    userNorm += cu * cu;
    targetNorm += ct * ct;
    userIntensity += Math.abs(cu);
    targetIntensity += Math.abs(ct);
    maxDiff = Math.max(maxDiff, Math.abs(u - t));
  }
  const count = axisIds.length;
  const axisSimilarity = (100 * similarity) / count;
  const augment = count * DIRECTION_AUGMENT_RADIUS * DIRECTION_AUGMENT_RADIUS;
  const cosine = (dot + augment) / Math.sqrt((userNorm + augment) * (targetNorm + augment));
  const directionSimilarity = CENTER + CENTER * cosine;
  const magnitudeSimilarity = 100 - 2 * Math.abs(userIntensity / count - targetIntensity / count);
  const outlierSimilarity = 100 * Math.max(0, 1 - Math.pow(maxDiff / OUTLIER_FULL_SPREAD, OUTLIER_EXPONENT));
  return round1(
    clamp(
      AXIS_WEIGHT * axisSimilarity +
        DIRECTION_WEIGHT * directionSimilarity +
        MAGNITUDE_WEIGHT * magnitudeSimilarity +
        OUTLIER_WEIGHT * outlierSimilarity
    )
  );
}

/** Percentil de uma nota: quantas notas do catálogo ficam abaixo dela. */
export function percentile(score: number, catalog: number[]): number {
  if (catalog.length === 0) return 0;
  const lower = catalog.filter((value) => value < score).length;
  return round1((100 * lower) / catalog.length);
}

/** Percentil de cada nota da lista, na mesma ordem. */
export function percentiles(catalog: number[]): number[] {
  if (catalog.length === 0) return [];
  const sorted = [...catalog].sort((a, b) => a - b);
  const countLower = (value: number): number => {
    let low = 0;
    let high = sorted.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      if (sorted[mid] < value) low = mid + 1;
      else high = mid;
    }
    return low;
  };
  return catalog.map((score) => round1((100 * countLower(score)) / catalog.length));
}

export function neutralVector(): Vector {
  return Object.fromEntries(AXIS_IDS.map((axis) => [axis, CENTER]));
}

/** Comparação de texto do Java (String.compareTo): por unidade UTF-16, sem regras de idioma. */
export function javaCompare(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}
