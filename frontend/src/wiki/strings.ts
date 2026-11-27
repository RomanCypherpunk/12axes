// Textos da wiki. As seções vêm da página de resultados, que fala com "você"; aqui elas passam a falar do perfil
// (terceira pessoa), sobrescrevendo só as chaves que mudam. O resto do dicionário continua o dos resultados.
// A distinção compara o perfil com o próprio catálogo dele, então as frases citam o catálogo certo.

import type { Strings } from '../i18n';

export type WikiLang = 'pt' | 'en' | 'es' | 'de' | 'it' | 'fr' | 'ru';
export type WikiKind = 'personality' | 'ideology' | 'country' | 'party';

const pct = (value: number): number => Math.round(value);
const low = (text: string): string => text.toLowerCase();

/** Como cada idioma se refere a um catálogo nas frases da distinção. */
interface Noun {
  /** "personalidades", no plural, para "Só 3 de 741 personalidades". */
  plural: string;
  /** "das personalidades", para "84% das personalidades". */
  of: string;
  /** "Nenhuma personalidade". */
  none: string;
  /** Rótulo da mediana na régua. */
  median: string;
  /** Concordância de "Seuls/Seules" (francês). */
  only?: string;
}

const NOUNS: Record<WikiLang, Record<WikiKind, Noun>> = {
  pt: {
    personality: { plural: 'personalidades', of: 'das personalidades', none: 'Nenhuma personalidade', median: 'Mediana das personalidades' },
    ideology: { plural: 'ideologias', of: 'das ideologias', none: 'Nenhuma ideologia', median: 'Mediana das ideologias' },
    country: { plural: 'países', of: 'dos países', none: 'Nenhum país', median: 'Mediana dos países' },
    party: { plural: 'partidos', of: 'dos partidos', none: 'Nenhum partido', median: 'Mediana dos partidos' }
  },
  en: {
    personality: { plural: 'figures', of: 'of the figures', none: 'No figure', median: 'Figure median' },
    ideology: { plural: 'ideologies', of: 'of the ideologies', none: 'No ideology', median: 'Ideology median' },
    country: { plural: 'countries', of: 'of the countries', none: 'No country', median: 'Country median' },
    party: { plural: 'parties', of: 'of the parties', none: 'No party', median: 'Party median' }
  },
  es: {
    personality: { plural: 'personalidades', of: 'de las personalidades', none: 'Ninguna personalidad', median: 'Mediana de las personalidades' },
    ideology: { plural: 'ideologías', of: 'de las ideologías', none: 'Ninguna ideología', median: 'Mediana de las ideologías' },
    country: { plural: 'países', of: 'de los países', none: 'Ningún país', median: 'Mediana de los países' },
    party: { plural: 'partidos', of: 'de los partidos', none: 'Ningún partido', median: 'Mediana de los partidos' }
  },
  de: {
    personality: { plural: 'Persönlichkeiten', of: 'der Persönlichkeiten', none: 'Keine Persönlichkeit', median: 'Median der Persönlichkeiten' },
    ideology: { plural: 'Ideologien', of: 'der Ideologien', none: 'Keine Ideologie', median: 'Median der Ideologien' },
    country: { plural: 'Länder', of: 'der Länder', none: 'Kein Land', median: 'Median der Länder' },
    party: { plural: 'Parteien', of: 'der Parteien', none: 'Keine Partei', median: 'Median der Parteien' }
  },
  it: {
    personality: { plural: 'personalità', of: 'delle personalità', none: 'Nessuna personalità', median: 'Mediana delle personalità' },
    ideology: { plural: 'ideologie', of: 'delle ideologie', none: 'Nessuna ideologia', median: 'Mediana delle ideologie' },
    country: { plural: 'paesi', of: 'dei paesi', none: 'Nessun paese', median: 'Mediana dei paesi' },
    party: { plural: 'partiti', of: 'dei partiti', none: 'Nessun partito', median: 'Mediana dei partiti' }
  },
  fr: {
    personality: { plural: 'personnalités', of: 'des personnalités', none: 'Aucune personnalité', median: 'Médiane des personnalités', only: 'Seules' },
    ideology: { plural: 'idéologies', of: 'des idéologies', none: 'Aucune idéologie', median: 'Médiane des idéologies', only: 'Seules' },
    country: { plural: 'pays', of: 'des pays', none: 'Aucun pays', median: 'Médiane des pays', only: 'Seuls' },
    party: { plural: 'partis', of: 'des partis', none: 'Aucun parti', median: 'Médiane des partis', only: 'Seuls' }
  },
  ru: {
    personality: { plural: 'личностей', of: 'личностей', none: 'Ни одна личность', median: 'Медиана личностей' },
    ideology: { plural: 'идеологий', of: 'идеологий', none: 'Ни одна идеология', median: 'Медиана идеологий' },
    country: { plural: 'стран', of: 'стран', none: 'Ни одна страна', median: 'Медиана стран' },
    party: { plural: 'партий', of: 'партий', none: 'Ни одна партия', median: 'Медиана партий' }
  }
};

