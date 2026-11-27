// Cópia fiel de QuizController.computeResult: o mesmo QuizResult que /api/results/by-axes devolveria para um vetor,
// calculado sem o backend, para as páginas estáticas da wiki.

import type {
  AxisResult,
  CountryMatch,
  IdeologyMatch,
  PartyMatch,
  PersonalityCategory,
  PersonalityMatch,
  QuizResult
} from '../../types/quiz';
import { axisDimensions, bottomOf, IDEOLOGY_TOP, PERSONALITY_TOP, COUNTRY_TOP, PARTY_TOP, personalityDimensions, rankCatalog, type Ranked } from './matchers.ts';
import { rankOutliers, strongestTension, type AxisText } from './outliers.ts';
import { normalizeReligion } from './religion.ts';
import { round1, type Vector } from './score.ts';
import { resolveValues, type ValueCategory, type ValueText } from './values.ts';

export type Lang = 'pt' | 'en' | 'es' | 'de' | 'it' | 'fr' | 'ru';

export interface IdeologyItem { id: string; name: string; category: string; description: string; phrase?: string; religions?: string[] }
export interface PersonalityItem {
  id: string; name: string; role: string; category: string; lifespan: string; description: string;
  imagePath: string; imageSourceName?: string; imageSourceUrl?: string; imageNote?: string; religions?: string[];
}
export interface CountryItem {
  id: string; name: string; category: string; description: string; flagPath: string; flagKind?: string;
  flagSourceName?: string; flagSourceUrl?: string; flagNote?: string; historical?: boolean; period?: string; religions?: string[];
}
export interface PartyItem {
  id: string; name: string; category: string; description: string; logoPath: string; logoSourceName?: string;
  logoSourceUrl?: string; logoNote?: string; countryId: string; countryName: string; countryFlagPath: string;
  historical?: boolean; period?: string; religions?: string[];
}

/** Catálogos já no idioma da página, na ordem dos JSONs (a ordem decide empates e os exemplos da tensão). */
export interface WikiCatalogs {
  lang: Lang;
  axes: AxisText[];
  ideologies: IdeologyItem[];
  personalities: PersonalityItem[];
  countries: CountryItem[];
  parties: PartyItem[];
  vectors: { ideology: Map<string, Vector>; personality: Map<string, Vector>; country: Map<string, Vector>; party: Map<string, Vector> };
  /** Ids na ordem de ideology-profiles.json (AxisOutlierService e AxisTensionService iteram nessa ordem). */
  ideologyProfileOrder: string[];
  valueCategories: ValueCategory[];
  /** Textos dos valores no idioma (null em pt) e em inglês (o reserva do backend). */
  valueText: ValueText | null;
  valueEnglish: ValueText;
}

/** Percentis que o backend também devolve, guardados à parte só para o teste de paridade. */
export const PERCENTILE = Symbol('percentile');
type WithPercentile<T> = T & { [PERCENTILE]?: number };

const INTENSITY: Record<Lang, string[]> = {
  pt: ['Equilibrado', 'Inclinado', 'Forte', 'Muito forte'],
  en: ['Balanced', 'Leaning', 'Strong', 'Very strong'],
  es: ['Equilibrado', 'Inclinado', 'Fuerte', 'Muy fuerte'],
  fr: ['Équilibré', 'Tendance', 'Fort', 'Très fort'],
  ru: ['Сбалансированно', 'Умеренно', 'Сильно', 'Очень сильно'],
  it: ['Equilibrato', 'Tendente', 'Forte', 'Molto forte'],
  de: ['Ausgeglichen', 'Tendenz', 'Stark', 'Sehr stark']
};

/** ScoringService.scoreFromLeftPercents: um AxisResult por eixo, na ordem de axes.json. */
export function axisResults(vector: Vector, catalogs: WikiCatalogs): AxisResult[] {
  return catalogs.axes.map((axis) => {
    const raw = vector[axis.id];
    if (raw == null) throw new Error(`vetor sem o eixo ${axis.id}`);
    const leftPercent = round1(Math.max(0, Math.min(100, raw)));
    const rightPercent = round1(100 - leftPercent);
    const distance = Math.abs(leftPercent - 50);
    const level = distance < 7.5 ? 0 : distance < 22.5 ? 1 : distance < 37.5 ? 2 : 3;
    return {
      axisId: axis.id,
      label: axis.label,
      leftPole: axis.leftPole,
      rightPole: axis.rightPole,
      leftPercent,
      rightPercent,
      dominantPole: leftPercent >= rightPercent ? axis.leftPole : axis.rightPole,
      intensity: INTENSITY[catalogs.lang][level]
    };
  });
}

// ── descrições das ideologias (IdeologyMatcherService.shortDescription / longDescription) ──

