import { describe, expect, it } from 'vitest';
import type { CompareItem } from '../types/quiz';
import { searchItems } from './compareSearch';

const item = (name: string, type: CompareItem['type'] = 'ideology'): CompareItem => ({ type, id: name, name, caption: '', category: 'Centro', historical: false });

const CATALOG = [
  item('Anarcodistributismo'),
  item('Anarcocapitalismo'),
  item('Anarcossindicalismo'),
  item('Distributismo Georgista'),
  item('Distributismo'),
  item('Socialismo de Mercado'),
  item('Getúlio Vargas', 'personality'),
  item('Estados Unidos', 'country'),
  item('Flórida (Estados Unidos)', 'country'),
  item('Mercado Comum')
];

const names = (query: string) => searchItems(CATALOG, query).map((found) => found.name);

describe('busca da análise comparativa', () => {
  it('o nome exato vem primeiro, antes de quem só começa ou contém a busca', () => {
    expect(names('distributismo')).toEqual(['Distributismo', 'Distributismo Georgista', 'Anarcodistributismo']);
  });

  it('um começo de palavra traz todos os que começam assim', () => {
    expect(names('anarco')).toEqual(['Anarcocapitalismo', 'Anarcodistributismo', 'Anarcossindicalismo']);
  });

  it('ignora acento, maiúscula, hífen e espaço', () => {
    expect(names('GETULIO')).toEqual(['Getúlio Vargas']);
    expect(names('getúlio vargas')).toEqual(['Getúlio Vargas']);
    expect(names('anarco distributismo')[0]).toBe('Anarcodistributismo');
    expect(names('anarco-distributismo')[0]).toBe('Anarcodistributismo');
    expect(names('anarcodistributismo')[0]).toBe('Anarcodistributismo');
  });

  it('acha por palavras em qualquer ordem e por palavras do meio do nome', () => {
    expect(names('mercado socialismo')).toEqual(['Socialismo de Mercado']);
    expect(names('unidos')).toEqual(['Estados Unidos', 'Flórida (Estados Unidos)']);
    expect(names('florida estados')).toEqual(['Flórida (Estados Unidos)']);
  });

  it('o nome exato de um país vem antes dos que o contêm', () => {
    expect(names('estados unidos')[0]).toBe('Estados Unidos');
  });

  it('busca vazia ou só pontuação não traz nada, e sem acerto devolve lista vazia', () => {
    expect(names('')).toEqual([]);
    expect(names(' - ')).toEqual([]);
    expect(names('zzzz')).toEqual([]);
  });

  it('não corta em 8: traz todos os que acertam até o limite', () => {
    const many = Array.from({ length: 25 }, (_, index) => item(`Anarco ${index}`));
    expect(searchItems(many, 'anarco')).toHaveLength(25);
  });
});
