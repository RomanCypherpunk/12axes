// Gera páginas estáticas de SEO (ideologias, países, personalidades) em PT e EN
// a partir dos JSONs do backend. Roda após o `vite build` e escreve direto em dist/.
// Fonte estrutural: backend/src/main/resources/data (PT). Textos EN vêm dos
// overlays em data/i18n/en/*.json (chaveados por id, com fallback para PT).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DATA_DIR = resolve(ROOT, '../backend/src/main/resources/data');
const DIST = join(ROOT, 'dist');
const SITE = 'https://12axes.vercel.app';
const VERCEL_ANALYTICS_SNIPPET = `<script>
      window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    </script>
    <script defer src="/_vercel/insights/script.js"></script>`;
const UMAMI_ANALYTICS_SNIPPET = `<script defer src="https://cloud.umami.is/script.js" data-website-id="fde12166-1136-4d98-bfe1-2a70753a9252"></script>`;

const readJson = (path) => JSON.parse(readFileSync(join(DATA_DIR, path), 'utf8'));

const baseAxes = readJson('axes.json');
const baseIdeologies = readJson('ideologies.json');
const baseCountries = readJson('countries.json');
const basePersonalities = readJson('personalities.json');
const ideologyProfiles = new Map(readJson('ideology-profiles.json').map((p) => [p.ideologyId, p.vector]));
const countryProfiles = new Map(readJson('countries-profiles.json').map((p) => [p.countryId, p.vector]));
const personalityProfiles = new Map(readJson('personality-profiles.json').map((p) => [p.personalityId, p.vector]));

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
    navIdeologies: 'Ideologias',
    navCountries: 'Países',
    navPersonalities: 'Personalidades',
    takeTheTest: 'Fazer o teste',
    footerTagline: '12 Axes — quiz político e teste ideológico gratuito em 12 eixos.',
    axesTitle: 'Perfil nos 12 eixos',
    axesLead: (name) => `Como ${name} se posiciona em cada uma das 12 dimensões políticas medidas pelo 12 Axes.`,
    relatedTitle: 'Relacionados',
    countryIdeologiesTitle: 'Ideologias ligadas a este país',
    personalityIdeologiesTitle: 'Ideologias associadas',
    ctaTitle: 'E você, onde está no espectro político?',
    ctaText: 'Responda ao quiz e descubra suas compatibilidades com ideologias, países e personalidades nos 12 eixos.',
    ctaButton: 'Fazer o teste político',
    closestCountry: 'País mais próximo',
    associatedPersonality: 'Personalidade associada',
    countryChip: (name) => `País: ${name}`,
    referenceChip: (name) => `Referência: ${name}`,
    currentCountry: 'País atual',
    historicalRegime: (period) => `Regime histórico${period ? ` · ${period}` : ''}`,
    flagAlt: (name) => `Bandeira: ${name}`,
    portraitAlt: (name) => `Retrato: ${name}`,
    imageSource: 'Fonte da imagem',
    breadcrumbLabel: 'Trilha de navegação',
    sectionsLabel: 'Seções',
    footerLabel: 'Rodapé',
    homeAria: '12 Axes — página inicial',
    balanced: 'Equilibrado',
    intensity: ['Equilibrado', 'Inclinado', 'Forte', 'Muito forte'],
    subjectPrefix: (name, kind) => (kind === 'ideology' ? `o ${name}` : name),
    ideologyTitle: (name) => `${name} — o que é e posição nos 12 eixos políticos | 12 Axes`,
    countryTitle: (name) => `${name} — perfil político nos 12 eixos | 12 Axes`,
    personalityTitle: (name) => `${name} — posição política nos 12 eixos | 12 Axes`,
    ideologyHeadline: (name) => `${name} — posição política nos 12 eixos`,
    countryHeadline: (name) => `${name} — perfil político nos 12 eixos`,
    ideologiesIndexTitle: (n) => `Ideologias políticas: lista completa com ${n} correntes | 12 Axes`,
    ideologiesIndexDesc: (n) => `Explore ${n} ideologias políticas — do comunismo ao libertarianismo — com descrição e posição em 12 eixos. Descubra a sua com o quiz político 12 Axes.`,
    ideologiesIndexHeading: 'Ideologias políticas',
    ideologiesIndexLead: (n) => `As ${n} correntes políticas mapeadas pelo 12 Axes, cada uma com descrição e perfil completo nos 12 eixos. Faça o teste para descobrir com quais você é compatível.`,
    countriesIndexTitle: (n) => `Perfis políticos de ${n} países e regimes históricos | 12 Axes`,
    countriesIndexDesc: (n) => `Compare o perfil político de ${n} países e regimes históricos em 12 eixos — democracia, economia, liberdades e mais. Descubra seu país mais compatível.`,
    countriesIndexHeading: 'Países e regimes',
    countriesIndexLead: (n) => `${n} países atuais e regimes históricos com perfil político completo nos 12 eixos. Faça o teste para descobrir qual é o mais próximo de você.`,
    currentCountriesGroup: 'Países atuais',
    historicalCountriesGroup: 'Regimes históricos',
    personalitiesIndexTitle: (n) => `${n} personalidades políticas e suas posições | 12 Axes`,
    personalitiesIndexDesc: (n) => `Veja a posição política de ${n} personalidades históricas e contemporâneas em 12 eixos. Descubra com quem você mais se parece no quiz 12 Axes.`,
    personalitiesIndexHeading: 'Personalidades políticas',
    personalitiesIndexLead: (n) => `${n} líderes, pensadores e figuras históricas com perfil político nos 12 eixos. Faça o teste para descobrir com quem você mais se parece.`
  },
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    prefix: '/en',
    home: 'Home',
    navIdeologies: 'Ideologies',
    navCountries: 'Countries',
    navPersonalities: 'Personalities',
    takeTheTest: 'Take the test',
    footerTagline: '12 Axes — a free political quiz and ideology test across 12 axes.',
    axesTitle: 'Profile across the 12 axes',
    axesLead: (name) => `How ${name} positions on each of the 12 political dimensions measured by 12 Axes.`,
    relatedTitle: 'Related',
    countryIdeologiesTitle: 'Ideologies linked to this country',
    personalityIdeologiesTitle: 'Associated ideologies',
    ctaTitle: 'Where do you stand on the political spectrum?',
    ctaText: 'Take the quiz and discover your compatibility with ideologies, countries, and personalities across the 12 axes.',
    ctaButton: 'Take the political test',
    closestCountry: 'Closest country',
    associatedPersonality: 'Associated personality',
    countryChip: (name) => `Country: ${name}`,
    referenceChip: (name) => `Key figure: ${name}`,
    currentCountry: 'Modern country',
    historicalRegime: (period) => `Historical regime${period ? ` · ${period}` : ''}`,
    flagAlt: (name) => `Flag: ${name}`,
    portraitAlt: (name) => `Portrait: ${name}`,
    imageSource: 'Image source',
    breadcrumbLabel: 'Breadcrumb',
    sectionsLabel: 'Sections',
    footerLabel: 'Footer',
    homeAria: '12 Axes — home page',
    balanced: 'Balanced',
    intensity: ['Balanced', 'Leaning', 'Strong', 'Very strong'],
    subjectPrefix: (name) => name,
    ideologyTitle: (name) => `${name} — what it is and its position on the 12 political axes | 12 Axes`,
    countryTitle: (name) => `${name} — political profile across the 12 axes | 12 Axes`,
    personalityTitle: (name) => `${name} — political position on the 12 axes | 12 Axes`,
    ideologyHeadline: (name) => `${name} — political position on the 12 axes`,
    countryHeadline: (name) => `${name} — political profile across the 12 axes`,
    ideologiesIndexTitle: (n) => `Political ideologies: full list of ${n} currents | 12 Axes`,
    ideologiesIndexDesc: (n) => `Explore ${n} political ideologies — from communism to libertarianism — with descriptions and positions on 12 axes. Find yours with the 12 Axes political quiz.`,
    ideologiesIndexHeading: 'Political ideologies',
    ideologiesIndexLead: (n) => `The ${n} political currents mapped by 12 Axes, each with a description and a full profile across the 12 axes. Take the test to discover which ones match you.`,
    countriesIndexTitle: (n) => `Political profiles of ${n} countries and historical regimes | 12 Axes`,
    countriesIndexDesc: (n) => `Compare the political profile of ${n} countries and historical regimes across 12 axes — democracy, economy, liberties, and more. Find your most compatible country.`,
    countriesIndexHeading: 'Countries and regimes',
    countriesIndexLead: (n) => `${n} modern countries and historical regimes with a full political profile across the 12 axes. Take the test to discover which one is closest to you.`,
    currentCountriesGroup: 'Modern countries',
    historicalCountriesGroup: 'Historical regimes',
    personalitiesIndexTitle: (n) => `${n} political personalities and their positions | 12 Axes`,
    personalitiesIndexDesc: (n) => `See the political position of ${n} historical and contemporary personalities across 12 axes. Discover who you resemble most with the 12 Axes quiz.`,
    personalitiesIndexHeading: 'Political personalities',
    personalitiesIndexLead: (n) => `${n} leaders, thinkers, and historical figures with a political profile across the 12 axes. Take the test to discover who you resemble most.`
  }
};

