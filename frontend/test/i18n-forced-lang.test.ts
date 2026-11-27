import { afterEach, describe, expect, it } from 'vitest';
import { resolveLang } from '../src/i18n';

const scope = globalThis as { __WIKI_LANG?: unknown };

describe('resolveLang com idioma fixado (páginas da wiki)', () => {
  afterEach(() => {
    delete scope.__WIKI_LANG;
  });

  it('usa globalThis.__WIKI_LANG quando é um idioma válido', () => {
    scope.__WIKI_LANG = 'de';
    expect(resolveLang()).toBe('de');
  });

  it('ignora valor inválido e segue a regra normal', () => {
    scope.__WIKI_LANG = 'xx';
    expect(resolveLang()).not.toBe('xx');
  });
});
