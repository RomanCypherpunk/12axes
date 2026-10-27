import { parseReligion, parseReligionList, type Religion } from './religion';

// Comparação entre duas pessoas: /compare/people?an=Você&a=65,32,...&bn=Julia&b=40,51,...
// (a e b = % do polo esquerdo dos 12 eixos, na ordem de RESULT_URL_KEYS; ra e rb = religião, opcional).
export const PEOPLE_COMPARE_PATH = '/compare/people';

// URL de resultado compartilhável: /results?est=65&rep=32.5&... (uma chave por eixo, valor = % do polo
// esquerdo, na mesma ordem de axes.json e dos ids de HOME_AXES).
export const RESULT_URL_KEYS = ['est', 'rep', 'pod', 'imi', 'dip', 'int', 'eco', 'con', 'com', 'rel', 'mor', 'tec'] as const;

export const MAX_NAME_LENGTH = 40;

// Dois perfis ficam em lados opostos de um eixo quando cada um passa do centro (50%) por pelo menos esta folga,
// cada um para um polo. Ficar perto do centro mas já do outro lado conta: o ponto na trilha cruza a linha do meio.
export const OPPOSITE_SIDE_MARGIN = 2;

export interface PersonResult {
  values: number[];
  /** A religião (a primeira, quando há várias): usada nos ícones e nos valores. */
  religion: Religion | null;
  /** Todas as religiões, separadas por vírgula ("catholic,protestant"), quando o perfil tem mais de uma; o filtro usa todas. */
  religionFilter?: string | null;
}

/** O que vai para a API como preferência religiosa: todas as religiões da pessoa, ou a única. */
export function religionPreference(person: PersonResult): string | null {
  return person.religionFilter ?? person.religion;
}

function personReligion(raw: string | null): Pick<PersonResult, 'religion' | 'religionFilter'> {
  const list = parseReligionList(raw);
  return list.length > 1 ? { religion: list[0], religionFilter: list.join(',') } : { religion: list[0] ?? null };
}

export type ResultLinkProblem = { kind: 'empty' } | { kind: 'missing'; keys: string[] } | { kind: 'invalid'; keys: string[] };

export type ResultLinkParse = ({ ok: true } & PersonResult) | { ok: false; problem: ResultLinkProblem };

/**
 * Lê o link de resultado de qualquer jeito que a pessoa o cole: URL completa, só o caminho
 * (/results?est=...), só a query (?est=... ou est=...), com #âncora, com &amp; ou com espaços em volta.
 * Só importa o que vem depois do "?": domínio, caminho e idioma são ignorados e a ordem das chaves
 * não conta. Chaves desconhecidas passam; faltar um eixo ou trazer valor fora de 0 a 100 é erro.
 */
export function parseResultLink(raw: string): ResultLinkParse {
  const text = raw.trim().replace(/&amp;/gi, '&').replace(/#.*$/, '');
  if (!text) return { ok: false, problem: { kind: 'empty' } };
  const query = text.includes('?') ? text.slice(text.indexOf('?') + 1) : text;
  const params = new URLSearchParams(query);
  const byKey = new Map<string, string>();
  params.forEach((value, key) => byKey.set(key.trim().toLowerCase(), value.trim()));

  const missing = RESULT_URL_KEYS.filter((key) => !byKey.get(key));
  if (missing.length > 0) return { ok: false, problem: { kind: 'missing', keys: missing } };

  const values = RESULT_URL_KEYS.map((key) => Number((byKey.get(key) ?? '').replace(',', '.')));
  const invalid = RESULT_URL_KEYS.filter((_, index) => !Number.isFinite(values[index]) || values[index] < 0 || values[index] > 100);
  if (invalid.length > 0) return { ok: false, problem: { kind: 'invalid', keys: invalid } };

  return { ok: true, values, religion: parseReligion(byKey.get('religion')) };
}

export interface PeopleCompareLink {
  names: [string, string];
  people: [PersonResult, PersonResult];
}

const round1 = (value: number): number => Math.round(value * 10) / 10;

function parseVector(raw: string | null): number[] | null {
  const values = (raw ?? '').split(',').map((part) => Number(part));
  if (values.length !== RESULT_URL_KEYS.length) return null;
  return values.every((value) => Number.isFinite(value) && value >= 0 && value <= 100) ? values : null;
}

export function cleanName(raw: string | null | undefined, fallback: string): string {
  return (raw ?? '').trim().replace(/\s+/g, ' ').slice(0, MAX_NAME_LENGTH) || fallback;
}

/** "E" para "Enzo"; "EX" para "Enzo Xavier" (e para mais de duas palavras, só as duas primeiras). */
export function personInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return words.map((word) => Array.from(word)[0]).join('').toUpperCase() || '?';
}