const LOCALES = ['pt', 'en'];

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

function readableInk(hexColor) {
  const raw = hexColor.replace('#', '');
  const hex = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
  const [r, g, b] = [0, 2, 4].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? '#0B1020' : '#ffffff';
}

function intensityFor(distance, labels) {
  if (distance < 7.5) return labels[0];
  if (distance < 22.5) return labels[1];
  if (distance < 37.5) return labels[2];
  return labels[3];
}

// ── Barra de eixo (mesma semântica do AxisResultBar.tsx: vetor = leftPercent) ──
function axisRow(L, axis, leftPercent) {
  const left = Math.max(0, Math.min(100, leftPercent));
  const right = 100 - left;
  const balanced = Math.abs(left - 50) < 7.5;
  const leaningRight = right > left;
  const domColor = balanced ? '#94A3B8' : leaningRight ? axis.rightColor : axis.leftColor;
  const leanText = balanced
    ? L.s.balanced
    : `${intensityFor(Math.abs(left - 50), L.s.intensity)} - ${leaningRight ? axis.rightPole : axis.leftPole}`;
  const position = right; // 0 = polo esquerdo, 100 = polo direito
  const fillLeft = Math.min(position, 50);
  const fillWidth = balanced ? 0 : Math.abs(position - 50);

  return `
<article class="axis-row" style="--axis-dom:${domColor}">
  <header class="axis-row-head">
    <div class="axis-row-id"><h3>${escapeHtml(axis.label)}</h3></div>
    <span class="axis-lean" data-balanced="${balanced}">${escapeHtml(leanText)}</span>
  </header>
  <div class="axis-meter">
    <div class="axis-pole${!balanced && !leaningRight ? ' is-active' : ''}" data-side="left" style="--pole:${axis.leftColor};--pole-ink:${readableInk(axis.leftColor)}">
      <span class="axis-pole-text">
        <span class="axis-pole-name">${escapeHtml(axis.leftPole)}</span>
        <span class="axis-pole-value">${left.toFixed(0)}%</span>
      </span>
    </div>
    <div class="axis-track" role="img" aria-label="${escapeHtml(`${axis.label}: ${axis.leftPole} ${left.toFixed(0)}%, ${axis.rightPole} ${right.toFixed(0)}%`)}">
      <span class="axis-track-center"></span>
      <span class="axis-track-fill" style="left:${fillLeft}%;width:${fillWidth}%"></span>
      <span class="axis-track-thumb" data-balanced="${balanced}" style="left:${position}%"></span>
    </div>
    <div class="axis-pole${!balanced && leaningRight ? ' is-active' : ''}" data-side="right" style="--pole:${axis.rightColor};--pole-ink:${readableInk(axis.rightColor)}">
      <span class="axis-pole-text">
        <span class="axis-pole-name">${escapeHtml(axis.rightPole)}</span>
        <span class="axis-pole-value">${right.toFixed(0)}%</span>
      </span>
    </div>
  </div>
</article>`;
}

