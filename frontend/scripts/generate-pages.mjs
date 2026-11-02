// Gera páginas estáticas de SEO (ideologias, países, personalidades) em PT, EN e FR
// a partir dos JSONs do backend. Roda após o `vite build` e escreve direto em dist/.
// Fonte estrutural: backend/src/main/resources/data (PT). Textos EN vêm dos
// overlays em data/i18n/en/*.json (chaveados por id, com fallback para PT).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ideologiesIndexPage, IDEOLOGIES_CSS } from './ideologies-index.mjs';
import { SITE_HEADER_CSS } from './site-header.mjs';
import { writeTreeData } from './tree-data.mjs';
import { personalitiesIndexPage, PERSONALITIES_CSS } from './personalities-index.mjs';
import { personalityPage, PROFILE_CSS } from './personality-page.mjs';
import { ideologyPage } from './ideology-page.mjs';
import { countryPage, COUNTRY_PAGE_CSS } from './country-page.mjs';
import { countriesIndexPage, COUNTRIES_CSS } from './countries-index.mjs';
import { booksIndexPage, BOOKS_CSS } from './books-index.mjs';
import { partiesIndexPage, PARTIES_CSS } from './parties-index.mjs';
import { partyPage, PARTY_PAGE_CSS } from './party-page.mjs';
import { policyPages, POLICY_CSS } from './policy-pages.mjs';
import { cdnifyHtml, cdnifyShareImage } from './cdn.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DATA_DIR = resolve(ROOT, '../backend/src/main/resources/data');
const CATALOGUE_ONLY = process.argv.includes('--catalogue-only');
const DIST = join(ROOT, CATALOGUE_ONLY ? 'node_modules/.cache/catalogue-pages' : 'dist');
const SITE = 'https://12axes.vercel.app';
const GOOGLE_ANALYTICS_SNIPPET = `<!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-JF63DF6BNM"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-JF63DF6BNM');
    </script>`;

const readJson = (path) => JSON.parse(readFileSync(join(DATA_DIR, path), 'utf8'));

const baseAxes = readJson('axes.json');
const baseIdeologies = readJson('ideologies.json');
const baseCountries = readJson('countries.json');
const basePersonalities = readJson('personalities.json');
const baseParties = readJson('parties.json');
const baseBooks = readJson('books.json');
const ideologyProfiles = new Map(readJson('ideology-profiles.json').map((p) => [p.ideologyId, p.vector]));
const countryProfiles = new Map(readJson('countries-profiles.json').map((p) => [p.countryId, p.vector]));
const personalityProfiles = new Map(readJson('personality-profiles.json').map((p) => [p.personalityId, p.vector]));
const partyProfiles = new Map(readJson('parties-profiles.json').map((p) => [p.partyId, p.vector]));

function overlay(base, locale, file) {
  if (locale === 'pt') return base;
  const path = join(DATA_DIR, 'i18n', locale, file);
  if (!existsSync(path)) {
    console.warn(`[i18n] overlay ausente: ${locale}/${file} — usando PT`);
    return base;
  }
  const byId = new Map(JSON.parse(readFileSync(path, 'utf8')).map((item) => [item.id, item]));
  return base.map((item) => {
    const tr = byId.get(item.id);
    if (!tr) console.warn(`[i18n] sem tradução ${locale}: ${file} → ${item.id} (fallback PT)`);
    return tr ? { ...item, ...tr } : item;
  });
}

