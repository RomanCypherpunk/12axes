import { describe, expect, it } from 'vitest';
import { COMPASS_QUADRANTS, COMPASS_QUADRANT_ORDER, quadrantAt } from '../src/utils/compassQuadrants';

describe('quadrantes da bússola', () => {
  it('são quatro, com fundo e cor de texto próprios', () => {
    expect(COMPASS_QUADRANT_ORDER).toHaveLength(4);
    const backgrounds = COMPASS_QUADRANT_ORDER.map((key) => COMPASS_QUADRANTS[key].bg);
    expect(new Set(backgrounds).size).toBe(4);
    const hex = /^#[0-9A-F]{6}$/i;
    expect(COMPASS_QUADRANT_ORDER.every((key) => hex.test(COMPASS_QUADRANTS[key].bg) && hex.test(COMPASS_QUADRANTS[key].ink))).toBe(true);
  });

  it('uma posição cai no quadrante do seu lado de cada eixo', () => {
    expect(quadrantAt(20, 80)).toBe('authLeft');
    expect(quadrantAt(80, 80)).toBe('authRight');
    expect(quadrantAt(20, 20)).toBe('libLeft');
    expect(quadrantAt(80, 20)).toBe('libRight');
  });

  it('a divisa em 50 pertence à direita e ao lado autoritário', () => {
    expect(quadrantAt(50, 50)).toBe('authRight');
    expect(quadrantAt(49.9, 50)).toBe('authLeft');
    expect(quadrantAt(50, 49.9)).toBe('libRight');
  });
});
