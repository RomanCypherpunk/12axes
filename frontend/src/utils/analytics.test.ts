import { afterEach, describe, expect, it, vi } from 'vitest';
import { track } from './analytics';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('track', () => {
  it('chama o gtag com o nome e os parâmetros', () => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag });
    track('paywall_view', { source: 'pdf' });
    expect(gtag).toHaveBeenCalledWith('event', 'paywall_view', { source: 'pdf' });
  });

  it('sem gtag (bloqueador de anúncios) não faz nada e não quebra', () => {
    vi.stubGlobal('window', {});
    expect(() => track('checkout_start')).not.toThrow();
  });

  it('se o gtag falhar, a tela não quebra', () => {
    vi.stubGlobal('window', {
      gtag: () => {
        throw new Error('bloqueado');
      }
    });
    expect(() => track('purchase_unlocked')).not.toThrow();
  });
});