/** Primeiro nome, para as etiquetas pequenas ("Enzo" para "Enzo Xavier Santos"). */
export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}

export function peopleCompareUrl({ names, people }: PeopleCompareLink): string {
  const params = new URLSearchParams();
  params.set('an', names[0]);
  params.set('a', people[0].values.map(round1).join(','));
  if (religionPreference(people[0])) params.set('ra', religionPreference(people[0]) as string);
  params.set('bn', names[1]);
  params.set('b', people[1].values.map(round1).join(','));
  if (religionPreference(people[1])) params.set('rb', religionPreference(people[1]) as string);
  return `${PEOPLE_COMPARE_PATH}?${params.toString()}`;
}

/** Null quando o link não traz os dois vetores completos. */
export function parsePeopleCompareUrl(search: string, fallbackNames: [string, string]): PeopleCompareLink | null {
  const params = new URLSearchParams(search);
  const first = parseVector(params.get('a'));
  const second = parseVector(params.get('b'));
  if (!first || !second) return null;
  return {
    names: [cleanName(params.get('an'), fallbackNames[0]), cleanName(params.get('bn'), fallbackNames[1])],
    people: [
      { values: first, ...personReligion(params.get('ra')) },
      { values: second, ...personReligion(params.get('rb')) }
    ]
  };
}

// Compatibilidade entre dois vetores: mesma fórmula do backend (ProfileMatchScorer.compatibility), para
// "você × outra pessoa" bater com o resto do site sem precisar de um endpoint novo.
const CENTER = 50;
const AXIS_SPREAD = 50;
const AXIS_WEIGHT = 0.42;
const DIRECTION_WEIGHT = 0.33;
const MAGNITUDE_WEIGHT = 0.18;
const OUTLIER_WEIGHT = 0.07;
const OPPOSITE_SIDE_MAX_PENALTY = 0.45;
const OPPOSITE_SIDE_SPREAD = 25;
const OUTLIER_FULL_SPREAD = 100;
const OUTLIER_EXPONENT = 2.5;
const DIRECTION_AUGMENT_RADIUS = 8;

export function pairCompatibility(first: number[], second: number[]): number {
  const size = Math.min(first.length, second.length);
  let axisTotal = 0;
  let dot = 0;
  let firstNorm = 0;
  let secondNorm = 0;
  let firstIntensity = 0;
  let secondIntensity = 0;
  let maxDiff = 0;
  for (let i = 0; i < size; i += 1) {
    const a = first[i];
    const b = second[i];
    const diff = Math.abs(a - b);
    let similarity = Math.max(0, 1 - (diff / AXIS_SPREAD) ** 2);
    if ((a - CENTER) * (b - CENTER) < 0) {
      similarity *=
        1 -
        OPPOSITE_SIDE_MAX_PENALTY *
          Math.tanh(Math.abs(a - CENTER) / OPPOSITE_SIDE_SPREAD) *
          Math.tanh(Math.abs(b - CENTER) / OPPOSITE_SIDE_SPREAD);
    }
    axisTotal += similarity;
    dot += (a - CENTER) * (b - CENTER);
    firstNorm += (a - CENTER) ** 2;
    secondNorm += (b - CENTER) ** 2;
    firstIntensity += Math.abs(a - CENTER);
    secondIntensity += Math.abs(b - CENTER);
    maxDiff = Math.max(maxDiff, diff);
  }
  const augment = size * DIRECTION_AUGMENT_RADIUS * DIRECTION_AUGMENT_RADIUS;
  const cosine = (dot + augment) / Math.sqrt((firstNorm + augment) * (secondNorm + augment));
  const axisSimilarity = (100 * axisTotal) / size;
  const directionSimilarity = CENTER + CENTER * cosine;
  const magnitudeSimilarity = 100 - 2 * Math.abs(firstIntensity / size - secondIntensity / size);
  const outlierSimilarity = 100 * Math.max(0, 1 - (maxDiff / OUTLIER_FULL_SPREAD) ** OUTLIER_EXPONENT);
  const score =
    AXIS_WEIGHT * axisSimilarity +
    DIRECTION_WEIGHT * directionSimilarity +
    MAGNITUDE_WEIGHT * magnitudeSimilarity +
    OUTLIER_WEIGHT * outlierSimilarity;
  return round1(Math.max(0, Math.min(100, score)));
}

/** Vetor médio das duas pessoas, para achar a ideologia que têm em comum. */
export function midpoint(first: number[], second: number[]): number[] {
  return first.map((value, index) => round1((value + second[index]) / 2));
}