function axesSection(L, subjectName, vector) {
  const rows = L.axes.map((axis) => axisRow(L, axis, vector[axis.id] ?? 50)).join('\n');
  return `
<section class="page-section" aria-labelledby="axes-title">
  <h2 id="axes-title">${escapeHtml(L.s.axesTitle)}</h2>
  <p class="section-lead">${escapeHtml(L.s.axesLead(subjectName))}</p>
  <div class="axis-rows">${rows}</div>
</section>`;
}

function relatedCard(href, eyebrow, title, description) {
  return `
<a class="related-card" href="${href}">
  <span class="card-eyebrow">${escapeHtml(eyebrow)}</span>
  <span class="card-title">${escapeHtml(title)}</span>
  <span class="card-desc">${escapeHtml(truncate(description, 120))}</span>
</a>`;
}

function ctaSection(L) {
  return `
<section class="cta-panel">
  <h2>${escapeHtml(L.s.ctaTitle)}</h2>
  <p>${escapeHtml(L.s.ctaText)}</p>
  <a class="primary-button hero-cta" href="/">${escapeHtml(L.s.ctaButton)}
    <svg class="btn-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
  </a>
</section>`;
}

function breadcrumbLd(L, sectionLabel, sectionPath, name, path) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '12 Axes', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: sectionLabel, item: `${SITE}${L.s.prefix}${sectionPath}` },
      { '@type': 'ListItem', position: 3, name, item: `${SITE}${path}` }
    ]
  };
}

// basePath: caminho sem prefixo de locale — usado para gerar os pares hreflang.
function layout(L, { basePath, title, description, ogImage, jsonLd, body }) {
  const path = `${L.s.prefix}${basePath}`;
  const url = `${SITE}${path}`;
  const ldBlocks = jsonLd
    .map((ld) => `<script type="application/ld+json">${JSON.stringify(ld)}</script>`)
    .join('\n    ');
  return `<!doctype html>
<html lang="${L.s.htmlLang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#0B1020" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" hreflang="pt-BR" href="${SITE}${basePath}" />
    <link rel="alternate" hreflang="en" href="${SITE}/en${basePath}" />
    <link rel="alternate" hreflang="x-default" href="${SITE}/en${basePath}" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="12 Axes" />
    <meta property="og:locale" content="${L.s.ogLocale}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${SITE}${ogImage}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${SITE}${ogImage}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap" />
    <link rel="stylesheet" href="/pages.css" />
    ${ldBlocks}
    ${VERCEL_ANALYTICS_SNIPPET}
    ${UMAMI_ANALYTICS_SNIPPET}
  </head>
  <body>
    <div class="page-shell">
      <header class="site-header">
        <a class="brand-lockup" href="/" aria-label="${escapeHtml(L.s.homeAria)}"><span class="brand-num">12</span><span class="brand-word">Axes</span></a>
        <nav class="home-nav" aria-label="${escapeHtml(L.s.sectionsLabel)}">
          <a href="${L.s.prefix}/ideologies">${escapeHtml(L.s.navIdeologies)}</a>
          <a href="${L.s.prefix}/countries">${escapeHtml(L.s.navCountries)}</a>
          <a href="${L.s.prefix}/personalities">${escapeHtml(L.s.navPersonalities)}</a>
        </nav>
      </header>
      <main class="page-main">${body}</main>
      <footer class="page-footer">
        <a class="brand-lockup" href="/"><span class="brand-num">12</span><span class="brand-word">Axes</span></a>
        <nav aria-label="${escapeHtml(L.s.footerLabel)}">
          <a href="/">${escapeHtml(L.s.takeTheTest)}</a>
          <a href="${L.s.prefix}/ideologies">${escapeHtml(L.s.navIdeologies)}</a>
          <a href="${L.s.prefix}/countries">${escapeHtml(L.s.navCountries)}</a>
          <a href="${L.s.prefix}/personalities">${escapeHtml(L.s.navPersonalities)}</a>
          <a href="${L.s.prefix === '' ? '/en' : ''}${basePath}">${L.s.prefix === '' ? 'English' : 'Português'}</a>
        </nav>
        <p>${escapeHtml(L.s.footerTagline)}</p>
      </footer>
    </div>
  </body>
</html>`;
}

