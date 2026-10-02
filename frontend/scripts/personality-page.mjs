// Página /personalities/:id (e /en/...): perfil de uma personalidade com a
// identidade nova, na mesma lógica da tela de resultados do quiz — o vetor da
// pessoa faz o papel do "usuário" e é comparado com ideologias, outras
// personalidades e países pela mesma fórmula do backend (profile-match.mjs).
import { ARROW, CATEGORY_KEY, SPECTRUM } from './ideologies-index.mjs';
import { AREA_LABELS, catalogHead, initials } from './personalities-index.mjs';
import { dimensionMatches, rank, religionVisibility } from './profile-match.mjs';
import { AXIS_EXPLANATIONS } from './app-strings.mjs';
import { poleSprite, poleUse, profileReligion, religionPoleUse } from './pole-icons.mjs';

const STR = {
  pt: {
    skip: 'Pular para o conteúdo',
    catalogNav: 'Catálogo',
    homeAria: '12 axes, página inicial',
    takeTheTest: 'Fazer o teste',
    kpiSpectrum: 'Espectro mais próximo',
    kpiAssociated: 'Ideologia associada',
    kpiClosestIdeology: 'Ideologia mais próxima',
    kpiClosestPerson: 'Personalidade mais próxima',
    portraitAlt: (name) => `Retrato de ${name}`,
    flagAlt: (name) => `Bandeira: ${name}`,
    tabsAria: 'Seções do perfil',
    tabs: { axes: 'Eixos', ideologies: 'Ideologias', personalities: 'Personalidades', countries: 'Países' },
    ids: { axes: 'eixos', ideologies: 'ideologias', personalities: 'personalidades', countries: 'paises' },
    axesEyebrow: 'Eixos políticos',
    axesTitle: 'Perfil nos 12 eixos',
    distTitle: (name) => `O que distingue ${name}`,
    rareTag: 'Posição mais incomum',
    commonTag: 'Posição mais comum',
    rareText: (name, pole, pct, n) => `${name} puxa mais para ${pole.toLowerCase()} que ${pct}% das ${n} personalidades do catálogo.`,
    rareNote: (axis, name) => `De todos os eixos, ${axis} é onde ${name} mais se afasta do conjunto.`,
    commonText: (axis, name, exact) =>
      exact ? `Em ${axis}, ${name} fica praticamente na mediana do catálogo.` : `Em ${axis}, ${name} fica perto da mediana do catálogo.`,
    commonNote: 'Aqui está em terreno comum com a maioria das personalidades.',
    median: 'Mediana das personalidades',
    ideologyEyebrow: 'Proximidade ideológica',
    ideologyTitle: (name) => `Ideologias de ${name}`,
    closestIdeologies: (n) => `As mais próximas entre as ${n} ideologias`,
    distantIdeology: 'A ideologia mais distante',
    matchWord: 'match',
    personalitiesTitle: 'Personalidades mais próximas',
    mostCompatible: 'Mais compatível',
    alsoByDimension: 'Também próximos, por dimensão',
    dimensionLabels: { political: 'Politicamente', social: 'Socialmente', economic: 'Economicamente' },
    nearSub: 'Outros perfis parecidos',
    farSub: (name) => `Os mais distantes de ${name}`,
    countriesTitle: 'Países mais próximos',
    countryTabsAria: 'Tipo de país',
    currentTab: 'País atual',
    historicalTab: 'Experiência histórica',
    currentKicker: 'País mais compatível',
    historicalKicker: 'Experiência histórica mais compatível',
    ctaTitle: 'E você, com quem se parece?',
    ctaText: (name) => `Responda ao quiz e veja sua compatibilidade com ${name}, ideologias, países e outras personalidades nos 12 eixos.`,
    footer: 'Quiz político independente · 12axes.vercel.app'
  },
  en: {
    skip: 'Skip to content',
    catalogNav: 'Catalog',
    homeAria: '12 axes, home page',
    takeTheTest: 'Take the test',
    kpiSpectrum: 'Closest spectrum',
    kpiAssociated: 'Associated ideology',
    kpiClosestIdeology: 'Closest ideology',
    kpiClosestPerson: 'Closest personality',
    portraitAlt: (name) => `Portrait of ${name}`,
    flagAlt: (name) => `Flag: ${name}`,
    tabsAria: 'Profile sections',
    tabs: { axes: 'Axes', ideologies: 'Ideologies', personalities: 'Personalities', countries: 'Countries' },
    ids: { axes: 'axes', ideologies: 'ideologies', personalities: 'personalities', countries: 'countries' },
    axesEyebrow: 'Political axes',
    axesTitle: 'Profile across the 12 axes',
    distTitle: (name) => `What sets ${name} apart`,
    rareTag: 'Most unusual position',
    commonTag: 'Most common position',
    rareText: (name, pole, pct, n) => `${name} leans further toward ${pole.toLowerCase()} than ${pct}% of the ${n} personalities in the catalog.`,
    rareNote: (axis, name) => `Of all the axes, ${axis} is where ${name} stands furthest from the rest.`,
    commonText: (axis, name, exact) =>
      exact ? `On ${axis}, ${name} sits practically at the catalog median.` : `On ${axis}, ${name} sits close to the catalog median.`,
    commonNote: 'Here they share common ground with most personalities.',
    median: 'Personality median',
    ideologyEyebrow: 'Ideological proximity',
    ideologyTitle: (name) => `${name}'s ideologies`,
    closestIdeologies: (n) => `The closest among the ${n} ideologies`,
    distantIdeology: 'The most distant ideology',
    matchWord: 'match',
    personalitiesTitle: 'Closest personalities',
    mostCompatible: 'Most compatible',
    alsoByDimension: 'Also close, by dimension',
    dimensionLabels: { political: 'Politically', social: 'Socially', economic: 'Economically' },
    nearSub: 'Other similar profiles',
    farSub: (name) => `Furthest from ${name}`,
    countriesTitle: 'Closest countries',
    countryTabsAria: 'Country type',
    currentTab: 'Modern country',
    historicalTab: 'Historical experience',
    currentKicker: 'Most compatible country',
    historicalKicker: 'Most compatible historical experience',
    ctaTitle: 'And you, who do you resemble?',
    ctaText: (name) => `Take the quiz and see your compatibility with ${name}, ideologies, countries and other personalities across the 12 axes.`,
    footer: 'Independent political quiz · 12axes.vercel.app'
  }
};

const ARR = '<svg class="arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';
const pct = (x) => Math.round(x);

