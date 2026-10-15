// Página /parties (e /en/parties): partidos, movimentos, casas dinásticas e organizações
// agrupados por tipo, com busca, filtro, logo 1:1, país associado e a faixa de 12 ícones
// de polo. Reaproveita o CSS do catálogo de personalidades e troca o retrato pelo logo.
import { ARROW, dna, dnaLegend } from './ideologies-index.mjs';
import { poleSprite } from './pole-icons.mjs';
import { PERSONALITIES_CSS, catalogHead } from './personalities-index.mjs';
import { buildCardPoles, renderFilterButton, renderFilterDrawer, renderClientFilterScript } from './catalogue-filters.mjs';

// Tipos (campo `category` em PT, valor fechado do backend), na ordem de exibição.
const KINDS = [
  { key: 'Partido', slug: 'partidos', c: '#2D4778', cb: '#D6E0F2' },
  { key: 'Movimento', slug: 'movimentos', c: '#7A2E1B', cb: '#F0DCD5' },
  { key: 'Casa dinástica', slug: 'casas', c: '#5A3B5E', cb: '#E9DDEA' },
  { key: 'Organização armada', slug: 'armadas', c: '#880912', cb: '#F1D9DA' },
  { key: 'Organização internacional', slug: 'internacionais', c: '#102E24', cb: '#DCE6E0' }
];

const STR = {
  pt: {
    skip: 'Pular para a lista',
    catalogNav: 'Catálogo',
    homeAria: '12 axes, página inicial',
    eyebrow: 'Catálogo',
    lead: (n, cur, hist) => `${n} partidos, movimentos, casas dinásticas e organizações, ${cur} atuais e ${hist} históricos, com perfil completo nos 12 eixos e o país associado a cada um.`,
    stats: ['perfis', 'atuais', 'históricos'],
    kindsAria: 'Tipos',
    searchLabel: 'Buscar partido ou organização',
    searchPlaceholder: 'Buscar partido, organização ou país',
    filterAria: 'Filtrar por tipo',
    count: { Partido: ['partido', 'partidos'], Movimento: ['movimento', 'movimentos'], 'Casa dinástica': ['casa', 'casas'], 'Organização armada': ['organização', 'organizações'], 'Organização internacional': ['organização', 'organizações'] },
    viewProfile: 'Ver perfil',
    dnaNote:
      '<b>Como ler a faixa de 12 ícones:</b> cada ícone é um eixo e mostra o polo para onde o partido ou a organização pende. Quanto mais forte o ícone, mais intensa a posição. Passe o mouse para ver os valores.',
    legendAria: 'Polos de cada eixo, na ordem da faixa',
    emptyTitle: 'Nenhum perfil encontrado',
    emptyText: 'Tente outro termo ou limpe os filtros.',
    found: ['perfil encontrado', 'perfis encontrados'],
    clear: 'Limpar filtros',
    logoAlt: (name) => `Símbolo de ${name}`,
    ctaTitle: 'Qual partido combina com você?',
    ctaText: 'Responda ao quiz e descubra quais partidos, movimentos e organizações mais combinam com você.',
    takeTheTest: 'Fazer o teste',
    footer: 'Quiz político independente · 12axes.vercel.app · © 2026. Todos os direitos reservados',
    otherLang: { label: 'English', href: '/en/parties' },
    labels: {
      Partido: 'Partidos',
      Movimento: 'Movimentos',
      'Casa dinástica': 'Casas dinásticas',
      'Organização armada': 'Organizações armadas',
      'Organização internacional': 'Organizações internacionais'
    },
    descriptions: {
      Partido: 'Partidos políticos, atuais e históricos, com a prática e as ideias de cada um.',
      Movimento: 'Movimentos políticos e sociais, de massas ou de vanguarda.',
      'Casa dinástica': 'Dinastias e casas reais e imperiais, no poder ou pretendentes.',
      'Organização armada': 'Grupos armados e insurgentes, com a doutrina e a prática declaradas.',
      'Organização internacional': 'Organizações e blocos que atuam acima dos Estados.'
    }
  },
  en: {
    skip: 'Skip to the list',
    catalogNav: 'Catalog',
    homeAria: '12 axes, home page',
    eyebrow: 'Catalog',
    lead: (n, cur, hist) => `${n} parties, movements, dynastic houses and organizations, ${cur} current and ${hist} historical, with a full profile across the 12 axes and the country each one is tied to.`,
    stats: ['profiles', 'current', 'historical'],
    kindsAria: 'Types',
    searchLabel: 'Search party or organization',
    searchPlaceholder: 'Search party, organization or country',
    filterAria: 'Filter by type',
    count: { Partido: ['party', 'parties'], Movimento: ['movement', 'movements'], 'Casa dinástica': ['house', 'houses'], 'Organização armada': ['organization', 'organizations'], 'Organização internacional': ['organization', 'organizations'] },
    viewProfile: 'View profile',
    dnaNote:
      '<b>How to read the 12-icon strip:</b> each icon is an axis and shows the pole the party or organization leans toward. The stronger the icon, the more intense the position. Hover to see the values.',
    legendAria: 'Poles of each axis, in strip order',
    emptyTitle: 'No profile found',
    emptyText: 'Try another term or clear the filters.',
    found: ['profile found', 'profiles found'],
    clear: 'Clear filters',
    logoAlt: (name) => `Symbol of ${name}`,
    ctaTitle: 'Which party matches you?',
    ctaText: 'Take the quiz and find out which parties, movements and organizations match you best.',
    takeTheTest: 'Take the test',
    footer: 'Independent political quiz · 12axes.vercel.app · © 2026. All rights reserved',
    otherLang: { label: 'Português', href: '/parties' },
    labels: {
      Partido: 'Parties',
      Movimento: 'Movements',
      'Casa dinástica': 'Dynastic houses',
      'Organização armada': 'Armed organizations',
      'Organização internacional': 'International organizations'
    },
    descriptions: {
      Partido: 'Political parties, current and historical, with the practice and ideas of each.',
      Movimento: 'Political and social movements, mass-based or vanguard.',
      'Casa dinástica': 'Royal and imperial dynasties and houses, in power or claimants.',
      'Organização armada': 'Armed and insurgent groups, with their declared doctrine and practice.',
      'Organização internacional': 'Organizations and blocs acting above states.'
    }
  }
};