type Perspective = (n: string, k: Noun) => Partial<Strings>;

const PERSPECTIVE: Record<WikiLang, Perspective> = {
  pt: (n, k) => ({
    areasGeneralTitle: 'Compatibilidade geral',
    resultsNavAreas: 'Compatibilidade',
    axesSectionTitle: 'Perfil nos 12 eixos',
    signatureTitle: `O que distingue ${n}`,
    signatureUnusualLabel: 'Posição mais incomum',
    signatureCommonLabel: 'Posição mais comum',
    signatureMedian: k.median,
    signatureUnusualLead: (pole, percent) => `${n} puxa mais para ${low(pole)} que ${pct(percent)}% ${k.of} do catálogo.`,
    signatureUnusualLeadMax: (pole) => `${k.none} do catálogo puxa tanto para ${low(pole)} quanto ${n}.`,
    signatureUnusualLeadBalanced: (axis, pole, percent) =>
      `A posição de ${n} em ${axis} é de meio-termo. Mesmo assim, fica mais para ${low(pole)} que ${pct(percent)}% ${k.of} do catálogo.`,
    signatureCommonNote: (pole) => `Aqui ${n} está em terreno comum: não puxa para ${low(pole)} nem para o polo oposto.`,
    signatureCommonNoteBalanced: (axis) => `${n} fica no centro em ${axis}, e o catálogo também. É onde o perfil menos se distingue.`,
    signatureYou: n,
    signatureBigCap: (pole) => `${k.of} puxam menos que ${n} para ${low(pole)}.`,
    tensionLabel: 'Tensão interna',
    tensionUnique: `${k.none} do catálogo junta essas duas posições.`,
    tensionRareShort: (count, total) => `Só ${count} de ${total} ${k.plural} juntam essas duas posições.`,
    closenessYou: n,
    countriesSectionTitle: 'Países mais próximos',
    personalitiesSectionTitle: 'Personalidades mais próximas',
    partiesSectionTitle: 'Partidos mais próximos',
    valuesSectionTitle: 'Valores aproximados'
  }),
  en: (n, k) => ({
    areasGeneralTitle: 'Overall compatibility',
    resultsNavAreas: 'Compatibility',
    axesSectionTitle: 'Profile on the 12 axes',
    signatureTitle: `What sets ${n} apart`,
    signatureUnusualLabel: 'Most unusual position',
    signatureCommonLabel: 'Most typical position',
    signatureMedian: k.median,
    signatureUnusualLead: (pole, percent) => `${n} leans further toward ${low(pole)} than ${pct(percent)}% ${k.of} in the catalog.`,
    signatureUnusualLeadMax: (pole) => `${k.none} in the catalog leans as far toward ${low(pole)} as ${n}.`,
    signatureUnusualLeadBalanced: (axis, pole, percent) =>
      `${n}'s position on ${axis} is middle of the road. Even so, it sits further toward ${low(pole)} than ${pct(percent)}% ${k.of} in the catalog.`,
    signatureCommonNote: (pole) => `This is common ground: ${n} leans neither toward ${low(pole)} nor to the opposite pole.`,
    signatureCommonNoteBalanced: (axis) => `${n} sits at the centre on ${axis}, and so does the catalog. This is where the profile stands out least.`,
    signatureYou: n,
    signatureBigCap: (pole) => `${k.of} lean less toward ${low(pole)} than ${n}.`,
    tensionLabel: 'Internal tension',
    tensionUnique: `${k.none} in the catalog holds both of these positions.`,
    tensionRareShort: (count, total) => `Only ${count} of ${total} ${k.plural} hold both of these positions.`,
    closenessYou: n,
    countriesSectionTitle: 'Closest countries',
    personalitiesSectionTitle: 'Closest figures',
    partiesSectionTitle: 'Closest parties',
    valuesSectionTitle: 'Approximate values'
  }),
  es: (n, k) => ({
    areasGeneralTitle: 'Compatibilidad general',
    resultsNavAreas: 'Compatibilidad',
    axesSectionTitle: 'Perfil en los 12 ejes',
    signatureTitle: `Lo que distingue a ${n}`,
    signatureUnusualLabel: 'Posición más inusual',
    signatureCommonLabel: 'Posición más común',
    signatureMedian: k.median,
    signatureUnusualLead: (pole, percent) => `${n} tira más hacia ${low(pole)} que el ${pct(percent)}% ${k.of} del catálogo.`,
    signatureUnusualLeadMax: (pole) => `${k.none} del catálogo tira tanto hacia ${low(pole)} como ${n}.`,
    signatureUnusualLeadBalanced: (axis, pole, percent) =>
      `La posición de ${n} en ${axis} es intermedia. Aun así, queda más hacia ${low(pole)} que el ${pct(percent)}% ${k.of} del catálogo.`,
    signatureCommonNote: (pole) => `Aquí ${n} está en terreno común: no tira hacia ${low(pole)} ni hacia el polo opuesto.`,
    signatureCommonNoteBalanced: (axis) => `${n} queda en el centro en ${axis}, y el catálogo también. Es donde el perfil menos se distingue.`,
    signatureYou: n,
    signatureBigCap: (pole) => `${k.of} tiran menos que ${n} hacia ${low(pole)}.`,
    tensionLabel: 'Tensión interna',
    tensionUnique: `${k.none} del catálogo mantiene ambas posiciones.`,
    tensionRareShort: (count, total) => `Solo ${count} de ${total} ${k.plural} mantienen ambas posiciones.`,
    closenessYou: n,
    countriesSectionTitle: 'Países más cercanos',
    personalitiesSectionTitle: 'Personalidades más cercanas',
    partiesSectionTitle: 'Partidos más cercanos',
    valuesSectionTitle: 'Valores aproximados'
  }),
  de: (n, k) => ({
    areasGeneralTitle: 'Gesamtübereinstimmung',
    resultsNavAreas: 'Übereinstimmung',
    axesSectionTitle: 'Profil auf den 12 Achsen',
    signatureTitle: `Was ${n} auszeichnet`,
    signatureUnusualLabel: 'Ungewöhnlichste Position',
    signatureCommonLabel: 'Typischste Position',
    signatureMedian: k.median,
    signatureUnusualLead: (pole, percent) => `${n} neigt stärker zu ${pole} als ${pct(percent)} % ${k.of} im Katalog.`,
    signatureUnusualLeadMax: (pole) => `${k.none} im Katalog neigt so stark zu ${pole} wie ${n}.`,
    signatureUnusualLeadBalanced: (axis, pole, percent) =>
      `Bei ${axis} liegt ${n} in der Mitte. Trotzdem steht die Position näher an ${pole} als ${pct(percent)} % ${k.of} im Katalog.`,
    signatureCommonNote: (pole) => `Hier ist ${n} auf gemeinsamem Boden: weder zu ${pole} noch zum Gegenpol geneigt.`,
    signatureCommonNoteBalanced: (axis) => `${n} liegt bei ${axis} in der Mitte, wie auch der Katalog. Hier hebt sich das Profil am wenigsten ab.`,
    signatureYou: n,
    signatureBigCap: (pole) => `${k.of} neigen weniger zu ${pole} als ${n}.`,
    tensionLabel: 'Innere Spannung',
    tensionUnique: `${k.none} im Katalog vertritt beide dieser Positionen.`,
    tensionRareShort: (count, total) => `Nur ${count} von ${total} ${k.plural} vertreten beide dieser Positionen.`,
    closenessYou: n,
    countriesSectionTitle: 'Nächste Länder',
    personalitiesSectionTitle: 'Nächste Persönlichkeiten',
    partiesSectionTitle: 'Nächste Parteien',
    valuesSectionTitle: 'Ungefähre Werte'
  }),
  it: (n, k) => ({
    areasGeneralTitle: 'Compatibilità generale',
    resultsNavAreas: 'Compatibilità',
    axesSectionTitle: 'Profilo sui 12 assi',
    signatureTitle: `Cosa distingue ${n}`,
    signatureUnusualLabel: 'Posizione più insolita',
    signatureCommonLabel: 'Posizione più comune',
    signatureMedian: k.median,
    signatureUnusualLead: (pole, percent) => `${n} tende verso ${low(pole)} più del ${pct(percent)}% ${k.of} del catalogo.`,
    signatureUnusualLeadMax: (pole) => `${k.none} del catalogo tende verso ${low(pole)} quanto ${n}.`,
    signatureUnusualLeadBalanced: (axis, pole, percent) =>
      `La posizione di ${n} su ${axis} è intermedia. Anche così, è più verso ${low(pole)} del ${pct(percent)}% ${k.of} del catalogo.`,
    signatureCommonNote: (pole) => `Qui ${n} è su un terreno comune: non tende verso ${low(pole)} né verso il polo opposto.`,
    signatureCommonNoteBalanced: (axis) => `${n} sta al centro su ${axis}, e così il catalogo. È dove il profilo si distingue meno.`,
    signatureYou: n,
    signatureBigCap: (pole) => `${k.of} tendono verso ${low(pole)} meno di ${n}.`,
    tensionLabel: 'Tensione interna',
    tensionUnique: `${k.none} del catalogo sostiene entrambe queste posizioni.`,
    tensionRareShort: (count, total) => `Solo ${count} ${k.plural} su ${total} sostengono entrambe queste posizioni.`,
    closenessYou: n,
    countriesSectionTitle: 'Paesi più vicini',
    personalitiesSectionTitle: 'Personalità più vicine',
    partiesSectionTitle: 'Partiti più vicini',
    valuesSectionTitle: 'Valori approssimativi'
  }),
  fr: (n, k) => ({
    areasGeneralTitle: 'Compatibilité générale',
    resultsNavAreas: 'Compatibilité',
    axesSectionTitle: 'Profil sur les 12 axes',
    signatureTitle: `Ce qui distingue ${n}`,
    signatureUnusualLabel: 'Position la plus inhabituelle',
    signatureCommonLabel: 'Position la plus courante',
    signatureMedian: k.median,
    signatureUnusualLead: (pole, percent) => `${n} penche davantage vers ${low(pole)} que ${pct(percent)} % ${k.of} du catalogue.`,
    signatureUnusualLeadMax: (pole) => `${k.none} du catalogue ne penche autant vers ${low(pole)} que ${n}.`,
    signatureUnusualLeadBalanced: (axis, pole, percent) =>
      `Sur ${axis}, la position de ${n} est médiane. Elle reste malgré tout plus proche de ${low(pole)} que ${pct(percent)} % ${k.of} du catalogue.`,
    signatureCommonNote: (pole) => `Ici, ${n} est en terrain commun : ni vers ${low(pole)} ni vers le pôle opposé.`,
    signatureCommonNoteBalanced: (axis) => `${n} se situe au centre sur ${axis}, comme le catalogue. C’est là que le profil se distingue le moins.`,
    signatureYou: n,
    signatureBigCap: (pole) => `${k.of} penchent moins que ${n} vers ${low(pole)}.`,
    tensionLabel: 'Tension interne',
    tensionUnique: `${k.none} du catalogue ne tient ces deux positions.`,
    tensionRareShort: (count, total) => `${k.only ?? 'Seuls'} ${count} ${k.plural} sur ${total} tiennent ces deux positions.`,
    closenessYou: n,
    countriesSectionTitle: 'Pays les plus proches',
    personalitiesSectionTitle: 'Personnalités les plus proches',
    partiesSectionTitle: 'Partis les plus proches',
    valuesSectionTitle: 'Valeurs approximatives'
  }),
  ru: (n, k) => ({
    areasGeneralTitle: 'Общая совместимость',
    resultsNavAreas: 'Совместимость',
    axesSectionTitle: 'Профиль по 12 осям',
    signatureTitle: `Чем выделяется ${n}`,
    signatureUnusualLabel: 'Самая необычная позиция',
    signatureCommonLabel: 'Самая типичная позиция',
    signatureMedian: k.median,
    signatureUnusualLead: (pole, percent) => `${n}: сильнее тяготеет к полюсу «${low(pole)}», чем ${pct(percent)}% ${k.of} каталога.`,
    signatureUnusualLeadMax: (pole) => `${k.none} каталога не тяготеет к полюсу «${low(pole)}» так сильно. ${n} — дальше всех.`,
    signatureUnusualLeadBalanced: (axis, pole, percent) =>
      `${n}: по оси «${axis}» позиция срединная. И всё же она ближе к полюсу «${low(pole)}», чем у ${pct(percent)}% ${k.of} каталога.`,
    signatureCommonNote: (pole) => `${n}: здесь общая почва — ни к полюсу «${low(pole)}», ни к противоположному.`,
    signatureCommonNoteBalanced: (axis) => `${n}: в центре по оси «${axis}», как и каталог. Здесь профиль выделяется меньше всего.`,
    signatureYou: n,
    signatureBigCap: (pole) => `${k.of} тяготеют к полюсу «${low(pole)}» слабее.`,
    tensionLabel: 'Внутреннее противоречие',
    tensionUnique: `${k.none} каталога не разделяет обе эти позиции.`,
    tensionRareShort: (count, total) => `Обе эти позиции разделяют лишь ${count} из ${total} ${k.plural}.`,
    closenessYou: n,
    countriesSectionTitle: 'Ближайшие страны',
    personalitiesSectionTitle: 'Ближайшие личности',
    partiesSectionTitle: 'Ближайшие партии',
    valuesSectionTitle: 'Примерные ценности'
  })
};

