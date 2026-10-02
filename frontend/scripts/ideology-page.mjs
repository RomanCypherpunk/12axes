// Página /ideologies/:id (e /en/...): perfil de uma ideologia com a identidade
// nova. Mesma lógica da página de personalidade — o vetor da ideologia é
// comparado com personalidades, países e outras ideologias pela fórmula do
// backend — mais o hero com as referências e a frase que a resume.
import { catalogHead, AREA_LABELS, initials } from './personalities-index.mjs';
import {
  PAGE_SCRIPT,
  axisRowsHtml,
  axisSheetHtml,
  distinctive,
  mbarHtml,
  spectrumOf
} from './personality-page.mjs';
import { poleSprite } from './pole-icons.mjs';
import { compatibility, dimensionMatches, rank, religionVisibility } from './profile-match.mjs';

const STR = {
  pt: {
    skip: 'Pular para o conteúdo',
    catalogNav: 'Catálogo',
    homeAria: '12 axes, página inicial',
    takeTheTest: 'Fazer o teste',
    kind: 'Ideologia',
    refPerson: 'Personalidade de referência',
    refCountry: 'País de referência',
    phraseTitle: 'Em uma frase',
    phraseNote: (name) => ['É assim que alguém do ', name, ' resumiria a sociedade que quer.'],
    portraitAlt: (name) => `Retrato de ${name}`,
    flagAlt: (name) => `Bandeira: ${name}`,
    tabsAria: 'Seções da ideologia',
    tabs: { axes: 'Eixos', personalities: 'Personalidades', countries: 'Países', ideologies: 'Ideologias' },
    ids: { axes: 'eixos', personalities: 'personalidades', countries: 'paises', ideologies: 'ideologias' },
    axesEyebrow: 'Eixos políticos',
    axesTitle: 'Perfil nos 12 eixos',
    distTitle: 'O que distingue esta ideologia',
    rareTag: 'Posição mais incomum',
    commonTag: 'Posição mais comum',
    rareText: (pole, pct, n) => `Puxa mais para ${pole.toLowerCase()} que ${pct}% das ${n} ideologias do catálogo.`,
    rareNote: (axis) => `De todos os eixos, ${axis} é onde mais se afasta do conjunto.`,
    commonText: (axis, exact) => (exact ? `Em ${axis}, fica praticamente na mediana do catálogo.` : `Em ${axis}, fica perto da mediana do catálogo.`),
    commonNote: 'Aqui está em terreno comum com a maioria das ideologias.',
    median: 'Mediana das ideologias',
    you: 'Esta ideologia',
    personalitiesTitle: 'Personalidades',
    mostCompatible: 'Mais compatível',
    byDimension: 'Mais próximas, por dimensão',
    dimensionLabels: { political: 'Politicamente', social: 'Socialmente', economic: 'Economicamente' },
    nearSub: 'Outros perfis compatíveis',
    farPeople: 'As mais distantes',
    countriesTitle: 'Países',
    refHistorical: 'Referência histórica',
    refCurrent: 'Referência atual',
    otherCountries: 'Outros países próximos',
    countryTabsAria: 'Tipo de país',
    currentTab: 'País atual',
    historicalTab: 'Experiência histórica',
    currentKicker: 'País atual mais compatível',
    historicalKicker: 'Experiência histórica mais compatível',
    alsoByDimension: 'Também próximos, por dimensão',
    farCountries: 'Os mais distantes',
    ideologyEyebrow: 'Proximidade ideológica',
    ideologiesTitle: 'Ideologias próximas',
    sameSpectrum: (label) => `Mais próximas em ${label.toLowerCase()}`,
    otherSpectrums: 'Mais próximas em outros espectros',
    distantIdeology: 'A ideologia mais distante',
    matchWord: 'match',
    ctaTitle: 'E você, onde está no espectro?',
    ctaText: (name, n) => `Responda ao quiz e veja sua compatibilidade com ${name} e outras ${n} ideologias nos 12 eixos.`,
    footer: 'Quiz político independente · 12axes.vercel.app'
  },
  en: {
    skip: 'Skip to content',
    catalogNav: 'Catalog',
    homeAria: '12 axes, home page',
    takeTheTest: 'Take the test',
    kind: 'Ideology',
    refPerson: 'Key figure',
    refCountry: 'Reference country',
    phraseTitle: 'In one sentence',
    phraseNote: (name) => ['This is how someone from ', name, ' would sum up the society they want.'],
    portraitAlt: (name) => `Portrait of ${name}`,
    flagAlt: (name) => `Flag: ${name}`,
    tabsAria: 'Ideology sections',
    tabs: { axes: 'Axes', personalities: 'Personalities', countries: 'Countries', ideologies: 'Ideologies' },
    ids: { axes: 'axes', personalities: 'personalities', countries: 'countries', ideologies: 'ideologies' },
    axesEyebrow: 'Political axes',
    axesTitle: 'Profile across the 12 axes',
    distTitle: 'What sets this ideology apart',
    rareTag: 'Most unusual position',
    commonTag: 'Most common position',
    rareText: (pole, pct, n) => `Leans further toward ${pole.toLowerCase()} than ${pct}% of the ${n} ideologies in the catalog.`,
    rareNote: (axis) => `Of all the axes, ${axis} is where it stands furthest from the rest.`,
    commonText: (axis, exact) => (exact ? `On ${axis}, it sits practically at the catalog median.` : `On ${axis}, it sits close to the catalog median.`),
    commonNote: 'Here it shares common ground with most ideologies.',
    median: 'Ideology median',
    you: 'This ideology',
    personalitiesTitle: 'Personalities',
    mostCompatible: 'Most compatible',
    byDimension: 'Closest, by dimension',
    dimensionLabels: { political: 'Politically', social: 'Socially', economic: 'Economically' },
    nearSub: 'Other compatible profiles',
    farPeople: 'The most distant',
    countriesTitle: 'Countries',
    refHistorical: 'Historical reference',
    refCurrent: 'Current reference',
    otherCountries: 'Other close countries',
    countryTabsAria: 'Country type',
    currentTab: 'Modern country',
    historicalTab: 'Historical experience',
    currentKicker: 'Most compatible modern country',
    historicalKicker: 'Most compatible historical experience',
    alsoByDimension: 'Also close, by dimension',
    farCountries: 'The most distant',
    ideologyEyebrow: 'Ideological proximity',
    ideologiesTitle: 'Close ideologies',
    sameSpectrum: (label) => `Closest within ${label}`,
    otherSpectrums: 'Closest in other spectrums',
    distantIdeology: 'The most distant ideology',
    matchWord: 'match',
    ctaTitle: 'And you, where do you stand?',
    ctaText: (name, n) => `Take the quiz and see your compatibility with ${name} and ${n} other ideologies across the 12 axes.`,
    footer: 'Independent political quiz · 12axes.vercel.app'
  }
};