export function spectrumOf(category) {
  const key = CATEGORY_KEY[category.trim().toLowerCase()];
  return SPECTRUM.find((s) => s.key === key) ?? SPECTRUM.find((s) => s.key === 'centro');
}

function intensity(distance, labels) {
  if (distance < 7.5) return labels[0];
  if (distance < 22.5) return labels[1];
  if (distance < 37.5) return labels[2];
  return labels[3];
}

// Mediana por eixo de um catálogo (personalidades ou ideologias) (calculada uma vez por mapa).
const medianCache = new WeakMap();
export function catalogStats(axes, profiles) {
  if (medianCache.has(profiles)) return medianCache.get(profiles);
  const vectors = [...profiles.values()];
  const stats = new Map();
  for (const axis of axes) {
    const values = vectors.map((v) => v?.[axis.id] ?? 50).sort((a, b) => a - b);
    const mid = values.length >> 1;
    const median = values.length % 2 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
    stats.set(axis.id, { values, median });
  }
  medianCache.set(profiles, stats);
  return stats;
}


// Eixo mais incomum e mais comum do vetor em relação à mediana do catálogo.
export function distinctive(axes, vector, profiles) {
  const stats = catalogStats(axes, profiles);
  const deviations = axes.map((axis) => {
    const left = vector[axis.id] ?? 50;
    const { values, median } = stats.get(axis.id);
    return { axis, left, median, values, dev: Math.abs(left - median) };
  });
  const rare = deviations.reduce((a, b) => (b.dev > a.dev ? b : a));
  const common = deviations.reduce((a, b) => (b.dev < a.dev ? b : a));
  const towardLeft = rare.left >= rare.median;
  const beaten = rare.values.filter((x) => (towardLeft ? x < rare.left : x > rare.left)).length;
  return {
    rare,
    common,
    rarePct: pct((100 * beaten) / rare.values.length),
    rarePole: towardLeft ? rare.axis.leftPole : rare.axis.rightPole
  };
}

export function mbarHtml(d, strong, medianLabel, youLabel, esc) {
  return `<div class="mbar" aria-hidden="true"><span class="mtrack"></span><span class="mmed" style="left:${d.median.toFixed(1)}%"></span><span class="myou${strong ? ' strong' : ''}" style="left:${d.left.toFixed(1)}%"></span></div><div class="mlab"><span>${esc(medianLabel)} ${pct(d.median)}</span><b>${esc(youLabel)} ${pct(d.left)}</b></div>`;
}

const INFO_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16m-1-4h2v2h-2zm0-1.992s2-.008 2 0C13 13.006 16 12 16 10c0-2.21-1.773-4-3.991-4A4 4 0 0 0 8 10h2c0-1.1.9-2 2-2s2 .9 2 2c0 .9-3 2.367-3 4.008"/></svg>';
const BALANCED_COLOR = '#9C988C';
const AXIS_INFO = {
  pt: { aria: (label) => `O que significa o eixo ${label}?`, close: 'Fechar' },
  en: { aria: (label) => `What does the ${label} axis mean?`, close: 'Close' }
};

// Barras dos 12 eixos, iguais às da tela de resultados (AxesSection.tsx):
// ícones de polo preenchidos, cinza quando equilibrado e helper "?" que abre
// a explicação do eixo (texto do i18n do app).
export function axisRowsHtml(L, vector, esc, locale, religions = []) {
  const info = AXIS_INFO[locale];
  const religion = profileReligion(religions);
  return L.axes
    .map((axis) => {
      const left = Math.max(0, Math.min(100, vector[axis.id] ?? 50));
      const right = 100 - left;
      const dist = Math.abs(left - 50);
      const balanced = dist < 7.5;
      const leftWins = !balanced && left > 50;
      const rightWins = !balanced && !leftWins;
      const ac = balanced ? BALANCED_COLOR : leftWins ? axis.leftColor : axis.rightColor;
      const level = intensity(dist, L.s.intensity);
      const pole = leftWins ? axis.leftPole : axis.rightPole;
      const tag = balanced ? level : `${level} · ${pole}`;
      const sheetTitle = balanced ? esc(level) : `<span>${pct(leftWins ? left : right)}%</span> ${esc(pole)}`;
      const fill = `<i style="width:${(dist * 2).toFixed(0)}%"></i>`;
      const helper = `<button class="axis-info" type="button" aria-label="${esc(info.aria(axis.label))}" data-label="${esc(axis.label)}" data-title="${esc(sheetTitle)}" data-text="${esc(AXIS_EXPLANATIONS[locale][axis.id] ?? '')}" data-ac="${ac}">${INFO_ICON}</button>`;
      return `<li class="axis-row" style="--ac:${ac};--al:${axis.leftColor};--ar:${axis.rightColor}"><div class="axis-row-head"><div class="axis-title"><h3>${esc(axis.label)}</h3>${helper}</div><span class="itag"><span class="idot"></span>${esc(tag)}</span></div><div class="axis-bar"><div class="pole left${leftWins ? ' win' : ''}">${poleUse(axis.id, 'left', ' class="pico" width="18" height="18"')}<span><b>${esc(axis.leftPole)}</b><em>${pct(left)}%</em></span></div><div class="atrack" role="img" aria-label="${esc(`${axis.label}: ${axis.leftPole} ${pct(left)}%, ${axis.rightPole} ${pct(right)}%`)}"><div class="ahalf l">${leftWins ? fill : ''}</div><div class="ahalf r">${rightWins ? fill : ''}</div><span class="amid"></span><span class="adot" style="left:${right.toFixed(1)}%"></span></div><div class="pole right${rightWins ? ' win' : ''}"><span><b>${esc(axis.rightPole)}</b><em>${pct(right)}%</em></span>${axis.id === 'religiao' && religion ? religionPoleUse(religion, ' class="pico" width="18" height="18" aria-hidden="true"') : poleUse(axis.id, 'right', ' class="pico" width="18" height="18"')}</div></div></li>`;
    })
    .join('');
}

// Janela da explicação do eixo (uma por página, preenchida pelo PAGE_SCRIPT).
export function axisSheetHtml(locale) {
  return `<div class="sheet-backdrop" id="axis-sheet" hidden><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="axis-sheet-title"><span class="sheet-handle" aria-hidden="true"></span><button class="sheet-close" type="button" aria-label="${AXIS_INFO[locale].close}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button><p class="sheet-label"></p><h3 id="axis-sheet-title"></h3><p class="sheet-text"></p></div></div>`;
}

