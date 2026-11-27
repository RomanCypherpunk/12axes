// Cópia fiel de AxisOutlierService.java (eixo mais incomum e mais comum) e AxisTensionService.java (par de eixos que
// contraria o padrão do catálogo de ideologias).

import { javaCompare, round1, type Vector } from './score.ts';
import type { AxisOutlier, AxisTension } from '../../types/quiz';

export interface AxisText {
  id: string;
  label: string;
  leftPole: string;
  rightPole: string;
}

const CENTER = 50;
const BALANCED_THRESHOLD = 7.5;
const MIN_CORRELATION = 0.45;
const MIN_LEAN = 15;
const CATALOG_LEAN = 10;
const MAX_EXAMPLES = 3;

function median(sorted: number[]): number {
  const size = sorted.length;
  return size % 2 === 1 ? sorted[(size - 1) / 2] : (sorted[size / 2 - 1] + sorted[size / 2]) / 2;
}

/** Eixos do mais ao menos incomum em relação à mediana do catálogo de ideologias. */
export function rankOutliers(user: { axisId: string; leftPercent: number }[], axes: AxisText[], ideologyVectors: Vector[]): AxisOutlier[] {
  if (ideologyVectors.length === 0) return [];
  const outliers: AxisOutlier[] = [];
  for (const result of user) {
    const values = ideologyVectors
      .map((vector) => vector[result.axisId])
      .filter((value): value is number => value != null)
      .sort((a, b) => a - b);
    if (values.length === 0) continue;
    const axis = axes.find((candidate) => candidate.id === result.axisId);
    if (!axis) continue;
    const userValue = result.leftPercent;
    const med = median(values);
    const balanced = Math.abs(userValue - CENTER) < BALANCED_THRESHOLD;
    const aboveMedian = userValue >= med;
    const behind = aboveMedian ? values.filter((value) => value < userValue).length : values.filter((value) => value > userValue).length;
    outliers.push({
      axisId: axis.id,
      label: axis.label,
      userPercent: round1(userValue),
      catalogMedian: round1(med),
      distanceFromMedian: round1(Math.abs(userValue - med)),
      dominantPole: balanced ? null : userValue > CENTER ? axis.leftPole : axis.rightPole,
      balanced,
      abovePole: aboveMedian ? axis.leftPole : axis.rightPole,
      abovePercent: round1((100 * behind) / values.length)
    });
  }
  return outliers.sort((a, b) => b.distanceFromMedian - a.distanceFromMedian || javaCompare(a.label, b.label));
}

function correlation(vectors: Vector[], first: string, second: string): number {
  const xs: number[] = [];
  const ys: number[] = [];
  for (const vector of vectors) {
    if (vector[first] != null && vector[second] != null) {
      xs.push(vector[first]);
      ys.push(vector[second]);
    }
  }
  if (xs.length < 2) return 0;
  const meanX = xs.reduce((sum, value) => sum + value, 0) / xs.length;
  const meanY = ys.reduce((sum, value) => sum + value, 0) / ys.length;
  let numerator = 0;
  let sumX = 0;
  let sumY = 0;
  for (let index = 0; index < xs.length; index++) {
    const dx = xs[index] - meanX;
    const dy = ys[index] - meanY;
    numerator += dx * dy;
    sumX += dx * dx;
    sumY += dy * dy;
  }
  const denominator = Math.sqrt(sumX * sumY);
  return denominator === 0 ? 0 : numerator / denominator;
}

const side = (lean: number): number => (lean > 0 ? 1 : -1);
const catalogSide = (value: number): number => {
  const lean = value - CENTER;
  return Math.abs(lean) < CATALOG_LEAN ? 0 : lean > 0 ? 1 : -1;
};

/** `ideologies` na ordem de ideology-profiles.json, cada um com o nome no idioma. */
export function strongestTension(user: Vector, axes: AxisText[], ideologies: { name: string | null; vector: Vector }[]): AxisTension | null {
  if (ideologies.length === 0 || axes.length === 0) return null;
  const vectors = ideologies.map((ideology) => ideology.vector);
  let best: AxisTension | null = null;
  let bestScore = 0;
  for (let i = 0; i < axes.length; i++) {
    for (let j = i + 1; j < axes.length; j++) {
      const first = axes[i];
      const second = axes[j];
      const userFirst = user[first.id];
      const userSecond = user[second.id];
      if (userFirst == null || userSecond == null) continue;
      const leanFirst = userFirst - CENTER;
      const leanSecond = userSecond - CENTER;
      if (Math.abs(leanFirst) < MIN_LEAN || Math.abs(leanSecond) < MIN_LEAN) continue;
      const corr = correlation(vectors, first.id, second.id);
      if (Math.abs(corr) < MIN_CORRELATION) continue;
      const sameDirection = leanFirst * leanSecond > 0;
      if (sameDirection === corr > 0) continue;
      const firstSide = side(leanFirst);
      const secondSide = side(leanSecond);
      const examples: string[] = [];
      let matching = 0;
      for (const ideology of ideologies) {
        const a = ideology.vector[first.id];
        const b = ideology.vector[second.id];
        if (a == null || b == null) continue;
        if (catalogSide(a) === firstSide && catalogSide(b) === secondSide) {
          matching++;
          if (ideology.name != null && examples.length < MAX_EXAMPLES) examples.push(ideology.name);
        }
      }
      const rarity = 1 - matching / ideologies.length;
      const score = Math.abs(corr) * rarity;
      if (score > bestScore) {
        bestScore = score;
        best = {
          firstAxisLabel: first.label,
          firstPole: leanFirst > 0 ? first.leftPole : first.rightPole,
          secondAxisLabel: second.label,
          secondPole: leanSecond > 0 ? second.leftPole : second.rightPole,
          matchingIdeologies: matching,
          catalogSize: ideologies.length,
          examples
        };
      }
    }
  }
  return best;
}
