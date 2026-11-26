/**
 * Os quatro quadrantes da bússola, no estilo do modelo padrão do Political Compass: cor do fundo e cor do nome de cada um.
 * Por cima deles vai o degradê (`compassBlendCells`), o mesmo na página, no relatório em PDF e no cartão de compartilhar.
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

/** Quadradinhos por lado da grade (os mesmos das linhas de `.e-compass-grid`). */
export const COMPASS_CELLS = 20;
// Quanto o degradê avança para cada lado do meio da grade, em pontos (12.5 = dois quadradinhos e meio).
const QUADRANT_BLEND = 12.5;
// Roxo da Terceira Posição, no mesmo tom claro do vermelho e do azul. Ocupa a região dela em `compassRegion`:
// o terço do meio na horizontal e o terço de cima na vertical.
const THIRD_BG = '#CCA5F8';
const THIRD_HALF_WIDTH = 100 / 6;
const THIRD_BOTTOM = 100 / 3;

/** 0 antes do degradê, 1 depois e meio a meio em cima da divisa. */
const ramp = (past: number): number => Math.max(0, Math.min(1, 0.5 + past / (2 * QUADRANT_BLEND)));

function mixHex(from: string, to: string, amount: number): string {
  const channel = (hex: string, index: number): number => parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16);
  return `#${[0, 1, 2]
    .map((index) => Math.round(channel(from, index) + (channel(to, index) - channel(from, index)) * amount).toString(16).padStart(2, '0'))
    .join('')}`.toUpperCase();
}

/**
 * A cor de cada quadradinho (coluna e linha a partir do canto de cima à esquerda): os quatro quadrantes em degradê onde se
 * cruzam e, no alto, o encontro do vermelho e do azul com o roxo da Terceira Posição.
 */
export function compassBlendCells(): { column: number; row: number; color: string }[] {
  const size = 100 / COMPASS_CELLS;
  const { authLeft, authRight, libLeft, libRight } = COMPASS_QUADRANTS;
  return Array.from({ length: COMPASS_CELLS * COMPASS_CELLS }, (_, index) => {
    const column = index % COMPASS_CELLS;
    const row = Math.floor(index / COMPASS_CELLS);
    const x = (column + 0.5) * size;
    const y = (row + 0.5) * size;
    const toRight = ramp(x - 50);
    const base = mixHex(mixHex(authLeft.bg, authRight.bg, toRight), mixHex(libLeft.bg, libRight.bg, toRight), ramp(y - 50));
    const color = mixHex(base, THIRD_BG, ramp(THIRD_HALF_WIDTH - Math.abs(x - 50)) * ramp(THIRD_BOTTOM - y));
    return { column, row, color };
  });
}
