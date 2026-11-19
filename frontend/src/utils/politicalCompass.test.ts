import { describe, expect, it } from 'vitest';
import { economicLevel } from './politicalCompass';

describe('economicLevel', () => {
  it('uses the same distance-from-center bands as the axes', () => {
    expect(economicLevel(0)).toBe('left');
    expect(economicLevel(27.4)).toBe('left');
    expect(economicLevel(27.5)).toBe('centerLeft');
    expect(economicLevel(42.4)).toBe('centerLeft');
    expect(economicLevel(42.5)).toBe('center');
    expect(economicLevel(50)).toBe('center');
    expect(economicLevel(57.5)).toBe('center');
    expect(economicLevel(57.6)).toBe('centerRight');
    expect(economicLevel(72.5)).toBe('centerRight');
    expect(economicLevel(72.6)).toBe('right');
    expect(economicLevel(100)).toBe('right');
  });
});
