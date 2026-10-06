import { describe, expect, it } from 'vitest';
import { splitByTerms } from './questionTerms';

const term = (match: string) => ({ match, term: match, definition: 'def' });

describe('splitByTerms', () => {
  it('returns the whole text when there are no terms', () => {
    expect(splitByTerms('Plain question.', [])).toEqual([{ text: 'Plain question.' }]);
  });

  it('marks a term case-insensitively and keeps the original casing', () => {
    expect(splitByTerms('The Central Bank should obey.', [term('central bank')])).toEqual([
      { text: 'The ' },
      { text: 'Central Bank', termIndex: 0 },
      { text: ' should obey.' }
    ]);
  });

  it('marks several terms in reading order regardless of list order', () => {
    const segments = splitByTerms('Domestic industries need tariffs.', [term('tariffs'), term('Domestic industries')]);

    expect(segments).toEqual([
      { text: 'Domestic industries', termIndex: 1 },
      { text: ' need ' },
      { text: 'tariffs', termIndex: 0 },
      { text: '.' }
    ]);
  });

  it('marks only the first occurrence of a term', () => {
    const segments = splitByTerms('tax and tax', [term('tax')]);

    expect(segments.filter((s) => s.termIndex !== undefined)).toHaveLength(1);
    expect(segments.map((s) => s.text).join('')).toBe('tax and tax');
  });

  it('skips a term that overlaps an earlier one', () => {
    const segments = splitByTerms('central bank independence', [term('central bank'), term('bank independence')]);

    expect(segments).toEqual([
      { text: 'central bank', termIndex: 0 },
      { text: ' independence' }
    ]);
  });

  it('ignores terms that are missing or empty', () => {
    expect(splitByTerms('Same text.', [term('absent'), term('')])).toEqual([{ text: 'Same text.' }]);
  });
});
