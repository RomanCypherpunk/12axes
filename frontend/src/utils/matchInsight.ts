import type { Axis } from '../types/quiz';

export type InsightSide = 'left' | 'right' | 'balanced';

export interface InsightAxis {
  axisId: string;
  label: string;
  user: number;
  other: number;
  userSide: InsightSide;
  otherSide: InsightSide;
}

export interface MatchInsight {
  /** Eixos em que os dois estão do mesmo lado, do mais próximo ao menos próximo (até 2). */
  shared: InsightAxis[];
  /** Eixos em que mais se afastam (até 2): lados diferentes, ou um dos dois no meio. */
  apart: InsightAxis[];
}

// Mesmo corte do "equilibrado" do resultado: menos de 7,5 pontos do centro não pende para lado nenhum.
const BALANCED_BAND = 7.5;
// Diferença mínima para dizer que dois perfis se afastam num eixo.
const APART_MIN = 15;
const MAX_PER_GROUP = 2;

export function insightSide(leftPercent: number): InsightSide {
  const distance = leftPercent - 50;
  if (Math.abs(distance) < BALANCED_BAND) return 'balanced';
  return distance > 0 ? 'left' : 'right';
}

/** O que aproxima e o que afasta o usuário de um perfil, só pelos vetores dos 12 eixos (sem texto, sem idioma). */
export function matchInsight(axes: Axis[], user: ReadonlyMap<string, number>, vector: Readonly<Record<string, number>>): MatchInsight {
  const rows: InsightAxis[] = [];
  for (const axis of axes) {
    const u = user.get(axis.id);
    const o = vector[axis.id];
    if (u === undefined || o === undefined) continue;
    rows.push({ axisId: axis.id, label: axis.label, user: u, other: o, userSide: insightSide(u), otherSide: insightSide(o) });
  }

  const gap = (row: InsightAxis) => Math.abs(row.user - row.other);
  const conviction = (row: InsightAxis) => Math.min(Math.abs(row.user - 50), Math.abs(row.other - 50));

  const shared = rows
    .filter((row) => row.userSide !== 'balanced' && row.userSide === row.otherSide)
    .sort((a, b) => gap(a) - gap(b) || conviction(b) - conviction(a))
    .slice(0, MAX_PER_GROUP);
  const sharedIds = new Set(shared.map((row) => row.axisId));
  const apart = rows
    // Só se afastam de verdade quando pendem para lados diferentes (ou um deles fica no meio); no mesmo lado, a diferença é de intensidade.
    .filter((row) => !sharedIds.has(row.axisId) && row.userSide !== row.otherSide && gap(row) >= APART_MIN)
    .sort((a, b) => gap(b) - gap(a))
    .slice(0, MAX_PER_GROUP);

  return { shared, apart };
}