const ARR = '<svg class="arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';
const pct = (x) => Math.round(x);

export function ideologyPage(L, ideology, ctx) {
  const { locale, site, gaSnippet, escapeHtml, truncate, profiles } = ctx;
  const esc = escapeHtml;
  const t = STR[locale];
  const prefix = L.s.prefix;
  const home = prefix || '/';
  const vector = profiles.ideology.get(ideology.id) ?? {};
  const name = ideology.name;
  const spec = spectrumOf(ideology.category);
  const img = (src, alt, cls, who) =>
    `<img class="${cls}" src="${src}" alt="${esc(alt)}" loading="lazy" decoding="async" data-i="${esc(initials(who))}">`;
  const personHref = (p) => `${prefix}/personalities/${p.id}`;
  const countryHref = (c) => `${prefix}/countries/${c.id}`;
  const countryCaption = (c) => (c.historical && c.period ? c.period : c.category);
  const tags = (list) => list.filter(Boolean).map((x) => `<span class="tag tag-neutral">${esc(x)}</span>`).join('');

  const refPerson = L.personalityById.get(ideology.personalityId);
  const refCountry = L.countryById.get(ideology.countryId);

  // ── personalidades ──
  const personVector = (p) => profiles.personality.get(p.id);
  const visible = religionVisibility(ideology);
  const visiblePeople = L.personalities.filter(visible);
  const rankedPeople = rank(vector, visiblePeople, personVector);
  const lead = refPerson
    ? { item: refPerson, score: compatibility(vector, personVector(refPerson)), kicker: t.refPerson }
    : { ...rankedPeople[0], kicker: t.mostCompatible };
  const personDims = dimensionMatches(vector, visiblePeople, personVector, [lead.item.id]);
  const shownPeople = new Set([lead.item.id, ...personDims.map((d) => d.item.id)]);
  const nearPeople = rankedPeople.filter((r) => !shownPeople.has(r.item.id)).slice(0, 8);
  const farPeople = rankedPeople.slice(-3).reverse();

  // ── países ──
  const countryVector = (c) => profiles.country.get(c.id);
  const countryGroups = [false, true].map((historical) => {
    const pool = L.countries.filter((c) => Boolean(c.historical) === historical && visible(c));
    const ranked = rank(vector, pool, countryVector);
    return {
      historical,
      top: ranked[0],
      dims: dimensionMatches(vector, pool, countryVector, [ranked[0].item.id]),
      far: ranked.slice(-3).reverse()
    };
  });

  // ── ideologias ──
  const rankedIdeologies = rank(
    vector,
    L.ideologies.filter((i) => i.id !== ideology.id && visible(i)),
    (i) => profiles.ideology.get(i.id)
  );
  const sameSpec = (i) => spectrumOf(i.category).key === spec.key;
  const closeSame = rankedIdeologies.filter((r) => sameSpec(r.item)).slice(0, 3);
  const closeOther = rankedIdeologies.filter((r) => !sameSpec(r.item)).slice(0, 3);
  const distantIdeology = rankedIdeologies[rankedIdeologies.length - 1];

  const { rare, common, rarePct, rarePole } = distinctive(L.axes, vector, profiles.ideology);
  const mbar = (d, strong) => mbarHtml(d, strong, t.median, t.you, esc);

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

  const lp = lead.item;
  const personalitiesPanel = `<div class="panel"><h2>${esc(t.personalitiesTitle)}</h2>
      <a class="match" href="${personHref(lp)}">${img(lp.imagePath, t.portraitAlt(lp.name), 'portrait', lp.name)}<div>
        <div class="match-tags"><span class="tag tag-solid">${esc(lead.kicker)}</span><span class="tag tag-cat">${pct(lead.score)}% ${t.matchWord}</span></div>
        <h3>${esc(lp.name)}</h3><div class="match-tags">${tags([lp.role, lp.lifespan])}</div>
        <p>${esc(lp.description)}</p></div></a>
      <p class="sub">${esc(t.byDimension)}</p><ul class="dims">${personDims.map((d) => dimRow(d, img(d.item.imagePath, t.portraitAlt(d.item.name), 'avatar', d.item.name), personHref(d.item), d.item.role)).join('')}</ul>
      <p class="sub">${esc(t.nearSub)}</p><ul class="near-grid">${nearPeople.map((r) => `<li><a class="near" href="${personHref(r.item)}">${img(r.item.imagePath, t.portraitAlt(r.item.name), 'avatar', r.item.name)}<div><span class="tag tag-neutral">${esc(AREA_LABELS[locale][r.item.category] ?? '')}</span><strong>${esc(r.item.name)}</strong><small>${esc(r.item.role)}</small><span class="pctc">${pct(r.score)}%</span></div></a></li>`).join('')}</ul>
      <p class="sub">${esc(t.farPeople)}</p><ul class="fars">${farPeople.map((r) => farRow(r, personHref(r.item), r.item.role)).join('')}</ul>
    </div>`;

  const countryPanel = (g) => {
    const c = g.top.item;
    const id = g.historical ? 'c-hist' : 'c-atual';
    return `<div class="cpanel" id="${id}" role="tabpanel"${g.historical ? ' hidden' : ''}><a class="match" href="${countryHref(c)}">${img(c.flagPath, t.flagAlt(c.name), 'flagbig', c.name)}<div><div class="match-tags"><span class="tag tag-cat">${esc(g.historical ? t.historicalKicker : t.currentKicker)}</span><span class="tag tag-solid">${pct(g.top.score)}% ${t.matchWord}</span></div><h3>${esc(c.name)}</h3><span class="tag tag-neutral">${esc(countryCaption(c))}</span><p>${esc(c.description)}</p></div></a><p class="sub">${esc(t.alsoByDimension)}</p><ul class="dims">${g.dims.map((d) => dimRow(d, img(d.item.flagPath, t.flagAlt(d.item.name), 'flagimg', d.item.name), countryHref(d.item), countryCaption(d.item))).join('')}</ul><p class="sub">${esc(t.farCountries)}</p><ul class="fars">${g.far.map((r) => farRow(r, countryHref(r.item), countryCaption(r.item))).join('')}</ul></div>`;
  };

  const refCountryCard = refCountry
    ? `<p class="sub first">${esc(t.refCountry)}</p><a class="match refm" href="${countryHref(refCountry)}">${img(refCountry.flagPath, t.flagAlt(refCountry.name), 'flagbig', refCountry.name)}<div><div class="match-tags"><span class="tag tag-solid">${esc(refCountry.historical ? t.refHistorical : t.refCurrent)}</span><span class="tag tag-cat">${pct(compatibility(vector, countryVector(refCountry)))}% ${t.matchWord}</span></div><h3>${esc(refCountry.name)}</h3><span class="tag tag-neutral">${esc(countryCaption(refCountry))}</span><p>${esc(refCountry.description)}</p></div></a><p class="sub">${esc(t.otherCountries)}</p>`
    : '';

  const distSpec = spectrumOf(distantIdeology.item.category);
  const ideologiesPanel = `<div class="panel"><p class="eyebrow">${esc(t.ideologyEyebrow)}</p><h2>${esc(t.ideologiesTitle)}</h2>
      ${closeSame.length ? `<p class="sub first">${esc(t.sameSpectrum(ideology.category))}</p><ul class="others">${closeSame.map(ideologyCard).join('')}</ul>` : ''}
      <p class="sub${closeSame.length ? '' : ' first'}">${esc(t.otherSpectrums)}</p><ul class="others">${closeOther.map(ideologyCard).join('')}</ul>
      <p class="sub">${esc(t.distantIdeology)}</p>
      <a class="distant" href="${prefix}/ideologies/${distantIdeology.item.id}"><strong>${esc(distantIdeology.item.name)}</strong><span class="tag" style="background:${distSpec.cb};color:${distSpec.c}">${esc(distantIdeology.item.category)}</span><span>${pct(distantIdeology.score)}%</span></a>
    </div>`;

  const refs = [
    refPerson &&
      `<a class="refc" href="${personHref(refPerson)}">${img(refPerson.imagePath, t.portraitAlt(refPerson.name), 'refimg', refPerson.name)}<span><small>${esc(t.refPerson)}</small><b>${esc(refPerson.name)}</b><em>${esc([refPerson.role, refPerson.lifespan].filter(Boolean).join(' · '))}</em></span></a>`,
    refCountry &&
      `<a class="refc" href="${countryHref(refCountry)}">${img(refCountry.flagPath, t.flagAlt(refCountry.name), 'refflag', refCountry.name)}<span><small>${esc(t.refCountry)}</small><b>${esc(refCountry.name)}</b><em>${esc(countryCaption(refCountry))}</em></span></a>`
  ].filter(Boolean);

  const [noteBefore, noteName, noteAfter] = t.phraseNote(name);
  const phrase = ideology.phrase
    ? `<figure class="panel phrase"><span class="q" aria-hidden="true">“</span><div><p class="eyebrow">${esc(t.phraseTitle)}</p><blockquote>${esc(ideology.phrase)}</blockquote><figcaption>${esc(noteBefore)}<b>${esc(noteName)}</b>${esc(noteAfter)}</figcaption></div></figure>`
    : '';

  const tabIds = t.ids;
  const tabButton = (key, first) =>
    `<button role="tab" id="t-${tabIds[key]}" aria-controls="${tabIds[key]}" aria-selected="${first}"${first ? '' : ' tabindex="-1"'}>${esc(t.tabs[key])}</button>`;

  const basePath = `/ideologies/${ideology.id}`;
  const description = truncate(ideology.description);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '12 Axes', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: L.s.navIdeologies, item: `${site}${prefix}/ideologies` },
        { '@type': 'ListItem', position: 3, name, item: `${site}${prefix}${basePath}` }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: L.s.ideologyHeadline(name),
      description,
      inLanguage: L.s.htmlLang,
      mainEntityOfPage: `${site}${prefix}${basePath}`,
      author: { '@type': 'Organization', name: '12 Axes', url: `${site}/` }
    }
  ];

  const html = `<!doctype html>
<html lang="${L.s.htmlLang}">
  ${catalogHead(L, { site, basePath, title: L.s.ideologyTitle(name), description, ogType: 'article', ogImage: '/logo.png', css: '/profile.css', jsonLd, gaSnippet, escapeHtml })}
  <body style="--cat:${spec.c};--cat-bg:${spec.cb}">
${poleSprite(L.axes)}
<a class="skip" href="#main">${esc(t.skip)}</a>
<header class="nav"><div class="wrap">
  <a class="logo" href="${home}" aria-label="${esc(t.homeAria)}"><b>12</b><span>axes</span></a>
  <nav class="navl" aria-label="${esc(t.catalogNav)}"><a href="${prefix}/ideologies" aria-current="page">${esc(L.s.navIdeologies)}</a><a href="${prefix}/countries">${esc(L.s.navCountries)}</a><a href="${prefix}/personalities">${esc(L.s.navPersonalities)}</a></nav>
  <a class="btn btn-primary btn-sm" href="${home}">${esc(t.takeTheTest)} ${ARR}</a>
</div></header>

<main id="main" class="res"><div class="wrap">
  <p class="crumbs"><a href="${home}">${esc(L.s.home)}</a> / <a href="${prefix}/ideologies">${esc(L.s.navIdeologies)}</a> / <span aria-current="page">${esc(name)}</span></p>
  <article class="panel ihero">
    <div class="ih-txt">
      <div class="match-tags"><span class="tag tag-solid">${esc(ideology.category)}</span><span class="tag tag-neutral">${esc(t.kind)}</span></div>
      <h1>${esc(name)}</h1>
      <p class="lead">${esc(ideology.description)}</p>
    </div>
    ${refs.length ? `<div class="ih-refs">${refs.join('')}</div>` : ''}
  </article>
  ${phrase}

  <div class="ptabs-wrap"><div class="ptabs" role="tablist" aria-label="${esc(t.tabsAria)}">
    ${tabButton('axes', true)}
    ${tabButton('personalities', false)}
    ${tabButton('countries', false)}
    ${tabButton('ideologies', false)}
  </div></div>

  <section class="tp" id="${tabIds.axes}" role="tabpanel" aria-labelledby="t-${tabIds.axes}">
    <div class="panel"><p class="eyebrow">${esc(t.axesEyebrow)}</p><h2>${esc(t.axesTitle)}</h2><ul class="axes-list">${axisRowsHtml(L, vector, esc, locale, ideology.religions)}</ul></div>
    <div class="panel"><h2>${esc(t.distTitle)}</h2><div class="dist">
      <article class="dcard strong"><span class="tag tag-cat">${esc(t.rareTag)}</span><h3>${esc(rare.axis.label)}</h3>
        <p>${esc(t.rareText(rarePole, rarePct, rare.values.length))}</p>${mbar(rare, true)}
        <p>${esc(t.rareNote(rare.axis.label))}</p></article>
      <article class="dcard"><span class="tag tag-neutral">${esc(t.commonTag)}</span><h3>${esc(common.axis.label)}</h3>
        <p>${esc(t.commonText(common.axis.label, common.dev < 5))}</p>${mbar(common, false)}
        <p>${esc(t.commonNote)}</p></article>
    </div></div>
  </section>

  <section class="tp" id="${tabIds.personalities}" role="tabpanel" aria-labelledby="t-${tabIds.personalities}" hidden>
    ${personalitiesPanel}
  </section>

  <section class="tp" id="${tabIds.countries}" role="tabpanel" aria-labelledby="t-${tabIds.countries}" hidden>
    <div class="panel"><h2>${esc(t.countriesTitle)}</h2>${refCountryCard}
      <div class="tabs ctabs" role="tablist" aria-label="${esc(t.countryTabsAria)}"><button role="tab" aria-selected="true" aria-controls="c-atual">${esc(t.currentTab)}</button><button role="tab" aria-selected="false" aria-controls="c-hist">${esc(t.historicalTab)}</button></div>
      ${countryGroups.map(countryPanel).join('')}
    </div>
  </section>

  <section class="tp" id="${tabIds.ideologies}" role="tabpanel" aria-labelledby="t-${tabIds.ideologies}" hidden>
    ${ideologiesPanel}
  </section>

  <aside class="panel pcta"><div><h2>${esc(t.ctaTitle)}</h2><p>${esc(t.ctaText(L.s.subjectPrefix(name, 'ideology'), L.ideologies.length - 1))}</p></div><a class="btn btn-primary" href="${home}">${esc(t.takeTheTest)} ${ARR}</a></aside>
</div></main>
<footer class="foot"><div class="wrap"><a class="logo" href="${home}"><b>12</b><span>axes</span></a><p>${esc(t.footer)} · <a href="${prefix === '' ? '/en' : ''}${basePath}">${prefix === '' ? 'English' : 'Português'}</a></p></div></footer>
${axisSheetHtml(locale)}
<script>
${PAGE_SCRIPT}</script>
  </body>
</html>`;

  return { basePath, html };
}
