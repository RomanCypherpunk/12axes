import { describe, expect, it } from 'vitest';
import type { Axis, AxisResult } from '../types/quiz';
import { compareAxes, summaryKinds } from './compareAxes';

const axis = (id: string): Axis => ({ id, label: id, leftPole: 'L', rightPole: 'R', leftColor: '#000', rightColor: '#fff' } as Axis);
const result = (id: string, leftPercent: number): AxisResult => ({ axisId: id, label: id, leftPole: 'L', rightPole: 'R', leftPercent, rightPercent: 100 - leftPercent, dominantPole: 'L', intensity: '' });

describe('compareAxes', () => {
  const axes = [axis('a'), axis('b'), axis('c')];
  const results = new Map([['a', result('a', 80)], ['b', result('b', 20)], ['c', result('c', 50)]]);

  it('encontra o eixo mais próximo e o mais distante', () => {
    const summary = compareAxes(axes, results, { a: 75, b: 90, c: 10 });
    expect(summary.closest?.axis.id).toBe('a');
    expect(summary.farthest?.axis.id).toBe('b');
    expect(summary.rows.map((row) => row.distance)).toEqual([5, 70, 40]);
  });

  it('em empate vale a ordem dos eixos', () => {
    const summary = compareAxes(axes, results, { a: 70, b: 30, c: 60 });
    expect(summary.closest?.axis.id).toBe('a');
    expect(summary.farthest?.axis.id).toBe('a');
  });

  it('ignora eixos sem valor no perfil e devolve vazio sem vetor', () => {
    expect(compareAxes(axes, results, { a: 50 }).rows).toHaveLength(1);
    const empty = compareAxes(axes, results, undefined);
    expect(empty.rows).toEqual([]);
    expect(empty.closest).toBeNull();
    expect(empty.farthest).toBeNull();
  });
});

describe('summaryKinds', () => {
  const axes = [axis('a'), axis('b')];
  const results = new Map([['a', result('a', 80)], ['b', result('b', 20)]]);

  it('vetor idêntico vira uma frase só, sem "compatível" e "distante" no mesmo eixo', () => {
    const kinds = summaryKinds(compareAxes(axes, results, { a: 80, b: 20 }));
    expect(kinds.identical).toBe(true);
  });

  it('só chama de compatível até 20 pontos e de distante a partir de 20', () => {
    expect(summaryKinds(compareAxes(axes, results, { a: 70, b: 5 }))).toMatchObject({ identical: false, closest: 'close', farthest: 'none' });
    expect(summaryKinds(compareAxes(axes, results, { a: 40, b: 90 }))).toMatchObject({ closest: 'nearest', farthest: 'far' });
  });

  it('sem eixos não há resumo idêntico', () => {
    expect(summaryKinds(compareAxes(axes, results, undefined)).identical).toBe(false);
  });
});
