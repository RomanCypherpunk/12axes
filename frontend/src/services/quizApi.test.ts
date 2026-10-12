import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchSharedResult, submitResults } from './quizApi';

function mockSuccessfulFetch() {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({})
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('quizApi personality representation', () => {
  it('sends female representation when submitting results', async () => {
    const fetchMock = mockSuccessfulFetch();

    await submitResults('short', [], {}, 'female');

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0];

    expect(String(url)).toContain('/api/results?');
    expect(String(url)).toContain('representation=female');
    expect(options).toMatchObject({ method: 'POST' });
  });

  it('keeps male as the default representation', async () => {
    const fetchMock = mockSuccessfulFetch();

    await submitResults('short', []);

    const [url] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('representation=male');
  });

  it('preserves female representation in shared-result URLs', async () => {
    const fetchMock = mockSuccessfulFetch();

    await fetchSharedResult(
      [78, 55, 6, 45, 72, 28, 3, 3, 6, 96, 55, 92],
      'female'
    );

    const [url] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/api/results/by-axes?');
    expect(String(url)).toContain('representation=female');
    expect(String(url)).toContain('v=78,55,6,45,72,28,3,3,6,96,55,92');
  });
});
