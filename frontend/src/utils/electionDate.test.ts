import { describe, expect, it } from 'vitest';
import { formatElectionDate, isElectionOver } from './electionDate';

describe('formatElectionDate', () => {
  it('formats the ISO date in the language of the page', () => {
    const es = formatElectionDate('2026-11-29', 'es');
    expect(es).toContain('29');
    expect(es).toContain('2026');
    expect(es.toLowerCase()).toContain('noviembre');
    expect(formatElectionDate('2026-11-29', 'fr').toLowerCase()).toContain('novembre');
    expect(formatElectionDate('2026-11-29', 'pt').toLowerCase()).toContain('novembro');
  });

  it('does not shift the day, whatever the local time zone', () => {
    // 2026-11-29T00:00Z em um fuso negativo seria dia 28 se a data fosse lida no horário local.
    expect(formatElectionDate('2026-11-29', 'es')).toContain('29');
    expect(formatElectionDate('2026-01-01', 'es')).toContain('1');
    expect(formatElectionDate('2026-01-01', 'es')).toContain('2026');
  });

  it('returns the raw value when the date is not valid', () => {
    expect(formatElectionDate('em breve', 'es')).toBe('em breve');
  });
});

describe('isElectionOver', () => {
  it('is false until the end of election day and true from the next day on', () => {
    expect(isElectionOver('2026-11-29', new Date(2026, 10, 18, 12, 0))).toBe(false);
    expect(isElectionOver('2026-11-29', new Date(2026, 10, 29, 9, 0))).toBe(false);
    expect(isElectionOver('2026-11-29', new Date(2026, 10, 29, 23, 59))).toBe(false);
    expect(isElectionOver('2026-11-29', new Date(2026, 10, 30, 0, 1))).toBe(true);
    expect(isElectionOver('2026-11-29', new Date(2027, 0, 5))).toBe(true);
  });

  it('is false when the date is not valid', () => {
    expect(isElectionOver('em breve', new Date(2030, 0, 1))).toBe(false);
  });
});
