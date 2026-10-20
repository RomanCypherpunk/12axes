import { describe, expect, it } from 'vitest';
import { buildTreeLayout, vectorSimilarity } from '../../scripts/tree-layout.mjs';

const v = (n: number) => new Array<number>(12).fill(n);

describe('buildTreeLayout', () => {
  const items = [
    { id: 'a', vector: v(10) },
    { id: 'b', vector: v(12) },
    { id: 'c', vector: v(14) },
    { id: 'd', vector: v(88) },
    { id: 'e', vector: v(90) },
    { id: 'f', vector: v(92) }
  ];

  it('is deterministic', () => {
    const one = buildTreeLayout(items, 2);
    const two = buildTreeLayout(items, 2);
    expect(Array.from(one.x)).toEqual(Array.from(two.x));
    expect(Array.from(one.y)).toEqual(Array.from(two.y));
  });

  it('keeps similar items closer than opposite ones', () => {
    const { x, y } = buildTreeLayout(items, 2);
    const dist = (i: number, j: number) => Math.hypot(x[i] - x[j], y[i] - y[j]);
    expect(dist(0, 1)).toBeLessThan(dist(0, 3));
    expect(dist(4, 5)).toBeLessThan(dist(2, 5));
  });

  it('links each item to its nearest neighbours', () => {
    const { edges } = buildTreeLayout(items, 1);
    const has = (a: number, b: number) =>
      edges.some((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a));
    expect(has(0, 1)).toBe(true);
    expect(has(4, 5)).toBe(true);
    expect(has(0, 5)).toBe(false);
  });

  it('gives 1 for identical vectors and ~0 for opposite ones', () => {
    expect(vectorSimilarity(v(40), v(40))).toBe(1);
    expect(vectorSimilarity(v(0), v(100))).toBe(0);
  });
});
