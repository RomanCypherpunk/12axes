import type { AnswerValue } from '../types/quiz';

/** Respostas do quiz e escolhas de arquétipo/religião, o que o modal "Editar respostas" altera. */
export interface AnswerSet {
  answers: Record<string, AnswerValue>;
  archetypeChoices: Record<string, string>;
}

function changedKeys<T>(original: Record<string, T>, edited: Record<string, T>): string[] {
  const keys = new Set([...Object.keys(original), ...Object.keys(edited)]);
  return [...keys].filter((key) => original[key] !== edited[key]);
}

/** Ids das perguntas do quiz cuja resposta mudou. */
export function changedQuestionIds(original: AnswerSet, edited: AnswerSet): string[] {
  return changedKeys(original.answers, edited.answers);
}

/** Ids das perguntas de arquétipo/religião cuja escolha mudou. */
export function changedArchetypeIds(original: AnswerSet, edited: AnswerSet): string[] {
  return changedKeys(original.archetypeChoices, edited.archetypeChoices);
}

/** Quantas respostas (de qualquer tipo) são diferentes das originais. */
export function countChanges(original: AnswerSet, edited: AnswerSet): number {
  return changedQuestionIds(original, edited).length + changedArchetypeIds(original, edited).length;
}
