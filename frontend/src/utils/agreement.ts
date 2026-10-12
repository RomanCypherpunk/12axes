import type { Axis, AxisResult } from '../types/quiz';

export interface AxisAgreement {
  axisId: string;
  label: string;
  short: string;
  value: number;
}

export function shortAxisLabel(label: string): string {
  return label.normalize('NFD').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
}

// Concordância por eixo (100 = mesma posição) entre o usuário e um perfil, maiores primeiro.
export function topAgreements(
  vector: Record<string, number> | undefined,
  axes: Axis[],
  results: Map<string, AxisResult>,
  count: number
): AxisAgreement[] {
  if (!vector) return [];
  return axes
    .flatMap((axis) => {
      const user = results.get(axis.id)?.leftPercent;
      const target = vector[axis.id];
      if (user === undefined || target === undefined) return [];
      return [{ axisId: axis.id, label: axis.label, short: shortAxisLabel(axis.label), value: Math.round(100 - Math.abs(user - target)) }];
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, count);
}

export type RatingTier = 'elite' | 'great' | 'good' | 'ok' | 'low';

export function ratingTier(pct: number): RatingTier {
  if (pct >= 90) return 'elite';
  if (pct >= 80) return 'great';
  if (pct >= 70) return 'good';
  if (pct >= 60) return 'ok';
  return 'low';
}