const STR = {
  pt: {
    htmlLang: 'pt-BR',
    ogLocale: 'pt_BR',
    prefix: '',
    home: 'Início',
    navBooks: 'Livros',
    navIdeologies: 'Ideologias',
    navCountries: 'Países',
    navCompare: 'Comparar',
    compareHref: '/compare',
    navPersonalities: 'Personalidades',
    navParties: 'Partidos',
    navWebView: 'Visualização em teia',
    navStart: 'Começar',
    navCatalog: 'Catálogo',
    takeTheTest: 'Fazer o teste',
    axesTitle: 'Perfil nos 12 eixos',
    ctaTitle: 'E você, onde está no espectro político?',
    ctaText: 'Responda ao quiz e descubra suas compatibilidades com ideologias, países e personalidades nos 12 eixos.',
    currentCountry: 'País atual',
    historicalRegime: (period) => `Regime histórico${period ? ` · ${period}` : ''}`,
    flagAlt: (name) => `Bandeira: ${name}`,
    imageSource: 'Fonte da imagem',
    homeAria: '12 Axes — página inicial',
    balanced: 'Equilibrado',
    intensity: ['Equilibrado', 'Inclinado', 'Forte', 'Muito forte'],
    subjectPrefix: (name, kind) => (kind === 'ideology' ? `o ${name}` : name),
    ideologyTitle: (name) => `${name} — o que é e posição nos 12 eixos políticos | 12 Axes`,
    countryTitle: (name) => `${name} — perfil político nos 12 eixos | 12 Axes`,
    personalityTitle: (name) => `${name} — posição política nos 12 eixos | 12 Axes`,
    partyTitle: (name) => `${name} — perfil político nos 12 eixos | 12 Axes`,
    partyHeadline: (name) => `${name} — perfil político nos 12 eixos`,
    ideologyHeadline: (name) => `${name} — posição política nos 12 eixos`,
    countryHeadline: (name) => `${name} — perfil político nos 12 eixos`,
    ideologiesIndexTitle: (n) => `Ideologias políticas: lista completa com ${n} correntes | 12 Axes`,
    ideologiesIndexDesc: (n) => `Lista completa de ${n} ideologias políticas, do comunismo ao libertarianismo, com posição em 12 eixos. Descubra a sua no teste político 12 Axes, grátis e rápido.`,
    ideologiesIndexHeading: 'Ideologias políticas',
    countriesIndexTitle: (n) => `Perfis políticos de ${n} países e regimes históricos | 12 Axes`,
    countriesIndexDesc: (n) => `Compare o perfil político de ${n} países e regimes históricos em 12 eixos. Descubra qual país é compatível com você no teste político 12 Axes, grátis.`,
    countriesIndexHeading: 'Países e regimes',
    personalitiesIndexTitle: (n) => `${n} personalidades políticas e suas posições | 12 Axes`,
    personalitiesIndexDesc: (n) => `Veja a posição política de ${n} personalidades em 12 eixos. Descubra qual personalidade é compatível com você no teste político 12 Axes, grátis e rápido.`,
    personalitiesIndexHeading: 'Personalidades políticas',
    partiesIndexTitle: (n) => `${n} partidos, movimentos e organizações políticas e suas posições | 12 Axes`,
    partiesIndexDesc: (n) => `Compare o perfil de ${n} partidos, movimentos, casas dinásticas e organizações em 12 eixos, com o país associado a cada um. Descubra qual combina com você no teste político 12 Axes, grátis.`,
    partiesIndexHeading: 'Partidos e organizações',
    booksIndexTitle: (n) => `Livros políticos e filosóficos: ${n} obras essenciais | 12 Axes`,
    booksIndexDesc: (n) => `Biblioteca com ${n} obras fundamentais de política, filosofia e economia escritas pelas personalidades mapeadas no 12 Axes, com perfil em 12 eixos.`,
    booksIndexHeading: 'Livros e autores políticos'
  },
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    prefix: '/en',
    home: 'Home',
    navBooks: 'Books',
    navIdeologies: 'Ideologies',
    navCountries: 'Countries',
    navCompare: 'Compare',
    compareHref: '/en/compare',
    navPersonalities: 'Personalities',
    navParties: 'Parties',
    navWebView: 'Web view',
    navStart: 'Start',
    navCatalog: 'Catalog',
    takeTheTest: 'Take the test',
    axesTitle: 'Profile across the 12 axes',
    ctaTitle: 'Where do you stand on the political spectrum?',
    ctaText: 'Take the quiz and discover your compatibility with ideologies, countries, and personalities across the 12 axes.',
    currentCountry: 'Modern country',
    historicalRegime: (period) => `Historical regime${period ? ` · ${period}` : ''}`,
    flagAlt: (name) => `Flag: ${name}`,
    imageSource: 'Image source',
    homeAria: '12 Axes — home page',
    balanced: 'Balanced',
    intensity: ['Balanced', 'Leaning', 'Strong', 'Very strong'],
    subjectPrefix: (name) => name,
    ideologyTitle: (name) => `${name} — what it is and its position on the 12 political axes | 12 Axes`,
    countryTitle: (name) => `${name} — political profile across the 12 axes | 12 Axes`,
    personalityTitle: (name) => `${name} — political position on the 12 axes | 12 Axes`,
    partyTitle: (name) => `${name} — political profile across the 12 axes | 12 Axes`,
    partyHeadline: (name) => `${name} — political profile across the 12 axes`,
    ideologyHeadline: (name) => `${name} — political position on the 12 axes`,
    countryHeadline: (name) => `${name} — political profile across the 12 axes`,
    ideologiesIndexTitle: (n) => `Political ideologies: full list of ${n} currents | 12 Axes`,
    ideologiesIndexDesc: (n) => `Full list of ${n} political ideologies, from communism to libertarianism, with positions on 12 axes. Find yours with the free, fast 12 Axes political test.`,
    ideologiesIndexHeading: 'Political ideologies',
    countriesIndexTitle: (n) => `Political profiles of ${n} countries and historical regimes | 12 Axes`,
    countriesIndexDesc: (n) => `Compare the political profile of ${n} countries and historical regimes across 12 axes. Find which country is compatible with you in the free 12 Axes political test.`,
    countriesIndexHeading: 'Countries and regimes',
    personalitiesIndexTitle: (n) => `${n} political personalities and their positions | 12 Axes`,
    personalitiesIndexDesc: (n) => `See the political position of ${n} personalities across 12 axes. Find which political figure is compatible with you in the free, fast 12 Axes political test.`,
    personalitiesIndexHeading: 'Political personalities',
    partiesIndexTitle: (n) => `${n} political parties, movements and organizations and their positions | 12 Axes`,
    partiesIndexDesc: (n) => `Compare the profile of ${n} parties, movements, dynastic houses and organizations across 12 axes, with the country tied to each. Find which one matches you in the free 12 Axes political test.`,
    partiesIndexHeading: 'Parties and organizations',
    booksIndexTitle: (n) => `Political and philosophical books: ${n} essential works | 12 Axes`,
    booksIndexDesc: (n) => `Library of ${n} foundational works in politics, philosophy, and economics written by figures mapped across the 12 Axes, with 12-axis profiles.`,
    booksIndexHeading: 'Political books and authors'
  },
  fr: {
    htmlLang: 'fr',
    ogLocale: 'fr_FR',
    prefix: '/fr',
    home: 'Accueil',
    navBooks: 'Livres',
    navIdeologies: 'Idéologies',
    navCountries: 'Pays',
    navCompare: 'Comparer',
    compareHref: '/fr/compare',
    navPersonalities: 'Personnalités',
    navParties: 'Partis',
    navWebView: 'Vue en toile',
    navStart: 'Commencer',
    navCatalog: 'Catalogue',
    takeTheTest: 'Faire le test',
    axesTitle: 'Profil sur les 12 axes',
    ctaTitle: 'Et vous, où vous situez-vous sur le spectre politique ?',
    ctaText: 'Répondez au quiz et découvrez votre compatibilité avec des idéologies, des pays et des personnalités sur les 12 axes.',
    currentCountry: 'Pays actuel',
    historicalRegime: (period) => `Régime historique${period ? ` · ${period}` : ''}`,
    flagAlt: (name) => `Drapeau : ${name}`,
    imageSource: 'Source de l’image',
    homeAria: '12 Axes — page d’accueil',
    balanced: 'Équilibré',
    intensity: ['Équilibré', 'Incliné', 'Fort', 'Très fort'],
    subjectPrefix: (name) => name,
    ideologyTitle: (name) => `${name} — ce que c’est et sa position sur les 12 axes politiques | 12 Axes`,
    countryTitle: (name) => `${name} — profil politique sur les 12 axes | 12 Axes`,
    personalityTitle: (name) => `${name} — position politique sur les 12 axes | 12 Axes`,
    partyTitle: (name) => `${name} — profil politique sur les 12 axes | 12 Axes`,
    partyHeadline: (name) => `${name} — profil politique sur les 12 axes`,
    ideologyHeadline: (name) => `${name} — position politique sur les 12 axes`,
    countryHeadline: (name) => `${name} — profil politique sur les 12 axes`,
    ideologiesIndexTitle: (n) => `Idéologies politiques : liste complète de ${n} courants | 12 Axes`,
    ideologiesIndexDesc: (n) => `Liste complète de ${n} idéologies politiques, du communisme au libertarianisme, avec leur position sur 12 axes. Découvrez la vôtre avec le test politique 12 Axes, gratuit et rapide.`,
    ideologiesIndexHeading: 'Idéologies politiques',
    countriesIndexTitle: (n) => `Profils politiques de ${n} pays et régimes historiques | 12 Axes`,
    countriesIndexDesc: (n) => `Comparez le profil politique de ${n} pays et régimes historiques sur 12 axes. Découvrez quel pays vous correspond avec le test politique 12 Axes, gratuit.`,
    countriesIndexHeading: 'Pays et régimes',
    personalitiesIndexTitle: (n) => `${n} personnalités politiques et leurs positions | 12 Axes`,
    personalitiesIndexDesc: (n) => `Découvrez la position politique de ${n} personnalités sur 12 axes. Trouvez la figure politique qui vous correspond avec le test politique 12 Axes, gratuit et rapide.`,
    personalitiesIndexHeading: 'Personnalités politiques',
    partiesIndexTitle: (n) => `${n} partis, mouvements et organisations politiques et leurs positions | 12 Axes`,
    partiesIndexDesc: (n) => `Comparez le profil de ${n} partis, mouvements, maisons dynastiques et organisations sur 12 axes, avec le pays associé à chacun. Découvrez lequel vous correspond avec le test politique 12 Axes, gratuit.`,
    partiesIndexHeading: 'Partis et organisations',
    booksIndexTitle: (n) => `Livres politiques et philosophiques : ${n} œuvres essentielles | 12 Axes`,
    booksIndexDesc: (n) => `Bibliothèque de ${n} œuvres fondatrices de politique, de philosophie et d’économie écrites par les figures cartographiées sur les 12 Axes, avec profil sur 12 axes.`,
    booksIndexHeading: 'Livres et auteurs politiques'
  }
};

