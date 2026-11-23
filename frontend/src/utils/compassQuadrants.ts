/**
 * Os quatro quadrantes lisos da bússola, no estilo do modelo padrão do Political Compass.
 * Cor do fundo e cor do nome de cada um. A página, o relatório em PDF e o cartão de compartilhar desenham a grade com estas mesmas cores.
 */
export type QuadrantKey = 'authLeft' | 'authRight' | 'libLeft' | 'libRight';

export const COMPASS_QUADRANTS: Record<QuadrantKey, { bg: string; ink: string }> = {
  authLeft: { bg: '#F9BABA', ink: '#C96A6C' },
  authRight: { bg: '#92D9F8', ink: '#0088AA' },
  libLeft: { bg: '#C8E4BC', ink: '#3B9339' },
  libRight: { bg: '#F5F5A7', ink: '#9A9900' }
};

/** Ordem de desenho: cima-esquerda, cima-direita, baixo-esquerda, baixo-direita. */
export const COMPASS_QUADRANT_ORDER: QuadrantKey[] = ['authLeft', 'authRight', 'libLeft', 'libRight'];

/** Quadrante de uma posição (0 a 100 em cada eixo; direita e autoritário acima de 50). */
export function quadrantAt(right: number, authoritarian: number): QuadrantKey {
  if (authoritarian >= 50) return right >= 50 ? 'authRight' : 'authLeft';
  return right >= 50 ? 'libRight' : 'libLeft';
}