// Fichas da bússola: todas começam com "você tende" (ou equivalente); a abertura passa a ser o nome do perfil.
const TENDS: Record<WikiLang, [RegExp, (name: string) => string]> = {
  pt: [/^Você tende/, (n) => `${n} tende`],
  en: [/^You tend/, (n) => `${n} tends`],
  es: [/^Tiendes/, (n) => `${n} tiende`],
  de: [/^Du neigst dazu/, (n) => `${n} neigt dazu`],
  it: [/^Tendi/, (n) => `${n} tende`],
  fr: [/^Vous tendez/, (n) => `${n} tend`],
  ru: [/^Вы склонны/, (n) => `${n}: склонность`]
};

type CompassTexts = Pick<Strings, 'compassSpectrumDescriptions' | 'compassEconomicDescriptions' | 'compassSocialDescriptions'>;
// Os textos originais, guardados na primeira chamada: cada página do build troca o nome a partir deles, não do anterior.
let original: CompassTexts | null = null;

function rename<T extends Record<string, string>>(texts: T, lang: WikiLang, name: string): T {
  const [pattern, replacement] = TENDS[lang];
  return Object.fromEntries(Object.entries(texts).map(([key, text]) => [key, text.replace(pattern, replacement(name))])) as T;
}

/** Troca, no dicionário dos resultados, os textos em segunda pessoa pelos do perfil. Chamar antes de renderizar. */
export function applyPerspective(t: Strings, lang: WikiLang, name: string, kind: WikiKind = 'personality'): void {
  original ??= {
    compassSpectrumDescriptions: { ...t.compassSpectrumDescriptions },
    compassEconomicDescriptions: { ...t.compassEconomicDescriptions },
    compassSocialDescriptions: { ...t.compassSocialDescriptions }
  };
  Object.assign(t, PERSPECTIVE[lang](name, NOUNS[lang][kind]), {
    compassSpectrumDescriptions: rename(original.compassSpectrumDescriptions, lang, name),
    compassEconomicDescriptions: rename(original.compassEconomicDescriptions, lang, name),
    compassSocialDescriptions: rename(original.compassSocialDescriptions, lang, name)
  });
}

