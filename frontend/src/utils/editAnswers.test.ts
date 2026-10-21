import { describe, expect, it } from 'vitest';
import { changedArchetypeIds, changedQuestionIds, countChanges, type AnswerSet } from './editAnswers';

const original: AnswerSet = {
  answers: { estrutura_01: 'AGREE', poder_02: 'DISAGREE', moral_03: 'NEUTRAL' },
  archetypeChoices: { sociedade: 'A', religiao: 'F' }
};

describe('countChanges', () => {
  it('is zero when nothing changed', () => {
    expect(countChanges(original, structuredClone(original))).toBe(0);
  });

  it('counts changed quiz answers and archetype choices together', () => {
    const edited: AnswerSet = {
      answers: { ...original.answers, poder_02: 'STRONGLY_AGREE' },
      archetypeChoices: { ...original.archetypeChoices, sociedade: 'C' }
    };
    expect(changedQuestionIds(original, edited)).toEqual(['poder_02']);
    expect(changedArchetypeIds(original, edited)).toEqual(['sociedade']);
    expect(countChanges(original, edited)).toBe(2);
  });

  it('counts a choice that was added or removed (such as the Christian branch)', () => {
    const added: AnswerSet = { ...original, archetypeChoices: { ...original.archetypeChoices, denominacao: 'B' } };
    expect(changedArchetypeIds(original, added)).toEqual(['denominacao']);
    const removed: AnswerSet = { ...original, archetypeChoices: { sociedade: 'A' } };
    expect(changedArchetypeIds(original, removed)).toEqual(['religiao']);
  });

  it('goes back to zero when an answer returns to its original value', () => {
    const edited: AnswerSet = { ...original, answers: { ...original.answers, moral_03: 'AGREE' } };
    expect(countChanges(original, edited)).toBe(1);
    const reverted: AnswerSet = { ...edited, answers: { ...edited.answers, moral_03: 'NEUTRAL' } };
    expect(countChanges(original, reverted)).toBe(0);
  });
});