function crumbs(L, sectionLabel, sectionPath, name) {
  return `
<nav class="crumbs" aria-label="${escapeHtml(L.s.breadcrumbLabel)}">
  <a href="${L.s.prefix || '/'}">${escapeHtml(L.s.home)}</a><span aria-hidden="true">/</span><a href="${L.s.prefix}${sectionPath}">${escapeHtml(sectionLabel)}</a><span aria-hidden="true">/</span><span>${escapeHtml(name)}</span>
</nav>`;
}

function metaChip(text) {
  return `<span class="intro-meta-item">${escapeHtml(text)}</span>`;
}

// ── Páginas de detalhe ──────────────────────────────────────────────────────
function ideologyPage(L, ideology) {
  const basePath = `/ideologies/${ideology.id}`;
  const country = L.countryById.get(ideology.countryId);
  const personality = L.personalityById.get(ideology.personalityId);
  const vector = ideologyProfiles.get(ideology.id);
  const siblings = L.ideologies
    .filter((i) => i.category === ideology.category && i.id !== ideology.id)
    .slice(0, 6);

  const p = L.s.prefix;
  const related = [
    country && relatedCard(`${p}/countries/${country.id}`, L.s.closestCountry, country.name, country.description),
    personality && relatedCard(`${p}/personalities/${personality.id}`, L.s.associatedPersonality, personality.name, personality.description),
    ...siblings.map((s) => relatedCard(`${p}/ideologies/${s.id}`, s.category, s.name, s.description))
  ].filter(Boolean);

  const body = `
${crumbs(L, L.s.navIdeologies, '/ideologies', ideology.name)}
<section class="entity-hero">
  <span class="intro-eyebrow">${escapeHtml(ideology.category)}</span>
  <h1>${escapeHtml(ideology.name)}</h1>
  <p class="intro-lead">${escapeHtml(ideology.description)}</p>
  <div class="intro-meta">
    ${country ? metaChip(L.s.countryChip(country.name)) : ''}
    ${personality ? metaChip(L.s.referenceChip(personality.name)) : ''}
  </div>
</section>
${axesSection(L, L.s.subjectPrefix(ideology.name, 'ideology'), vector)}
<section class="page-section" aria-labelledby="related-title">
  <h2 id="related-title">${escapeHtml(L.s.relatedTitle)}</h2>
  <div class="related-grid">${related.join('\n')}</div>
</section>
${ctaSection(L)}`;

  return {
    basePath,
    html: layout(L, {
      basePath,
      title: L.s.ideologyTitle(ideology.name),
      description: truncate(ideology.description),
      ogImage: '/logo.png',
      jsonLd: [
        breadcrumbLd(L, L.s.navIdeologies, '/ideologies', ideology.name, `${p}${basePath}`),
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: L.s.ideologyHeadline(ideology.name),
          description: truncate(ideology.description),
          inLanguage: L.s.htmlLang,
          mainEntityOfPage: `${SITE}${p}${basePath}`,
          author: { '@type': 'Organization', name: '12 Axes', url: `${SITE}/` }
        }
      ],
      body
    })
  };
}

function countryPage(L, country) {
  const basePath = `/countries/${country.id}`;
  const vector = countryProfiles.get(country.id);
  const linked = L.ideologiesByCountry.get(country.id) ?? [];
  const p = L.s.prefix;
  const related = linked.map((i) => relatedCard(`${p}/ideologies/${i.id}`, i.category, i.name, i.description));

  const body = `
${crumbs(L, L.s.navCountries, '/countries', country.name)}
<section class="entity-hero has-figure">
  <div class="entity-intro">
    <span class="intro-eyebrow">${escapeHtml(country.category)}</span>
    <h1>${escapeHtml(country.name)}</h1>
    <p class="intro-lead">${escapeHtml(country.description)}</p>
    <div class="intro-meta">
      ${country.historical ? metaChip(L.s.historicalRegime(country.period)) : metaChip(L.s.currentCountry)}
    </div>
  </div>
  <figure class="entity-figure">
    <img src="${country.flagPath}" alt="${escapeHtml(L.s.flagAlt(country.name))}" width="220" loading="lazy" />
  </figure>
</section>
${axesSection(L, country.name, vector)}
${related.length ? `
<section class="page-section" aria-labelledby="related-title">
  <h2 id="related-title">${escapeHtml(L.s.countryIdeologiesTitle)}</h2>
  <div class="related-grid">${related.join('\n')}</div>
</section>` : ''}
${ctaSection(L)}`;

  return {
    basePath,
    html: layout(L, {
      basePath,
      title: L.s.countryTitle(country.name),
      description: truncate(country.description),
      ogImage: country.flagPath,
      jsonLd: [
        breadcrumbLd(L, L.s.navCountries, '/countries', country.name, `${p}${basePath}`),
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: L.s.countryHeadline(country.name),
          description: truncate(country.description),
          inLanguage: L.s.htmlLang,
          mainEntityOfPage: `${SITE}${p}${basePath}`,
          author: { '@type': 'Organization', name: '12 Axes', url: `${SITE}/` }
        }
      ],
      body
    })
  };
}

