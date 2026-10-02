// Página /countries/:id (e /en/...): perfil de um país ou regime histórico com
// a identidade nova. Mesma lógica das páginas de personalidade e ideologia: o
// vetor do país é comparado com ideologias, personalidades e outros países
// pela fórmula do backend (profile-match.mjs).
import { AREA_LABELS, catalogHead, initials } from './personalities-index.mjs';
import { PAGE_SCRIPT, axisRowsHtml, axisSheetHtml, distinctive, mbarHtml, spectrumOf } from './personality-page.mjs';
import { poleSprite } from './pole-icons.mjs';
import { dimensionMatches, rank, religionVisibility } from './profile-match.mjs';

const STR = {
  pt: {
    skip: 'Pular para o conteúdo',
    catalogNav: 'Catálogo',
    homeAria: '12 axes, página inicial',
    takeTheTest: 'Fazer o teste',
    currentCountry: 'País atual',
    historicalRegime: 'Regime histórico',
    kpiSpectrum: 'Espectro predominante',
    kpiLinked: 'Ideologia ligada',
    kpiClosestIdeology: 'Ideologia mais próxima',
    kpiClosestPerson: 'Personalidade mais próxima',
    portraitAlt: (name) => `Retrato de ${name}`,
    flagAlt: (name) => `Bandeira: ${name}`,
    tabsAria: 'Seções do país',
    tabs: { axes: 'Eixos', ideologies: 'Ideologias', personalities: 'Personalidades', countries: 'Países' },
    ids: { axes: 'eixos', ideologies: 'ideologias', personalities: 'personalidades', countries: 'paises' },
    axesEyebrow: 'Eixos políticos',
    axesTitle: 'Perfil nos 12 eixos',
    distTitle: (name) => `O que distingue ${name}`,
    rareTag: 'Posição mais incomum',
    commonTag: 'Posição mais comum',
    rareText: (pole, pct, n) => `Puxa mais para ${pole.toLowerCase()} que ${pct}% dos ${n} países e regimes do catálogo.`,
    rareNote: (axis) => `De todos os eixos, ${axis} é onde mais se afasta do conjunto.`,
    commonText: (axis, exact) => (exact ? `Em ${axis}, fica praticamente na mediana do catálogo.` : `Em ${axis}, fica perto da mediana do catálogo.`),
    commonNote: 'Aqui está em terreno comum com a maioria dos países.',
    median: 'Mediana dos países',
    ideologyEyebrow: 'Proximidade ideológica',
    ideologiesTitle: 'Ideologias',
    compatibleSub: (n) => `Mais compatíveis entre as ${n} ideologias`,
    distantIdeology: 'A ideologia mais distante',
    personalitiesTitle: 'Personalidades',
    mostCompatible: 'Mais compatível',
    byDimension: 'Mais próximas, por dimensão',
    dimensionLabels: { political: 'Politicamente', social: 'Socialmente', economic: 'Economicamente' },
    nearSub: 'Outros perfis compatíveis',
    farPeople: 'As mais distantes',
    countriesTitle: 'Países parecidos',
    countryTabsAria: 'Tipo de país',
    currentTab: 'Países atuais',
    historicalTab: 'Regimes históricos',
    currentKicker: 'País atual mais parecido',
    historicalKicker: 'Regime histórico mais parecido',
    alsoByDimension: 'Também parecidos, por dimensão',
    farCountries: 'Os mais diferentes',
    matchWord: 'match',
    ctaTitle: 'Você viveria bem aqui?',
    ctaText: (name, n) => `Responda ao quiz e veja sua compatibilidade com ${name} e outros ${n} países e regimes nos 12 eixos.`,
    footer: 'Quiz político independente · 12axes.vercel.app'
  },
  en: {
    skip: 'Skip to content',
    catalogNav: 'Catalog',
    homeAria: '12 axes, home page',
    takeTheTest: 'Take the test',
    currentCountry: 'Modern country',
    historicalRegime: 'Historical regime',
    kpiSpectrum: 'Predominant spectrum',
    kpiLinked: 'Linked ideology',
    kpiClosestIdeology: 'Closest ideology',
    kpiClosestPerson: 'Closest personality',
    portraitAlt: (name) => `Portrait of ${name}`,
    flagAlt: (name) => `Flag: ${name}`,
    tabsAria: 'Country sections',
    tabs: { axes: 'Axes', ideologies: 'Ideologies', personalities: 'Personalities', countries: 'Countries' },
    ids: { axes: 'axes', ideologies: 'ideologies', personalities: 'personalities', countries: 'countries' },
    axesEyebrow: 'Political axes',
    axesTitle: 'Profile across the 12 axes',
    distTitle: (name) => `What sets ${name} apart`,
    rareTag: 'Most unusual position',
    commonTag: 'Most common position',
    rareText: (pole, pct, n) => `Leans further toward ${pole.toLowerCase()} than ${pct}% of the ${n} countries and regimes in the catalog.`,
    rareNote: (axis) => `Of all the axes, ${axis} is where it stands furthest from the rest.`,
    commonText: (axis, exact) => (exact ? `On ${axis}, it sits practically at the catalog median.` : `On ${axis}, it sits close to the catalog median.`),
    commonNote: 'Here it shares common ground with most countries.',
    median: 'Country median',
    ideologyEyebrow: 'Ideological proximity',
    ideologiesTitle: 'Ideologies',
    compatibleSub: (n) => `Most compatible among the ${n} ideologies`,
    distantIdeology: 'The most distant ideology',
    personalitiesTitle: 'Personalities',
    mostCompatible: 'Most compatible',
    byDimension: 'Closest, by dimension',
    dimensionLabels: { political: 'Politically', social: 'Socially', economic: 'Economically' },
    nearSub: 'Other compatible profiles',
    farPeople: 'The most distant',
    countriesTitle: 'Similar countries',
    countryTabsAria: 'Country type',
    currentTab: 'Modern countries',
    historicalTab: 'Historical regimes',
    currentKicker: 'Most similar modern country',
    historicalKicker: 'Most similar historical regime',
    alsoByDimension: 'Also similar, by dimension',
    farCountries: 'The most different',
    matchWord: 'match',
    ctaTitle: 'Would you live well here?',
    ctaText: (name, n) => `Take the quiz and see your compatibility with ${name} and ${n} other countries and regimes across the 12 axes.`,
    footer: 'Independent political quiz · 12axes.vercel.app'
  }
};

