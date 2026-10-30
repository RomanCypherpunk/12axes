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
    expect(paywallEnabled({ mode: 'off', search: '?paywall=1', storage: memory() })).toBe(false);
  });

  it('ligado: todo mundo vê', () => {
    expect(paywallEnabled({ mode: 'on', search: '', storage: memory() })).toBe(true);
  });

  it('prévia: sem a marca ninguém vê', () => {
    expect(paywallEnabled({ mode: 'preview', search: '?est=1', storage: memory() })).toBe(false);
  });

  it('prévia: ?paywall=1 marca o navegador e a marca fica para as próximas visitas', () => {
    const storage = memory();
    expect(paywallEnabled({ mode: 'preview', search: '?paywall=1', storage })).toBe(true);
    expect(paywallEnabled({ mode: 'preview', search: '?est=1', storage })).toBe(true);
  });

  it('prévia: ?paywall=0 tira a marca', () => {
    const storage = memory({ '12axes:paywall': '1' });
    expect(paywallEnabled({ mode: 'preview', search: '?paywall=0', storage })).toBe(false);
    expect(paywallEnabled({ mode: 'preview', search: '', storage })).toBe(false);
  });

  it('sem armazenamento (aba anônima) a marca vale só pelo endereço', () => {
    expect(paywallEnabled({ mode: 'preview', search: '?paywall=1', storage: null })).toBe(true);
    expect(paywallEnabled({ mode: 'preview', search: '', storage: null })).toBe(false);
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
    expect(paywallEnabled({ mode: 'preview', search: '?paywall=1', storage: broken })).toBe(true);
    expect(paywallEnabled({ mode: 'preview', search: '', storage: broken })).toBe(false);
  });
});

describe('vendas pausadas (paused)', () => {
  it('o relatório segue ligado, para quem já pagou', () => {
    expect(paywallEnabled({ mode: 'paused', search: '', storage: memory() })).toBe(true);
  });

  it('a compra só aparece com as vendas abertas', () => {
    expect(salesOpen({ mode: 'paused', enabled: true, search: '', storage: memory() })).toBe(false);
    expect(salesOpen({ mode: 'on', enabled: true, search: '', storage: memory() })).toBe(true);
    expect(salesOpen({ mode: 'preview', enabled: true, search: '', storage: memory() })).toBe(true);
    expect(salesOpen({ mode: 'on', enabled: false, search: '', storage: memory() })).toBe(false);
  });

  it('pausada, só o navegador marcado (?paywall=1) vê a compra: o dono testa no ar sem abrir a venda', () => {
    const storage = memory();
    expect(salesOpen({ mode: 'paused', enabled: true, search: '?paywall=1', storage })).toBe(true);
    expect(salesOpen({ mode: 'paused', enabled: true, search: '', storage })).toBe(true);
    expect(salesOpen({ mode: 'paused', enabled: true, search: '?paywall=0', storage })).toBe(false);
    expect(salesOpen({ mode: 'paused', enabled: true, search: '', storage })).toBe(false);
  });
});
