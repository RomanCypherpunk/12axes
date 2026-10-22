import { describe, expect, it } from 'vitest';
import { valueCoinMonogram } from './politicalValues';

describe('valueCoinMonogram', () => {
  it('usa a inicial das duas primeiras palavras', () => {
    expect(valueCoinMonogram('Socialismo Planificado')).toBe('SP');
  });

  it('separa palavras por hífen', () => {
    expect(valueCoinMonogram('Social-democracia')).toBe('SD');
    expect(valueCoinMonogram('Liberal-desenvolvimentismo')).toBe('LD');
  });

  it('devolve uma letra para nome de uma palavra', () => {
    expect(valueCoinMonogram('Pragmatismo')).toBe('P');
  });

  it('ignora conectivos curtos', () => {
    expect(valueCoinMonogram('Socialismo de Mercado')).toBe('SM');
  });
});
