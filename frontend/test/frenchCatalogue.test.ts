import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { frenchHome } from '../scripts/fr-home.mjs';
import { CATEGORY_KEY } from '../scripts/ideologies-index.mjs';
import { resolveIdeologyColor } from '../src/utils/ideologyColors';

it('generates French home metadata, translated FAQ, and reciprocal alternates', () => {
  const source = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const html = frenchHome(source, 'https://12axes.vercel.app');
  expect(html).toContain('<html lang="fr">');
  expect(html).toContain('rel="canonical" href="https://12axes.vercel.app/fr"');
  for (const locale of ['pt-BR', 'en', 'fr', 'x-default']) {
    expect(html).toContain(`hreflang="${locale}"`);
  }
  expect(html).toContain('property="og:locale" content="fr_FR"');
  const data = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  expect(data[0].inLanguage).toBe('fr');
  expect(data[0].url).toBe('https://12axes.vercel.app/fr');
  expect(data[1].mainEntity.length).toBeGreaterThan(0);
  expect(data[1].mainEntity[0].name).toBe('Le test est-il fiable ?');
  expect(html).not.toContain('undefined');
});

it('keeps every ideology in the same color and filter category in French', () => {
  const root = new URL('../../backend/src/main/resources/data/', import.meta.url);
  const base = JSON.parse(readFileSync(new URL('ideologies.json', root), 'utf8'));
  const french = JSON.parse(readFileSync(new URL('i18n/fr/ideologies.json', root), 'utf8'));
  const original = new Map(base.map((item: { id: string; category: string }) => [item.id, item.category]));
  for (const item of french) {
    const expected = resolveIdeologyColor(original.get(item.id) as string);
    expect(resolveIdeologyColor(item.category), item.id).toEqual(expected);
    expect(CATEGORY_KEY[item.category.toLowerCase()], item.id).toBe(expected.key);
  }
});
