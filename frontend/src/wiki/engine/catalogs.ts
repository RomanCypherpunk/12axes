// Monta os catálogos de um idioma a partir de backend/src/main/resources/data, como o QuizDataService: português é a
// base, o inglês sobrepõe por id e os idiomas gerados sobrepõem o inglês. Só roda no Node (build e testes).

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Lang, WikiCatalogs } from './result.ts';
import type { Vector } from './score.ts';
import type { ValueCategory, ValueText } from './values.ts';

type Item = { id: string } & Record<string, unknown>;

function readJson<T>(dataDir: string, file: string): T {
  return JSON.parse(readFileSync(join(dataDir, file), 'utf8')) as T;
}

function overlayItems(dataDir: string, lang: Lang, file: string): Map<string, Item> | null {
  const path = join(dataDir, 'i18n', lang, file);
  if (!existsSync(path)) return null;
  return new Map((JSON.parse(readFileSync(path, 'utf8')) as Item[]).map((item) => [item.id, item]));
}

function localized<T extends Item>(dataDir: string, lang: Lang, file: string): T[] {
  const base = readJson<T[]>(dataDir, file);
  if (lang === 'pt') return base;
  const english = overlayItems(dataDir, 'en', file);
  const generated = lang === 'en' ? null : overlayItems(dataDir, lang, file);
  return base.map((item) => ({ ...item, ...(english?.get(item.id) ?? {}), ...(generated?.get(item.id) ?? {}) }) as T);
}

function vectors(dataDir: string, file: string, key: string): { map: Map<string, Vector>; order: string[] } {
  const list = readJson<Record<string, unknown>[]>(dataDir, file);
  return {
    map: new Map(list.map((profile) => [profile[key] as string, profile.vector as Vector])),
    order: list.map((profile) => profile[key] as string)
  };
}

function valueText(items: Map<string, Item> | null): ValueText | null {
  if (!items) return null;
  return new Map([...items].map(([id, item]) => [id, { label: item.label as string, name: item.name as string, description: item.description as string }]));
}

export function loadCatalogs(dataDir: string, lang: Lang): WikiCatalogs {
  const countries = localized<Item>(dataDir, lang, 'countries.json');
  const countryById = new Map(countries.map((country) => [country.id, country]));
  const parties = localized<Item>(dataDir, lang, 'parties.json').map((party) => {
    const country = countryById.get(party.countryId as string);
    return { ...party, countryName: (country?.name as string) ?? '', countryFlagPath: (country?.flagPath as string) ?? '' };
  });
  const ideologyVectors = vectors(dataDir, 'ideology-profiles.json', 'ideologyId');
  return {
    lang,
    axes: localized<Item>(dataDir, lang, 'axes.json') as unknown as WikiCatalogs['axes'],
    ideologies: localized<Item>(dataDir, lang, 'ideologies.json') as unknown as WikiCatalogs['ideologies'],
    personalities: localized<Item>(dataDir, lang, 'personalities.json') as unknown as WikiCatalogs['personalities'],
    countries: countries as unknown as WikiCatalogs['countries'],
    parties: parties as unknown as WikiCatalogs['parties'],
    vectors: {
      ideology: ideologyVectors.map,
      personality: vectors(dataDir, 'personality-profiles.json', 'personalityId').map,
      country: vectors(dataDir, 'countries-profiles.json', 'countryId').map,
      party: vectors(dataDir, 'parties-profiles.json', 'partyId').map
    },
    ideologyProfileOrder: ideologyVectors.order,
    valueCategories: readJson<ValueCategory[]>(dataDir, 'political-values.json'),
    valueText: lang === 'pt' ? null : lang === 'en' ? valueText(overlayItems(dataDir, 'en', 'political-values.json')) : valueText(overlayItems(dataDir, lang, 'political-values.json')) ?? new Map(),
    valueEnglish: valueText(overlayItems(dataDir, 'en', 'political-values.json')) ?? new Map()
  };
}
