import type { QuizPayload, Question } from '../types/quiz';

export function selectAndBalanceQuestions(payload: QuizPayload): QuizPayload {
  const { questions: pool } = payload;
  const questionsPerAxis = payload.questionsPerAxis > 0
    ? payload.questionsPerAxis
    : payload.variant === 'extended' ? 5 : 3;

  const byAxis = new Map<string, Question[]>();
  for (const q of pool) {
    const group = byAxis.get(q.axisId) ?? [];
    group.push(q);
    byAxis.set(q.axisId, group);
  }

  const selected: Question[] = [];
  let axisIndex = 0;
  for (const axisQuestions of byAxis.values()) {
    const leftPool = shuffleArray(axisQuestions.filter((q) => q.agreePole === 'LEFT'));
    const rightPool = shuffleArray(axisQuestions.filter((q) => q.agreePole === 'RIGHT'));
    const extraLeft = axisIndex % 2 === 0;
    const leftCount = extraLeft
      ? Math.ceil(questionsPerAxis / 2)
      : Math.floor(questionsPerAxis / 2);
    const rightCount = questionsPerAxis - leftCount;
    selected.push(...leftPool.slice(0, leftCount), ...rightPool.slice(0, rightCount));
    axisIndex++;
  }

  const leftQueue = shuffleArray(selected.filter((q) => q.agreePole === 'LEFT'));
  const rightQueue = shuffleArray(selected.filter((q) => q.agreePole === 'RIGHT'));
  const ordered: Question[] = [];
  let li = 0;
  let ri = 0;
  let pickLeft = Math.random() < 0.5;

  for (let i = 0; i < selected.length; i++) {
    if (pickLeft && li < leftQueue.length) {
      ordered.push(leftQueue[li++]);
    } else if (!pickLeft && ri < rightQueue.length) {
      ordered.push(rightQueue[ri++]);
    } else if (li < leftQueue.length) {
      ordered.push(leftQueue[li++]);
    } else {
      ordered.push(rightQueue[ri++]);
    }
    pickLeft = !pickLeft;
  }

  return { ...payload, questions: ordered };
}

/**
 * Versão extrema: usa TODAS as perguntas do pool (sem subselecionar), apenas
 * reordenando para intercalar afirmações LEFT/RIGHT como no quiz normal.
 */
export function selectAllQuestionsBalanced(payload: QuizPayload): QuizPayload {
  const pool = payload.questions;
  const leftQueue = shuffleArray(pool.filter((q) => q.agreePole === 'LEFT'));
  const rightQueue = shuffleArray(pool.filter((q) => q.agreePole === 'RIGHT'));
  const ordered: Question[] = [];
  let li = 0;
  let ri = 0;
  let pickLeft = Math.random() < 0.5;

  for (let i = 0; i < pool.length; i++) {
    if (pickLeft && li < leftQueue.length) {
      ordered.push(leftQueue[li++]);
    } else if (!pickLeft && ri < rightQueue.length) {
      ordered.push(rightQueue[ri++]);
    } else if (li < leftQueue.length) {
      ordered.push(leftQueue[li++]);
    } else {
      ordered.push(rightQueue[ri++]);
    }
    pickLeft = !pickLeft;
  }

  return {
    ...payload,
    variant: 'extreme',
    questions: ordered,
    questionCount: ordered.length,
    questionsPerAxis: 0
  };
}

function shuffleArray<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
