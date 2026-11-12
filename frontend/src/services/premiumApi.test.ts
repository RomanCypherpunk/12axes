import { afterEach, describe, expect, it, vi } from 'vitest';
import { archetypeOnly, fetchPremiumReport } from './premiumApi';

describe('archetypeOnly', () => {
  it('tira as escolhas de religião, que o servidor não aceita como arquétipo', () => {
    expect(archetypeOnly({ sociedade: 'A', poder: 'C', religiao: 'budismo', denominacao: 'catolico' })).toEqual({
      sociedade: 'A',
      poder: 'C'
    });
  });

  it('mantém as alternativas de arquétipo como estão', () => {
    expect(archetypeOnly({ mundo: 'B', tecnologia: 'D' })).toEqual({ mundo: 'B', tecnologia: 'D' });
  });

  it('tira os passos da árvore de valores (fv:), que viram `values` e não arquétipo', () => {
    expect(archetypeOnly({ 'fv:politica_1': '1', 'fv:politica_2': '0', sociedade: 'A', religiao: 'B' })).toEqual({ sociedade: 'A' });
  });
});

describe('fetchPremiumReport', () => {
  afterEach(() => vi.unstubAllGlobals());

  function stubFetch() {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    vi.stubGlobal('fetch', fetchMock);
    return () => JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string) as Record<string, unknown>;
  }

  const saved = { variant: 'extreme' as const, answers: { q1: 'AGREE' as const }, archetypeChoices: { 'fv:p1': '1', religiao: 'A' } };

  it('envia os valores completos junto com as respostas (sem eles as respostas não reproduzem o vetor)', async () => {
    const body = stubFetch();
    await fetchPremiumReport([50, 50], { ...saved, values: { politica: 'tecnocracia' } }, 'token', null);
    expect(body()).toMatchObject({ archetype: {}, values: { politica: 'tecnocracia' } });
  });

  it('não manda values quando o resultado não tem valores completos', async () => {
    const body = stubFetch();
    await fetchPremiumReport([50, 50], saved, 'token', null);
    expect(body().values).toBeUndefined();
  });
});
