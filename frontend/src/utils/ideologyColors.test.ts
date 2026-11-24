import { describe, expect, it } from 'vitest';
import { catStyle, localCatStyle, resolveIdeologyColor } from './ideologyColors';

const DARK_IDEOLOGIES = [
  'aceleracionismo-de-direita',
  'iluminismo-sombrio',
  'neorreacionarismo',
  'tecno-monarquismo',
  'tecno-feudalismo',
  'neocameralismo',
  'tecno-comercialismo'
];

describe('cores próprias de algumas ideologias', () => {
  it('as ideologias do cluster neorreacionário (conjunto grafite e creme) ganham as cores delas, qualquer que seja o espectro', () => {
    for (const id of DARK_IDEOLOGIES) {
      const color = resolveIdeologyColor('Extrema Direita', id);
      expect(color.base).toBe('#2B2B2B');
      expect(color.bg).toBe('#F0E4C8');
      expect(catStyle('Extrema Direita', id)).toEqual({ '--cat': '#2B2B2B', '--cat-bg': '#F0E4C8' });
      expect(localCatStyle('Libertário', id)).toEqual({ '--c': '#2B2B2B', '--cb': '#F0E4C8' });
    }
  });

  it('as outras ideologias seguem a cor do espectro, como antes', () => {
    expect(resolveIdeologyColor('Extrema Direita', 'reacionarismo').base).toBe('#001743');
    expect(resolveIdeologyColor('Extrema Direita', 'aceleracionismo-de-esquerda').base).toBe('#001743');
    // parentes próximos que ficam de fora do conjunto: reacionarismo tradicional e monarquia absoluta
    expect(resolveIdeologyColor('Extrema Direita', 'monarquismo-absoluto').base).toBe('#001743');
    expect(resolveIdeologyColor('Extrema Direita', 'feudalismo').base).toBe('#001743');
    expect(catStyle('Esquerda', 'qualquer-id')).toEqual({ '--cat': '#035732', '--cat-bg': '#D5ECE2' });
  });

  it('sem id de ideologia nada muda (links e telas antigas)', () => {
    expect(catStyle('Extrema Direita')).toEqual({ '--cat': '#001743', '--cat-bg': '#D5DAE6' });
    expect(resolveIdeologyColor('categoria desconhecida').key).toBe('centro');
  });

  it('o conjunto especial não entra na ordem do espectro da home', async () => {
    const { SPECTRUM_ORDER } = await import('./ideologyColors');
    // as cores do conjunto especial vêm de anarquismo e libertário, então o que importa é que a lista siga com as 8 categorias
    expect(SPECTRUM_ORDER.map((color) => color.key)).toEqual(['esq-radical', 'esquerda', 'centro', 'direita', 'ext-direita', 'terceira', 'libertario', 'anarquismo']);
  });
});
