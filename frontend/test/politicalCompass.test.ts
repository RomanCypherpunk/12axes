import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { AxisResult } from '../src/types/quiz';
import { compassFromVector, compassPoints, compassRegion, computeCompass, economicLevel, economicMethod, economicName, socialLevel } from '../src/utils/politicalCompass';

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
    expect(computeCompass(results(ALL))).toEqual({ right: 50, economy: 50, planning: 50, authoritarian: 50, traditional: 50 });
  });

  it('o cartão econômico (economy) usa só a economia, sem a moral', () => {
    expect(computeCompass(results({ ...ALL, economia: 70.9, moral: 7.7 }))?.economy).toBeCloseTo(29.1, 5);
  });

  it('propriedade privada com moral conservadora leva à direita; pública com moral progressista, à esquerda', () => {
    const right = computeCompass(results({ ...ALL, economia: 0, moral: 0 }))?.right ?? 0;
    const left = computeCompass(results({ ...ALL, economia: 100, moral: 100 }))?.right ?? 100;
    expect(right).toBe(100);
    expect(left).toBe(0);
  });

  it('o planejamento estatal não mexe no eixo esquerda-direita', () => {
    expect(computeCompass(results({ ...ALL, controle: 0 }))?.right).toBe(50);
    expect(computeCompass(results({ ...ALL, controle: 100 }))?.right).toBe(50);
  });

  it('é proporcional e linear: 75% público e 75% progressista resulta em 25% na bússola', () => {
    const pos = computeCompass(results({ ...ALL, economia: 75, moral: 75 }));
    expect(pos?.right).toBe(25);
  });

  it('a economia pesa o dobro da moral no eixo esquerda-direita (2:1)', () => {
    // só economia pública: 100 - (2*100 + 50) / 3; só moral progressista: 100 - (2*50 + 100) / 3
    expect(computeCompass(results({ ...ALL, economia: 100 }))?.right).toBeCloseTo(16.67, 2);
    expect(computeCompass(results({ ...ALL, moral: 100 }))?.right).toBeCloseTo(33.33, 2);
  });

  it('economia dirigida com moral conservadora fica no meio, não na esquerda radical', () => {
    // Teocratismo Islâmico no catálogo: economia 70.9, moral 7.7
    const position = computeCompass(results({ ...ALL, economia: 70.9, moral: 7.7 }));
    expect(position?.right).toBeCloseTo(50.17, 2);
  });

  it('é monótono: mais mercado nunca leva mais à esquerda', () => {
    const at = (economia: number) => computeCompass(results({ ...ALL, economia }))?.right ?? 0;
    const xs = [100, 75, 50, 25, 0].map(at);
    expect([...xs].sort((a, b) => a - b)).toEqual(xs);
  });

  it('o perfil do nacional-socialismo vai à direita pela moral (propriedade mista) e acima no vertical (planejamento)', () => {
    // Nacional-socialismo no catálogo: economia 47.5 (propriedade sob controle), controle 78.8 (planejamento), moral 11.2
    const position = computeCompass(results({ ...ALL, economia: 47.5, controle: 78.8, moral: 11.2 }));
    expect(position?.right).toBeCloseTo(64.6, 1);
    // o planejamento (10% do vertical) o empurra um pouco para o lado autoritário
    expect(position?.authoritarian).toBeCloseTo(52.88, 2);
  });

  it('um perfil com intervencionismo moderado (Trump) não fica no mesmo ponto de um anarcocapitalista', () => {
    // Vetores do catálogo, em percentual do polo esquerdo de cada eixo.
    const trump = computeCompass(
      results({ economia: 25, controle: 37.5, poder: 62.5, representacao: 38.8, estrutura: 25, moral: 21.2 })
    );
    const rothbard = computeCompass(
      results({ economia: 6.2, controle: 5, poder: 1.2, representacao: 77.5, estrutura: 96.2, moral: 53.8 })
    );
    expect(trump?.right).toBeGreaterThan(70);
    // os dois ficam à direita; o que os separa é o eixo vertical (Trump mais autoritário)
    expect((trump?.authoritarian ?? 0) - (rothbard?.authoritarian ?? 0)).toBeGreaterThan(12);
  });

  it('ordem, autocracia e unitarismo são autoritários; liberdade, democracia e federalismo, libertários', () => {
    // esq. Segurança / esq. Democracia / esq. Federal: 100 = polo esquerdo; controle (esq. Planejamento) entra direto, com 10%
    expect(computeCompass(results({ ...ALL, poder: 100, representacao: 0, estrutura: 0, controle: 100 }))?.authoritarian).toBe(100);
    expect(computeCompass(results({ ...ALL, poder: 0, representacao: 100, estrutura: 100, controle: 0 }))?.authoritarian).toBe(0);
  });

  it('o planejamento pesa 10% no eixo vertical: mais planejamento, mais autoritário', () => {
    expect(computeCompass(results({ ...ALL, controle: 100 }))?.authoritarian).toBe(55);
    expect(computeCompass(results({ ...ALL, controle: 0 }))?.authoritarian).toBe(45);
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
  it('cobre as cinco faixas nos limites, as mesmas do eixo econômico', () => {
    expect(socialLevel(0)).toBe('veryProgressive');
    expect(socialLevel(27.4)).toBe('veryProgressive');
    expect(socialLevel(27.5)).toBe('progressive');
    expect(socialLevel(42.4)).toBe('progressive');
    expect(socialLevel(42.5)).toBe('moderate');
    expect(socialLevel(57.5)).toBe('moderate');
    expect(socialLevel(57.6)).toBe('traditional');
    expect(socialLevel(72.5)).toBe('traditional');
    expect(socialLevel(72.6)).toBe('veryTraditional');
    expect(socialLevel(100)).toBe('veryTraditional');
  });
});