export function personalityPage(L, personality, ctx) {
  const { locale, site, gaSnippet, escapeHtml, truncate, profiles } = ctx;
  const esc = escapeHtml;
  const t = STR[locale];
  const prefix = L.s.prefix;
  const home = prefix || '/';
  const vector = profiles.personality.get(personality.id) ?? {};
  const name = personality.name;
  const img = (src, alt, cls, who) =>
    `<img class="${cls}" src="${src}" alt="${esc(alt)}" loading="lazy" decoding="async" data-i="${esc(initials(who))}">`;

  // ── ideologias ──
  const visible = religionVisibility(personality);
  const rankedIdeologies = rank(vector, L.ideologies.filter(visible), (i) => profiles.ideology.get(i.id));
  const associated = L.ideologiesByPersonality.get(personality.id) ?? [];
  const topIdeology = rankedIdeologies[0];
  const otherIdeologies = rankedIdeologies.slice(0, 3);
  const distantIdeology = rankedIdeologies[rankedIdeologies.length - 1];
  const spec = spectrumOf(topIdeology.item.category);

  // ── personalidades ──
  const others = L.personalities.filter((p) => p.id !== personality.id && visible(p));
  const personVector = (p) => profiles.personality.get(p.id);
  const rankedPeople = rank(vector, others, personVector);
  const topPerson = rankedPeople[0];
  const personDims = dimensionMatches(vector, others, personVector, [topPerson.item.id]);
  const shownPeople = new Set([topPerson.item.id, ...personDims.map((d) => d.item.id)]);
  const nearPeople = rankedPeople.filter((r) => !shownPeople.has(r.item.id)).slice(0, 8);
  const farPeople = rankedPeople.slice(-3).reverse();

  // ── países (atual x histórico, como na tela de resultado) ──
  const countryVector = (c) => profiles.country.get(c.id);
  const countryGroups = [false, true].map((historical) => {
    const pool = L.countries.filter((c) => Boolean(c.historical) === historical && visible(c));
    const ranked = rank(vector, pool, countryVector);
    const top = ranked[0];
    return {
      historical,
      top,
      dims: dimensionMatches(vector, pool, countryVector, [top.item.id]),
      far: ranked.slice(-3).reverse()
    };
  });

  const { rare, common, rarePct, rarePole } = distinctive(L.axes, vector, profiles.personality);
  const mbar = (d, strong) => mbarHtml(d, strong, t.median, name, esc);
  const axisRows = axisRowsHtml(L, vector, esc, locale, personality.religions);

  const catVars = (category) => {
    const s = spectrumOf(category);
    return `--c:${s.c};--cb:${s.cb}`;
  };

  const ideologyCard = ({ item }) =>
    `<li class="ocard" style="${catVars(item.category)}"><a href="${prefix}/ideologies/${item.id}"><div class="ocard-head"><div class="ocard-top"><span class="tag osolid">${esc(item.category)}</span></div><h3>${esc(item.name)}</h3></div><p>${esc(item.description)}</p></a></li>`;


  const personHref = (p) => `${prefix}/personalities/${p.id}`;
  const countryHref = (c) => `${prefix}/countries/${c.id}`;
  const countryCaption = (c) => (c.historical && c.period ? c.period : c.category);

  const dimRow = (d, visual, href, caption) =>
    `<li><a class="dim-row" href="${href}">${visual}<div><span class="dim">${esc(t.dimensionLabels[d.dimension])}</span><strong>${esc(d.item.name)}</strong><small>${esc(caption)}</small></div><span class="pctc">${pct(d.score)}%</span></a></li>`;

  const farRow = (r, href, caption) =>
    `<li><a class="far-row" href="${href}"><div><strong>${esc(r.item.name)}</strong><small>${esc(caption)}</small></div><span>${pct(r.score)}%</span></a></li>`;

  const tp = topPerson.item;
  const personalitiesPanel = `<div class="panel"><h2>${esc(t.personalitiesTitle)}</h2>
      <a class="match" href="${personHref(tp)}">${img(tp.imagePath, t.portraitAlt(tp.name), 'portrait', tp.name)}<div>
        <div class="match-tags"><span class="tag tag-cat">${esc(t.mostCompatible)}</span><span class="tag tag-solid">${pct(topPerson.score)}% ${t.matchWord}</span></div>
        <h3>${esc(tp.name)}</h3><div class="match-tags">${[tp.role, tp.lifespan].filter(Boolean).map((x) => `<span class="tag tag-neutral">${esc(x)}</span>`).join('')}</div>
        <p>${esc(tp.description)}</p></div></a>
      <p class="sub">${esc(t.alsoByDimension)}</p><ul class="dims">${personDims.map((d) => dimRow(d, img(d.item.imagePath, t.portraitAlt(d.item.name), 'avatar', d.item.name), personHref(d.item), d.item.role)).join('')}</ul>
      <p class="sub">${esc(t.nearSub)}</p><ul class="near-grid">${nearPeople.map((r) => `<li><a class="near" href="${personHref(r.item)}">${img(r.item.imagePath, t.portraitAlt(r.item.name), 'avatar', r.item.name)}<div><span class="tag tag-neutral">${esc(AREA_LABELS[locale][r.item.category] ?? '')}</span><strong>${esc(r.item.name)}</strong><small>${esc(r.item.role)}</small><span class="pctc">${pct(r.score)}%</span></div></a></li>`).join('')}</ul>
      <p class="sub">${esc(t.farSub(name))}</p><ul class="fars">${farPeople.map((r) => farRow(r, personHref(r.item), r.item.role)).join('')}</ul>
    </div>`;

  const countryPanel = (g) => {
    const c = g.top.item;
    const id = g.historical ? 'c-hist' : 'c-atual';
    return `<div class="cpanel" id="${id}" role="tabpanel"${g.historical ? ' hidden' : ''}><a class="match" href="${countryHref(c)}">${img(c.flagPath, t.flagAlt(c.name), 'flagbig', c.name)}<div><div class="match-tags"><span class="tag tag-cat">${esc(g.historical ? t.historicalKicker : t.currentKicker)}</span><span class="tag tag-solid">${pct(g.top.score)}% ${t.matchWord}</span></div><h3>${esc(c.name)}</h3><span class="tag tag-neutral">${esc(countryCaption(c))}</span><p>${esc(c.description)}</p></div></a><p class="sub">${esc(t.alsoByDimension)}</p><ul class="dims">${g.dims.map((d) => dimRow(d, img(d.item.flagPath, t.flagAlt(d.item.name), 'flagimg', d.item.name), countryHref(d.item), countryCaption(d.item))).join('')}</ul><p class="sub">${esc(t.farSub(name))}</p><ul class="fars">${g.far.map((r) => farRow(r, countryHref(r.item), countryCaption(r.item))).join('')}</ul></div>`;
  };

  const distSpec = spectrumOf(distantIdeology.item.category);
  const ideologiesPanel = `<div class="panel"><p class="eyebrow">${esc(t.ideologyEyebrow)}</p><h2>${esc(t.ideologyTitle(name))}</h2>
      <p class="sub first">${esc(t.closestIdeologies(L.ideologies.length))}</p><ul class="others">${otherIdeologies.map(ideologyCard).join('')}</ul>
      <p class="sub">${esc(t.distantIdeology)}</p>
      <a class="distant" href="${prefix}/ideologies/${distantIdeology.item.id}"><strong>${esc(distantIdeology.item.name)}</strong><span class="tag" style="background:${distSpec.cb};color:${distSpec.c}">${esc(distantIdeology.item.category)}</span><span>${pct(distantIdeology.score)}%</span></a>
    </div>`;

  const kpiIdeology = associated[0]
    ? [t.kpiAssociated, associated[0].name]
    : [t.kpiClosestIdeology, topIdeology.item.name];

  const credit = personality.imageSourceUrl
    ? `<figcaption><a href="${esc(personality.imageSourceUrl)}" rel="noopener nofollow" target="_blank">${esc(personality.imageSourceName || L.s.imageSource)}</a></figcaption>`
    : '';

  const tabIds = t.ids;
  const tabButton = (key, first) =>
    `<button role="tab" id="t-${tabIds[key]}" aria-controls="${tabIds[key]}" aria-selected="${first}"${first ? '' : ' tabindex="-1"'}>${esc(t.tabs[key])}</button>`;

  const basePath = `/personalities/${personality.id}`;
  const description = truncate(personality.description);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '12 Axes', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: L.s.navPersonalities, item: `${site}${prefix}/personalities` },
        { '@type': 'ListItem', position: 3, name, item: `${site}${prefix}${basePath}` }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      mainEntity: { '@type': 'Person', name, description },
      inLanguage: L.s.htmlLang,
      url: `${site}${prefix}${basePath}`
    }
  ];

  const html = `<!doctype html>
<html lang="${L.s.htmlLang}">
  ${catalogHead(L, { site, basePath, title: L.s.personalityTitle(name), description, ogType: 'profile', ogImage: personality.imagePath, css: '/profile.css', jsonLd, gaSnippet, escapeHtml })}
  <body style="--cat:${spec.c};--cat-bg:${spec.cb}">
${poleSprite(L.axes)}
<a class="skip" href="#main">${esc(t.skip)}</a>
<header class="nav"><div class="wrap">
  <a class="logo" href="${home}" aria-label="${esc(t.homeAria)}"><b>12</b><span>axes</span></a>
  <nav class="navl" aria-label="${esc(t.catalogNav)}"><a href="${prefix}/ideologies">${esc(L.s.navIdeologies)}</a><a href="${prefix}/countries">${esc(L.s.navCountries)}</a><a href="${prefix}/personalities" aria-current="page">${esc(L.s.navPersonalities)}</a></nav>
  <a class="btn btn-primary btn-sm" href="${home}">${esc(t.takeTheTest)} ${ARR}</a>
</div></header>

<main id="main" class="res"><div class="wrap">
  <p class="crumbs"><a href="${home}">${esc(L.s.home)}</a> / <a href="${prefix}/personalities">${esc(L.s.navPersonalities)}</a> / <span aria-current="page">${esc(name)}</span></p>
  <article class="panel phero">
    <div class="ph-txt">
      <div class="match-tags"><span class="tag tag-solid">${esc(personality.role)}</span><span class="tag tag-neutral">${esc(AREA_LABELS[locale][personality.category] ?? '')}</span>${personality.lifespan ? `<span class="tag tag-neutral">${esc(personality.lifespan)}</span>` : ''}</div>
      <h1>${esc(name)}</h1>
      <p class="lead">${esc(personality.description)}</p>
      <dl class="kpis">
        <div><dt>${esc(t.kpiSpectrum)}</dt><dd class="c">${esc(topIdeology.item.category)}</dd></div>
        <div><dt>${esc(kpiIdeology[0])}</dt><dd>${esc(kpiIdeology[1])}</dd></div>
        <div><dt>${esc(t.kpiClosestPerson)}</dt><dd>${esc(tp.name)}</dd></div>
      </dl>
    </div>
    <figure class="ph-img"><img src="${personality.imagePath}" alt="${esc(t.portraitAlt(name))}" data-i="${esc(initials(name))}">${credit}</figure>
  </article>

  <div class="ptabs-wrap"><div class="ptabs" role="tablist" aria-label="${esc(t.tabsAria)}">
    ${tabButton('axes', true)}
    ${tabButton('ideologies', false)}
    ${tabButton('personalities', false)}
    ${tabButton('countries', false)}
  </div></div>

  <section class="tp" id="${tabIds.axes}" role="tabpanel" aria-labelledby="t-${tabIds.axes}">
    <div class="panel"><p class="eyebrow">${esc(t.axesEyebrow)}</p><h2>${esc(t.axesTitle)}</h2><ul class="axes-list">${axisRows}</ul></div>
    <div class="panel"><h2>${esc(t.distTitle(name))}</h2><div class="dist">
      <article class="dcard strong"><span class="tag tag-cat">${esc(t.rareTag)}</span><h3>${esc(rare.axis.label)}</h3>
        <p>${esc(t.rareText(name, rarePole, rarePct, rare.values.length))}</p>${mbar(rare, true)}
        <p>${esc(t.rareNote(rare.axis.label, name))}</p></article>
      <article class="dcard"><span class="tag tag-neutral">${esc(t.commonTag)}</span><h3>${esc(common.axis.label)}</h3>
        <p>${esc(t.commonText(common.axis.label, name, common.dev < 5))}</p>${mbar(common, false)}
        <p>${esc(t.commonNote)}</p></article>
    </div></div>
  </section>

  <section class="tp" id="${tabIds.ideologies}" role="tabpanel" aria-labelledby="t-${tabIds.ideologies}" hidden>
    ${ideologiesPanel}
  </section>

  <section class="tp" id="${tabIds.personalities}" role="tabpanel" aria-labelledby="t-${tabIds.personalities}" hidden>
    ${personalitiesPanel}
  </section>

  <section class="tp" id="${tabIds.countries}" role="tabpanel" aria-labelledby="t-${tabIds.countries}" hidden>
    <div class="panel"><h2>${esc(t.countriesTitle)}</h2>
      <div class="tabs ctabs" role="tablist" aria-label="${esc(t.countryTabsAria)}"><button role="tab" aria-selected="true" aria-controls="c-atual">${esc(t.currentTab)}</button><button role="tab" aria-selected="false" aria-controls="c-hist">${esc(t.historicalTab)}</button></div>
      ${countryGroups.map(countryPanel).join('')}
    </div>
  </section>

  <aside class="panel pcta"><div><h2>${esc(t.ctaTitle)}</h2><p>${esc(t.ctaText(name))}</p></div><a class="btn btn-primary" href="${home}">${esc(t.takeTheTest)} ${ARR}</a></aside>
</div></main>
<footer class="foot"><div class="wrap"><a class="logo" href="${home}"><b>12</b><span>axes</span></a><p>${esc(t.footer)} · <a href="${prefix === '' ? '/en' : ''}${basePath}">${prefix === '' ? 'English' : 'Português'}</a></p></div></footer>
${axisSheetHtml(locale)}
<script>
${PAGE_SCRIPT}</script>
  </body>
</html>`;

  return { basePath, html };
}

