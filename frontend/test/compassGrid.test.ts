import { describe, expect, it } from 'vitest';
import { COMPASS_GRID_CELLS } from '../src/components/results/PoliticalCompassSection';

const SIZE = 9;
const cell = (column: number, row: number): string => COMPASS_GRID_CELLS[row * SIZE + column];

describe('grade da bússola', () => {
  it('tem 81 células, cada uma de uma cor só (sem degradê dentro do quadrado)', () => {
    expect(COMPASS_GRID_CELLS).toHaveLength(SIZE * SIZE);
    expect(COMPASS_GRID_CELLS.every((color) => /^rgb\(\d+,\d+,\d+\)$/.test(color))).toBe(true);
  });

  it('o miolo de cada bloco tem exatamente a mesma cor', () => {
    expect(cell(0, 0)).toBe(cell(1, 0)); // Esquerda radical
    expect(cell(0, 0)).toBe(cell(0, 1));
    expect(cell(0, 0)).toBe(cell(1, 1));
    expect(cell(4, 4)).toBe(cell(4, 5)); // Centro
    expect(cell(7, 0)).toBe(cell(8, 1)); // Extrema direita
    expect(cell(7, 4)).toBe(cell(8, 5)); // Direita
  });

  it('blocos diferentes têm cores diferentes no miolo', () => {
    const cores = [cell(0, 0), cell(4, 0), cell(8, 0), cell(0, 5), cell(4, 5), cell(8, 5), cell(0, 8), cell(8, 8)];
    expect(new Set(cores).size).toBe(cores.length);
  });

  it('o quadrado da divisa mistura um pouco da cor vizinha, e os dois lados são distintos', () => {
    // Esquerda radical (2,0) e Terceira posição (3,0) se tocam: cada um difere do miolo e um do outro.
    expect(cell(2, 0)).not.toBe(cell(0, 0));
    expect(cell(3, 0)).not.toBe(cell(4, 0));
    expect(cell(2, 0)).not.toBe(cell(3, 0));
    // Esquerda radical (0,2) e Esquerda (0,3), na vertical.
    expect(cell(0, 2)).not.toBe(cell(0, 0));
    expect(cell(0, 3)).not.toBe(cell(0, 5));
    expect(cell(0, 2)).not.toBe(cell(0, 3));
  });

  it('a coluna do meio da base fica entre Anarquismo e Libertário', () => {
    expect(cell(4, 8)).not.toBe(cell(3, 8));
    expect(cell(4, 8)).not.toBe(cell(5, 8));
    expect(cell(3, 8)).not.toBe(cell(5, 8));
  });
});
