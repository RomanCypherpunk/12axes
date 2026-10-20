// Página /parties/:id (e /en/...): perfil de um partido, movimento, casa dinástica ou
// organização, com o logo oficial 1:1 e o país associado. Mesma lógica das páginas de
// país e personalidade: o vetor do perfil é comparado com ideologias, personalidades e
// outros partidos pela fórmula do backend (profile-match.mjs).
import { siteHeader } from './site-header.mjs';
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
    currentKind: 'Atual',
    historicalKind: 'Período histórico',
    kpiSpectrum: 'Espectro predominante',
    kpiClosestIdeology: 'Ideologia mais próxima',
    kpiClosestPerson: 'Personalidade mais próxima',
    portraitAlt: (name) => `Retrato de ${name}`,
    logoAlt: (name) => `Símbolo de ${name}`,
    flagAlt: (name) => `Bandeira: ${name}`,
    tabsAria: 'Seções do perfil',
    tabs: { axes: 'Eixos', ideologies: 'Ideologias', personalities: 'Personalidades', parties: 'Partidos e organizações' },
    ids: { axes: 'eixos', ideologies: 'ideologias', personalities: 'personalidades', parties: 'partidos' },
    axesEyebrow: 'Eixos políticos',
    axesTitle: 'Perfil nos 12 eixos',
    distTitle: (name) => `O que distingue ${name}`,
    rareTag: 'Posição mais incomum',
    commonTag: 'Posição mais comum',
    rareText: (pole, pct, n) => `Puxa mais para ${pole.toLowerCase()} que ${pct}% dos ${n} partidos e organizações do catálogo.`,
    rareNote: (axis) => `De todos os eixos, ${axis} é onde mais se afasta do conjunto.`,
    commonText: (axis, exact) => (exact ? `Em ${axis}, fica praticamente na mediana do catálogo.` : `Em ${axis}, fica perto da mediana do catálogo.`),
    commonNote: 'Aqui está em terreno comum com a maioria dos partidos e organizações.',
    median: 'Mediana dos partidos',
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
    partiesTitle: 'Partidos e organizações parecidos',
    partyKicker: 'Mais parecido',
    alsoSimilar: 'Também parecidos',
    farParties: 'Os mais diferentes',
    associatedCountry: 'País associado',
    matchWord: 'match',
    ctaTitle: 'Você se identifica com este perfil?',
    ctaText: (name, n) => `Responda ao quiz e veja sua compatibilidade com ${name} e outros ${n} partidos e organizações nos 12 eixos.`,
    footer: 'Quiz político independente · 12axes.vercel.app · © 2026. Todos os direitos reservados'
  },
  en: {
    skip: 'Skip to content',
    catalogNav: 'Catalog',
    homeAria: '12 axes, home page',
    takeTheTest: 'Take the test',
    currentKind: 'Current',
    historicalKind: 'Historical period',
    kpiSpectrum: 'Predominant spectrum',
    kpiClosestIdeology: 'Closest ideology',
    kpiClosestPerson: 'Closest personality',
    portraitAlt: (name) => `Portrait of ${name}`,
    logoAlt: (name) => `Symbol of ${name}`,
    flagAlt: (name) => `Flag: ${name}`,
    tabsAria: 'Profile sections',
    tabs: { axes: 'Axes', ideologies: 'Ideologies', personalities: 'Personalities', parties: 'Parties and organizations' },
    ids: { axes: 'axes', ideologies: 'ideologies', personalities: 'personalities', parties: 'parties' },
    axesEyebrow: 'Political axes',
    axesTitle: 'Profile across the 12 axes',
    distTitle: (name) => `What sets ${name} apart`,
    rareTag: 'Most unusual position',
    commonTag: 'Most common position',
    rareText: (pole, pct, n) => `Leans further toward ${pole.toLowerCase()} than ${pct}% of the ${n} parties and organizations in the catalog.`,
    rareNote: (axis) => `Of all the axes, ${axis} is where it stands furthest from the rest.`,
    commonText: (axis, exact) => (exact ? `On ${axis}, it sits practically at the catalog median.` : `On ${axis}, it sits close to the catalog median.`),
    commonNote: 'Here it shares common ground with most parties and organizations.',
    median: 'Party median',
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
    partiesTitle: 'Similar parties and organizations',
    partyKicker: 'Most similar',
    alsoSimilar: 'Also similar',
    farParties: 'The most different',
    associatedCountry: 'Associated country',
    matchWord: 'match',
    ctaTitle: 'Do you identify with this profile?',
    ctaText: (name, n) => `Take the quiz and see your compatibility with ${name} and ${n} other parties and organizations across the 12 axes.`,
    footer: 'Independent political quiz · 12axes.vercel.app · © 2026. All rights reserved'
  }
};

