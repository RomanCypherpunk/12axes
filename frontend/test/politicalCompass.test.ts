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

const ALL = {
  estrutura: 50, representacao: 50, poder: 50, imigracao: 50, diplomacia: 50, intervencao: 50,
  economia: 50, controle: 50, comercio: 50, religiao: 50, moral: 50, tecnologia: 50
};

const DATA = '../../backend/src/main/resources/data/';
const readData = <T,>(file: string): T => JSON.parse(readFileSync(new URL(DATA + file, import.meta.url), 'utf-8')) as T;
const personalityNames = new Map(readData<{ id: string; name: string }[]>('personalities.json').map((p) => [p.id, p.name]));
const personalityVectors = new Map(readData<{ personalityId: string; vector: Record<string, number> }[]>('personality-profiles.json').map((p) => [p.personalityId, p.vector]));
const person = (id: string) => {
  const vector = personalityVectors.get(id);
  if (!vector) throw new Error(`personalidade ${id} (${personalityNames.get(id)}) sem vetor`);
  return compassFromVector(vector)!;
};

describe('computeCompass (pesos por quadrante)', () => {
  it('centro em tudo fica na região do centro, com economia, planejamento e moral no meio', () => {
    const position = computeCompass(results(ALL))!;
    expect(position).toMatchObject({ economy: 50, planning: 50, traditional: 50 });
    expect(compassRegion(position)).toBe('centro');
  });

  it('o cartão econômico (economy) usa só a economia, sem a moral', () => {
    expect(computeCompass(results({ ...ALL, economia: 70.9, moral: 7.7 }))?.economy).toBeCloseTo(29.1, 5);
  });

  it('progressista (polo esquerdo de moral) vira 0 na barra e tradicionalista vira 100', () => {
    expect(computeCompass(results({ ...ALL, moral: 100 }))?.traditional).toBe(0);
    expect(computeCompass(results({ ...ALL, moral: 0 }))?.traditional).toBe(100);
  });

  it('fica dentro da grade', () => {
    for (const vector of personalityVectors.values()) {
      const { right, authoritarian } = compassFromVector(vector)!;
      expect(right).toBeGreaterThanOrEqual(0);
      expect(right).toBeLessThanOrEqual(100);
      expect(authoritarian).toBeGreaterThanOrEqual(0);
      expect(authoritarian).toBeLessThanOrEqual(100);
    }
  });

  it('cada figura cai na região do seu espectro', () => {
    expect(compassRegion(person('stalin'))).toBe('esq-radical');
    expect(compassRegion(person('mussolini'))).toBe('terceira');
    expect(['terceira', 'ext-direita']).toContain(compassRegion(person('hitler')));
    expect(compassRegion(person('bernie-sanders'))).toBe('esquerda');
    expect(compassRegion(person('rothbard'))).toBe('libertario');
    expect(compassRegion(person('javier-milei'))).toBe('libertario');
    expect(compassRegion(person('jair-bolsonaro'))).toBe('direita');
  });

  it('um ultracapitalista pouco religioso (Nick Land) vai para a borda direita, não para o meio da direita', () => {
    expect(person('nick-land').right).toBeGreaterThan(85);
  });

  it('mais propriedade privada leva mais à direita', () => {
    const at = (economia: number) => computeCompass(results({ ...ALL, economia }))!.right;
    expect(at(10)).toBeGreaterThan(at(50));
    expect(at(50)).toBeGreaterThan(at(90));
  });

  it('mantém o encaixe do catálogo: ao menos 195 das ideologias na região do próprio espectro', () => {
    const categories = new Map(readData<{ id: string; category: string }[]>('ideologies.json').map((i) => [i.id, i.category]));
    const KEY: Record<string, string> = {
      'Esquerda Radical': 'esq-radical', Esquerda: 'esquerda', Centro: 'centro', Direita: 'direita',
      'Extrema Direita': 'ext-direita', 'Terceira Posição': 'terceira', Libertário: 'libertario', Anarquismo: 'anarquismo'
    };
    const profiles = readData<{ ideologyId: string; vector: Record<string, number> }[]>('ideology-profiles.json');
    const hits = profiles.filter((p) => compassRegion(compassFromVector(p.vector)!) === KEY[categories.get(p.ideologyId) ?? '']).length;
    expect(hits).toBeGreaterThanOrEqual(195);
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
    ['moral', 'Progressista'],
    ['religiao', 'Irreligioso'],
    ['imigracao', 'Assimilação'],
    ['comercio', 'Protecionismo']
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
    expect(points[2].position).toMatchObject({ economy: 50, planning: 50, traditional: 50 });
    expect(compassRegion(points[2].position)).toBe('centro');
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