const COMPATIBILITY_NOTE: Record<Lang, string> = {
  fr: ' La compatibilité indique à quel point vos réponses se rapprochent de ce profil.',
  ru: ' Совместимость показывает, насколько ваши ответы близки к этому профилю.',
  it: ' La compatibilità indica quanto le tue risposte sono vicine a questo profilo.',
  de: ' Die Übereinstimmung zeigt, wie nah deine Antworten an diesem Profil liegen.',
  es: ' La compatibilidad indica cuán cerca están tus respuestas de este perfil.',
  en: ' Compatibility indicates how close your answers are to this profile.',
  pt: ' A compatibilidade indica proximidade entre suas respostas e esse perfil.'
};

function cleanDescription(raw: string | undefined): string {
  let description = (raw ?? '').trim().replace(/\s+/g, ' ');
  const note = description.indexOf('NOTA METODOLÓGICA');
  if (note >= 0) description = description.slice(0, note).trim();
  return description;
}

function normalizeField(value: string): string {
  if (!value || !value.trim()) return 'variável conforme o contexto';
  return value.slice(0, 1).toLowerCase() + value.slice(1);
}

function splitDescription(clean: string) {
  const split = clean.split(/\s+Politicamente:/);
  const summary = split[0].trim();
  if (split.length === 1) return { summary, political: '', economic: '', social: '', empty: true };
  const rest = split.slice(1).join(' Politicamente:');
  const fields = rest.split(/\s+\|\s+/);
  const political = normalizeField((fields[0] ?? '').trim());
  const economic = normalizeField((fields[1] ?? '').replace(/^Economicamente:\s*/, '').trim());
  const social = normalizeField((fields[2] ?? '').replace(/^Socialmente:\s*/, '').trim());
  return { summary, political, economic, social, empty: false };
}

function abbreviate(value: string, max: number): string {
  if (value.length <= max) return value;
  let cut = value.lastIndexOf(' ', max - 1);
  if (cut < Math.floor(max / 2)) cut = max - 1;
  return value.slice(0, cut).trim() + '...';
}

export function shortDescription(raw: string | undefined): string {
  const parts = splitDescription(cleanDescription(raw));
  const sentences = parts.summary.split(/(?<=[.!?])\s+/);
  let summary = sentences.length === 0 ? parts.summary : sentences[0];
  if (sentences.length > 1 && summary.length < 140) summary = summary + ' ' + sentences[1];
  return abbreviate(summary, 230);
}

export function longDescription(raw: string | undefined, lang: Lang): string {
  const parts = splitDescription(cleanDescription(raw));
  let description = parts.summary;
  if (!parts.summary.endsWith('.')) description += '.';
  description += COMPATIBILITY_NOTE[lang];
  if (!parts.empty) {
    description +=
      lang !== 'pt'
        ? ` In practical terms: political values and form of government tend to be ${parts.political}; the economy tends to be ${parts.economic}; social norms tend to be ${parts.social}.`
        : ` Em termos práticos: valores políticos e forma de governo tendem a ser ${parts.political}; economia tende a ser ${parts.economic}; normas sociais tendem a ser ${parts.social}.`;
  }
  return description;
}

// ── conversões para os tipos do front ──

function ideologyMatch(ranked: Ranked<IdeologyItem>, lang: Lang): WithPercentile<IdeologyMatch> {
  const { item } = ranked;
  return {
    ideologyId: item.id,
    name: item.name,
    category: item.category,
    description: shortDescription(item.description),
    longDescription: longDescription(item.description, lang),
    phrase: item.phrase ?? '',
    compatibility: ranked.compatibility,
    [PERCENTILE]: ranked.percentile
  };
}

function personalityMatch(ranked: Ranked<PersonalityItem>, vectors: Map<string, Vector>): WithPercentile<PersonalityMatch> {
  const { item } = ranked;
  return {
    personalityId: item.id,
    name: item.name,
    role: item.role,
    category: item.category as PersonalityCategory,
    lifespan: item.lifespan,
    description: item.description,
    imagePath: item.imagePath,
    imageSourceName: item.imageSourceName,
    imageSourceUrl: item.imageSourceUrl,
    imageNote: item.imageNote,
    compatibility: ranked.compatibility,
    vector: vectors.get(item.id),
    spectrum: null,
    [PERCENTILE]: ranked.percentile
  };
}

function countryMatch(ranked: Ranked<CountryItem>, vectors: Map<string, Vector>): WithPercentile<CountryMatch> {
  const { item } = ranked;
  return {
    countryId: item.id,
    name: item.name,
    category: item.category,
    description: item.description,
    flagPath: item.flagPath,
    flagKind: item.flagKind,
    flagSourceName: item.flagSourceName,
    flagSourceUrl: item.flagSourceUrl,
    flagNote: item.flagNote,
    historical: Boolean(item.historical),
    period: item.period ?? '',
    compatibility: ranked.compatibility,
    vector: vectors.get(item.id),
    [PERCENTILE]: ranked.percentile
  };
}