export interface WikiText {
  nearestSpectrum: string;
  nearestIdeology: string;
  nearestPerson: string;
  nearestCountry: string;
  compare: string;
  ctaTitle: string;
  ctaText: (name: string) => string;
  ctaButton: string;
  all: string;
  showing: (shown: number, total: number) => string;
  more: string;
}

export const WIKI_TEXT: Record<WikiLang, WikiText> = {
  pt: {
    nearestSpectrum: 'Espectro mais próximo', nearestIdeology: 'Ideologia mais próxima', nearestPerson: 'Personalidade mais próxima',
    nearestCountry: 'País mais próximo', compare: 'Comparar com…', ctaTitle: 'E você, com quem se parece?',
    ctaText: (n) => `Responda ao quiz e veja sua compatibilidade com ${n}, ideologias, países e personalidades nos 12 eixos.`,
    ctaButton: 'Fazer o teste', all: 'Todos', showing: (s, t) => `Mostrando ${s} de ${t}`, more: 'Mostrar mais'
  },
  en: {
    nearestSpectrum: 'Closest spectrum', nearestIdeology: 'Closest ideology', nearestPerson: 'Closest figure',
    nearestCountry: 'Closest country', compare: 'Compare with…', ctaTitle: 'And you, who are you like?',
    ctaText: (n) => `Take the quiz and see how you match ${n}, ideologies, countries and figures on the 12 axes.`,
    ctaButton: 'Take the test', all: 'All', showing: (s, t) => `Showing ${s} of ${t}`, more: 'Show more'
  },
  es: {
    nearestSpectrum: 'Espectro más cercano', nearestIdeology: 'Ideología más cercana', nearestPerson: 'Personalidad más cercana',
    nearestCountry: 'País más cercano', compare: 'Comparar con…', ctaTitle: 'Y tú, ¿a quién te pareces?',
    ctaText: (n) => `Responde el test y ve tu compatibilidad con ${n}, ideologías, países y personalidades en los 12 ejes.`,
    ctaButton: 'Hacer el test', all: 'Todos', showing: (s, t) => `Mostrando ${s} de ${t}`, more: 'Mostrar más'
  },
  de: {
    nearestSpectrum: 'Nächstes Spektrum', nearestIdeology: 'Nächste Ideologie', nearestPerson: 'Nächste Persönlichkeit',
    nearestCountry: 'Nächstes Land', compare: 'Vergleichen mit…', ctaTitle: 'Und wem ähnelst du?',
    ctaText: (n) => `Mach das Quiz und sieh deine Übereinstimmung mit ${n}, Ideologien, Ländern und Persönlichkeiten auf den 12 Achsen.`,
    ctaButton: 'Zum Test', all: 'Alle', showing: (s, t) => `${s} von ${t}`, more: 'Mehr anzeigen'
  },
  it: {
    nearestSpectrum: 'Spettro più vicino', nearestIdeology: 'Ideologia più vicina', nearestPerson: 'Personalità più vicina',
    nearestCountry: 'Paese più vicino', compare: 'Confronta con…', ctaTitle: 'E tu, a chi somigli?',
    ctaText: (n) => `Fai il quiz e scopri la tua compatibilità con ${n}, ideologie, paesi e personalità sui 12 assi.`,
    ctaButton: 'Fai il test', all: 'Tutti', showing: (s, t) => `${s} di ${t}`, more: 'Mostra altri'
  },
  fr: {
    nearestSpectrum: 'Spectre le plus proche', nearestIdeology: 'Idéologie la plus proche', nearestPerson: 'Personnalité la plus proche',
    nearestCountry: 'Pays le plus proche', compare: 'Comparer avec…', ctaTitle: 'Et vous, à qui ressemblez-vous ?',
    ctaText: (n) => `Répondez au quiz et voyez votre compatibilité avec ${n}, des idéologies, des pays et des personnalités sur les 12 axes.`,
    ctaButton: 'Faire le test', all: 'Tous', showing: (s, t) => `${s} sur ${t}`, more: 'Afficher plus'
  },
  ru: {
    nearestSpectrum: 'Ближайший спектр', nearestIdeology: 'Ближайшая идеология', nearestPerson: 'Ближайшая личность',
    nearestCountry: 'Ближайшая страна', compare: 'Сравнить с…', ctaTitle: 'А на кого похожи вы?',
    ctaText: (n) => `Пройдите тест и узнайте свою совместимость: ${n}, идеологии, страны и личности по 12 осям.`,
    ctaButton: 'Пройти тест', all: 'Все', showing: (s, t) => `Показано ${s} из ${t}`, more: 'Показать ещё'
  }
};

