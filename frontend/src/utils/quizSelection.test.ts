import { describe, it, expect } from 'vitest';
import { selectAllQuestionsBalanced, selectAndBalanceQuestions } from './quizSelection';
import type { QuizPayload } from '../types/quiz';

const AXIS_IDS = [
  'estrutura', 'representacao', 'poder', 'imigracao',
  'diplomacia', 'intervencao', 'economia', 'controle',
  'comercio', 'religiao', 'moral', 'tecnologia',
];

function makePool(questionsPerAxis: number, targetPerAxisSelection: number): QuizPayload {
  const questions = AXIS_IDS.flatMap((axisId) =>
    Array.from({ length: questionsPerAxis }, (_, i) => ({
      id: `${axisId}_${String(i).padStart(2, '0')}`,
      axisId,
      text: `Pergunta ${i} de ${axisId}`,
      agreePole: (i % 2 === 0 ? 'LEFT' : 'RIGHT') as 'LEFT' | 'RIGHT',
      weight: 1,
    }))
  );
  return {
    title: '12 Axes',
    description: 'Test',
    variant: 'short',
    questionCount: AXIS_IDS.length * targetPerAxisSelection,
    questionsPerAxis: targetPerAxisSelection,
    axes: AXIS_IDS.map((id) => ({
      id, label: id, leftPole: 'L', rightPole: 'R', leftColor: '', rightColor: '',
    })),
    questions,
    answerOptions: [],
  };
}

describe('selectAndBalanceQuestions — quiz curto (3 por eixo)', () => {
  it('retorna exatamente 36 questões', () => {
    const result = selectAndBalanceQuestions(makePool(20, 3));
    expect(result.questions).toHaveLength(36);
  });

  it('retorna exatamente 3 questões por eixo', () => {
    const result = selectAndBalanceQuestions(makePool(20, 3));
    for (const axisId of AXIS_IDS) {
      const count = result.questions.filter((q) => q.axisId === axisId).length;
      expect(count, `eixo ${axisId}`).toBe(3);
    }
  });

  it('retorna 18 questões LEFT e 18 RIGHT', () => {
    const result = selectAndBalanceQuestions(makePool(20, 3));
    const leftCount = result.questions.filter((q) => q.agreePole === 'LEFT').length;
    const rightCount = result.questions.filter((q) => q.agreePole === 'RIGHT').length;
    expect(leftCount).toBe(18);
    expect(rightCount).toBe(18);
  });

  it('não apresenta dois polos iguais consecutivos', () => {
    const result = selectAndBalanceQuestions(makePool(20, 3));
    for (let i = 1; i < result.questions.length; i++) {
      expect(
        result.questions[i].agreePole,
        `questões ${i - 1} e ${i} têm mesmo polo`
      ).not.toBe(result.questions[i - 1].agreePole);
    }
  });
});

describe('selectAllQuestionsBalanced — modo oculto /240questions', () => {
  it('mantém TODAS as perguntas do pool (sem perder nem duplicar)', () => {
    const pool = makePool(20, 3);
    const result = selectAllQuestionsBalanced(pool);
    expect(result.questions).toHaveLength(pool.questions.length);
    const ids = new Set(result.questions.map((q) => q.id));
    expect(ids.size).toBe(pool.questions.length);
    expect(ids).toEqual(new Set(pool.questions.map((q) => q.id)));
  });

  it('marca a versão como extended e ajusta a contagem', () => {
    const result = selectAllQuestionsBalanced(makePool(20, 3));
    expect(result.variant).toBe('extended');
    expect(result.questionCount).toBe(result.questions.length);
  });

  it('intercala polos sempre que ainda há de ambos os lados', () => {
    const result = selectAllQuestionsBalanced(makePool(20, 3));
    for (let i = 1; i < result.questions.length; i++) {
      expect(
        result.questions[i].agreePole,
        `questões ${i - 1} e ${i} têm mesmo polo`
      ).not.toBe(result.questions[i - 1].agreePole);
    }
  });
});

describe('selectAndBalanceQuestions — quiz completo (5 por eixo)', () => {
  it('retorna exatamente 60 questões', () => {
    const result = selectAndBalanceQuestions(makePool(20, 5));
    expect(result.questions).toHaveLength(60);
  });

  it('retorna exatamente 5 questões por eixo', () => {
    const result = selectAndBalanceQuestions(makePool(20, 5));
    for (const axisId of AXIS_IDS) {
      const count = result.questions.filter((q) => q.axisId === axisId).length;
      expect(count, `eixo ${axisId}`).toBe(5);
    }
  });

  it('retorna 30 questões LEFT e 30 RIGHT', () => {
    const result = selectAndBalanceQuestions(makePool(20, 5));
    const leftCount = result.questions.filter((q) => q.agreePole === 'LEFT').length;
    const rightCount = result.questions.filter((q) => q.agreePole === 'RIGHT').length;
    expect(leftCount).toBe(30);
    expect(rightCount).toBe(30);
  });

  it('não apresenta dois polos iguais consecutivos', () => {
    const result = selectAndBalanceQuestions(makePool(20, 5));
    for (let i = 1; i < result.questions.length; i++) {
      expect(
        result.questions[i].agreePole,
        `questões ${i - 1} e ${i} têm mesmo polo`
      ).not.toBe(result.questions[i - 1].agreePole);
    }
  });
});