function partyMatch(ranked: Ranked<PartyItem>, vectors: Map<string, Vector>): WithPercentile<PartyMatch> {
  const { item } = ranked;
  return {
    partyId: item.id,
    name: item.name,
    category: item.category,
    description: item.description,
    logoPath: item.logoPath,
    logoSourceName: item.logoSourceName,
    logoSourceUrl: item.logoSourceUrl,
    logoNote: item.logoNote,
    countryId: item.countryId,
    countryName: item.countryName,
    countryFlagPath: item.countryFlagPath,
    historical: Boolean(item.historical),
    period: item.period ?? '',
    compatibility: ranked.compatibility,
    vector: vectors.get(item.id),
    [PERCENTILE]: ranked.percentile
  };
}

/** O QuizResult de /api/results/by-axes para este vetor e religião (livros e eleições ficam vazios). */
export function computeResult(vector: Vector, rawReligion: string | null, catalogs: WikiCatalogs): QuizResult {
  const religion = normalizeReligion(rawReligion);
  const axes = axisResults(vector, catalogs);
  const user: Vector = Object.fromEntries(axes.map((axis) => [axis.axisId, axis.leftPercent]));
  const { vectors, lang } = catalogs;

  const ideologies = rankCatalog(user, catalogs.ideologies, vectors.ideology, religion);
  if (ideologies.length === 0) throw new Error('Nenhuma ideologia disponivel para matching');
  const matches = ideologies.slice(0, IDEOLOGY_TOP).map((ranked) => ideologyMatch(ranked, lang));

  const people = rankCatalog(user, catalogs.personalities, vectors.personality, religion);
  const personalityMatches = people.slice(0, PERSONALITY_TOP).map((ranked) => personalityMatch(ranked, vectors.personality));
  const topPersonality = personalityMatches[0];

  const countries = rankCatalog(user, catalogs.countries, vectors.country, religion);
  const topCountry = countries.find((ranked) => !ranked.item.historical);
  const topHistoricalCountry = countries.find((ranked) => Boolean(ranked.item.historical));
  if (!topCountry || !topHistoricalCountry) throw new Error('Nenhum pais disponivel para matching');

  const parties = rankCatalog(user, catalogs.parties, vectors.party, religion);
  const topParty = parties.find((ranked) => !ranked.item.historical) ?? null;
  const topHistoricalParty = parties.find((ranked) => Boolean(ranked.item.historical)) ?? null;
  const excludedParties = [topParty?.item.id, topHistoricalParty?.item.id].filter((id): id is string => Boolean(id));

  const outliers = rankOutliers(axes, catalogs.axes, catalogs.ideologyProfileOrder.map((id) => vectors.ideology.get(id)!).filter(Boolean));
  const ideologyNames = new Map(catalogs.ideologies.map((ideology) => [ideology.id, ideology.name]));

  return {
    axes,
    topMatch: matches[0],
    matches,
    bottomIdeologyMatch: ideologyMatch(ideologies[ideologies.length - 1], lang),
    topCountryMatch: countryMatch(topCountry, vectors.country),
    topCountryMatches: countries.slice(0, COUNTRY_TOP).map((ranked) => countryMatch(ranked, vectors.country)),
    topHistoricalCountryMatch: countryMatch(topHistoricalCountry, vectors.country),
    countryDimensionMatches: axisDimensions(user, catalogs.countries, vectors.country, religion, [topCountry.item.id, topHistoricalCountry.item.id]).map(
      ({ dimension, ranked }) => ({ dimension, match: countryMatch(ranked, vectors.country) })
    ),
    bottomCountryMatches: bottomOf(countries).map((ranked) => countryMatch(ranked, vectors.country)),
    topPersonalityMatch: topPersonality,
    personalityMatches,
    dimensionMatches: personalityDimensions(user, catalogs.personalities, vectors.personality, religion, topPersonality?.personalityId ?? null).map(
      ({ dimension, ranked }) => ({ dimension, match: personalityMatch(ranked, vectors.personality) })
    ),
    bottomPersonalityMatches: bottomOf(people).map((ranked) => personalityMatch(ranked, vectors.personality)),
    mostUnusualAxis: outliers[0],
    mostCommonAxis: outliers[outliers.length - 1],
    axisTension: strongestTension(
      user,
      catalogs.axes,
      catalogs.ideologyProfileOrder.map((id) => ({ name: ideologyNames.get(id) ?? null, vector: vectors.ideology.get(id)! }))
    ),
    bookRecommendations: [],
    topPartyMatch: topParty ? partyMatch(topParty, vectors.party) : undefined,
    topPartyMatches: parties.slice(0, PARTY_TOP).map((ranked) => partyMatch(ranked, vectors.party)),
    topHistoricalPartyMatch: topHistoricalParty ? partyMatch(topHistoricalParty, vectors.party) : undefined,
    partyDimensionMatches: axisDimensions(user, catalogs.parties, vectors.party, religion, excludedParties).map(({ dimension, ranked }) => ({
      dimension,
      match: partyMatch(ranked, vectors.party)
    })),
    bottomPartyMatches: bottomOf(parties).map((ranked) => partyMatch(ranked, vectors.party)),
    politicalValues: resolveValues(catalogs.valueCategories, user, religion, catalogs.valueText, catalogs.valueEnglish),
    elections: []
  };
}