/** Textos de cada lista (título, linha de abertura, busca, título do painel e lista vazia). */
export interface WikiListText {
  title: string;
  lead: (count: number) => string;
  search: string;
  panel: string;
  empty: string;
}

export const WIKI_LIST_TEXT: Record<WikiLang, Record<WikiKind, WikiListText>> = {
  pt: {
    personality: { title: 'Personalidades políticas', lead: (c) => `${c} líderes, pensadores e ativistas, cada um com perfil completo nos 12 eixos.`, search: 'Buscar nome ou cargo', panel: 'Todas as personalidades', empty: 'Nenhuma personalidade encontrada.' },
    ideology: { title: 'Ideologias políticas', lead: (c) => `${c} correntes políticas, cada uma com perfil completo nos 12 eixos.`, search: 'Buscar ideologia', panel: 'Todas as ideologias', empty: 'Nenhuma ideologia encontrada.' },
    country: { title: 'Países e regimes', lead: (c) => `${c} países, regiões e regimes históricos, cada um com perfil completo nos 12 eixos.`, search: 'Buscar país ou regime', panel: 'Todos os países', empty: 'Nenhum país encontrado.' },
    party: { title: 'Partidos e organizações', lead: (c) => `${c} partidos, movimentos e organizações, cada um com perfil completo nos 12 eixos.`, search: 'Buscar partido ou país', panel: 'Todos os partidos', empty: 'Nenhum partido encontrado.' }
  },
  en: {
    personality: { title: 'Political figures', lead: (c) => `${c} leaders, thinkers and activists, each with a full profile on the 12 axes.`, search: 'Search name or role', panel: 'All figures', empty: 'No figure found.' },
    ideology: { title: 'Political ideologies', lead: (c) => `${c} political currents, each with a full profile on the 12 axes.`, search: 'Search ideology', panel: 'All ideologies', empty: 'No ideology found.' },
    country: { title: 'Countries and regimes', lead: (c) => `${c} countries, regions and historical regimes, each with a full profile on the 12 axes.`, search: 'Search country or regime', panel: 'All countries', empty: 'No country found.' },
    party: { title: 'Parties and organizations', lead: (c) => `${c} parties, movements and organizations, each with a full profile on the 12 axes.`, search: 'Search party or country', panel: 'All parties', empty: 'No party found.' }
  },
  es: {
    personality: { title: 'Personalidades políticas', lead: (c) => `${c} líderes, pensadores y activistas, cada uno con perfil completo en los 12 ejes.`, search: 'Buscar nombre o cargo', panel: 'Todas las personalidades', empty: 'No se encontró ninguna personalidad.' },
    ideology: { title: 'Ideologías políticas', lead: (c) => `${c} corrientes políticas, cada una con perfil completo en los 12 ejes.`, search: 'Buscar ideología', panel: 'Todas las ideologías', empty: 'No se encontró ninguna ideología.' },
    country: { title: 'Países y regímenes', lead: (c) => `${c} países, regiones y regímenes históricos, cada uno con perfil completo en los 12 ejes.`, search: 'Buscar país o régimen', panel: 'Todos los países', empty: 'No se encontró ningún país.' },
    party: { title: 'Partidos y organizaciones', lead: (c) => `${c} partidos, movimientos y organizaciones, cada uno con perfil completo en los 12 ejes.`, search: 'Buscar partido o país', panel: 'Todos los partidos', empty: 'No se encontró ningún partido.' }
  },
  de: {
    personality: { title: 'Politische Persönlichkeiten', lead: (c) => `${c} Anführer, Denker und Aktivisten, jeweils mit vollständigem Profil auf den 12 Achsen.`, search: 'Name oder Amt suchen', panel: 'Alle Persönlichkeiten', empty: 'Keine Persönlichkeit gefunden.' },
    ideology: { title: 'Politische Ideologien', lead: (c) => `${c} politische Strömungen, jeweils mit vollständigem Profil auf den 12 Achsen.`, search: 'Ideologie suchen', panel: 'Alle Ideologien', empty: 'Keine Ideologie gefunden.' },
    country: { title: 'Länder und Regime', lead: (c) => `${c} Länder, Regionen und historische Regime, jeweils mit vollständigem Profil auf den 12 Achsen.`, search: 'Land oder Regime suchen', panel: 'Alle Länder', empty: 'Kein Land gefunden.' },
    party: { title: 'Parteien und Organisationen', lead: (c) => `${c} Parteien, Bewegungen und Organisationen, jeweils mit vollständigem Profil auf den 12 Achsen.`, search: 'Partei oder Land suchen', panel: 'Alle Parteien', empty: 'Keine Partei gefunden.' }
  },
  it: {
    personality: { title: 'Personalità politiche', lead: (c) => `${c} leader, pensatori e attivisti, ciascuno con profilo completo sui 12 assi.`, search: 'Cerca nome o carica', panel: 'Tutte le personalità', empty: 'Nessuna personalità trovata.' },
    ideology: { title: 'Ideologie politiche', lead: (c) => `${c} correnti politiche, ciascuna con profilo completo sui 12 assi.`, search: 'Cerca ideologia', panel: 'Tutte le ideologie', empty: 'Nessuna ideologia trovata.' },
    country: { title: 'Paesi e regimi', lead: (c) => `${c} paesi, regioni e regimi storici, ciascuno con profilo completo sui 12 assi.`, search: 'Cerca paese o regime', panel: 'Tutti i paesi', empty: 'Nessun paese trovato.' },
    party: { title: 'Partiti e organizzazioni', lead: (c) => `${c} partiti, movimenti e organizzazioni, ciascuno con profilo completo sui 12 assi.`, search: 'Cerca partito o paese', panel: 'Tutti i partiti', empty: 'Nessun partito trovato.' }
  },
  fr: {
    personality: { title: 'Personnalités politiques', lead: (c) => `${c} dirigeants, penseurs et militants, chacun avec un profil complet sur les 12 axes.`, search: 'Chercher un nom ou une fonction', panel: 'Toutes les personnalités', empty: 'Aucune personnalité trouvée.' },
    ideology: { title: 'Idéologies politiques', lead: (c) => `${c} courants politiques, chacun avec un profil complet sur les 12 axes.`, search: 'Chercher une idéologie', panel: 'Toutes les idéologies', empty: 'Aucune idéologie trouvée.' },
    country: { title: 'Pays et régimes', lead: (c) => `${c} pays, régions et régimes historiques, chacun avec un profil complet sur les 12 axes.`, search: 'Chercher un pays ou un régime', panel: 'Tous les pays', empty: 'Aucun pays trouvé.' },
    party: { title: 'Partis et organisations', lead: (c) => `${c} partis, mouvements et organisations, chacun avec un profil complet sur les 12 axes.`, search: 'Chercher un parti ou un pays', panel: 'Tous les partis', empty: 'Aucun parti trouvé.' }
  },
  ru: {
    personality: { title: 'Политические личности', lead: (c) => `${c} лидеров, мыслителей и активистов, у каждого полный профиль по 12 осям.`, search: 'Искать имя или должность', panel: 'Все личности', empty: 'Ничего не найдено.' },
    ideology: { title: 'Политические идеологии', lead: (c) => `${c} политических течений, у каждого полный профиль по 12 осям.`, search: 'Искать идеологию', panel: 'Все идеологии', empty: 'Ничего не найдено.' },
    country: { title: 'Страны и режимы', lead: (c) => `${c} стран, регионов и исторических режимов, у каждого полный профиль по 12 осям.`, search: 'Искать страну или режим', panel: 'Все страны', empty: 'Ничего не найдено.' },
    party: { title: 'Партии и организации', lead: (c) => `${c} партий, движений и организаций, у каждой полный профиль по 12 осям.`, search: 'Искать партию или страну', panel: 'Все партии', empty: 'Ничего не найдено.' }
  }
};