export function partiesIndexPage(L, { locale, site, gaSnippet, escapeHtml, profiles, title, description }) {
  const t = STR[locale];
  const prefix = L.s.prefix;
  const collator = new Intl.Collator(L.s.htmlLang);
  // O `category` do catálogo EN vem traduzido; o tipo canônico é o do JSON PT.
  const kindOf = (party) => L.partyKindById.get(party.id);

  const groups = KINDS.map((k) => ({
    ...k,
    items: L.parties.filter((p) => kindOf(p) === k.key).sort((a, b) => collator.compare(a.name, b.name))
  })).filter((g) => g.items.length > 0);

  const n = L.parties.length;
  const current = L.parties.filter((p) => !p.historical).length;
  const historical = n - current;
  const countryName = (p) => L.countryById.get(p.countryId)?.name ?? '';

  const vars = (g) => `--c:${g.c};--cb:${g.cb}`;
  const abar = groups
    .map((g) => `<a class="ab" href="#${g.slug}" style="--c:${g.c}"><b>${g.items.length}</b><span>${escapeHtml(t.labels[g.key])}</span></a>`)
    .join('');
  const chips = groups
    .map((g) => `<button type="button" class="chip" data-cat="${g.slug}" style="${vars(g)}" aria-pressed="false"><span class="dot"></span>${escapeHtml(t.labels[g.key])}<em>${g.items.length}</em></button>`)
    .join('');
  const legend = dnaLegend(L.axes, escapeHtml);
  const { drawerHtml, activeFiltersBar } = renderFilterDrawer({ axes: L.axes, locale, type: 'parties', escapeHtml });

  const card = (p) => {
    const where = countryName(p);
    const text = [p.name, p.category, where, p.period, p.description].filter(Boolean).join(' ').toLowerCase();
    const vec = profiles.get(p.id);
    const poles = buildCardPoles(L.axes, vec);
    return `<li class="pc" data-text="${escapeHtml(text)}" data-poles="${escapeHtml(poles)}"><a href="${prefix}/parties/${p.id}"><span class="pc-top"><span class="lg"><img src="${p.logoPath}" alt="${escapeHtml(t.logoAlt(p.name))}" loading="lazy" decoding="async"></span><span class="pc-id"><h3>${escapeHtml(p.name)}</h3><span class="meta">${escapeHtml(where)}</span>${p.historical && p.period ? `<span class="life">${escapeHtml(p.period)}</span>` : ''}</span></span><p>${escapeHtml(p.description)}</p><span class="ic-foot">${dna(L.axes, vec, escapeHtml)}<span class="go">${escapeHtml(t.viewProfile)} ${ARROW}</span></span></a></li>`;
  };

  const section = (g) =>
    `<section class="cat" id="${g.slug}" data-cat="${g.slug}" style="${vars(g)}" aria-labelledby="h-${g.slug}"><header class="cat-head"><div class="cat-title"><span class="cat-mark" aria-hidden="true"></span><div><h2 id="h-${g.slug}">${escapeHtml(t.labels[g.key])}</h2><p>${escapeHtml(t.descriptions[g.key])}</p></div></div><span class="cat-count" data-one="${escapeHtml(t.count[g.key][0])}" data-many="${escapeHtml(t.count[g.key][1])}"><b class="cc">${g.items.length}</b> <span class="cl">${escapeHtml(t.count[g.key][g.items.length === 1 ? 0 : 1])}</span></span></header><ul class="grid">${g.items.map(card).join('')}</ul></section>`;

  const basePath = '/parties';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: L.s.partiesIndexHeading,
    description,
    inLanguage: L.s.htmlLang,
    url: `${site}${prefix}${basePath}`
  };
  const scriptStrings = JSON.stringify({ found: t.found, clear: t.clear });

  const html = `<!doctype html>
<html lang="${L.s.htmlLang}">
  ${catalogHead(L, { site, basePath, title, description, ogType: 'website', ogImage: '/logo.png', css: '/parties.css', jsonLd: [jsonLd], gaSnippet, escapeHtml })}
  <body>
${poleSprite(L.axes)}
<a class="skip" href="#lista">${escapeHtml(t.skip)}</a>
<header class="nav"><div class="wrap">
  <a class="logo" href="${prefix || '/'}" aria-label="${escapeHtml(t.homeAria)}"><b>12</b><span>axes</span></a>
  <nav aria-label="${escapeHtml(t.catalogNav)}"><a href="${prefix}/books">${escapeHtml(L.s.navBooks)}</a><a href="${prefix}/ideologies">${escapeHtml(L.s.navIdeologies)}</a><a href="${prefix}/personalities">${escapeHtml(L.s.navPersonalities)}</a><a href="${prefix}/countries">${escapeHtml(L.s.navCountries)}</a><a href="${prefix}/parties" aria-current="page">${escapeHtml(L.s.navParties)}</a></nav>
  <a class="btn" href="${prefix || '/'}">${escapeHtml(t.takeTheTest)} ${ARROW}</a>
</div></header>

<div class="wrap hero">
  <p class="crumbs"><a href="${prefix || '/'}">${escapeHtml(L.s.home)}</a> / ${escapeHtml(L.s.navParties)}</p>
  <p class="eyebrow">${escapeHtml(t.eyebrow)}</p>
  <h1>${escapeHtml(L.s.partiesIndexHeading)}</h1>
  <p class="lead">${escapeHtml(t.lead(n, current, historical))}</p>
  <div class="stats"><div><b>${n}</b><span>${escapeHtml(t.stats[0])}</span></div><div><b>${current}</b><span>${escapeHtml(t.stats[1])}</span></div><div><b>${historical}</b><span>${escapeHtml(t.stats[2])}</span></div></div>
  <nav class="abar" aria-label="${escapeHtml(t.kindsAria)}">${abar}</nav>
</div>

<div class="tools" role="search"><div class="wrap">
  <label class="search"><span class="sr">${escapeHtml(t.searchLabel)}</span>
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
    <input id="q" type="search" placeholder="${escapeHtml(t.searchPlaceholder)}" autocomplete="off"></label>
  ${renderFilterButton(locale)}
  <div class="chips" role="group" aria-label="${escapeHtml(t.filterAria)}">${chips}</div>
</div></div>
${drawerHtml}

<main id="lista" class="wrap">
  ${activeFiltersBar}
  <p class="result-info" id="info" aria-live="polite"></p>
  <p class="dna-note">${t.dnaNote}</p>
  <ul class="legend" aria-label="${escapeHtml(t.legendAria)}">${legend}</ul>
  ${groups.map(section).join('')}
  <div class="empty" id="empty"><h2>${escapeHtml(t.emptyTitle)}</h2><p>${escapeHtml(t.emptyText)}</p></div>
  <aside class="cta"><div><h2>${escapeHtml(t.ctaTitle)}</h2><p>${escapeHtml(t.ctaText)}</p></div><a class="btn" href="${prefix || '/'}">${escapeHtml(t.takeTheTest)} ${ARROW}</a></aside>
</main>
<footer class="foot"><div class="wrap"><a class="logo" href="${prefix || '/'}"><b>12</b><span>axes</span></a><p>${escapeHtml(t.footer)} · <a href="${t.otherLang.href}">${escapeHtml(t.otherLang.label)}</a></p></div></footer>
<script>
window.__SCRIPT_STRINGS__=${scriptStrings};
${renderClientFilterScript({ cardSelector: '.pc', hasHistorical: false, locale })}
</script>
  </body>
</html>`;

  return { basePath, html };
}

export const PARTIES_CSS = `${PERSONALITIES_CSS}
.lg{flex:none;width:64px;height:64px;border-radius:14px;overflow:hidden;background:#fff;box-shadow:0 0 0 1px var(--borda);display:grid;place-items:center}
.lg img{width:100%;height:100%;object-fit:contain;display:block;padding:6px;box-sizing:border-box}
.abar{grid-template-columns:repeat(5,1fr)}
.ab{border-top:4px solid var(--c);transition:transform .15s}
.ab:hover{transform:translateY(-2px);border-color:var(--borda);border-top-color:var(--c)}
.ab b{color:var(--c)}
@media (max-width:980px){.abar{grid-template-columns:repeat(3,1fr)}}
@media (max-width:640px){.abar{display:grid;grid-template-columns:repeat(2,1fr)}.lg{width:56px;height:56px}}
`;
