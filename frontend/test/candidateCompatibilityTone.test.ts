import { describe, it, expect } from 'vitest';
import { toneForCompatibility } from '../src/components/CandidateCompatibilityChart';

/**
 * Faixas de cor do gráfico de compatibilidade das eleições 2026.
 * Os limites são regra de design: mudá-los muda a leitura do resultado.
 */
describe('toneForCompatibility', () => {
  const BANDS = [
    { name: 'verde forte', bar: '#00bf63', ink: '#00783e', inside: [89, 95, 100] },
    { name: 'verde médio', bar: '#7ed957', ink: '#487a32', inside: [79, 84, 88] },
    { name: 'verde claro', bar: '#c1ff72', ink: '#728a3d', inside: [69, 74, 78] },
    { name: 'âmbar', bar: '#ffbd59', ink: '#b68945', inside: [59, 63, 68] },
    { name: 'laranja', bar: '#ff751f', ink: '#bf5b1d', inside: [49, 53, 58] },
    { name: 'vermelho', bar: '#ff3131', ink: '#a11f1f', inside: [0, 20, 48] },
  ];

  for (const band of BANDS) {
    it(`usa a faixa ${band.name} nos valores ${band.inside.join(', ')}`, () => {
      for (const value of band.inside) {
        expect(toneForCompatibility(value)).toEqual({ bar: band.bar, ink: band.ink });
      }
    });
  }

  it('cobre toda a escala de 0 a 100 sem buracos', () => {
    for (let value = 0; value <= 100; value += 1) {
      expect(toneForCompatibility(value)).toBeDefined();
    }
  });

  it('nunca melhora a cor conforme a compatibilidade cai', () => {
    const order = BANDS.map((b) => b.bar);
    let previousRank = 0;
    for (let value = 100; value >= 0; value -= 1) {
      const rank = order.indexOf(toneForCompatibility(value).bar);
      expect(rank).toBeGreaterThanOrEqual(previousRank);
      previousRank = rank;
    }
  });
});
