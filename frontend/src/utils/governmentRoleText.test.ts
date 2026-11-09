import { describe, expect, it } from 'vitest';
import type { Axis, AxisResult } from '../types/quiz';
import { buildSeatRole, holderPositions, type SeatRoleTexts } from './governmentRoleText';

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
