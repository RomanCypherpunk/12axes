import { describe, expect, it } from 'vitest';
import { parseLastResult, type LastResult } from './lastResult';

const NOW = 1_800_000_000_000;

function stored(overrides: Partial<LastResult> = {}): string {
  return JSON.stringify({
    v: 2,
    url: '/results?est=65&rep=32.5&pod=70&imi=40&dip=55&int=45&eco=30&con=35&com=50&rel=60&mor=40&tec=55&religion=catholic',
    name: 'Socialismo Democrático',
    savedAt: NOW - 1000,
    ...overrides
  });
}

describe('parseLastResult', () => {
  it('reads a valid saved result', () => {
    expect(parseLastResult(stored(), NOW)?.name).toBe('Socialismo Democrático');
  });

  it('returns null without data or with broken JSON', () => {
    expect(parseLastResult(null, NOW)).toBeNull();
    expect(parseLastResult('{oops', NOW)).toBeNull();
  });

  it('drops other versions and results older than 30 days', () => {
    expect(parseLastResult(stored({ v: 3 }), NOW)).toBeNull();
    expect(parseLastResult(stored({ savedAt: NOW - 31 * 24 * 60 * 60 * 1000 }), NOW)).toBeNull();
    expect(parseLastResult(stored({ savedAt: NOW + 10 * 60_000 }), NOW)).toBeNull();
  });

  it('only accepts result paths of the site itself', () => {
    expect(parseLastResult(stored({ url: 'https://evil.example/results?est=1' }), NOW)).toBeNull();
    expect(parseLastResult(stored({ url: '//evil.example/results?est=1' }), NOW)).toBeNull();
    expect(parseLastResult(stored({ url: '/other?est=1' }), NOW)).toBeNull();
    expect(parseLastResult(stored({ url: '/results?' }), NOW)).toBeNull();
    expect(parseLastResult(stored({ url: '/results?est=1"onmouseover="x' }), NOW)).toBeNull();
  });

  it('requires a short non-empty name', () => {
    expect(parseLastResult(stored({ name: '' }), NOW)).toBeNull();
    expect(parseLastResult(stored({ name: 'x'.repeat(121) }), NOW)).toBeNull();
  });

  it('still reads results saved before the answers were kept (v1)', () => {
    const result = parseLastResult(stored({ v: 1 }), NOW);
    expect(result?.name).toBe('Socialismo Democrático');
    expect(result?.answers).toBeUndefined();
  });

  it('keeps valid answers and drops invalid ones without losing the result', () => {
    const answers = {
      variant: 'short',
      questionIds: ['estrutura_01', 'poder_02'],
      answers: { estrutura_01: 'AGREE', poder_02: 'STRONGLY_DISAGREE' },
      archetypeChoices: { sociedade: 'A', religiao: 'F' }
    };
    expect(parseLastResult(stored({ answers } as Partial<LastResult>), NOW)?.answers).toEqual(answers);

    const broken = { ...answers, answers: { estrutura_01: 'MAYBE' } };
    const parsed = parseLastResult(stored({ answers: broken } as unknown as Partial<LastResult>), NOW);
    expect(parsed?.name).toBe('Socialismo Democrático');
    expect(parsed?.answers).toBeUndefined();

    const noVariant = { ...answers, variant: 'huge' };
    expect(parseLastResult(stored({ answers: noVariant } as unknown as Partial<LastResult>), NOW)?.answers).toBeUndefined();
    const noQuestions = { ...answers, questionIds: [] };
    expect(parseLastResult(stored({ answers: noQuestions } as unknown as Partial<LastResult>), NOW)?.answers).toBeUndefined();
  });
});