const ARR = '<svg class="arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';
const pct = (x) => Math.round(x);

export function partyPage(L, party, ctx) {
  const { locale, site, gaSnippet, escapeHtml, truncate, profiles } = ctx;
  const esc = escapeHtml;
  const t = STR[locale];
  const prefix = L.s.prefix;
  const home = prefix || '/';
  const vector = profiles.party.get(party.id) ?? {};
  const name = party.name;
  const country = L.countryById.get(party.countryId);
  const countryName = country?.name ?? '';
  const title = countryName ? `${name}, ${countryName}` : name;
  const img = (src, alt, cls, who) =>
    `<img class="${cls}" src="${src}" alt="${esc(alt)}" loading="lazy" decoding="async" data-i="${esc(initials(who))}">`;
  const personHref = (p) => `${prefix}/personalities/${p.id}`;
  const partyHref = (p) => `${prefix}/parties/${p.id}`;
  const partyCaption = (p) => {
    const c = L.countryById.get(p.countryId)?.name ?? '';
    return p.historical && p.period ? `${c} · ${p.period}` : c;
  };
  const tags = (list) => list.filter(Boolean).map((x) => `<span class="tag tag-neutral">${esc(x)}</span>`).join('');

  // ── ideologias ──
  const ideologyVector = (i) => profiles.ideology.get(i.id);
  const visible = religionVisibility(party);
  const rankedIdeologies = rank(vector, L.ideologies.filter(visible), ideologyVector);
  const compatible = rankedIdeologies.slice(0, 3);
  const distantIdeology = rankedIdeologies[rankedIdeologies.length - 1];
  const specItem = rankedIdeologies[0].item;
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

  // ── outros partidos e organizações ──
  const partyVector = (p) => profiles.party.get(p.id);
  const pool = L.parties.filter((p) => p.id !== party.id && visible(p));
  const rankedParties = rank(vector, pool, partyVector);
  const topParty = rankedParties[0];
  const nearParties = rankedParties.slice(1, 9);
  const farParties = rankedParties.slice(-3).reverse();

  const { rare, common, rarePct, rarePole } = distinctive(L.axes, vector, profiles.party);
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

  const tpP = topParty?.item;
  const partiesPanel = tpP
    ? `<div class="panel"><h2>${esc(t.partiesTitle)}</h2>
      <a class="match" href="${partyHref(tpP)}">${img(tpP.logoPath, t.logoAlt(tpP.name), 'plogo plogo-b', tpP.name)}<div>
        <div class="match-tags"><span class="tag tag-cat">${esc(t.partyKicker)}</span><span class="tag tag-solid">${pct(topParty.score)}% ${t.matchWord}</span></div>
        <h3>${esc(tpP.name)}</h3><div class="match-tags">${tags([tpP.category, partyCaption(tpP)])}</div>
        <p>${esc(tpP.description)}</p></div></a>
      <p class="sub">${esc(t.alsoSimilar)}</p><ul class="near-grid">${nearParties.map((r) => `<li><a class="near" href="${partyHref(r.item)}">${img(r.item.logoPath, t.logoAlt(r.item.name), 'plogo plogo-s', r.item.name)}<div><span class="tag tag-neutral">${esc(r.item.category)}</span><strong>${esc(r.item.name)}</strong><small>${esc(partyCaption(r.item))}</small><span class="pctc">${pct(r.score)}%</span></div></a></li>`).join('')}</ul>
      <p class="sub">${esc(t.farParties)}</p><ul class="fars">${farParties.map((r) => farRow(r, partyHref(r.item), partyCaption(r.item))).join('')}</ul>
    </div>`
    : '';

  const kindTag = party.historical ? [t.historicalKind, party.period].filter(Boolean).join(' · ') : t.currentKind;

  const tabIds = t.ids;
  const tabButton = (key, first) =>
    `<button role="tab" id="t-${tabIds[key]}" aria-controls="${tabIds[key]}" aria-selected="${first}"${first ? '' : ' tabindex="-1"'}>${esc(t.tabs[key])}</button>`;

  const basePath = `/parties/${party.id}`;
  const description = truncate(`${title}. ${party.description}`);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '12 Axes', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: L.s.navParties, item: `${site}${prefix}/parties` },
        { '@type': 'ListItem', position: 3, name: title, item: `${site}${prefix}${basePath}` }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: L.s.partyHeadline(title),
      description,
      inLanguage: L.s.htmlLang,
      mainEntityOfPage: `${site}${prefix}${basePath}`,
      author: { '@type': 'Organization', name: '12 Axes', url: `${site}/` }
    }
  ];

  const html = `<!doctype html>
<html lang="${L.s.htmlLang}">
  ${catalogHead(L, { site, basePath, title: L.s.partyTitle(title), description, ogType: 'article', ogImage: party.logoPath, css: '/profile.css', jsonLd, gaSnippet, escapeHtml })}
  <body style="--cat:${spec.c};--cat-bg:${spec.cb}">
${poleSprite(L.axes)}
<a class="skip" href="#main">${esc(t.skip)}</a>
${siteHeader({ L, basePath, current: 'parties', webView: `/tree/parties?id=${party.id}` })}

<main id="main" class="res"><div class="wrap">
  <p class="crumbs"><a href="${home}">${esc(L.s.home)}</a> / <a href="${prefix}/parties">${esc(L.s.navParties)}</a> / <span aria-current="page">${esc(name)}</span></p>
  <article class="panel chero">
    <div class="ih-txt">
      <div class="match-tags"><span class="tag tag-solid">${esc(party.category)}</span><span class="tag tag-neutral">${esc(kindTag)}</span>${country ? `<a class="tag tag-neutral" href="${prefix}/countries/${country.id}" aria-label="${esc(t.associatedCountry)}: ${esc(countryName)}">${esc(countryName)}</a>` : ''}</div>
      <h1>${esc(name)}</h1>
      <p class="lead">${esc(party.description)}</p>
      <dl class="kpis">
        <div><dt>${esc(t.kpiSpectrum)}</dt><dd class="c">${esc(specItem.category)}</dd></div>
        <div><dt>${esc(t.kpiClosestIdeology)}</dt><dd>${esc(specItem.name)}</dd></div>
        <div><dt>${esc(t.kpiClosestPerson)}</dt><dd>${esc(tp.name)}</dd></div>
      </dl>
    </div>
    <figure class="ch-flag ch-logo"><img src="${party.logoPath}" alt="${esc(t.logoAlt(name))}"></figure>
  </article>

  <div class="ptabs-wrap"><div class="ptabs" role="tablist" aria-label="${esc(t.tabsAria)}">
    ${tabButton('axes', true)}
    ${tabButton('ideologies', false)}
    ${tabButton('personalities', false)}
    ${tabButton('parties', false)}
  </div></div>

  <section class="tp" id="${tabIds.axes}" role="tabpanel" aria-labelledby="t-${tabIds.axes}">
    <div class="panel"><p class="eyebrow">${esc(t.axesEyebrow)}</p><h2>${esc(t.axesTitle)}</h2><ul class="axes-list">${axisRowsHtml(L, vector, esc, locale, party.religions)}</ul></div>
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

  <section class="tp" id="${tabIds.parties}" role="tabpanel" aria-labelledby="t-${tabIds.parties}" hidden>
    ${partiesPanel}
  </section>

  <aside class="panel pcta"><div><h2>${esc(t.ctaTitle)}</h2><p>${esc(t.ctaText(name, L.parties.length - 1))}</p></div><a class="btn btn-primary" href="${home}">${esc(t.takeTheTest)} ${ARR}</a></aside>
</div></main>
<footer class="foot"><div class="wrap"><a class="logo" href="${home}"><b>12</b><span>axes</span></a><p>${esc(t.footer)} · <a href="${prefix === '' ? '/en' : ''}${basePath}">${prefix === '' ? 'English' : 'Português'}</a></p></div></footer>
${axisSheetHtml(locale)}
<script>
${PAGE_SCRIPT}</script>
  </body>
</html>`;

  return { basePath, html };
}

export const PARTY_PAGE_CSS = `
/* partido/organização: hero com logo quadrado 1:1 sobre fundo claro */
.ch-logo{padding:32px}
.ch-logo img{width:100%;max-width:260px;aspect-ratio:1/1;height:auto;object-fit:contain;background:#fff;padding:18px;border-radius:20px;box-shadow:0 14px 34px rgba(16,16,16,.18)}
.ch-logo .ini{width:100%;max-width:260px;aspect-ratio:1/1;border-radius:20px;font-size:48px}
.h1-country{font-size:.55em;letter-spacing:-.02em;font-weight:500;color:var(--soft,#555);white-space:nowrap}
.plogo{object-fit:contain;background:#fff;box-shadow:0 0 0 1px var(--borda);box-sizing:border-box}
.plogo-b{width:140px;height:140px;padding:12px;border-radius:20px}
.plogo-s{width:52px;height:52px;padding:5px;border-radius:12px}
`;