// Abas, sub-abas de país e fallback de imagem — comum às páginas de perfil.
export const PAGE_SCRIPT = `const tabs=[...document.querySelectorAll('.ptabs [role=tab]')];
const nav=document.querySelector('.nav');
const setNav=()=>document.documentElement.style.setProperty('--navh',nav.offsetHeight+'px');setNav();addEventListener('resize',setNav);
function show(id,push){tabs.forEach(t=>{const on=t.getAttribute('aria-controls')===id;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!on});
  if(push)history.replaceState(null,'','#'+id);}
tabs.forEach((t,i)=>{t.addEventListener('click',()=>{show(t.getAttribute('aria-controls'),true);const w=document.querySelector('.ptabs-wrap');const nh=nav.offsetHeight;if(w.getBoundingClientRect().top<=nh+1)window.scrollTo({top:w.offsetTop-nh,behavior:'auto'})});
  t.addEventListener('keydown',e=>{let j=e.key==='ArrowRight'?i+1:e.key==='ArrowLeft'?i-1:null;if(j===null)return;j=(j+tabs.length)%tabs.length;tabs[j].focus();tabs[j].click()})});
const h=location.hash.slice(1);if(tabs.some(t=>t.getAttribute('aria-controls')===h))show(h,false);
document.querySelectorAll('.ctabs').forEach(g=>{const bs=[...g.querySelectorAll('button')];bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>{const on=x===b;x.setAttribute('aria-selected',on);document.getElementById(x.getAttribute('aria-controls')).hidden=!on})}))});
function fallback(im){const s=document.createElement('span');s.className=im.className+' ini'+(im.closest('.ph-img')?' big':'');s.textContent=im.dataset.i||'';s.setAttribute('aria-hidden','true');im.replaceWith(s)}
document.querySelectorAll('img[data-i]').forEach(im=>{if(im.complete&&!im.naturalWidth)fallback(im);else im.addEventListener('error',()=>fallback(im))});
const sheet=document.getElementById('axis-sheet');
if(sheet){const box=sheet.querySelector('.sheet');let opener=null;
  const close=()=>{sheet.hidden=true;document.body.style.overflow='';if(opener)opener.focus()};
  document.querySelectorAll('.axis-info').forEach(b=>b.addEventListener('click',()=>{opener=b;box.style.setProperty('--ac',b.dataset.ac);
    sheet.querySelector('.sheet-label').textContent=b.dataset.label;sheet.querySelector('h3').innerHTML=b.dataset.title;sheet.querySelector('.sheet-text').textContent=b.dataset.text;
    sheet.hidden=false;document.body.style.overflow='hidden';sheet.querySelector('.sheet-close').focus()}));
  sheet.addEventListener('click',e=>{if(e.target===sheet)close()});sheet.querySelector('.sheet-close').addEventListener('click',close);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!sheet.hidden)close()})}
`;

