import { describe, expect, it } from 'vitest';
import type { ValueTree } from '../types/quiz';
import { chooseValueNode, fullValuesSteps, FV_STEP_PREFIX, normalizeArchetypeChoices, valuesFromChoices } from './valueTrees';

const opt = (id: string, text: string, next: string | null, value: string | null) => ({ id, text, next, value });

const POLITICA: ValueTree = {
  categoryId: 'politica',
  label: 'Política',
  root: 'p1',
  nodes: [
    { id: 'p1', text: 'Quem decide?', options: [opt('0', 'Especialistas', null, 'tecnocracia'), opt('1', 'Eleitos', 'p2', null)] },
    { id: 'p2', text: 'Com que limites?', options: [opt('0', 'Constituição', null, 'democracia'), opt('1', 'Equilíbrio', null, 'equilibrado')] }
  ]
};

const TECNOLOGIA: ValueTree = {
  categoryId: 'tecnologia',
  label: 'Tecnologia',
  root: 't1',
  nodes: [{ id: 't1', text: 'E a tecnologia?', options: [opt('0', 'Acelerar', null, 'aceleracao'), opt('1', 'Frear', null, 'precaucao')] }]
};

const P1 = `${FV_STEP_PREFIX}p1`;
const P2 = `${FV_STEP_PREFIX}p2`;
const T1 = `${FV_STEP_PREFIX}t1`;

describe('fullValuesSteps', () => {
  it('começa só com a raiz de cada árvore', () => {
    const steps = fullValuesSteps([POLITICA], {});
    expect(steps.map((step) => step.id)).toEqual([P1]);
    expect(steps[0]).toMatchObject({ label: 'Política', text: 'Quem decide?', theme: 'poder' });
    expect(steps[0].options).toEqual([
      { id: '0', text: 'Especialistas' },
      { id: '1', text: 'Eleitos' }
    ]);
  });

  it('usa o ícone de tema da categoria (o de sociedade quando ela não tem um próprio)', () => {
    expect(fullValuesSteps([TECNOLOGIA], {})[0].theme).toBe('tecnologia');
    expect(fullValuesSteps([{ ...TECNOLOGIA, categoryId: 'nacao' }], {})[0].theme).toBe('sociedade');
  });

  it('acrescenta o nó seguinte depois de uma resposta e para na folha', () => {
    expect(fullValuesSteps([POLITICA], { [P1]: '1' }).map((step) => step.id)).toEqual([P1, P2]);
    expect(fullValuesSteps([POLITICA], { [P1]: '1', [P2]: '0' }).map((step) => step.id)).toEqual([P1, P2]);
    expect(fullValuesSteps([POLITICA], { [P1]: '0' }).map((step) => step.id)).toEqual([P1]);
  });

  it('põe as árvores em sequência, na ordem recebida', () => {
    expect(fullValuesSteps([POLITICA, TECNOLOGIA], {}).map((step) => step.id)).toEqual([P1, T1]);
    expect(fullValuesSteps([POLITICA, TECNOLOGIA], { [P1]: '1' }).map((step) => step.id)).toEqual([P1, P2, T1]);
  });

  it('trata uma alternativa que não existe no nó como sem resposta', () => {
    expect(fullValuesSteps([POLITICA], { [P1]: '9' }).map((step) => step.id)).toEqual([P1]);
  });
});

describe('valuesFromChoices', () => {
  it('devolve o valor da folha de cada árvore concluída', () => {
    expect(valuesFromChoices([POLITICA, TECNOLOGIA], { [P1]: '0', [T1]: '1' })).toEqual({
      politica: 'tecnocracia',
      tecnologia: 'precaucao'
    });
    expect(valuesFromChoices([POLITICA], { [P1]: '1', [P2]: '0' })).toEqual({ politica: 'democracia' });
  });

  it('não devolve valor de árvore incompleta nem de ids desconhecidos', () => {
    expect(valuesFromChoices([POLITICA], {})).toEqual({});
    expect(valuesFromChoices([POLITICA], { [P1]: '1' })).toEqual({});
    expect(valuesFromChoices([POLITICA], { [`${FV_STEP_PREFIX}zzz`]: '0', religiao: 'A' })).toEqual({});
  });
});

describe('chooseValueNode', () => {
  it('grava a escolha sem mexer nas de outras árvores nem nas que não são de valores', () => {
    const next = chooseValueNode([POLITICA, TECNOLOGIA], { [T1]: '0', religiao: 'B' }, P1, '1');
    expect(next).toEqual({ [T1]: '0', religiao: 'B', [P1]: '1' });
  });

  it('descarta a escolha do nó que deixou de estar no caminho ao mudar uma resposta anterior', () => {
    const answered = { [P1]: '1', [P2]: '0' };
    const changed = chooseValueNode([POLITICA], answered, P1, '0');
    expect(changed).toEqual({ [P1]: '0' });
    expect(valuesFromChoices([POLITICA], changed)).toEqual({ politica: 'tecnocracia' });
    // voltando ao ramo antigo, o nó filho começa em branco: não sobra valor órfão
    const back = chooseValueNode([POLITICA], changed, P1, '1');
    expect(back).toEqual({ [P1]: '1' });
    expect(valuesFromChoices([POLITICA], back)).toEqual({});
    expect(fullValuesSteps([POLITICA], back).map((step) => step.id)).toEqual([P1, P2]);
  });

  it('pular (opção nula) remove a escolha do nó e as dos nós seguintes', () => {
    expect(chooseValueNode([POLITICA], { [P1]: '1', [P2]: '0' }, P1, null)).toEqual({});
    expect(chooseValueNode([POLITICA], { [P1]: '1', [P2]: '0' }, P2, null)).toEqual({ [P1]: '1' });
  });

  it('ignora um nó que não é de nenhuma árvore', () => {
    expect(chooseValueNode([POLITICA], { [P1]: '0' }, `${FV_STEP_PREFIX}zzz`, '1')).toEqual({ [P1]: '0' });
  });
});

describe('normalizeArchetypeChoices', () => {
  const simple = ['poder', 'sociedade'];

  it('com a árvore ativa, descarta as escolhas das perguntas de arquétipo simples (senão contariam sem a pessoa ver)', () => {
    expect(normalizeArchetypeChoices({ poder: 'A', sociedade: 'B', religiao: 'C', [P1]: '0' }, simple, true)).toEqual({
      religiao: 'C',
      [P1]: '0'
    });
  });

  it('sem a árvore, descarta as escolhas dos nós de valores e mantém o resto', () => {
    expect(normalizeArchetypeChoices({ poder: 'A', religiao: 'C', [P1]: '0' }, simple, false)).toEqual({ poder: 'A', religiao: 'C' });
  });

  it('não mexe em nada quando não há o que descartar', () => {
    const choices = { religiao: 'C', denominacao: 'A' };
    expect(normalizeArchetypeChoices(choices, simple, true)).toEqual(choices);
    expect(normalizeArchetypeChoices(choices, simple, false)).toEqual(choices);
  });
});
