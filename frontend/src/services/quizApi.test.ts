import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchSharedResult, submitResults } from './quizApi';

describe('fetchSharedResult', () => {
  afterEach(() => vi.unstubAllGlobals());

  function stubFetch() {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    vi.stubGlobal('fetch', fetchMock);
    return () => String(fetchMock.mock.calls[0][0]);
  }

  it('manda a chave dos valores completos como f, junto com a versão nova do formato', async () => {
    const url = stubFetch();
    await fetchSharedResult([10, 20], null, '1AbCdEfGhI');
    expect(url()).toContain('v=10,20');
    expect(url()).toContain('&f=1AbCdEfGhI');
    expect(url()).toContain('&rv=4');
  });

  it('sem chave o endereço não leva f', async () => {
    const url = stubFetch();
    await fetchSharedResult([10, 20], null);
    expect(url()).not.toContain('&f=');
  });
});

describe('submitResults', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('envia os valores completos escolhidos no corpo', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    vi.stubGlobal('fetch', fetchMock);
    await submitResults('extreme', [], {}, null, { politica: 'tecnocracia' });
    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(body.values).toEqual({ politica: 'tecnocracia' });
  });
});
