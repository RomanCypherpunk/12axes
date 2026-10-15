import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { AxisResult } from '../src/types/quiz';
import { centerSide, compassRegion, computeCompass, socialLevel } from '../src/utils/politicalCompass';

function results(left: Record<string, number>): Map<string, AxisResult> {
  return new Map(
    Object.entries(left).map(([axisId, leftPercent]) => [
      axisId,
      { axisId, label: axisId, leftPole: '', rightPole: '', leftPercent, rightPercent: 100 - leftPercent, dominantPole: '', intensity: '' }
    ])
  );
}

const ALL = { economia: 50, controle: 50, poder: 50, representacao: 50, estrutura: 50, moral: 50 };

describe('computeCompass', () => {
  it('centro em tudo fica no meio da bússola', () => {
    expect(computeCompass(results(ALL))).toEqual({ right: 50, authoritarian: 50, traditional: 50 });
  });

  it('economia privada e livre mercado levam à direita; propriedade pública e planejamento, à esquerda', () => {
    const right = computeCompass(results({ ...ALL, economia: 0, controle: 0 }))?.right ?? 0;
    const left = computeCompass(results({ ...ALL, economia: 100, controle: 100 }))?.right ?? 100;
    expect(right).toBe(100);
    expect(left).toBe(0);
  });

  it('é proporcional e linear: 75% público resulta em 25% na bússola', () => {
    const pos = computeCompass(results({ ...ALL, economia: 75, controle: 75 }));
    expect(pos?.right).toBe(25);
  });

  it('é monótono: mais mercado nunca leva mais à esquerda', () => {
    const at = (economia: number) => computeCompass(results({ ...ALL, economia }))?.right ?? 0;
    const xs = [100, 75, 50, 25, 0].map(at);
    expect([...xs].sort((a, b) => a - b)).toEqual(xs);
  });

  it('o perfil do nacional-socialismo fica no centro horizontal (Terceira Posição)', () => {
    // Nacional-socialismo no catálogo: economia 47.5 (propriedade sob controle), controle 78.8 (planejamento)
    const position = computeCompass(results({ ...ALL, economia: 47.5, controle: 78.8 }));
    // faixa central de 33.3 a 66.7: a Terceira Posição rejeita tanto o liberalismo quanto o socialismo
    expect(position?.right).toBeGreaterThan(33.3);
    expect(position?.right).toBeLessThan(45);
  });

  it('um perfil com intervencionismo moderado (Trump) não fica no mesmo ponto de um anarcocapitalista', () => {
    // Vetores do catálogo, em percentual do polo esquerdo de cada eixo.
    const trump = computeCompass(results({ ...ALL, economia: 25, controle: 37 }));
    const rothbard = computeCompass(results({ ...ALL, economia: 6, controle: 5 }));
    expect(trump?.right).toBeGreaterThan(70);
    expect((rothbard?.right ?? 0) - (trump?.right ?? 0)).toBeGreaterThan(12);
  });

  it('ordem, autocracia e unitarismo são autoritários; liberdade, democracia e federalismo, libertários', () => {
    // esq. Segurança / esq. Democracia / esq. Federal: 100 = polo esquerdo
    expect(computeCompass(results({ ...ALL, poder: 100, representacao: 0, estrutura: 0 }))?.authoritarian).toBe(100);
    expect(computeCompass(results({ ...ALL, poder: 0, representacao: 100, estrutura: 100 }))?.authoritarian).toBe(0);
  });

  it('progressista (polo esquerdo de moral) vira 0 na barra e tradicionalista vira 100', () => {
    expect(computeCompass(results({ ...ALL, moral: 100 }))?.traditional).toBe(0);
    expect(computeCompass(results({ ...ALL, moral: 0 }))?.traditional).toBe(100);
  });

  it('devolve null se algum eixo faltar', () => {
    const { moral: _moral, ...withoutMoral } = ALL;
    expect(computeCompass(results(withoutMoral))).toBeNull();
  });
});

// As inversões acima dependem de qual é o polo esquerdo de cada eixo em axes.json; se alguém
// reordenar os polos, a bússola inverteria em silêncio.
describe('polos dos eixos usados na bússola', () => {
  const axes = JSON.parse(readFileSync(new URL('../../backend/src/main/resources/data/axes.json', import.meta.url), 'utf-8')) as {
    id: string;
    leftPole: string;
  }[];
  const leftPole = (id: string) => axes.find((axis) => axis.id === id)?.leftPole;

  it.each([
    ['economia', 'Público'],
    ['controle', 'Planejamento'],
    ['poder', 'Segurança'],
    ['representacao', 'Democracia'],
    ['estrutura', 'Federal'],
    ['moral', 'Progressista']
  ])('%s tem %s como polo esquerdo', (id, expected) => {
    expect(leftPole(id)).toBe(expected);
  });
});

describe('socialLevel', () => {
  it('cobre as cinco faixas nos limites', () => {
    expect(socialLevel(0)).toBe('veryProgressive');
    expect(socialLevel(19)).toBe('veryProgressive');
    expect(socialLevel(20)).toBe('progressive');
    expect(socialLevel(39)).toBe('progressive');
    expect(socialLevel(40)).toBe('moderate');
    expect(socialLevel(60)).toBe('moderate');
    expect(socialLevel(61)).toBe('traditional');
    expect(socialLevel(80)).toBe('traditional');
    expect(socialLevel(81)).toBe('veryTraditional');
    expect(socialLevel(100)).toBe('veryTraditional');
  });
});

describe('compassRegion', () => {
  const at = (right: number, authoritarian: number) => compassRegion({ right, authoritarian, traditional: 50 });

  it('divide a grade nas regiões do mapa de cores', () => {
    expect(at(5, 95)).toBe('esq-radical');
    expect(at(50, 90)).toBe('terceira');
    expect(at(95, 95)).toBe('ext-direita');
    expect(at(10, 50)).toBe('esquerda');
    expect(at(50, 55)).toBe('centro');
    expect(at(90, 50)).toBe('direita');
    expect(at(10, 5)).toBe('anarquismo');
    expect(at(90, 5)).toBe('libertario');
  });

  it('divide a coluna do meio da faixa de baixo pelo lado esquerda-direita', () => {
    expect(at(48, 5)).toBe('anarquismo');
    expect(at(52, 5)).toBe('libertario');
  });

  it('segura os extremos dentro da grade', () => {
    expect(at(0, 100)).toBe('esq-radical');
    expect(at(100, 0)).toBe('libertario');
  });
});

describe('centerSide', () => {
  it('Centro com esquerda ou direita vira centro-esquerda ou centro-direita, em qualquer ordem', () => {
    expect(centerSide('centro', 'direita')).toBe('direita');
    expect(centerSide('direita', 'centro')).toBe('direita');
    expect(centerSide('esquerda', 'centro')).toBe('esquerda');
  });

  it('os demais pares, e o mesmo lado, não mudam', () => {
    expect(centerSide('centro', 'ext-direita')).toBeNull();
    expect(centerSide('esquerda', 'anarquismo')).toBeNull();
    expect(centerSide('centro', 'centro')).toBeNull();
  });
});
