import { describe, expect, it } from 'vitest';
import type { Axis, AxisResult } from '../types/quiz';
import { buildSeatRole, holderPositions, selectRoleAxes, type SeatRoleTexts } from './governmentRoleText';

const axis = (id: string, label: string): Axis => ({ id, label, leftPole: 'L', rightPole: 'R', leftColor: '#000', rightColor: '#fff' });
const axes = [axis('economia', 'Economia'), axis('controle', 'Controle'), axis('comercio', 'Comércio')];
const result = (id: string, leftPercent: number) => [id, { axisId: id, leftPercent } as AxisResult] as const;

const texts: SeatRoleTexts = {
  intro: '{name} cuida da economia.',
  axes: {
    economia: { left: '{name} prioriza o setor público', right: '{name} prioriza o setor privado', balanced: '{name} busca o meio-termo' },
    controle: { left: '{name} planeja', right: '{name} liberaliza', balanced: '{name} decide caso a caso' },
    comercio: { left: '{name} protege', right: '{name} abre', balanced: '{name} negocia' }
  }
};

describe('buildSeatRole', () => {
  it('escolhe o fragmento pelo lado do usuário em cada eixo e troca {name}', () => {
    const role = buildSeatRole(texts, axes, new Map([result('economia', 80), result('controle', 15), result('comercio', 52)]), 'Ana');
    expect(role?.intro).toBe('Ana cuida da economia.');
    // O nome só abre o primeiro parágrafo; nos seguintes o texto segue sem o sujeito.
    expect(role?.lines.map((line) => [line.axisId, line.text])).toEqual([
      ['economia', 'Ana prioriza o setor público'],
      ['controle', 'liberaliza'],
      ['comercio', 'negocia']
    ]);
  });

  it('idioma que não omite o sujeito usa o pronome dado nos parágrafos seguintes', () => {
    const role = buildSeatRole(texts, axes, new Map([result('economia', 80), result('controle', 15)]), 'Ana', 'they');
    expect(role?.lines.map((line) => line.text)).toEqual(['Ana prioriza o setor público', 'they liberaliza']);
  });

  it('holderPositions usa o vetor da personalidade e, sem ele, as posições do usuário', () => {
    const user = new Map([result('economia', 80)].map(([id, value]) => [id, { leftPercent: value.leftPercent }] as const));
    expect(holderPositions({ economia: 10 }, user).get('economia')?.leftPercent).toBe(10);
    expect(holderPositions(undefined, user)).toBe(user);
    expect(holderPositions({}, user)).toBe(user);
    const role = buildSeatRole(texts, axes, holderPositions({ economia: 10 }, user), 'Ana');
    expect(role?.lines[0].text).toBe('Ana prioriza o setor privado');
  });

  it('eixo sem resultado fica de fora e cargo sem texto devolve null', () => {
    const role = buildSeatRole(texts, axes, new Map([result('economia', 70)]), 'Ana');
    expect(role?.lines.map((line) => line.axisId)).toEqual(['economia']);
    expect(buildSeatRole(undefined, axes, new Map(), 'Ana')).toBeNull();
  });
});

describe('selectRoleAxes', () => {
  const pos = (entries: Record<string, number>) => new Map(Object.entries(entries).map(([id, leftPercent]) => [id, { leftPercent }]));
  const seatTexts = (ids: string[]): SeatRoleTexts => ({ intro: '{name}', axes: Object.fromEntries(ids.map((id) => [id, { left: '{name} a', right: '{name} b', balanced: '{name} c' }])) });

  it('escolhe os dois eixos em que o titular mais se aproxima do usuário', () => {
    const roles = { cultura: seatTexts(['religiao', 'imigracao', 'moral', 'tecnologia']) };
    const user = pos({ religiao: 30, imigracao: 20, moral: 70, tecnologia: 90 });
    // titular: perto do usuário em moral e tecnologia, longe em imigração
    const chosen = selectRoleAxes([{ seatKey: 'cultura', vector: { religiao: 80, imigracao: 90, moral: 65, tecnologia: 85 } }], roles, user);
    expect(chosen.get('cultura')).toEqual(['tecnologia', 'moral']);
  });

  it('empate na distância vai para o eixo em que o titular tem posição mais marcada', () => {
    const roles = { lider: seatTexts(['economia', 'poder', 'estrutura']) };
    const user = pos({ economia: 50, poder: 50, estrutura: 50 });
    // os três empatam em distância 0; poder (10 do centro) e estrutura (30) são mais marcados que economia (0)
    const chosen = selectRoleAxes([{ seatKey: 'lider', vector: { economia: 50, poder: 60, estrutura: 80 } }], roles, user);
    // estrutura fica a 30 do usuário e sai; entre economia (0) e poder (10) vence a menor distância
    expect(chosen.get('lider')).toEqual(['economia', 'poder']);
    const tied = selectRoleAxes([{ seatKey: 'lider', vector: { economia: 40, poder: 70, estrutura: 20 } }], roles, pos({ economia: 40, poder: 70, estrutura: 20 }));
    // distância 0 nos três: ganham os de posição mais marcada (estrutura 30, poder 20)
    expect(tied.get('lider')).toEqual(['estrutura', 'poder']);
  });

  it('um eixo comenta no máximo 3 cargos; o cargo que sobra recebe outro eixo primeiro', () => {
    const roles = Object.fromEntries(['a', 'b', 'c', 'd'].map((key) => [key, seatTexts(['moral', 'tecnologia', 'poder'])]));
    const user = pos({ moral: 50, tecnologia: 50, poder: 50 });
    const vector = { moral: 50, tecnologia: 55, poder: 70 };
    const chosen = selectRoleAxes(['a', 'b', 'c', 'd'].map((seatKey) => ({ seatKey, vector })), roles, user);
    for (const key of ['a', 'b', 'c']) expect(chosen.get(key)).toEqual(['moral', 'tecnologia']);
    // d perdeu moral e tecnologia para o limite: pega poder e só então completa com o melhor restante
    expect(chosen.get('d')).toEqual(['poder', 'moral']);
  });

  it('buildSeatRole com `only` mostra só esses eixos, na ordem dada', () => {
    const role = buildSeatRole(texts, axes, new Map([result('economia', 80), result('controle', 15), result('comercio', 52)]), 'Ana', null, ['comercio', 'economia']);
    expect(role?.lines.map((line) => line.axisId)).toEqual(['comercio', 'economia']);
  });
});
