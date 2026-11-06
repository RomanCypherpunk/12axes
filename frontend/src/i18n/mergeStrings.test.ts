import { describe, expect, it } from 'vitest';
import { mergeStrings } from './mergeStrings';

describe('mergeStrings', () => {
  const base = {
    title: 'Title',
    nested: { a: 'A', b: 'B' },
    list: ['one', 'two'],
    count: (n: number) => `${n} items`
  };

  it('usa a tradução e completa o que falta com o dicionário base', () => {
    const merged = mergeStrings(base, { title: 'Título', nested: { a: 'Á' } });
    expect(merged.title).toBe('Título');
    expect(merged.nested).toEqual({ a: 'Á', b: 'B' });
    expect(merged.count(2)).toBe('2 items');
  });

  it('troca listas e funções inteiras', () => {
    const merged = mergeStrings(base, { list: ['uno'], count: (n: number) => `${n} elementos` });
    expect(merged.list).toEqual(['uno']);
    expect(merged.count(2)).toBe('2 elementos');
  });
});
