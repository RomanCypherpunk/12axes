import { describe, expect, it } from 'vitest';
import { parseReligion, RELIGION_OPTION_IDS, religionForOption } from './religion';
import { RELIGION_ICONS, religiousPoleIcon } from '../data/religionIcons';

describe('Hinduism preference', () => {
  it('recognizes Hinduism in shared result URLs', () => {
    expect(parseReligion(' Hinduism ')).toBe('hinduism');
    expect(parseReligion('unknown')).toBeNull();
    expect(parseReligion(null)).toBeNull();
  });

  it('preserves saved answers while giving Hinduism its own option', () => {
    expect(religionForOption('A')).toBe('christianity');
    expect(religionForOption('B')).toBe('judaism');
    expect(religionForOption('C')).toBe('islam');
    expect(religionForOption('D')).toBe('buddhism');
    expect(religionForOption('E')).toBeNull();
    expect(religionForOption('F')).toBe('hinduism');
    expect(religionForOption(undefined)).toBeNull();
    expect(new Set(Object.values(RELIGION_OPTION_IDS)).size).toBe(6);
  });

  it('uses the Om icon on results and share cards', () => {
    expect(religiousPoleIcon('hinduism')).toBe(RELIGION_ICONS.hinduism);
    expect(RELIGION_ICONS.hinduism.paths).not.toHaveLength(0);
  });
});
