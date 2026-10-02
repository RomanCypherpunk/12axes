import { describe, expect, it } from 'vitest';
import { answeredCount, parseProgress, restoreQuiz, type SavedProgress } from './quizProgress';
import type { QuizPayload } from '../types/quiz';

const NOW = 1_800_000_000_000;

function progress(overrides: Partial<SavedProgress> = {}): SavedProgress {
  return {
    v: 1,
    variant: 'extreme',
    questionIds: ['estrutura_01', 'poder_02', 'moral_03'],
    answers: { estrutura_01: 'AGREE', poder_02: 'STRONGLY_DISAGREE' },
    archetypeChoices: { sociedade: 'A' },
    stage: 'quiz',
    index: 2,
    savedAt: NOW - 1000,
    ...overrides
  };
}

function payload(): QuizPayload {
  return {
    title: '12 Axes',
    description: '',
    variant: 'extreme',
    questionCount: 4,
    questionsPerAxis: 0,
    axes: [],
    answerOptions: [],
    questions: ['moral_03', 'estrutura_01', 'poder_02', 'tecnologia_04'].map((id) => ({
      id,
      axisId: id.split('_')[0],
      text: id,
      agreePole: 'LEFT' as const,
      weight: 1
    }))
  };
}

describe('parseProgress', () => {
  it('aceita um progresso válido', () => {
    const saved = progress();
    expect(parseProgress(JSON.stringify(saved), NOW)).toEqual(saved);
  });

  it('descarta ausente, inválido ou de outra versão', () => {
    expect(parseProgress(null, NOW)).toBeNull();
    expect(parseProgress('{quebrado', NOW)).toBeNull();
    expect(parseProgress(JSON.stringify(progress({ v: 99 })), NOW)).toBeNull();
  });

  it('descarta progresso antigo demais', () => {
    const tooOld = progress({ savedAt: NOW - 8 * 24 * 60 * 60 * 1000 });
    expect(parseProgress(JSON.stringify(tooOld), NOW)).toBeNull();
  });

  it('descarta resposta, variante ou etapa desconhecidas', () => {
    expect(parseProgress(JSON.stringify(progress({ answers: { estrutura_01: 'TALVEZ' as never } })), NOW)).toBeNull();
    expect(parseProgress(JSON.stringify(progress({ variant: 'enorme' as never })), NOW)).toBeNull();
    expect(parseProgress(JSON.stringify(progress({ stage: 'fim' as never })), NOW)).toBeNull();
    expect(parseProgress(JSON.stringify(progress({ questionIds: [] })), NOW)).toBeNull();
    expect(parseProgress(JSON.stringify(progress({ index: -1 })), NOW)).toBeNull();
  });
});

describe('restoreQuiz', () => {
  it('remonta as perguntas na ordem guardada, mesmo que o servidor mande em outra', () => {
    const quiz = restoreQuiz(payload(), progress());
    expect(quiz?.questions.map((q) => q.id)).toEqual(['estrutura_01', 'poder_02', 'moral_03']);
    expect(quiz?.questionCount).toBe(3);
    expect(quiz?.variant).toBe('extreme');
  });

  it('não retoma se alguma pergunta deixou de existir', () => {
    expect(restoreQuiz(payload(), progress({ questionIds: ['estrutura_01', 'removida_99'] }))).toBeNull();
  });
});

describe('answeredCount', () => {
  it('conta só respostas de perguntas desta sequência', () => {
    expect(answeredCount(progress({ answers: { estrutura_01: 'AGREE', fora_01: 'AGREE' } }))).toBe(1);
  });
});