const ARR = '<svg class="arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';
const pct = (x) => Math.round(x);

export function countryPage(L, country, ctx) {
  const { locale, site, gaSnippet, escapeHtml, truncate, profiles } = ctx;
  const esc = escapeHtml;
  const t = STR[locale];
  const prefix = L.s.prefix;
  const home = prefix || '/';
  const vector = profiles.country.get(country.id) ?? {};
  const name = country.name;
  const img = (src, alt, cls, who) =>
    `<img class="${cls}" src="${src}" alt="${esc(alt)}" loading="lazy" decoding="async" data-i="${esc(initials(who))}">`;
  const personHref = (p) => `${prefix}/personalities/${p.id}`;
  const countryHref = (c) => `${prefix}/countries/${c.id}`;
  const countryCaption = (c) => (c.historical && c.period ? c.period : c.category);
  const tags = (list) => list.filter(Boolean).map((x) => `<span class="tag tag-neutral">${esc(x)}</span>`).join('');

  // ── ideologias ──
  const ideologyVector = (i) => profiles.ideology.get(i.id);
  const visible = religionVisibility(country);
  const rankedIdeologies = rank(vector, L.ideologies.filter(visible), ideologyVector);
  const linkedIds = new Set((L.ideologiesByCountry.get(country.id) ?? []).map((i) => i.id));
  const linked = rankedIdeologies.filter((r) => linkedIds.has(r.item.id));
  const compatible = rankedIdeologies.slice(0, 3);
  const distantIdeology = rankedIdeologies[rankedIdeologies.length - 1];

  // Espectro predominante: o mais frequente entre as ideologias ligadas
  // (empate: o da mais compatível); sem ligadas, o da ideologia mais próxima.
  const specSource = linked.length ? linked : rankedIdeologies.slice(0, 1);
  const specCount = new Map();
  for (const r of specSource) {
    const key = spectrumOf(r.item.category).key;
    specCount.set(key, (specCount.get(key) ?? 0) + 1);
  }
  const topCount = Math.max(...specCount.values());
  const specItem = specSource.find((r) => specCount.get(spectrumOf(r.item.category).key) === topCount).item;
  const spec = spectrumOf(specItem.category);

  // ── personalidades ──
  const personVector = (p) => profiles.personality.get(p.id);
  const visiblePeople = L.personalities.filter(visible);
  const rankedPeople = rank(vector, visiblePeople, personVector);
  const topPerson = rankedPeople[0];
  const personDims = dimensionMatches(vector, visiblePeople, personVector, [topPerson.item.id]);
  const shownPeople = new Set([topPerson.item.id, ...personDims.map((d) => d.item.id)]);
  const nearPeople = rankedPeople.filter((r) => !shownPeople.has(r.item.id)).slice(0, 8);
  const farPeople = rankedPeople.slice(-3).reverse();

  // ── países ──
  const countryVector = (c) => profiles.country.get(c.id);
  const countryGroups = [false, true].map((historical) => {
    const pool = L.countries.filter((c) => Boolean(c.historical) === historical && c.id !== country.id && visible(c));
    const ranked = rank(vector, pool, countryVector);
    return {
      historical,
      top: ranked[0],
      dims: dimensionMatches(vector, pool, countryVector, [ranked[0].item.id]),
      far: ranked.slice(-3).reverse()
    };
  });

  const { rare, common, rarePct, rarePole } = distinctive(L.axes, vector, profiles.country);
  const mbar = (d, strong) => mbarHtml(d, strong, t.median, name, esc);

  const catVars = (category) => {
    const s = spectrumOf(category);
    return `--c:${s.c};--cb:${s.cb}`;
  };
  const ideologyCard = ({ item }) =>
    `<li class="ocard" style="${catVars(item.category)}"><a href="${prefix}/ideologies/${item.id}"><div class="ocard-head"><div class="ocard-top"><span class="tag osolid">${esc(item.category)}</span></div><h3>${esc(item.name)}</h3></div><p>${esc(item.description)}</p></a></li>`;
  const dimRow = (d, visual, href, caption) =>
    `<li><a class="dim-row" href="${href}">${visual}<div><span class="dim">${esc(t.dimensionLabels[d.dimension])}</span><strong>${esc(d.item.name)}</strong><small>${esc(caption)}</small></div><span class="pctc">${pct(d.score)}%</span></a></li>`;
  const farRow = (r, href, caption) =>
    `<li><a class="far-row" href="${href}"><div><strong>${esc(r.item.name)}</strong><small>${esc(caption)}</small></div><span>${pct(r.score)}%</span></a></li>`;

  const distSpec = spectrumOf(distantIdeology.item.category);
  const ideologiesPanel = `<div class="panel"><p class="eyebrow">${esc(t.ideologyEyebrow)}</p><h2>${esc(t.ideologiesTitle)}</h2>
      <p class="sub first">${esc(t.compatibleSub(L.ideologies.length))}</p><ul class="others">${compatible.map(ideologyCard).join('')}</ul>
      <p class="sub">${esc(t.distantIdeology)}</p>
      <a class="distant" href="${prefix}/ideologies/${distantIdeology.item.id}"><strong>${esc(distantIdeology.item.name)}</strong><span class="tag" style="background:${distSpec.cb};color:${distSpec.c}">${esc(distantIdeology.item.category)}</span><span>${pct(distantIdeology.score)}%</span></a>
    </div>`;

  const tp = topPerson.item;
  const personalitiesPanel = `<div class="panel"><h2>${esc(t.personalitiesTitle)}</h2>
      <a class="match" href="${personHref(tp)}">${img(tp.imagePath, t.portraitAlt(tp.name), 'portrait', tp.name)}<div>
        <div class="match-tags"><span class="tag tag-cat">${esc(t.mostCompatible)}</span><span class="tag tag-solid">${pct(topPerson.score)}% ${t.matchWord}</span></div>
        <h3>${esc(tp.name)}</h3><div class="match-tags">${tags([tp.role, tp.lifespan])}</div>
        <p>${esc(tp.description)}</p></div></a>
      <p class="sub">${esc(t.byDimension)}</p><ul class="dims">${personDims.map((d) => dimRow(d, img(d.item.imagePath, t.portraitAlt(d.item.name), 'avatar', d.item.name), personHref(d.item), d.item.role)).join('')}</ul>
      <p class="sub">${esc(t.nearSub)}</p><ul class="near-grid">${nearPeople.map((r) => `<li><a class="near" href="${personHref(r.item)}">${img(r.item.imagePath, t.portraitAlt(r.item.name), 'avatar', r.item.name)}<div><span class="tag tag-neutral">${esc(AREA_LABELS[locale][r.item.category] ?? '')}</span><strong>${esc(r.item.name)}</strong><small>${esc(r.item.role)}</small><span class="pctc">${pct(r.score)}%</span></div></a></li>`).join('')}</ul>
      <p class="sub">${esc(t.farPeople)}</p><ul class="fars">${farPeople.map((r) => farRow(r, personHref(r.item), r.item.role)).join('')}</ul>
    </div>`;

  const countryPanel = (g) => {
    const c = g.top.item;
    const id = g.historical ? 'c-hist' : 'c-atual';
    return `<div class="cpanel" id="${id}" role="tabpanel"${g.historical ? ' hidden' : ''}><a class="match" href="${countryHref(c)}">${img(c.flagPath, t.flagAlt(c.name), 'flagbig', c.name)}<div><div class="match-tags"><span class="tag tag-cat">${esc(g.historical ? t.historicalKicker : t.currentKicker)}</span><span class="tag tag-solid">${pct(g.top.score)}% ${t.matchWord}</span></div><h3>${esc(c.name)}</h3><span class="tag tag-neutral">${esc(countryCaption(c))}</span><p>${esc(c.description)}</p></div></a><p class="sub">${esc(t.alsoByDimension)}</p><ul class="dims">${g.dims.map((d) => dimRow(d, img(d.item.flagPath, t.flagAlt(d.item.name), 'flagimg', d.item.name), countryHref(d.item), countryCaption(d.item))).join('')}</ul><p class="sub">${esc(t.farCountries)}</p><ul class="fars">${g.far.map((r) => farRow(r, countryHref(r.item), countryCaption(r.item))).join('')}</ul></div>`;
  };

  const kpiIdeology = linked[0] ? [t.kpiLinked, linked[0].item.name] : [t.kpiClosestIdeology, rankedIdeologies[0].item.name];
  const kindTag = country.historical ? [t.historicalRegime, country.period].filter(Boolean).join(' · ') : t.currentCountry;

  const tabIds = t.ids;
  const tabButton = (key, first) =>
    `<button role="tab" id="t-${tabIds[key]}" aria-controls="${tabIds[key]}" aria-selected="${first}"${first ? '' : ' tabindex="-1"'}>${esc(t.tabs[key])}</button>`;

  const basePath = `/countries/${country.id}`;
  const description = truncate(country.description);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '12 Axes', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: L.s.navCountries, item: `${site}${prefix}/countries` },
        { '@type': 'ListItem', position: 3, name, item: `${site}${prefix}${basePath}` }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: L.s.countryHeadline(name),
      description,
      inLanguage: L.s.htmlLang,
      mainEntityOfPage: `${site}${prefix}${basePath}`,
      author: { '@type': 'Organization', name: '12 Axes', url: `${site}/` }
    }
  ];

  const html = `<!doctype html>
<html lang="${L.s.htmlLang}">
  ${catalogHead(L, { site, basePath, title: L.s.countryTitle(name), description, ogType: 'article', ogImage: country.flagPath, css: '/profile.css', jsonLd, gaSnippet, escapeHtml })}
  <body style="--cat:${spec.c};--cat-bg:${spec.cb}">
${poleSprite(L.axes)}
<a class="skip" href="#main">${esc(t.skip)}</a>
<header class="nav"><div class="wrap">
  <a class="logo" href="${home}" aria-label="${esc(t.homeAria)}"><b>12</b><span>axes</span></a>
  <nav class="navl" aria-label="${esc(t.catalogNav)}"><a href="${prefix}/ideologies">${esc(L.s.navIdeologies)}</a><a href="${prefix}/countries" aria-current="page">${esc(L.s.navCountries)}</a><a href="${prefix}/personalities">${esc(L.s.navPersonalities)}</a></nav>
  <a class="btn btn-primary btn-sm" href="${home}">${esc(t.takeTheTest)} ${ARR}</a>
</div></header>

<main id="main" class="res"><div class="wrap">
  <p class="crumbs"><a href="${home}">${esc(L.s.home)}</a> / <a href="${prefix}/countries">${esc(L.s.navCountries)}</a> / <span aria-current="page">${esc(name)}</span></p>
  <article class="panel chero">
    <div class="ih-txt">
      <div class="match-tags"><span class="tag tag-solid">${esc(country.category)}</span><span class="tag tag-neutral">${esc(kindTag)}</span></div>
      <h1>${esc(name)}</h1>
      <p class="lead">${esc(country.description)}</p>
      <dl class="kpis">
        <div><dt>${esc(t.kpiSpectrum)}</dt><dd class="c">${esc(specItem.category)}</dd></div>
        <div><dt>${esc(kpiIdeology[0])}</dt><dd>${esc(kpiIdeology[1])}</dd></div>
        <div><dt>${esc(t.kpiClosestPerson)}</dt><dd>${esc(tp.name)}</dd></div>
      </dl>
    </div>
    <figure class="ch-flag"><img src="${country.flagPath}" alt="${esc(t.flagAlt(name))}"></figure>
  </article>

  <div class="ptabs-wrap"><div class="ptabs" role="tablist" aria-label="${esc(t.tabsAria)}">
    ${tabButton('axes', true)}
    ${tabButton('ideologies', false)}
    ${tabButton('personalities', false)}
    ${tabButton('countries', false)}
  </div></div>

  <section class="tp" id="${tabIds.axes}" role="tabpanel" aria-labelledby="t-${tabIds.axes}">
    <div class="panel"><p class="eyebrow">${esc(t.axesEyebrow)}</p><h2>${esc(t.axesTitle)}</h2><ul class="axes-list">${axisRowsHtml(L, vector, esc, locale, country.religions)}</ul></div>
    <div class="panel"><h2>${esc(t.distTitle(name))}</h2><div class="dist">
      <article class="dcard strong"><span class="tag tag-cat">${esc(t.rareTag)}</span><h3>${esc(rare.axis.label)}</h3>
        <p>${esc(t.rareText(rarePole, rarePct, rare.values.length))}</p>${mbar(rare, true)}
        <p>${esc(t.rareNote(rare.axis.label))}</p></article>
      <article class="dcard"><span class="tag tag-neutral">${esc(t.commonTag)}</span><h3>${esc(common.axis.label)}</h3>
        <p>${esc(t.commonText(common.axis.label, common.dev < 5))}</p>${mbar(common, false)}
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

  <aside class="panel pcta"><div><h2>${esc(t.ctaTitle)}</h2><p>${esc(t.ctaText(name, L.countries.length - 1))}</p></div><a class="btn btn-primary" href="${home}">${esc(t.takeTheTest)} ${ARR}</a></aside>
</div></main>
<footer class="foot"><div class="wrap"><a class="logo" href="${home}"><b>12</b><span>axes</span></a><p>${esc(t.footer)} · <a href="${prefix === '' ? '/en' : ''}${basePath}">${prefix === '' ? 'English' : 'Português'}</a></p></div></footer>
${axisSheetHtml(locale)}
<script>
${PAGE_SCRIPT}</script>
  </body>
</html>`;

  return { basePath, html };
}

export const COUNTRY_PAGE_CSS = `
/* país: hero com bandeira */
.chero{display:grid;grid-template-columns:1fr 340px;padding:0;overflow:hidden;border-top:6px solid var(--cat)}
.chero h1{font-size:clamp(40px,5.6vw,68px);letter-spacing:-.04em;line-height:1.02;margin:14px 0}
.chero .lead{font-size:16.5px;max-width:620px}
.ch-flag{margin:0;background:var(--cat-bg);display:grid;place-items:center;padding:32px}
.ch-flag img{width:100%;height:auto;border-radius:12px;box-shadow:0 14px 34px rgba(16,16,16,.18)}
.ch-flag .ini{width:100%;aspect-ratio:3/2;border-radius:12px;font-size:48px}
@media (max-width:860px){.chero{grid-template-columns:1fr}.ch-flag{order:-1;padding:28px 40px}.ch-flag img{max-width:320px}}
`;