const LOCALES = ['pt', 'en', 'fr'];

function groupBy(list, keyFn) {
  const map = new Map();
  for (const item of list) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

function truncate(text, max = 158) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

// ── Páginas de índice ───────────────────────────────────────────────────────
function buildIndexes(L) {
  const p = L.s.prefix;
  const n = { i: L.ideologies.length, c: L.countries.length, p: L.personalities.length, b: L.books.length, pa: L.parties.length };

  return [
    booksIndexPage(L, {
      locale: L.locale,
      site: SITE,
      gaSnippet: GOOGLE_ANALYTICS_SNIPPET,
      escapeHtml,
      profiles: personalityProfiles,
      title: L.s.booksIndexTitle(n.b),
      description: L.s.booksIndexDesc(n.b)
    }),
    ideologiesIndexPage(L, {
      locale: L.locale,
      site: SITE,
      gaSnippet: GOOGLE_ANALYTICS_SNIPPET,
      escapeHtml,
      profiles: ideologyProfiles,
      title: L.s.ideologiesIndexTitle(n.i),
      description: L.s.ideologiesIndexDesc(n.i)
    }),
    countriesIndexPage(L, {
      locale: L.locale,
      site: SITE,
      gaSnippet: GOOGLE_ANALYTICS_SNIPPET,
      escapeHtml,
      profiles: countryProfiles,
      title: L.s.countriesIndexTitle(n.c),
      description: L.s.countriesIndexDesc(n.c)
    }),
    personalitiesIndexPage(L, {
      locale: L.locale,
      site: SITE,
      gaSnippet: GOOGLE_ANALYTICS_SNIPPET,
      escapeHtml,
      profiles: personalityProfiles,
      title: L.s.personalitiesIndexTitle(n.p),
      description: L.s.personalitiesIndexDesc(n.p)
    }),
    partiesIndexPage(L, {
      locale: L.locale,
      site: SITE,
      gaSnippet: GOOGLE_ANALYTICS_SNIPPET,
      escapeHtml,
      profiles: partyProfiles,
      title: L.s.partiesIndexTitle(n.pa),
      description: L.s.partiesIndexDesc(n.pa)
    })
  ];
}

// ── Montagem por locale ─────────────────────────────────────────────────────
function buildLocaleContext(locale) {
  const ideologies = overlay(baseIdeologies, locale, 'ideologies.json');
  const countries = overlay(baseCountries, locale, 'countries.json');
  const personalities = overlay(basePersonalities, locale, 'personalities.json');
  const parties = overlay(baseParties, locale, 'parties.json');
  const books = baseBooks.map((b) => ({
    ...b,
    // Sem título/URL no idioma (ex.: fr), usa o EN (conteúdo do catálogo segue em inglês) antes do PT.
    title: (b.title && (b.title[locale] || b.title.en || b.title.pt)) || '',
    url: (b.url && (b.url[locale] || b.url.en || b.url.pt)) || ''
  }));
  return {
    locale,
    s: STR[locale],
    axes: overlay(baseAxes, locale, 'axes.json'),
    ideologies,
    countries,
    personalities,
    parties,
    // Tipo canônico (valor fechado em PT) de cada perfil: o overlay EN traduz o rótulo da categoria.
    partyKindById: new Map(baseParties.map((p) => [p.id, p.category])),
    books,
    countryById: new Map(countries.map((c) => [c.id, c])),
    personalityById: new Map(personalities.map((p) => [p.id, p])),
    ideologiesByCountry: groupBy(ideologies, (i) => i.countryId),
    ideologiesByPersonality: groupBy(ideologies, (i) => i.personalityId)
  };
}

function writePage(prefix, { basePath, html }) {
  const file = join(DIST, `${(prefix + basePath).replace(/^\//, '')}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, cdnifyHtml(html));
  return prefix + basePath;
}

// ── Homes /en e /br ─────────────────────────────────────────────────────────
// dist/en.html: cópia do index compilado com todo o SEO trocado para inglês
// (título, description, OG, JSON-LD) e canonical próprio — é o que o Google
// mostra para quem busca em inglês. dist/br.html: cópia fiel do index (o
// canonical continua apontando para /, então não cria conteúdo duplicado);
// o idioma forçado em ambos vem do caminho, resolvido pelo app.
function replaceBetween(html, startMarker, endMarker, replacement) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker, start);
  if (start === -1 || end === -1) {
    throw new Error(`Marcador não encontrado no index.html: ${startMarker} … ${endMarker}`);
  }
  return html.slice(0, start) + replacement + html.slice(end);
}

function buildHomeVariants() {
  const index = readFileSync(join(DIST, 'index.html'), 'utf8');

  writeFileSync(join(DIST, 'br.html'), index);

  // Rotas do app servidas como arquivos físicos (via cleanUrls), sem depender
  // do rewrite de SPA. results.html fica sem canonical/hreflang para que cada
  // URL de resultado compartilhado possa ser indexada individualmente.
  writeFileSync(join(DIST, '240questions.html'), index);
  const results = index
    .replace(/^\s*<link rel="canonical"[^\n]*\n/m, '')
    .replace(/^\s*<link rel="alternate" hreflang=[^\n]*\n/gm, '');
  writeFileSync(join(DIST, 'results.html'), results);
  // /r é o link curto de resultado (QR code do cartão): mesma página, também sem canonical.
  writeFileSync(join(DIST, 'r.html'), results);

  const enSeoBlock = `<!-- Primary SEO -->
    <title>12 Axes — Free Political Test, Quiz & Compass Across 12 Axes</title>
    <meta
      name="description"
      content="The free, fast and accurate 12 Axes political test. Find your ideology, country and political figure match across 12 axes, with a political compass."
    />
    <meta
      name="keywords"
      content="political test, free political test, political quiz, ideology test, political ideology, find your ideology, find your compatible ideology, find your compatible country, find your compatible political figure, political spectrum, political compass, political coordinates, political compass test, 12 axes, 12 axes political test, 12axes, 12 axes quiz, left, right, center, liberalism, conservatism, progressivism, libertarianism, socialism, capitalism"
    />
    <meta name="author" content="12 Axes" />
    <meta name="copyright" content="© 2026 12 Axes. All rights reserved" />
    <meta name="application-name" content="12 Axes" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="language" content="English" />
    <link rel="canonical" href="https://12axes.vercel.app/en" />
    <link rel="alternate" hreflang="pt-BR" href="https://12axes.vercel.app/" />
    <link rel="alternate" hreflang="en" href="https://12axes.vercel.app/en" />
    <link rel="alternate" hreflang="fr" href="https://12axes.vercel.app/fr" />
    <link rel="alternate" hreflang="x-default" href="https://12axes.vercel.app/en" />

    `;

  const enOgBlock = `<!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="12 Axes" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:url" content="https://12axes.vercel.app/en" />
    <meta property="og:title" content="12 Axes — Free Political Test, Quiz & Compass Across 12 Axes" />
    <meta
      property="og:description"
      content="A complete, free political quiz: find your political ideology, compatible country and political figure across 12 axes, with a political compass and full spectrum."
    />
    <meta property="og:image" content="https://12axes.vercel.app/logo.png" />
    <meta property="og:image:width" content="512" />
    <meta property="og:image:height" content="512" />
    <meta property="og:image:alt" content="12 Axes logo — a 12-axis political test" />

    `;

  const enTwitterBlock = `<!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="12 Axes — Free Political Test, Quiz & Compass Across 12 Axes" />
    <meta
      name="twitter:description"
      content="A free, fast political test: find your ideology, country and political figure match across 12 axes, with a political compass."
    />
    <meta name="twitter:image" content="https://12axes.vercel.app/logo.png" />

    `;

  const enWebApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '12 Axes',
    alternateName: ['12 Axes Political Quiz', '12 Axes Ideology Test', '12 Axes Political Test', '12 Axes Political Compass', '12 Axes Quiz'],
    url: 'https://12axes.vercel.app/en',
    description:
      'A free, fast and complete political test and ideology quiz that maps your position across 12 axes and shows your compatible ideology, country and political figure, with a political compass and spectrum.',
    applicationCategory: 'EducationApplication',
    operatingSystem: 'Web',
    inLanguage: 'en',
    isAccessibleForFree: true,
    copyrightYear: 2026,
    copyrightHolder: { '@type': 'Organization', name: '12 Axes', url: 'https://12axes.vercel.app/' },
    license: 'https://github.com/RomanCypherpunk/12axes/blob/main/LICENSE',
    image: 'https://12axes.vercel.app/logo.png',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    keywords:
      'political test, free political test, political quiz, ideology test, political ideology, find your ideology, find your compatible ideology, find your compatible country, find your compatible political figure, political spectrum, political compass, political coordinates, political compass test, 12 axes, 12 axes political test, 12axes, 12 axes quiz, left, right, center, liberalism, conservatism, progressivism, libertarianism, socialism, capitalism',
    featureList: [
      'Free political test with 36, 60 or 240 questions',
      'Result across 12 political axes',
      'Compatible political ideology',
      'Compatible country and historical regime',
      'Compatible political figure',
      'Political compass with socialism × capitalism and authoritarian × libertarian',
      'Anonymous, no sign-up'
    ],
    about: [
      'Political structure',
      'Democratic representation',
      'Elections',
      'Monarchy',
      'Civil liberties',
      'Immigration',
      'Diplomacy',
      'Intervention',
      'Economic policy',
      'Capitalism',
      'Socialism',
      'Free markets',
      'International trade',
      'Religion in politics',
      'Morality',
      'Technology',
      'Liberalism',
      'Conservatism',
      'Progressivism',
      'Libertarianism'
    ]
  };

  const enFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      ['Is the test reliable?', 'The 12 Axes political test is reliable as a tool for reading and comparing political positions. It uses questions spread across 12 axes to reduce single-topic bias, but it does not replace study, debate, or academic analysis.'],
      ['How long does it take?', 'The short version takes about 5 minutes. The full version takes roughly 9 minutes. The extreme version, with 240 questions, can take about 30 minutes.'],
      ['Can I retake it?', 'Yes. You can retake the political quiz as many times as you like, including choosing another depth to compare whether your result changes.'],
      ['Is there a right answer?', 'There is no right answer. The ideology test measures preferences about democracy, monarchy, federalism, immigration, religion in politics, economic policy, international trade, liberalism, conservatism, progressivism, and other topics.'],
      ['How does the algorithm calculate?', 'Each answer adds points to a specific pole. The algorithm calculates percentages per axis, compares your ideological vector with the profiles of political currents, countries, and personalities, and returns the highest compatibilities.'],
      ['Does the result change?', 'It can change if your opinions change, if you answer with more nuance, or if you take a longer version. The extreme version tends to reduce fluctuations by using more questions.'],
      ['Is the test scientific?', '12 Axes is not a clinically validated scientific instrument. It is an educational political test, inspired by political spectrum models and ideology quizzes, useful for reflection and comparison.'],
      ['Can I share it?', 'Yes. When you finish, you can share your result to discuss political ideology, the political spectrum, left, right, center, and the 12 axes with other people.'],
      ['Does the test collect data?', 'The test is anonymous and requires no sign-up. Answers are used to calculate the result at quiz time, without asking for your name, email, or personal identification.'],
      ['Can I take it on my phone?', 'Yes. The interface was designed for mobile and desktop, so you can take the political test in your smartphone browser.'],
      ['What is 12 Axes?', '12 Axes is a free political test that measures your position across 12 axes (state structure, representation, liberties, immigration, diplomacy, intervention, economy, economic control, trade, religion, morals and technology) and shows your compatible political ideology, country and political figure.'],
      ['Does 12 Axes have a political compass?', 'Yes. At the end of the result there is a two-axis political compass, socialism × capitalism and authoritarian × libertarian, with a progressive × traditionalist bar. It summarizes your 12 axes visually, but it does not replace the full analysis.'],
      ['How do I find my compatible political ideology?', 'Take the political quiz, with 36, 60 or 240 questions. The result shows the ideologies most compatible with your answers, with the compatibility percentage and the position of each one across the 12 axes.'],
      ['Can I find out which country or political figure matches me?', 'Yes. Besides ideology, the result compares your profile with current countries, historical regimes and political figures, showing the most compatible and the furthest from you.'],
      ['How many questions does the political quiz have?', 'There are three versions: quick, with 36 questions, full, with 60, and extreme, with 240. All cover the same 12 axes; the more questions, the more precise the result tends to be.']
    ].map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer }
    }))
  };

  const enWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '12 Axes',
    alternateName: ['12 Eixos', '12axes', '12 Axes Political Test'],
    url: 'https://12axes.vercel.app/en',
    inLanguage: ['en', 'pt-BR', 'fr']
  };

  const enJsonLdBlocks = [JSON.stringify(enWebApp), JSON.stringify(enFaq), JSON.stringify(enWebSite)];

  let en = index.replace('<html lang="pt-BR">', '<html lang="en">');
  en = replaceBetween(en, '<!-- Primary SEO -->', '<!-- Icons -->', enSeoBlock);
  en = replaceBetween(en, '<!-- Open Graph -->', '<!-- Twitter -->', enOgBlock);
  en = replaceBetween(en, '<!-- Twitter -->', '<style>', enTwitterBlock);
  // Troca apenas o conteúdo dos três blocos ld+json (WebApplication, FAQ e WebSite),
  // preservando os scripts do app que o Vite injeta no <head>.
  let ldIndex = 0;
  en = en.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, (block) =>
    ldIndex < enJsonLdBlocks.length
      ? `<script type="application/ld+json">${enJsonLdBlocks[ldIndex++]}</script>`
      : block
  );
  if (ldIndex !== enJsonLdBlocks.length) {
    throw new Error(`Esperava 3 blocos ld+json no index.html, encontrei ${ldIndex}`);
  }
  writeFileSync(join(DIST, 'en.html'), cdnifyShareImage(en));

  // dist/fr.html: mesmo esquema do en.html, com SEO em francês (conteúdo do app segue o idioma resolvido pelo caminho).
  const frTitle = '12 Axes — Test politique gratuit, quiz et boussole sur 12 axes';
  const frDescription = 'Le test politique 12 Axes, gratuit, rapide et précis. Trouvez votre idéologie, votre pays et votre figure politique compatibles sur 12 axes, avec une boussole politique.';
  const frKeywords = 'test politique, test politique gratuit, quiz politique, test idéologique, idéologie politique, trouver son idéologie, boussole politique, spectre politique, 12 axes, test politique 12 axes, 12axes, gauche, droite, centre, libéralisme, conservatisme, progressisme, libertarianisme, socialisme, capitalisme';

  const frSeoBlock = `<!-- Primary SEO -->
    <title>${frTitle}</title>
    <meta name="description" content="${frDescription}" />
    <meta name="keywords" content="${frKeywords}" />
    <meta name="author" content="12 Axes" />
    <meta name="copyright" content="© 2026 12 Axes. Tous droits réservés" />
    <meta name="application-name" content="12 Axes" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="language" content="French" />
    <link rel="canonical" href="https://12axes.vercel.app/fr" />
    <link rel="alternate" hreflang="pt-BR" href="https://12axes.vercel.app/" />
    <link rel="alternate" hreflang="en" href="https://12axes.vercel.app/en" />
    <link rel="alternate" hreflang="fr" href="https://12axes.vercel.app/fr" />
    <link rel="alternate" hreflang="x-default" href="https://12axes.vercel.app/en" />

    `;

  const frOgBlock = `<!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="12 Axes" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:url" content="https://12axes.vercel.app/fr" />
    <meta property="og:title" content="${frTitle}" />
    <meta property="og:description" content="${frDescription}" />
    <meta property="og:image" content="https://12axes.vercel.app/logo.png" />
    <meta property="og:image:width" content="512" />
    <meta property="og:image:height" content="512" />
    <meta property="og:image:alt" content="Logo 12 Axes — un test politique sur 12 axes" />

    `;

  const frTwitterBlock = `<!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${frTitle}" />
    <meta name="twitter:description" content="${frDescription}" />
    <meta name="twitter:image" content="https://12axes.vercel.app/logo.png" />

    `;

  const frWebApp = {
    ...enWebApp,
    url: 'https://12axes.vercel.app/fr',
    alternateName: ['12 Axes Quiz politique', '12 Axes Test politique', '12 Axes Boussole politique'],
    description:
      'Un test politique et un quiz idéologique gratuits, rapides et complets qui situent votre position sur 12 axes et montrent votre idéologie, votre pays et votre figure politique compatibles, avec une boussole et un spectre politiques.',
    inLanguage: 'fr',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    keywords: frKeywords,
    featureList: [
      'Test politique gratuit de 36, 60 ou 240 questions',
      'Résultat sur 12 axes politiques',
      'Idéologie politique compatible',
      'Pays et régime historique compatibles',
      'Figure politique compatible',
      'Boussole politique socialisme × capitalisme et autoritaire × libertaire',
      'Anonyme, sans inscription'
    ],
    about: [
      'Structure politique',
      'Représentation démocratique',
      'Élections',
      'Monarchie',
      'Libertés civiles',
      'Immigration',
      'Diplomatie',
      'Intervention',
      'Politique économique',
      'Capitalisme',
      'Socialisme',
      'Libre marché',
      'Commerce international',
      'Religion et politique',
      'Morale',
      'Technologie',
      'Libéralisme',
      'Conservatisme',
      'Progressisme',
      'Libertarianisme'
    ]
  };

  const frFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      ['Le test est-il fiable ?', 'Le test politique 12 Axes est fiable comme outil de lecture et de comparaison des positions politiques. Il répartit ses questions sur 12 axes pour réduire le biais d’un seul sujet, mais ne remplace ni l’étude, ni le débat, ni l’analyse académique.'],
      ['Combien de temps cela prend-il ?', 'La version courte prend environ 5 minutes. La version complète prend environ 9 minutes. La version extrême, avec 240 questions, peut prendre environ 30 minutes.'],
      ['Y a-t-il une bonne réponse ?', 'Il n’y a pas de bonne réponse. Le test mesure des préférences sur la démocratie, la monarchie, le fédéralisme, l’immigration, la religion en politique, la politique économique, le commerce international et d’autres sujets.'],
      ['Le test collecte-t-il des données ?', 'Le test est anonyme et ne demande aucune inscription. Les réponses servent à calculer le résultat au moment du quiz, sans demander votre nom, votre e-mail ni aucune identification personnelle.'],
      ['Qu’est-ce que 12 Axes ?', '12 Axes est un test politique gratuit qui mesure votre position sur 12 axes (structure de l’État, représentation, libertés, immigration, diplomatie, intervention, économie, contrôle économique, commerce, religion, morale et technologie) et montre votre idéologie, votre pays et votre figure politique compatibles.']
    ].map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer }
    }))
  };

  const frWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '12 Axes',
    alternateName: ['12 Eixos', '12axes', '12 Axes Test politique'],
    url: 'https://12axes.vercel.app/fr',
    inLanguage: ['fr', 'en', 'pt-BR']
  };

  const frJsonLdBlocks = [JSON.stringify(frWebApp), JSON.stringify(frFaq), JSON.stringify(frWebSite)];

  let fr = index.replace('<html lang="pt-BR">', '<html lang="fr">');
  fr = replaceBetween(fr, '<!-- Primary SEO -->', '<!-- Icons -->', frSeoBlock);
  fr = replaceBetween(fr, '<!-- Open Graph -->', '<!-- Twitter -->', frOgBlock);
  fr = replaceBetween(fr, '<!-- Twitter -->', '<style>', frTwitterBlock);
  let frLdIndex = 0;
  fr = fr.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, (block) =>
    frLdIndex < frJsonLdBlocks.length
      ? `<script type="application/ld+json">${frJsonLdBlocks[frLdIndex++]}</script>`
      : block
  );
  if (frLdIndex !== frJsonLdBlocks.length) {
    throw new Error(`Esperava 3 blocos ld+json no index.html, encontrei ${frLdIndex}`);
  }
  writeFileSync(join(DIST, 'fr.html'), cdnifyShareImage(fr));
}

const allPaths = [];
for (const locale of LOCALES) {
  const L = buildLocaleContext(locale);
  const profileCtx = {
    locale,
    site: SITE,
    gaSnippet: GOOGLE_ANALYTICS_SNIPPET,
    escapeHtml,
    truncate,
    profiles: { ideology: ideologyProfiles, country: countryProfiles, personality: personalityProfiles, party: partyProfiles }
  };
  const pages = [
    ...buildIndexes(L),
    ...policyPages(L, { site: SITE, gaSnippet: GOOGLE_ANALYTICS_SNIPPET, escapeHtml }),
    ...L.ideologies.map((i) => ideologyPage(L, i, profileCtx)),
    ...L.countries.map((c) => countryPage(L, c, profileCtx)),
    ...L.personalities.map((p) => personalityPage(L, p, profileCtx)),
    ...L.parties.map((p) => partyPage(L, p, profileCtx))
  ];
  for (const page of pages) allPaths.push(writePage(L.s.prefix, page));
}

if (!CATALOGUE_ONLY) buildHomeVariants();

writeFileSync(join(DIST, 'ideologies.css'), IDEOLOGIES_CSS + SITE_HEADER_CSS);
writeFileSync(join(DIST, 'personalities.css'), PERSONALITIES_CSS + SITE_HEADER_CSS);
writeFileSync(join(DIST, 'profile.css'), PROFILE_CSS + COUNTRY_PAGE_CSS + PARTY_PAGE_CSS + SITE_HEADER_CSS);
writeFileSync(join(DIST, 'countries.css'), COUNTRIES_CSS + SITE_HEADER_CSS);
writeFileSync(join(DIST, 'parties.css'), PARTIES_CSS + SITE_HEADER_CSS);
writeFileSync(join(DIST, 'books.css'), BOOKS_CSS + SITE_HEADER_CSS);
writeFileSync(join(DIST, 'policy.css'), POLICY_CSS + SITE_HEADER_CSS);

// Dados prontos da visualização em teia (/tree/*): similaridade, layout e vizinhos calculados aqui, não no navegador.
const treeFiles = writeTreeData(DATA_DIR, DIST);

const booksPtPath = join(DIST, 'books.html');
if (existsSync(booksPtPath)) {
  writeFileSync(join(DIST, 'livros.html'), readFileSync(booksPtPath, 'utf8'));
}

const today = new Date().toISOString().slice(0, 10);
const sitemapUrls = ['/', '/en', '/fr', ...allPaths]
  .map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n');
writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`
);

writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`Geradas ${allPaths.length} páginas (${LOCALES.join(', ')}) + sitemap.xml + robots.txt + ideologies.css + personalities.css + profile.css + countries.css + parties.css + books.css + ${treeFiles} arquivos de tree-data em dist/`);
