import { describe, expect, it } from 'vitest';
import { paywallEnabled, paywallMode, salesOpen } from './paywallFlag';

function memory(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key)
  };
}

describe('paywallMode', () => {
  it('só "true", "preview" e "paused" ligam alguma coisa', () => {
    expect(paywallMode('true')).toBe('on');
    expect(paywallMode('preview')).toBe('preview');
    expect(paywallMode('paused')).toBe('paused');
    expect(paywallMode('false')).toBe('off');
    expect(paywallMode('1')).toBe('off');
    expect(paywallMode(undefined)).toBe('off');
  });
});

describe('paywallEnabled', () => {
  it('desligado: ninguém vê, nem com ?paywall=1', () => {
    expect(paywallEnabled({ mode: 'off', lang: 'pt', search: '?paywall=1', storage: memory() })).toBe(false);
  });

  it('ligado: todo mundo vê em português, ninguém em inglês', () => {
    expect(paywallEnabled({ mode: 'on', lang: 'pt', search: '', storage: memory() })).toBe(true);
    expect(paywallEnabled({ mode: 'on', lang: 'en', search: '', storage: memory() })).toBe(false);
  });

  it('prévia: sem a marca ninguém vê', () => {
    expect(paywallEnabled({ mode: 'preview', lang: 'pt', search: '?est=1', storage: memory() })).toBe(false);
  });

  it('prévia: ?paywall=1 marca o navegador e a marca fica para as próximas visitas', () => {
    const storage = memory();
    expect(paywallEnabled({ mode: 'preview', lang: 'pt', search: '?paywall=1', storage })).toBe(true);
    expect(paywallEnabled({ mode: 'preview', lang: 'pt', search: '?est=1', storage })).toBe(true);
  });

  it('prévia: ?paywall=0 tira a marca', () => {
    const storage = memory({ '12axes:paywall': '1' });
    expect(paywallEnabled({ mode: 'preview', lang: 'pt', search: '?paywall=0', storage })).toBe(false);
    expect(paywallEnabled({ mode: 'preview', lang: 'pt', search: '', storage })).toBe(false);
  });

  it('prévia em inglês nunca liga, mesmo marcado', () => {
    expect(paywallEnabled({ mode: 'preview', lang: 'en', search: '?paywall=1', storage: memory() })).toBe(false);
  });

  it('sem armazenamento (aba anônima) a marca vale só pelo endereço', () => {
    expect(paywallEnabled({ mode: 'preview', lang: 'pt', search: '?paywall=1', storage: null })).toBe(true);
    expect(paywallEnabled({ mode: 'preview', lang: 'pt', search: '', storage: null })).toBe(false);
  });

  it('armazenamento que lança erro não quebra', () => {
    const broken = {
      getItem: () => {
        throw new Error('bloqueado');
      },
      setItem: () => {
        throw new Error('bloqueado');
      },
      removeItem: () => {
        throw new Error('bloqueado');
      }
    };
    expect(paywallEnabled({ mode: 'preview', lang: 'pt', search: '?paywall=1', storage: broken })).toBe(true);
    expect(paywallEnabled({ mode: 'preview', lang: 'pt', search: '', storage: broken })).toBe(false);
  });
});

describe('vendas pausadas (paused)', () => {
  it('o relatório segue ligado em português, para quem já pagou, e desligado em inglês', () => {
    expect(paywallEnabled({ mode: 'paused', lang: 'pt', search: '', storage: memory() })).toBe(true);
    expect(paywallEnabled({ mode: 'paused', lang: 'en', search: '', storage: memory() })).toBe(false);
  });

  it('a compra só aparece com as vendas abertas', () => {
    expect(salesOpen('paused', true)).toBe(false);
    expect(salesOpen('on', true)).toBe(true);
    expect(salesOpen('preview', true)).toBe(true);
    expect(salesOpen('on', false)).toBe(false);
  });
});
