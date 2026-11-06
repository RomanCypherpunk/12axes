import { describe, expect, it } from 'vitest';
import type { Axis } from '../types/quiz';
import { insightSide, matchInsight } from './matchInsight';

const axis = (id: string): Axis => ({ id, label: id.toUpperCase(), leftPole: 'L', rightPole: 'R', leftColor: '#000', rightColor: '#fff' });
const axes = ['a', 'b', 'c', 'd'].map(axis);

describe('insightSide', () => {
  it('equilibrado perto do centro, esquerdo acima de 50 e direito abaixo', () => {
    expect(insightSide(50)).toBe('balanced');
    expect(insightSide(56)).toBe('balanced');
    expect(insightSide(60)).toBe('left');
    expect(insightSide(40)).toBe('right');
  });
});

describe('matchInsight', () => {
  const user = new Map([['a', 80], ['b', 20], ['c', 55], ['d', 70]]);

  it('aproxima nos eixos do mesmo lado, do mais próximo ao menos próximo, até dois', () => {
    const { shared } = matchInsight(axes, user, { a: 78, b: 25, c: 50, d: 62 });
    expect(shared.map((row) => row.axisId)).toEqual(['a', 'b']);
  });

  it('eixo equilibrado do usuário nunca é "em comum"', () => {
    const { shared } = matchInsight(axes, user, { a: 10, b: 90, c: 55, d: 10 });
    expect(shared).toEqual([]);
  });

  it('afasta nos eixos de maior diferença, sem repetir os que aproximam', () => {
    const { shared, apart } = matchInsight(axes, user, { a: 78, b: 85, c: 50, d: 20 });
    expect(shared.map((row) => row.axisId)).toEqual(['a']);
    expect(apart.map((row) => row.axisId)).toEqual(['b', 'd']);
    expect(apart[0]).toMatchObject({ userSide: 'right', otherSide: 'left' });
  });

  it('mesmo lado com muita diferença de intensidade não conta como "se afastam"', () => {
    const { apart } = matchInsight(axes, new Map([['a', 90]]), { a: 60 });
    expect(apart).toEqual([]);
  });

  it('um dos dois no meio e o outro longe conta como afastamento', () => {
    const { apart } = matchInsight(axes, new Map([['c', 52]]), { c: 20 });
    expect(apart.map((row) => row.axisId)).toEqual(['c']);
  });

  it('ignora eixos que o perfil não tem', () => {
    const { shared, apart } = matchInsight(axes, user, { a: 80 });
    expect(shared.map((row) => row.axisId)).toEqual(['a']);
    expect(apart).toEqual([]);
  });
});