function personalityPage(L, personality) {
  const basePath = `/personalities/${personality.id}`;
  const vector = personalityProfiles.get(personality.id);
  const linked = L.ideologiesByPersonality.get(personality.id) ?? [];
  const p = L.s.prefix;
  const related = linked.map((i) => relatedCard(`${p}/ideologies/${i.id}`, i.category, i.name, i.description));

  const credit = personality.imageSourceUrl
    ? `<figcaption><a href="${personality.imageSourceUrl}" rel="noopener nofollow" target="_blank">${escapeHtml(personality.imageSourceName || L.s.imageSource)}</a></figcaption>`
    : '';

  const body = `
${crumbs(L, L.s.navPersonalities, '/personalities', personality.name)}
<section class="entity-hero has-figure">
  <div class="entity-intro">
    <span class="intro-eyebrow">${escapeHtml(personality.role)}</span>
    <h1>${escapeHtml(personality.name)}</h1>
    <p class="intro-lead">${escapeHtml(personality.description)}</p>
    <div class="intro-meta">
      ${personality.lifespan ? metaChip(personality.lifespan) : ''}
    </div>
  </div>
  <figure class="entity-figure is-portrait">
    <img src="${personality.imagePath}" alt="${escapeHtml(L.s.portraitAlt(personality.name))}" width="220" loading="lazy" />
    ${credit}
  </figure>
</section>
${axesSection(L, personality.name, vector)}
${related.length ? `
<section class="page-section" aria-labelledby="related-title">
  <h2 id="related-title">${escapeHtml(L.s.personalityIdeologiesTitle)}</h2>
  <div class="related-grid">${related.join('\n')}</div>
</section>` : ''}
${ctaSection(L)}`;

  return {
    basePath,
    html: layout(L, {
      basePath,
      title: L.s.personalityTitle(personality.name),
      description: truncate(personality.description),
      ogImage: personality.imagePath,
      jsonLd: [
        breadcrumbLd(L, L.s.navPersonalities, '/personalities', personality.name, `${p}${basePath}`),
        {
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: personality.name,
            description: truncate(personality.description)
          },
          inLanguage: L.s.htmlLang,
          url: `${SITE}${p}${basePath}`
        }
      ],
      body
    })
  };
}

// ── Páginas de índice ───────────────────────────────────────────────────────
function indexPage(L, { basePath, title, description, heading, lead, groups }) {
  const sections = groups
    .map(
      ({ label, items }) => `
<section class="page-section">
  <h2>${escapeHtml(label)}</h2>
  <div class="related-grid">${items.join('\n')}</div>
</section>`
    )
    .join('\n');

  const body = `
<section class="entity-hero">
  <h1>${escapeHtml(heading)}</h1>
  <p class="intro-lead">${escapeHtml(lead)}</p>
</section>
${sections}
${ctaSection(L)}`;

  return {
    basePath,
    html: layout(L, {
      basePath,
      title,
      description,
      ogImage: '/logo.png',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: heading,
          description,
          inLanguage: L.s.htmlLang,
          url: `${SITE}${L.s.prefix}${basePath}`
        }
      ],
      body
    })
  };
}

function buildIndexes(L) {
  const p = L.s.prefix;
  const ideologyGroups = [...groupBy(L.ideologies, (i) => i.category)].map(([label, items]) => ({
    label,
    items: items.map((i) => relatedCard(`${p}/ideologies/${i.id}`, label, i.name, i.description))
  }));

  const currentCountries = L.countries.filter((c) => !c.historical);
  const historicalCountries = L.countries.filter((c) => c.historical);
  const countryGroups = [
    {
      label: L.s.currentCountriesGroup,
      items: currentCountries.map((c) => relatedCard(`${p}/countries/${c.id}`, c.category, c.name, c.description))
    },
    {
      label: L.s.historicalCountriesGroup,
      items: historicalCountries.map((c) =>
        relatedCard(`${p}/countries/${c.id}`, c.period ? `${c.category} · ${c.period}` : c.category, c.name, c.description)
      )
    }
  ];

  const personalityGroups = [...groupBy(L.personalities, (pers) => pers.role)].map(([label, items]) => ({
    label,
    items: items.map((pers) => relatedCard(`${p}/personalities/${pers.id}`, label, pers.name, pers.description))
  }));

  const n = { i: L.ideologies.length, c: L.countries.length, p: L.personalities.length };

  return [
    indexPage(L, {
      basePath: '/ideologies',
      title: L.s.ideologiesIndexTitle(n.i),
      description: L.s.ideologiesIndexDesc(n.i),
      heading: L.s.ideologiesIndexHeading,
      lead: L.s.ideologiesIndexLead(n.i),
      groups: ideologyGroups
    }),
    indexPage(L, {
      basePath: '/countries',
      title: L.s.countriesIndexTitle(n.c),
      description: L.s.countriesIndexDesc(n.c),
      heading: L.s.countriesIndexHeading,
      lead: L.s.countriesIndexLead(n.c),
      groups: countryGroups
    }),
    indexPage(L, {
      basePath: '/personalities',
      title: L.s.personalitiesIndexTitle(n.p),
      description: L.s.personalitiesIndexDesc(n.p),
      heading: L.s.personalitiesIndexHeading,
      lead: L.s.personalitiesIndexLead(n.p),
      groups: personalityGroups
    })
  ];
}