// CSS comum às páginas de perfil (personalidade e ideologia).
export const PROFILE_CSS = `:root{
  --papel:#F4F1E8;--floresta:#102E24;--carmim:#880912;--tinta:#101010;
  --superficie:#FBF9F3;--borda:#E2DDCF;--neutro:#ECE8DC;--texto-suave:#5B5A55;
  --font-display:'Sora',system-ui,sans-serif;--font-body:'Poppins',system-ui,sans-serif;
  --cat:#4B5058;--cat-bg:#DDE0E3;--r-lg:28px;--r-md:20px;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--papel);color:var(--tinta);font-family:var(--font-body);font-size:16px;line-height:1.65;-webkit-font-smoothing:antialiased}
img{display:block;max-width:100%}
a{color:inherit}
ul,ol{list-style:none}
.wrap{max-width:1040px;margin:0 auto;padding:0 24px}
.ico{width:22px;height:22px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.arr{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.skip{position:absolute;left:-999px}.skip:focus{left:16px;top:16px;background:var(--tinta);color:var(--papel);padding:8px 16px;border-radius:40px;z-index:99}
:focus-visible{outline:3px solid var(--carmim);outline-offset:3px}
.logo{display:inline-flex;align-items:baseline;gap:.16em;text-decoration:none;font-size:26px;line-height:1}
.logo b{font-family:var(--font-display);font-weight:800;letter-spacing:-.04em;color:var(--floresta)}
.logo span{font-family:var(--font-body);font-weight:400;letter-spacing:-.01em}
.eyebrow{font-size:12.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--carmim);margin-bottom:10px}
.eyebrow::before{content:"— "}
h1,h2,h3,h4{font-family:var(--font-display);font-weight:600;line-height:1.1}
h2{font-size:clamp(32px,4vw,48px);letter-spacing:-.03em}
h3{font-size:20px;letter-spacing:-.01em;line-height:1.25}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:15px 28px;border-radius:999px;font-weight:500;font-size:15px;text-decoration:none;transition:transform .15s ease,background .15s ease;white-space:nowrap;border:2px solid transparent;cursor:pointer}
.btn:hover{transform:translateY(-1px)}
.btn-primary{background:var(--floresta);color:var(--papel)}
.btn-primary:hover{background:#1B4234}
.btn-sm{padding:10px 20px;font-size:14px}
.nav{position:sticky;top:0;z-index:20;background:rgba(244,241,232,.9);backdrop-filter:blur(10px);border-bottom:1px solid var(--borda)}
.nav .wrap{display:flex;align-items:center;justify-content:space-between;height:68px;gap:24px;max-width:1200px}
.navl{display:flex;gap:24px;font-size:14.5px}.navl a{text-decoration:none;color:var(--texto-suave)}.navl a:hover{color:var(--tinta)}.navl a[aria-current]{color:var(--tinta);font-weight:600}
.res{padding:32px 0 80px}
.crumbs{font-size:13px;color:var(--texto-suave);margin-bottom:18px}.crumbs a{text-decoration:none}.crumbs a:hover{text-decoration:underline}.crumbs span{color:var(--tinta)}
.panel{background:var(--superficie);border:1px solid var(--borda);border-radius:var(--r-lg);padding:36px}
.panel>h2{font-size:clamp(26px,3vw,34px);margin-bottom:28px}
.lead{color:var(--texto-suave)}
.tag{display:inline-block;font-size:13px;font-weight:600;padding:5px 14px;border-radius:999px;white-space:nowrap}
.tag-solid{background:var(--cat);color:var(--papel)}
.tag-cat{background:var(--cat-bg);color:var(--cat)}
.tag-neutral{background:var(--neutro);color:var(--tinta);font-weight:500}
.osolid{background:var(--c);color:var(--papel)}
/* hero */
.phero{display:grid;grid-template-columns:1fr 280px;gap:40px;align-items:start;padding:0;overflow:hidden;border-top:6px solid var(--cat)}
.ph-txt{padding:36px 0 36px 36px}
.phero h1{font-size:clamp(40px,5.6vw,68px);letter-spacing:-.04em;line-height:1.02;margin:14px 0}
.phero .lead{font-size:16.5px;max-width:620px}
.kpis{display:grid;grid-template-columns:repeat(3,1fr);margin-top:26px;border-top:1px solid var(--borda)}
.kpis div{padding:14px 16px 0 0}.kpis div+div{padding-left:16px;border-left:1px solid var(--borda)}
.kpis dt{font-size:12px;color:var(--texto-suave)}.kpis dd{font-family:var(--font-display);font-weight:600;font-size:17px;line-height:1.25;margin-top:2px}.kpis dd.c{color:var(--cat)}
.ph-img{margin:0;align-self:stretch;position:relative;background:var(--cat-bg);min-height:340px}
.ph-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 20%}
.ph-img figcaption{position:absolute;right:10px;bottom:10px;font-size:11px;color:#fff;background:rgba(16,16,16,.55);padding:3px 8px;border-radius:999px}
.ph-img figcaption a{text-decoration:none}
.ini{display:grid;place-items:center;background:var(--cat-bg);color:var(--cat);font-family:var(--font-display);font-weight:700}
.ini.big{position:absolute;inset:0;font-size:72px}
/* tabs */
.ptabs-wrap{position:sticky;top:var(--navh,68px);z-index:19;background:rgba(244,241,232,.94);backdrop-filter:blur(10px);margin:24px -8px 20px;padding:10px 8px}
.ptabs{display:flex;gap:4px;background:var(--neutro);padding:5px;border-radius:999px;width:fit-content;max-width:100%;overflow-x:auto;scrollbar-width:none}
.ptabs::-webkit-scrollbar{display:none}
.ptabs button{flex:none;border:0;background:none;font:500 15px var(--font-body);color:var(--texto-suave);padding:10px 22px;border-radius:999px;cursor:pointer}
.ptabs button:hover{color:var(--tinta)}
.ptabs button[aria-selected=true]{background:var(--tinta);color:var(--papel)}
.tp{display:flex;flex-direction:column;gap:24px}.tp[hidden]{display:none}
.tabs{display:inline-flex;gap:4px;background:var(--neutro);padding:5px;border-radius:999px;margin-bottom:24px;max-width:100%}
.tabs button{border:0;background:none;font:500 14px var(--font-body);color:var(--texto-suave);padding:8px 18px;border-radius:999px;cursor:pointer}
.tabs button[aria-selected=true]{background:var(--tinta);color:var(--papel)}
.cpanel[hidden]{display:none}
/* axes */
.axes-list{border-top:1px solid var(--tinta)}
.axis-row{padding:20px 0;border-bottom:1px solid var(--borda)}
.axis-row:last-child{border-bottom:0}
.axis-row-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px}
.axis-row-head h3{font-size:19px}
.axis-title{display:flex;align-items:center;gap:6px;min-width:0}
.axis-info{display:inline-grid;place-items:center;width:28px;height:28px;margin:-4px 0;padding:0;border:0;border-radius:50%;background:none;color:var(--texto-suave);cursor:pointer;flex:none;transition:color .15s ease,background .15s ease}
.axis-info svg{width:18px;height:18px}
.axis-info:hover{color:var(--tinta);background:var(--borda)}
.itag{display:inline-flex;align-items:center;gap:8px;font-size:12.5px;font-weight:600;padding:5px 12px;border-radius:999px;background:color-mix(in srgb,var(--ac) 14%,var(--superficie));color:var(--tinta);white-space:nowrap}
.idot{width:8px;height:8px;border-radius:50%;background:var(--ac)}
.axis-bar{display:grid;grid-template-columns:200px 1fr 200px;gap:18px;align-items:center}
.pole{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:14px;border:1px solid var(--borda);background:var(--superficie);min-width:0}
.pole.right{justify-content:flex-end;text-align:right}
.pole .pico{width:18px;height:18px;color:var(--texto-suave);flex:none;fill:currentColor}
.pole span{display:flex;flex-direction:column;line-height:1.25;min-width:0}
.pole b{font-size:13.5px;font-weight:600}
.pole em{font-style:normal;font-size:12.5px;color:var(--texto-suave)}
.pole.left.win{--pc:var(--al)}.pole.right.win{--pc:var(--ar)}
.pole.win{background:color-mix(in srgb,var(--pc) 13%,var(--superficie));border-color:color-mix(in srgb,var(--pc) 45%,var(--superficie))}
.pole.win .pico{color:var(--tinta)}
.pole.win em{color:var(--tinta);font-weight:600}
.atrack{position:relative;display:flex;height:8px;background:var(--borda);border-radius:8px}
.ahalf{flex:1;display:flex}.ahalf.l{justify-content:flex-end}
.ahalf i{display:block;height:100%;background:var(--ac)}
.ahalf.l i{border-radius:8px 0 0 8px}.ahalf.r i{border-radius:0 8px 8px 0}
.amid{position:absolute;left:50%;top:-4px;width:2px;height:16px;background:var(--texto-suave);transform:translateX(-50%)}
.adot{position:absolute;top:50%;width:18px;height:18px;border-radius:50%;background:var(--superficie);border:4px solid var(--ac);transform:translate(-50%,-50%)}
/* distinguish */
.dist{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.dcard{border:1px solid var(--borda);border-radius:var(--r-md);padding:24px;background:var(--papel)}
.dcard.strong{border:2px solid var(--cat);background:var(--superficie)}
.dcard h3{font-size:22px;margin:14px 0 8px}
.dcard p{font-size:14.5px;color:var(--texto-suave)}
.mbar{position:relative;height:28px;margin:18px 0 6px}
.mtrack{position:absolute;left:0;right:0;top:11px;height:6px;border-radius:6px;background:var(--borda)}
.mmed{position:absolute;top:4px;width:3px;height:20px;background:var(--texto-suave);transform:translateX(-50%)}
.myou{position:absolute;top:3px;width:22px;height:22px;border-radius:50%;background:var(--superficie);border:4px solid var(--texto-suave);transform:translateX(-50%)}
.myou.strong{border-color:var(--cat)}
.mlab{display:flex;justify-content:space-between;gap:12px;font-size:13px;color:var(--texto-suave);margin-bottom:14px}
.mlab b{color:var(--tinta);text-align:right}
.strong .mlab b{color:var(--cat)}
/* match cards */
.match-tags{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
.match{display:grid;grid-template-columns:auto 1fr;gap:28px;border:1px solid var(--borda);border-top:6px solid var(--cat);border-radius:var(--r-lg);padding:28px;background:var(--papel)}
.match .flagbig{width:220px;height:146px;object-fit:cover;border-radius:12px;border:1px solid var(--borda)}
.match .portrait{width:180px;height:220px;object-fit:cover;border-radius:16px}
.match h3{font-size:clamp(28px,3.4vw,40px);letter-spacing:-.03em;margin-bottom:12px}
.match p{font-size:15px;color:var(--texto-suave);margin-top:12px}
.sub{font-family:var(--font-display);font-weight:600;font-size:17px;margin:32px 0 14px}
.sub.first{margin-top:0}
.dims{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.dim-row{display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;border:1px solid var(--borda);border-radius:var(--r-md);padding:20px 16px;background:var(--papel);height:100%}
.dim-row>div{display:flex;flex-direction:column;align-items:center}
.flagimg{width:84px;height:56px;object-fit:cover;border-radius:8px;border:1px solid var(--borda)}
.avatar{width:72px;height:72px;object-fit:cover;border-radius:50%}
.dim{font-size:12px;font-weight:600;color:var(--cat);text-transform:uppercase;letter-spacing:.1em;margin-bottom:4px}
.dim-row strong{font-size:15px;line-height:1.3}
.dim-row small{font-size:13px;color:var(--texto-suave)}
.pctc{font-family:var(--font-display);font-weight:700;font-size:22px;color:var(--cat);letter-spacing:-.02em}
.fars{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.far-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 16px;border-radius:14px;background:var(--neutro);height:100%}
.far-row strong{display:block;font-size:14.5px}
.far-row small{font-size:12.5px;color:var(--texto-suave)}
.far-row span{font-family:var(--font-display);font-weight:700;color:var(--texto-suave)}
.near-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.near{display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;padding:20px 14px;border:1px solid var(--borda);border-radius:var(--r-md);background:var(--papel);height:100%}
.near .avatar{width:80px;height:80px}
.near div{display:flex;flex-direction:column;align-items:center;gap:4px}
.near strong{font-family:var(--font-display);font-size:16px;line-height:1.25;margin-top:6px}
.near small{font-size:13px;color:var(--texto-suave)}
.others{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.ocard{border:1px solid var(--borda);border-radius:var(--r-md);overflow:hidden;background:var(--papel)}
.ocard a{display:block;height:100%}
.ocard-head{background:var(--cb);padding:18px 20px 20px}
.ocard-top{display:flex;justify-content:space-between;align-items:center;gap:12px}
.ocard h3{font-size:19px;color:var(--c);margin-top:10px}
.ocard p{padding:16px 20px 0;margin-bottom:20px;font-size:14px;color:var(--texto-suave);display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
.ocard .ocard .tag{white-space:normal}
.idl{display:flex;flex-direction:column;gap:12px}
.distant{display:flex;flex-wrap:wrap;align-items:center;gap:14px;padding:16px 20px;border-radius:14px;background:var(--neutro);max-width:460px}
.distant strong{font-family:var(--font-display);font-size:18px;flex:1;min-width:0}
.distant>span:last-child{font-family:var(--font-display);font-weight:700;color:var(--texto-suave)}
a.match,a.dim-row,a.near,a.far-row,a.distant,.ocard a{text-decoration:none;color:inherit;transition:transform .15s ease,box-shadow .15s ease,border-color .15s ease}
a.match:hover,a.dim-row:hover,a.near:hover,.ocard:hover,a.far-row:hover,a.distant:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(16,16,16,.07)}
.avatar.ini{font-size:24px;border-radius:50%}.portrait.ini{font-size:48px;width:180px;height:220px;border-radius:16px}
.flagbig.ini,.flagimg.ini{font-size:18px}
/* cta + footer */
.pcta{display:flex;justify-content:space-between;align-items:center;gap:24px;margin-top:24px;background:var(--floresta);border:0;color:var(--papel)}
.pcta h2{font-size:clamp(24px,3vw,34px);color:var(--papel)}.pcta p{color:#BFD1C6;margin-top:6px;max-width:560px}
.pcta .btn{background:var(--papel);color:var(--floresta)}
.foot{background:var(--tinta);color:var(--papel);padding:40px 0}
.foot .wrap{display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap;font-size:14px;max-width:1200px}
.foot .logo b{color:var(--papel)}
.foot p{color:#9A968C}
.foot p a{color:#D8D4C8}
/* ideologia: hero com referências e frase */
.ihero{display:grid;grid-template-columns:1fr 320px;padding:0;overflow:hidden;border-top:6px solid var(--cat)}
.ih-txt{padding:40px 36px}
.ihero h1{font-size:clamp(40px,5.6vw,68px);letter-spacing:-.04em;line-height:1.02;margin:14px 0;color:var(--cat)}
.ihero .lead{font-size:16.5px;max-width:620px}
.ih-refs{background:var(--cat-bg);padding:24px;display:flex;flex-direction:column;justify-content:center;gap:12px}
.refc{display:flex;gap:14px;align-items:center;background:var(--superficie);border-radius:16px;padding:12px;text-decoration:none;color:inherit;transition:transform .15s ease,box-shadow .15s ease}
.refc:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(16,16,16,.08)}
.refimg{width:64px;height:64px;border-radius:14px;object-fit:cover;flex:none}
.refflag{width:64px;height:auto;border-radius:8px;flex:none;border:1px solid var(--borda);align-self:center}
.refimg.ini,.refflag.ini{font-size:20px;height:64px}
.refc span{display:flex;flex-direction:column;min-width:0;line-height:1.3}
.refc small{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--cat)}
.refc b{font-family:var(--font-display);font-size:16px}
.refc em{font-style:normal;font-size:12.5px;color:var(--texto-suave)}
.phrase{margin-top:24px;background:var(--cat-bg);border:0;display:grid;grid-template-columns:auto 1fr;gap:28px;padding:44px}
.phrase .q{font-family:var(--font-display);font-weight:700;font-size:120px;line-height:.75;color:var(--cat);opacity:.9}
.phrase blockquote{font-family:var(--font-display);font-weight:600;font-size:clamp(22px,2.6vw,32px);line-height:1.3;letter-spacing:-.02em;color:var(--cat)}
.phrase .eyebrow{color:var(--cat)}
.phrase figcaption{margin-top:18px;font-size:15px;color:var(--cat)}
.refm{border-top-color:var(--tinta)}
.flagbig,.flagimg{height:auto!important;object-fit:contain;align-self:start}
.dim-row .flagimg,.dim-row .flagimg.ini{align-self:center}
@media (max-width:860px){.ihero{grid-template-columns:1fr}.ih-txt{padding:24px}}
@media (max-width:720px){.ih-txt{padding:22px 18px}.ih-refs{padding:16px}.phrase{grid-template-columns:1fr;gap:4px;padding:28px 20px}.phrase .q{font-size:80px;line-height:.6}}
@media (max-width:860px){
  .phero{grid-template-columns:1fr;gap:0}.ph-img{order:-1;min-height:0;aspect-ratio:4/3}.ph-txt{padding:24px}
  .kpis{grid-template-columns:1fr}.kpis div+div{padding-left:0;border-left:0;border-top:1px solid var(--borda)}.kpis div{padding:12px 0}
  .navl{display:none}
    .near-grid{grid-template-columns:1fr 1fr}.others,.dims,.fars,.dist{grid-template-columns:1fr}
}
@media (max-width:720px){
  .wrap{padding:0 16px}
  .res{padding:24px 0 64px}.panel{padding:24px 18px}.panel.phero{padding:0}
  .ph-txt{padding:22px 18px}.ph-img{aspect-ratio:1/1}
  .ptabs{width:100%}.ptabs button{flex:1 1 auto;padding:9px 10px;font-size:13.5px}
  .match{grid-template-columns:1fr;padding:20px}.match .portrait,.portrait.ini{width:140px;height:170px}.match .flagbig{width:180px;height:120px}
  .axis-row-head{flex-wrap:wrap}.itag{white-space:normal}
  /* eixos: as colunas fixas de 200px estouravam a tela; os dois polos dividem uma
     linha e a barra ganha a largura toda embaixo, como na tela de resultados */
  .axis-row{padding:16px 0}
  .axis-bar{grid-template-columns:1fr 1fr;gap:10px}
  .axis-bar .pole.left{order:1}.axis-bar .pole.right{order:2}
  .axis-bar .atrack{order:3;grid-column:1/-1;margin:6px 9px 2px}
  .pole{padding:8px;gap:6px}.pole .pico{width:16px;height:16px}
  .pole b{font-size:12px;hyphens:auto;overflow-wrap:break-word}.pole em{font-size:12px}
  .dcard{padding:20px 16px}.dcard h3{font-size:20px}
  .mlab{flex-wrap:wrap}
  .btn,.tag{white-space:normal;text-align:center}
  .match .flagbig{max-width:100%}
  .phrase blockquote{font-size:21px}
  .distant{max-width:none}
  .pcta{flex-direction:column;align-items:flex-start}
  .nav .btn{padding:8px 14px;font-size:13px}
}
/* janela da explicação do eixo (igual à InfoSheet da tela de resultados) */
.sheet-backdrop{position:fixed;inset:0;z-index:200;display:grid;place-items:center;padding:24px;background:rgba(16,16,16,.42);animation:sheet-fade .2s ease}
.sheet-backdrop[hidden]{display:none}
.sheet{position:relative;width:min(460px,100%);max-height:calc(100dvh - 24px);overflow-y:auto;background:var(--superficie);border:1px solid var(--borda);border-radius:24px;padding:28px 28px 26px;box-shadow:0 24px 60px -24px rgba(16,16,16,.45);animation:sheet-pop .22s cubic-bezier(.2,.8,.2,1)}
.sheet-handle{display:none}
.sheet-close{position:absolute;top:14px;right:14px;width:36px;height:36px;display:grid;place-items:center;padding:0;border:1px solid var(--borda);border-radius:50%;background:var(--superficie);color:var(--tinta);cursor:pointer}
.sheet-close svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}
.sheet-label{margin:0 44px 4px 0;font-size:14px;color:var(--texto-suave)}
.sheet h3{margin:0 44px 12px 0;font-size:24px;line-height:1.2}
.sheet h3 span{color:var(--ac)}
.sheet-text{margin:0;font-size:15.5px;line-height:1.6;color:var(--tinta)}
@keyframes sheet-fade{from{opacity:0}}
@keyframes sheet-pop{from{opacity:0;transform:translateY(12px) scale(.98)}}
@keyframes sheet-up{from{transform:translateY(100%)}}
@media (max-width:640px){
  .sheet-backdrop{place-items:end stretch;padding:0}
  .sheet{width:100%;border-radius:24px 24px 0 0;border-bottom:0;padding:14px 20px calc(24px + env(safe-area-inset-bottom));animation:sheet-up .28s cubic-bezier(.2,.8,.2,1)}
  .sheet-handle{display:block;width:40px;height:4px;margin:0 auto 14px;border-radius:4px;background:var(--borda)}
  .sheet-close{top:22px;right:16px}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}
`;
