import { describe, expect, it } from 'vitest';
import { revealMode } from '../src/hooks/useScrollReveal';

describe('revealMode', () => {
  it('bloco comum aparece com animação quando 8% dele está à vista', () => {
    expect(revealMode(0.07, 1000, 600)).toBeNull();
    expect(revealMode(0.08, 1000, 600)).toBe('animate');
    expect(revealMode(0.5, 1000, 600)).toBe('animate');
  });

  it('bloco tão alto que 8% dele não cabe na tela aparece de uma vez, assim que a ponta entra', () => {
    // 8.531 px num celular de 576 px de área de observação: 8% são 682 px, que nunca cabem
    expect(revealMode(0.001, 8531, 576)).toBe('instant');
    expect(revealMode(0, 8531, 576)).toBe('instant');
  });

  it('o limite é 8% do bloco caber na área de observação', () => {
    expect(revealMode(0.01, 7000, 576)).toBeNull();
    expect(revealMode(0.01, 7400, 576)).toBe('instant');
  });
});
