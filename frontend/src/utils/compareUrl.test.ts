import { describe, expect, it } from 'vitest';
import { comparePath, compareUrl, MAX_COMPARE, parseCompareItems, parseCompareUrl, serializeCompareItems } from './compareUrl';

describe('parseCompareItems', () => {
  it('lê os perfis na ordem do link', () => {
    expect(parseCompareItems('personality:alvaro-uribe,personality:gustavo-petro,country:colombia')).toEqual([
      { type: 'personality', id: 'alvaro-uribe' },
      { type: 'personality', id: 'gustavo-petro' },
      { type: 'country', id: 'colombia' }
    ]);
  });

  it('aceita espaços em volta dos tokens', () => {
    expect(parseCompareItems(' ideology:social-democracia , country:brasil ')).toEqual([
      { type: 'ideology', id: 'social-democracia' },
      { type: 'country', id: 'brasil' }
    ]);
  });

  it('ignora tipo desconhecido, token sem tipo e id vazio', () => {
    expect(parseCompareItems('planet:x,alvaro-uribe,personality:,country:colombia')).toEqual([
      { type: 'country', id: 'colombia' }
    ]);
  });

  it('conta repetidos uma vez e corta no máximo', () => {
    const refs = parseCompareItems('country:a,country:a,country:b,country:c,country:d');
    expect(refs.map((ref) => ref.id)).toEqual(['a', 'b', 'c']);
    expect(refs).toHaveLength(MAX_COMPARE);
  });

  it('sem parâmetro não há perfis', () => {
    expect(parseCompareItems(null)).toEqual([]);
    expect(parseCompareItems('')).toEqual([]);
  });
});

describe('serializeCompareItems e compareUrl', () => {
  const refs = [
    { type: 'personality' as const, id: 'alvaro-uribe' },
    { type: 'country' as const, id: 'colombia' }
  ];

  it('gera o mesmo formato tipo:id que o backend recebe', () => {
    expect(serializeCompareItems(refs)).toBe('personality:alvaro-uribe,country:colombia');
    expect(compareUrl(refs)).toBe('/compare?items=personality:alvaro-uribe,country:colombia');
  });

  it('inclui a religião só quando existe', () => {
    expect(compareUrl(refs, 'judaism')).toBe('/compare?items=personality:alvaro-uribe,country:colombia&religion=judaism');
    expect(compareUrl([])).toBe('/compare');
  });

  it('ida e volta: o link gerado reconstrói a mesma comparação', () => {
    const url = compareUrl(refs, 'catholic');
    const parsed = parseCompareUrl(url.slice(url.indexOf('?')));
    expect(parsed).toEqual({ refs, religion: 'catholic' });
  });

  it('em inglês o caminho leva o prefixo /en, como no catálogo', () => {
    expect(comparePath('pt')).toBe('/compare');
    expect(comparePath('en')).toBe('/en/compare');
    expect(compareUrl(refs, null, 'en')).toBe('/en/compare?items=personality:alvaro-uribe,country:colombia');
    expect(compareUrl([], null, 'en')).toBe('/en/compare');
  });

  it('religião desconhecida no link vira sem filtro', () => {
    expect(parseCompareUrl('?items=country:colombia&religion=pastafari').religion).toBeNull();
  });
});