// ── CSS das páginas (tokens do app + estilos próprios) ─────────────────────
function buildCss() {
  const tokens = readFileSync(join(ROOT, 'src/styles/tokens.css'), 'utf8')
    .replace(/#root\s*{[^}]*}/, '');
  return `${tokens}
/* ── páginas estáticas (geradas por scripts/generate-pages.mjs) ── */
.page-shell{position:relative;z-index:1;display:flex;flex-direction:column;min-height:100dvh;width:min(940px,calc(100% - 48px));margin:0 auto}
.site-header{display:flex;align-items:center;justify-content:space-between;padding:24px 0 14px;flex-shrink:0}
.brand-lockup{display:inline-flex;align-items:baseline;font-family:var(--font-display);font-size:1.25rem;font-weight:800;letter-spacing:-.04em}
.brand-num{background:var(--grad-brand);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.brand-word{color:var(--ink-950)}
.home-nav{display:inline-flex;gap:6px;padding:5px;border:1px solid var(--line);border-radius:var(--radius-lg);background:var(--paper);box-shadow:var(--shadow-xs)}
.home-nav a{display:inline-flex;align-items:center;min-height:34px;padding:0 12px;border-radius:var(--radius-md);color:var(--text-muted);font-size:.82rem;font-weight:700;transition:color var(--dur-base) var(--ease-out),background var(--dur-base) var(--ease-out)}
.home-nav a:hover{color:var(--text-strong);background:var(--ink-50)}
.page-main{flex:1;display:flex;flex-direction:column;gap:clamp(28px,4vw,44px);padding:10px 0 40px}
.crumbs{display:flex;flex-wrap:wrap;align-items:center;gap:8px;color:var(--text-soft);font-size:.8rem;font-weight:600}
.crumbs a{color:var(--text-muted)}
.crumbs a:hover{color:var(--accent-deep)}
.crumbs span:last-child{color:var(--text-strong)}
.entity-hero{display:flex;flex-direction:column;gap:16px}
.entity-hero.has-figure{flex-direction:row;align-items:flex-start;justify-content:space-between;gap:clamp(20px,4vw,44px)}
.entity-intro{display:flex;flex-direction:column;gap:16px;min-width:0}
.entity-hero h1{font-size:clamp(2rem,3.6vw,3.2rem);line-height:1.02;letter-spacing:-.04em;font-weight:700}
.intro-eyebrow{display:inline-flex;align-items:center;gap:10px;width:fit-content;padding:8px 16px 8px 14px;border-radius:var(--radius-pill);background:var(--paper);border:1px solid var(--line);box-shadow:var(--shadow-xs);font-size:.74rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.intro-eyebrow::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px rgba(34,197,94,.18)}
.intro-lead{margin:0;max-width:64ch;color:var(--text-muted);font-size:clamp(1rem,.4vw + .92rem,1.1rem);line-height:1.6}
.intro-meta{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
.intro-meta-item{display:inline-flex;align-items:center;gap:8px;min-height:32px;padding:0 12px;border:1px solid var(--line);border-radius:var(--radius-md);background:var(--paper);color:var(--text-muted);font-size:.82rem;font-weight:600}
.entity-figure{flex-shrink:0;display:flex;flex-direction:column;gap:6px;margin:0}
.entity-figure img{display:block;width:220px;height:auto;border-radius:var(--radius-lg);border:1px solid var(--line-strong);box-shadow:var(--shadow-md);background:var(--paper)}
.entity-figure.is-portrait img{object-fit:cover;aspect-ratio:3/4}
.entity-figure figcaption{color:var(--text-soft);font-size:.7rem;text-align:right}
.entity-figure figcaption a:hover{color:var(--text-muted)}
.page-section{display:flex;flex-direction:column;gap:16px}
.page-section h2{font-size:clamp(1.3rem,2vw,1.7rem);letter-spacing:-.025em}
.section-lead{margin:0;color:var(--text-muted);font-size:.95rem;max-width:70ch}
.axis-rows{display:flex;flex-direction:column;gap:12px}
.axis-row{display:flex;flex-direction:column;gap:16px;padding:18px clamp(16px,2vw,24px);background:var(--paper);border:1px solid var(--line);border-radius:var(--radius-lg);box-shadow:var(--shadow-xs);transition:border-color var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out),transform var(--dur-base) var(--ease-spring)}
.axis-row:hover{border-color:var(--line-strong);box-shadow:var(--shadow-sm);transform:translateY(-1px)}
.axis-row-head{display:flex;align-items:center;justify-content:space-between;gap:12px}
.axis-row-id{display:inline-flex;align-items:center;gap:10px;min-width:0}
.axis-row-id h3{font-family:var(--font-display);font-size:clamp(.98rem,.6vw + .8rem,1.18rem);font-weight:700;letter-spacing:-.015em;color:var(--text-strong);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.axis-lean{flex-shrink:0;display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:var(--radius-pill);background:color-mix(in srgb,var(--axis-dom,var(--accent)) 14%,var(--paper));color:color-mix(in srgb,var(--axis-dom,var(--accent)) 68%,var(--ink-950));border:1px solid color-mix(in srgb,var(--axis-dom,var(--accent)) 26%,transparent);font-size:.72rem;font-weight:700;white-space:nowrap}
.axis-lean::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--axis-dom,var(--accent))}
.axis-lean[data-balanced="true"]{background:var(--ink-50);color:var(--text-muted);border-color:var(--line)}
.axis-lean[data-balanced="true"]::before{background:var(--ink-400)}
.axis-meter{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2.1fr) minmax(0,1fr);grid-template-areas:"lpole track rpole";align-items:center;gap:clamp(10px,1.6vw,18px)}
.axis-pole{display:inline-flex;align-items:center;gap:9px;min-width:0}
.axis-pole[data-side="left"]{grid-area:lpole}
.axis-pole[data-side="right"]{grid-area:rpole;justify-content:flex-end}
.axis-pole-text{display:flex;flex-direction:column;gap:1px;min-width:0}
.axis-pole[data-side="right"] .axis-pole-text{align-items:flex-end;text-align:right}
.axis-pole-name{font-size:.78rem;font-weight:600;line-height:1.2;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.axis-pole-value{font-family:var(--font-display);font-size:.84rem;font-weight:700;color:var(--text-soft);font-variant-numeric:tabular-nums;letter-spacing:-.01em}
.axis-pole.is-active .axis-pole-name{color:var(--text-strong)}
.axis-pole.is-active .axis-pole-value{color:color-mix(in srgb,var(--pole) 70%,var(--ink-950))}
.axis-track{grid-area:track;position:relative;height:10px;border-radius:var(--radius-pill);background:var(--ink-100);box-shadow:inset 0 1px 2px rgba(11,16,32,.07)}
.axis-track-center{position:absolute;top:-4px;bottom:-4px;left:50%;width:2px;transform:translateX(-50%);background:repeating-linear-gradient(var(--ink-300) 0 3px,transparent 3px 6px);border-radius:2px}
.axis-track-fill{position:absolute;top:0;bottom:0;background:linear-gradient(135deg,color-mix(in srgb,var(--axis-dom,var(--accent)) 82%,white) 0%,var(--axis-dom,var(--accent)) 100%);border-radius:var(--radius-pill);box-shadow:0 0 12px -2px color-mix(in srgb,var(--axis-dom,var(--accent)) 55%,transparent)}
.axis-track-thumb{position:absolute;top:50%;width:16px;height:16px;transform:translate(-50%,-50%);border-radius:50%;background:var(--paper);border:3px solid var(--axis-dom,var(--accent));box-shadow:0 2px 7px rgba(11,16,32,.22);z-index:1}
.axis-track-thumb[data-balanced="true"]{border-color:var(--ink-400)}
.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
.related-card{display:flex;flex-direction:column;gap:8px;padding:16px;background:var(--paper);border:1px solid var(--line);border-radius:var(--radius-lg);box-shadow:var(--shadow-xs);transition:border-color var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out),transform var(--dur-base) var(--ease-spring)}
.related-card:hover{border-color:var(--line-strong);box-shadow:var(--shadow-sm);transform:translateY(-2px)}
.card-eyebrow{color:var(--accent-deep);font-size:.68rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
.card-title{font-family:var(--font-display);font-size:1rem;font-weight:700;letter-spacing:-.02em;color:var(--text-strong)}
.card-desc{color:var(--text-muted);font-size:.82rem;line-height:1.5}
.cta-panel{display:flex;flex-direction:column;align-items:flex-start;gap:12px;padding:clamp(22px,3vw,34px);background:var(--paper);border:1px solid var(--line-strong);border-radius:var(--radius-xl);box-shadow:var(--shadow-md)}
.cta-panel h2{font-size:clamp(1.25rem,2vw,1.6rem);letter-spacing:-.03em}
.cta-panel p{margin:0;color:var(--text-muted);max-width:56ch}
.primary-button{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:10px;height:44px;padding:0 18px;border:1px solid var(--accent);border-radius:var(--radius-md);background:var(--accent);color:#fff;font-size:.92rem;font-weight:700;box-shadow:var(--shadow-xs);transition:transform var(--dur-base) var(--ease-spring),box-shadow var(--dur-base) var(--ease-out)}
.primary-button:hover{transform:translateY(-1px);box-shadow:var(--shadow-accent)}
.hero-cta{overflow:hidden;box-shadow:0 16px 34px -18px rgba(34,197,94,.92),0 0 0 5px rgba(34,197,94,.10)}
.btn-arrow{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.page-footer{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;padding:22px 0 30px;border-top:1px solid var(--line);color:var(--text-soft);font-size:.8rem}
.page-footer nav{display:flex;flex-wrap:wrap;gap:16px}
.page-footer nav a{color:var(--text-muted);font-weight:600}
.page-footer nav a:hover{color:var(--accent-deep)}
.page-footer p{margin:0;width:100%}
@media (max-width:760px){
.page-shell{width:calc(100% - 40px)}
.site-header{padding:14px 0 10px}
.home-nav a{padding:0 9px;font-size:.76rem}
.entity-hero.has-figure{flex-direction:column-reverse}
.entity-figure img{width:160px}
.axis-meter{grid-template-columns:1fr 1fr;grid-template-areas:"lpole rpole" "track track";gap:12px 14px}
}`;
}

// ── Montagem por locale ─────────────────────────────────────────────────────
function buildLocaleContext(locale) {
  const ideologies = overlay(baseIdeologies, locale, 'ideologies.json');
  const countries = overlay(baseCountries, locale, 'countries.json');
  const personalities = overlay(basePersonalities, locale, 'personalities.json');
  return {
    s: STR[locale],
    axes: overlay(baseAxes, locale, 'axes.json'),
    ideologies,
    countries,
    personalities,
    countryById: new Map(countries.map((c) => [c.id, c])),
    personalityById: new Map(personalities.map((p) => [p.id, p])),
    ideologiesByCountry: groupBy(ideologies, (i) => i.countryId),
    ideologiesByPersonality: groupBy(ideologies, (i) => i.personalityId)
  };
}

function writePage(prefix, { basePath, html }) {
  const file = join(DIST, `${(prefix + basePath).replace(/^\//, '')}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
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

  const enSeoBlock = `<!-- Primary SEO -->
    <title>12 Axes — Political Quiz and Ideology Test across 12 Axes</title>
    <meta
      name="description"
      content="Discover your political position in 5 minutes with 12 Axes. A free political quiz and ideology test that maps your political spectrum — left, right, center — across 12 axes."
    />
    <meta
      name="keywords"
      content="political test, ideology test, political spectrum, political position, political ideology, left, right, center, liberalism, conservatism, progressivism, libertarianism, socialism, capitalism, democracy, federalism, immigration, international trade, religion in politics, economic policy, political representation, 12 axes, 12axes, political quiz, elections, monarchy, political compass"
    />
    <meta name="author" content="12 Axes" />
    <meta name="application-name" content="12 Axes" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="language" content="English" />
    <link rel="canonical" href="https://12axes.vercel.app/en" />
    <link rel="alternate" hreflang="pt-BR" href="https://12axes.vercel.app/" />
    <link rel="alternate" hreflang="en" href="https://12axes.vercel.app/en" />
    <link rel="alternate" hreflang="x-default" href="https://12axes.vercel.app/en" />

    `;

  const enOgBlock = `<!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="12 Axes" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:url" content="https://12axes.vercel.app/en" />
    <meta property="og:title" content="12 Axes — Political Quiz and Ideology Test across 12 Axes" />
    <meta
      property="og:description"
      content="Discover your political position in 5 minutes. A free political quiz that maps your political spectrum, political ideology, and 12 axes."
    />
    <meta property="og:image" content="https://12axes.vercel.app/logo.png" />
    <meta property="og:image:width" content="512" />
    <meta property="og:image:height" content="512" />
    <meta property="og:image:alt" content="12 Axes logo — a 12-axis political quiz" />

    `;

  const enTwitterBlock = `<!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="12 Axes — Political Quiz and Ideology Test across 12 Axes" />
    <meta
      name="twitter:description"
      content="Discover your political position in 5 minutes with a free political quiz in English."
    />
    <meta name="twitter:image" content="https://12axes.vercel.app/logo.png" />

    `;

  const enWebApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '12 Axes',
    alternateName: ['12 Axes Political Quiz', '12 Axes Ideology Test'],
    url: 'https://12axes.vercel.app/en',
    description:
      'A political quiz and ideology test that maps your political position across 12 axes and returns your political spectrum, compatible ideologies, closest country, and related personality.',
    applicationCategory: 'EducationApplication',
    operatingSystem: 'Web',
    inLanguage: 'en',
    isAccessibleForFree: true,
    image: 'https://12axes.vercel.app/logo.png',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    keywords:
      'political test, ideology test, political spectrum, political position, political ideology, left, right, center, liberalism, conservatism, progressivism, libertarianism, socialism, capitalism, democracy, federalism, immigration, international trade, religion in politics, economic policy, political representation, 12 axes, political quiz, elections, monarchy',
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
      ['Can I take it on my phone?', 'Yes. The interface was designed for mobile and desktop, so you can take the political test in your smartphone browser.']
    ].map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer }
    }))
  };

  const enJsonLdBlocks = [JSON.stringify(enWebApp), JSON.stringify(enFaq)];

  let en = index.replace('<html lang="pt-BR">', '<html lang="en">');
  en = replaceBetween(en, '<!-- Primary SEO -->', '<!-- Icons -->', enSeoBlock);
  en = replaceBetween(en, '<!-- Open Graph -->', '<!-- Twitter -->', enOgBlock);
  en = replaceBetween(en, '<!-- Twitter -->', '<style>', enTwitterBlock);
  // Troca apenas o conteúdo dos dois blocos ld+json (WebApplication e FAQ),
  // preservando os scripts do app que o Vite injeta no <head>.
  let ldIndex = 0;
  en = en.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, (block) =>
    ldIndex < enJsonLdBlocks.length
      ? `<script type="application/ld+json">${enJsonLdBlocks[ldIndex++]}</script>`
      : block
  );
  if (ldIndex !== enJsonLdBlocks.length) {
    throw new Error(`Esperava 2 blocos ld+json no index.html, encontrei ${ldIndex}`);
  }
  writeFileSync(join(DIST, 'en.html'), en);
}

const allPaths = [];
for (const locale of LOCALES) {
  const L = buildLocaleContext(locale);
  const pages = [
    ...buildIndexes(L),
    ...L.ideologies.map((i) => ideologyPage(L, i)),
    ...L.countries.map((c) => countryPage(L, c)),
    ...L.personalities.map((p) => personalityPage(L, p))
  ];
  for (const page of pages) allPaths.push(writePage(L.s.prefix, page));
}

buildHomeVariants();

writeFileSync(join(DIST, 'pages.css'), buildCss());

const today = new Date().toISOString().slice(0, 10);
const sitemapUrls = ['/', '/en', ...allPaths]
  .map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n');
writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`
);

writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`Geradas ${allPaths.length} páginas (${LOCALES.join(', ')}) + sitemap.xml + robots.txt + pages.css em dist/`);
