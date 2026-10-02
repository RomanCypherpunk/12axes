import { describe, expect, it, vi, afterEach } from 'vitest';
import { languageUrl, resolveLanguage } from './locale';

describe('French language selection', () => {
  it('preserves path, URL, preference, and browser precedence', () => {
    expect(resolveLanguage('/fr', '?lang=en', 'pt', 'en-US')).toBe('fr');
    expect(resolveLanguage('/fr/countries/franca', '?lang=pt', 'en', 'pt-BR')).toBe('fr');
    expect(resolveLanguage('/en.html/', '?lang=fr', 'pt', 'fr-FR')).toBe('en');
    expect(resolveLanguage('/br', '?lang=fr', 'en', 'fr-FR')).toBe('pt');
    expect(resolveLanguage('/', '?lang=fr-CA', 'en', 'pt-BR')).toBe('fr');
    expect(resolveLanguage('/', '', 'fr', 'pt-BR')).toBe('fr');
    expect(resolveLanguage('/', '', null, 'fr-BE')).toBe('fr');
    expect(resolveLanguage('/', '', null, 'de-DE')).toBe('en');
    expect(resolveLanguage('/', '?lang=unknown', 'pt', 'fr-FR')).toBe('pt');
  });

  it('links to equivalent home and catalog pages without losing filters or fragments', () => {
    expect(languageUrl('https://example.test/en?lang=en#faq', 'fr')).toBe('https://example.test/fr#faq');
    expect(languageUrl('https://example.test/fr/countries/franca.html?search=France#axes', 'en'))
      .toBe('https://example.test/en/countries/franca?search=France#axes');
    expect(languageUrl('https://example.test/fr/ideologies/liberalismo', 'pt')).toBe('https://example.test/ideologies/liberalismo');
    expect(languageUrl('https://example.test/fr', 'pt')).toBe('https://example.test/br');
  });

  it('preserves shared result numbers and religion when changing language', () => {
    const url = new URL(languageUrl('https://example.test/results?est=12.5&rep=70&religion=catholic&lang=en#axes', 'fr'));
    expect(url.pathname).toBe('/results');
    expect(url.searchParams.get('est')).toBe('12.5');
    expect(url.searchParams.get('rep')).toBe('70');
    expect(url.searchParams.get('religion')).toBe('catholic');
    expect(url.searchParams.get('lang')).toBe('fr');
    expect(url.hash).toBe('#axes');
    expect(languageUrl('https://example.test/240questions', 'fr')).toBe('https://example.test/240questions?lang=fr');
  });
});

afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

it('selects French even when local storage is unavailable', async () => {
  vi.stubGlobal('window', {
    location: { pathname: '/fr', search: '' },
    get localStorage() { throw new Error('storage blocked'); }
  });
  vi.stubGlobal('navigator', { language: 'en-US' });
  const { LANG, t } = await import('./index');
  expect(LANG).toBe('fr');
  expect(t.languageLabel).toBe('Langue');
});

it('shows French errors for HTTP, proxy, and backend failures', async () => {
  vi.stubGlobal('window', { location: { pathname: '/fr', search: '' }, localStorage: { getItem: () => null } });
  vi.stubGlobal('navigator', { language: 'fr-FR' });
  const { formatApiError } = await import('../services/quizApi');
  expect(formatApiError('{"message":"Muitas requisicoes"}', 429)).toContain('Trop de requêtes');
  expect(formatApiError('<html>Bad Gateway</html>', 502)).toContain('Veuillez réessayer');
});
