// Cópia fiel dos rankings do backend: IdeologyMatcherService, PersonalityMatcherService, CountryMatcherService,
// PartyMatcherService e os três *DimensionMatcherService. Mesma ordem (nota decrescente, depois nome pelo compareTo do
// Java), mesmo percentil (calculado sobre o catálogo inteiro, antes do filtro de religião) e mesmos cortes.

import { compatibility, javaCompare, neutralVector, percentile, percentiles, round1, type Vector } from './score.ts';
import { religionAllows } from './religion.ts';

export interface CatalogItem {
  id: string;
  name: string;
  religions?: string[];
}

export interface Ranked<T extends CatalogItem> {
  item: T;
  compatibility: number;
  percentile: number;
}

export const POLITICAL_AXES = [
  'estrutura', 'representacao', 'poder', 'diplomacia', 'imigracao',
  'intervencao', 'tecnologia', 'controle', 'comercio', 'religiao', 'economia', 'moral'
];
export const SOCIAL_AXES = ['representacao', 'moral', 'religiao', 'economia', 'controle', 'comercio', 'imigracao', 'poder', 'tecnologia'];
export const ECONOMIC_AXES = ['economia', 'controle', 'comercio'];
export const POLITICAL_CATEGORIES = ['politico', 'teorico', 'ativista'];
export const SOCIAL_CATEGORIES = ['filosofo', 'religioso', 'intelectual', 'ativista'];
export const ECONOMIC_CATEGORIES = ['politico', 'economista', 'empresario'];
export type Dimension = 'political' | 'social' | 'economic';

export const IDEOLOGY_TOP = 4;
export const PERSONALITY_TOP = 8;
export const COUNTRY_TOP = 3;
export const PARTY_TOP = 3;
export const BOTTOM = 3;

const vectorOf = (vectors: Map<string, Vector>, id: string): Vector => {
  const vector = vectors.get(id);
  return vector && Object.keys(vector).length > 0 ? vector : neutralVector();
};

const byScoreThenName = <T extends CatalogItem>(a: Ranked<T>, b: Ranked<T>): number =>
  b.compatibility - a.compatibility || javaCompare(a.item.name, b.item.name);

/** Ranking completo de um catálogo, como computeRanking de cada *MatcherService. */
export function rankCatalog<T extends CatalogItem>(user: Vector, items: T[], vectors: Map<string, Vector>, religion: string | null): Ranked<T>[] {
  const scores = items.map((item) => compatibility(user, vectorOf(vectors, item.id)));
  const ranks = percentiles(scores);
  return items
    .map((item, index) => ({ item, compatibility: scores[index], percentile: ranks[index] }))
    .filter((ranked) => religionAllows(ranked.item.religions, religion))
    .sort(byScoreThenName);
}

/** Os três mais distantes, do menos ao mais distante (findBottomMatches). */
export function bottomOf<T extends CatalogItem>(ranking: Ranked<T>[]): Ranked<T>[] {
  return ranking.slice(Math.max(0, ranking.length - BOTTOM)).sort((a, b) => a.compatibility - b.compatibility);
}

interface DimensionSpec {
  dimension: Dimension;
  axes?: string[];
  categories?: string[];
}

const PERSONALITY_DIMENSIONS: DimensionSpec[] = [
  { dimension: 'political', categories: POLITICAL_CATEGORIES },
  { dimension: 'social', categories: SOCIAL_CATEGORIES },
  { dimension: 'economic', categories: ECONOMIC_CATEGORIES }
];
const AXIS_DIMENSIONS: DimensionSpec[] = [
  { dimension: 'political', axes: POLITICAL_AXES },
  { dimension: 'social', axes: SOCIAL_AXES },
  { dimension: 'economic', axes: ECONOMIC_AXES }
];

function dimensionMatches<T extends CatalogItem & { category?: string }>(
  user: Vector,
  items: T[],
  vectors: Map<string, Vector>,
  religion: string | null,
  excludeIds: string[],
  specs: DimensionSpec[]
): { dimension: Dimension; ranked: Ranked<T> }[] {
  const excluded = new Set(excludeIds);
  const out: { dimension: Dimension; ranked: Ranked<T> }[] = [];
  for (const spec of specs) {
    const pool = items
      .filter((item) => !excluded.has(item.id))
      .filter((item) => !spec.categories || spec.categories.includes(item.category ?? ''))
      .filter((item) => religionAllows(item.religions, religion));
    if (pool.length === 0) continue;
    const scored = pool
      .map((item) => ({ item, compatibility: compatibility(user, vectorOf(vectors, item.id), spec.axes), percentile: 0 }))
      .sort(byScoreThenName);
    const all = scored.map((entry) => entry.compatibility);
    const best = scored[0];
    out.push({ dimension: spec.dimension, ranked: { item: best.item, compatibility: round1(best.compatibility), percentile: percentile(best.compatibility, all) } });
    excluded.add(best.item.id);
  }
  return out;
}

/** DimensionMatcherService.findAll: personalidades por área, nos 12 eixos. */
export function personalityDimensions<T extends CatalogItem & { category?: string }>(
  user: Vector, items: T[], vectors: Map<string, Vector>, religion: string | null, excludeId: string | null
) {
  return dimensionMatches(user, items, vectors, religion, excludeId ? [excludeId] : [], PERSONALITY_DIMENSIONS);
}

/** CountryDimensionMatcherService / PartyDimensionMatcherService.findAll: por grupo de eixos. */
export function axisDimensions<T extends CatalogItem>(
  user: Vector, items: T[], vectors: Map<string, Vector>, religion: string | null, excludeIds: string[]
) {
  return dimensionMatches(user, items, vectors, religion, excludeIds, AXIS_DIMENSIONS);
}