describe('economicLevel', () => {
  it('usa as mesmas faixas de distância do centro dos eixos', () => {
    expect(economicLevel(0)).toBe('socialism');
    expect(economicLevel(12.4)).toBe('socialism');
    expect(economicLevel(12.5)).toBe('left');
    expect(economicLevel(27.4)).toBe('left');
    expect(economicLevel(27.5)).toBe('centerLeft');
    expect(economicLevel(42.4)).toBe('centerLeft');
    expect(economicLevel(42.5)).toBe('center');
    expect(economicLevel(50)).toBe('center');
    expect(economicLevel(57.5)).toBe('center');
    expect(economicLevel(57.6)).toBe('centerRight');
    expect(economicLevel(72.5)).toBe('centerRight');
    expect(economicLevel(72.6)).toBe('right');
    expect(economicLevel(87.5)).toBe('right');
    expect(economicLevel(87.6)).toBe('capitalism');
    expect(economicLevel(100)).toBe('capitalism');
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

describe('bússola com vários perfis', () => {
  const left = { ...ALL, economia: 80, controle: 70, poder: 30, representacao: 60, estrutura: 40, moral: 75 };
  const right = { ...ALL, economia: 20, controle: 10, poder: 80, representacao: 30, estrutura: 50, moral: 20 };

  it('o vetor de um perfil cai no mesmo ponto que um resultado com os mesmos leftPercents', () => {
    expect(compassFromVector(left)).toEqual(computeCompass(results(left)));
    expect(compassFromVector(right)).toEqual(computeCompass(results(right)));
  });

  it('um ponto por perfil, na ordem recebida, com rótulo e cor', () => {
    const points = compassPoints([
      { key: 'personality:a', label: 'A', color: '#111111', vector: left },
      { key: 'personality:b', label: 'B', color: '#222222', vector: right },
      { key: 'country:c', label: 'C', color: '#333333', vector: ALL }
    ]);
    expect(points.map((point) => [point.key, point.label, point.color])).toEqual([
      ['personality:a', 'A', '#111111'],
      ['personality:b', 'B', '#222222'],
      ['country:c', 'C', '#333333']
    ]);
    expect(points[0].position.right).toBeLessThan(50);
    expect(points[1].position.right).toBeGreaterThan(50);
    expect(points[1].position.authoritarian).toBeGreaterThan(points[0].position.authoritarian);
    expect(points[2].position).toEqual({ right: 50, economy: 50, planning: 50, authoritarian: 50, traditional: 50 });
  });

  it('perfil sem os eixos da bússola fica de fora sem tirar os outros', () => {
    const points = compassPoints([
      { key: 'a', label: 'A', color: '#111', vector: left },
      { key: 'b', label: 'B', color: '#222', vector: { economia: 50 } }
    ]);
    expect(points.map((point) => point.key)).toEqual(['a']);
  });
});

describe('economicMethod e economicName', () => {
  it('planejada a partir de 66,7, de mercado até 33,3 e sem rótulo no meio', () => {
    expect(economicMethod(100)).toBe('planned');
    expect(economicMethod(66.7)).toBe('planned');
    expect(economicMethod(66.6)).toBeNull();
    expect(economicMethod(50)).toBeNull();
    expect(economicMethod(33.4)).toBeNull();
    expect(economicMethod(33.3)).toBe('market');
    expect(economicMethod(0)).toBe('market');
  });

  const t = {
    compassEconomicLabels: { socialism: 'Socialismo', left: 'Esquerda', centerLeft: 'Centro-esquerda', center: 'Centro', centerRight: 'Centro-direita', right: 'Direita', capitalism: 'Capitalismo' },
    compassEconomicMethodLabels: { planned: 'economia planejada', market: 'economia de mercado' }
  };

  it('junta o nível e o método com vírgula (com quebra de linha só em Centro-esquerda e Centro-direita), e deixa só o nível quando não há método', () => {
    expect(economicName(t, 'centerLeft', 'planned')).toBe('Centro-esquerda,\neconomia planejada');
    expect(economicName(t, 'centerRight', 'market')).toBe('Centro-direita,\neconomia de mercado');
    expect(economicName(t, 'capitalism', 'market')).toBe('Capitalismo, economia de mercado');
    expect(economicName(t, 'center', 'planned')).toBe('Centro, economia planejada');
    expect(economicName(t, 'center', null)).toBe('Centro');
  });

  it('o planejamento (controle) vem só do eixo controle, sem a economia nem a moral', () => {
    expect(computeCompass(results({ ...ALL, controle: 80, economia: 10, moral: 10 }))?.planning).toBe(80);
  });
});
