import { FR_COUNTRIES_INDEX } from './fr-catalogue.mjs';
import { alternateLinks, languageLinks } from './locales.mjs';
// Página /countries (e /en/countries): países atuais e regimes históricos
// agrupados por época, com busca, filtro, bandeira e a faixa de 12 ícones de polo.
// Reaproveita o CSS do catálogo de personalidades e troca o retrato pela bandeira.
import { ARROW, dna, dnaLegend } from './ideologies-index.mjs';
import { poleSprite } from './pole-icons.mjs';
import { PERSONALITIES_CSS, catalogHead } from './personalities-index.mjs';

// Épocas, na ordem do catálogo. Cada regime entra na época do ano de início;
// `until` é o ano (exclusivo) que fecha a época. A Antiguidade fecha em 300
// para que Bizâncio (330) conte como medieval. Anos a.C. são negativos.
const ERAS = [
  { key: 'antiguidade', until: 300, c: '#6B4A1F', cb: '#EFE4D2' },
  { key: 'medieval', until: 1500, c: '#5A3B5E', cb: '#E9DDEA' },
  { key: 'moderna', until: 1800, c: '#2D4778', cb: '#D6E0F2' },
  { key: 'xix', until: 1900, c: '#7A2E1B', cb: '#F0DCD5' },
  { key: 'xx', until: Infinity, c: '#880912', cb: '#F1D9DA' }
];
const CURRENT = { key: 'atuais', c: '#102E24', cb: '#DCE6E0' };

// Anos de início e fim do período ("c. 900–192 a.C.", "509–27 a.C.",
// "27 a.C.–476 d.C.", "março–maio de 1871", "1922–1991", "2024–"). Anos a.C.
// são negativos; sem ano final, fim = início; sem número nenhum, null.
export function periodRange(period = '') {
  const parts = period.split('–');
  const nums = parts.map((part) => part.match(/\d+/)).map((m) => (m ? Number(m[0]) : null));
  const years = nums.filter((n) => n !== null);
  if (years.length === 0) return null;
  const allBc = period.includes('a.C.') && !period.includes('d.C.');
  const sign = (i) => (allBc || parts[i].includes('a.C.') ? -1 : 1);
  const idx = nums.map((n, i) => (n === null ? -1 : i)).filter((i) => i >= 0);
  const start = sign(idx[0]) * nums[idx[0]];
  const end = sign(idx[idx.length - 1]) * nums[idx[idx.length - 1]];
  return { start, end };
}

const STR = {
  fr: FR_COUNTRIES_INDEX,
  pt: {
    skip: 'Pular para a lista',
    catalogNav: 'Catálogo',
    homeAria: '12 axes, página inicial',
    eyebrow: 'Catálogo',
    lead: (cur, hist) => `${cur} países atuais e ${hist} regimes históricos com perfil completo nos 12 eixos. Da Antiguidade à política de hoje, descubra onde cada um se posiciona.`,
    stats: ['perfis', 'países atuais', 'regimes históricos', 'anos de história'],
    erasAria: 'Épocas',
    searchLabel: 'Buscar país ou regime',
    searchPlaceholder: 'Buscar país, regime ou época',
    filterAria: 'Filtrar por época',
    historicalBlock: 'Regimes históricos',
    countCurrent: ['país', 'países'],
    countHistorical: ['regime', 'regimes'],
    viewProfile: 'Ver perfil',
    dnaNote:
      '<b>Como ler a faixa de 12 ícones:</b> cada ícone é um eixo e mostra o polo para onde o país ou regime pende. Quanto mais forte o ícone, mais intensa a posição. Passe o mouse para ver os valores.',
    legendAria: 'Polos de cada eixo, na ordem da faixa',
    emptyTitle: 'Nenhum país encontrado',
    emptyText: 'Tente outro termo ou limpe os filtros.',
    found: ['perfil encontrado', 'perfis encontrados'],
    clear: 'Limpar filtros',
    flagAlt: (name) => `Bandeira: ${name}`,
    ctaTitle: 'Em que país você se encaixaria?',
    ctaText: 'Responda ao quiz e descubra quais países e regimes históricos mais combinam com você.',
    takeTheTest: 'Fazer o teste',
    footer: 'Quiz político independente · 12axes.vercel.app',
    otherLang: { label: 'English', href: '/en/countries' },
    labels: {
      atuais: 'Países atuais',
      antiguidade: 'Antiguidade',
      medieval: 'Idade Média',
      moderna: 'Idade Moderna',
      xix: 'Século XIX',
      xx: 'Séculos XX e XXI'
    },
    descriptions: {
      atuais: 'Estados e regiões autônomas de hoje, cada um com seu regime político e perfil nos 12 eixos.',
      antiguidade: 'Cidades-Estado, repúblicas e impérios do mundo antigo.',
      medieval: 'Impérios, repúblicas mercantes e comunidades medievais.',
      moderna: 'Monarquias, impérios coloniais e repúblicas da era moderna.',
      xix: 'Impérios, nações recém-unificadas e experiências revolucionárias do século XIX.',
      xx: 'Regimes dos séculos XX e XXI: totalitarismos, ditaduras, revoluções e experiências democráticas.'
    }
  },
  en: {
    skip: 'Skip to the list',
    catalogNav: 'Catalog',
    homeAria: '12 axes, home page',
    eyebrow: 'Catalog',
    lead: (cur, hist) => `${cur} modern countries and ${hist} historical regimes with a full profile across the 12 axes. From Antiquity to today's politics, see where each one stands.`,
    stats: ['profiles', 'modern countries', 'historical regimes', 'years of history'],
    erasAria: 'Eras',
    searchLabel: 'Search country or regime',
    searchPlaceholder: 'Search country, regime or era',
    filterAria: 'Filter by era',
    historicalBlock: 'Historical regimes',
    countCurrent: ['country', 'countries'],
    countHistorical: ['regime', 'regimes'],
    viewProfile: 'View profile',
    dnaNote:
      '<b>How to read the 12-icon strip:</b> each icon is an axis and shows the pole the country or regime leans toward. The stronger the icon, the more intense the position. Hover to see the values.',
    legendAria: 'Poles of each axis, in strip order',
    emptyTitle: 'No country found',
    emptyText: 'Try another term or clear the filters.',
    found: ['profile found', 'profiles found'],
    clear: 'Clear filters',
    flagAlt: (name) => `Flag: ${name}`,
    ctaTitle: 'Which country would you fit in?',
    ctaText: 'Take the quiz and find out which countries and historical regimes match you best.',
    takeTheTest: 'Take the test',
    footer: 'Independent political quiz · 12axes.vercel.app',
    otherLang: { label: 'Português', href: '/countries' },
    labels: {
      atuais: 'Modern countries',
      antiguidade: 'Antiquity',
      medieval: 'Middle Ages',
      moderna: 'Early modern era',
      xix: '19th century',
      xx: '20th and 21st centuries'
    },
    descriptions: {
      atuais: "Today's states and autonomous regions, each with its political regime and profile across the 12 axes.",
      antiguidade: 'City-states, republics and empires of the ancient world.',
      medieval: 'Empires, merchant republics and medieval communities.',
      moderna: 'Monarchies, colonial empires and republics of the early modern era.',
      xix: 'Empires, newly unified nations and revolutionary experiments of the 19th century.',
      xx: 'Regimes of the 20th and 21st centuries: totalitarianisms, dictatorships, revolutions and democratic experiments.'
    }
  }
};

export function countriesIndexPage(L, { locale, site, gaSnippet, escapeHtml, profiles, title, description }) {
  const t = STR[locale];
  const prefix = L.s.prefix;
  const collator = new Intl.Collator(L.s.htmlLang);

  const current = L.countries.filter((c) => !c.historical).sort((a, b) => collator.compare(a.name, b.name));
  const historical = L.countries
    .filter((c) => c.historical)
    .map((c) => ({ c, range: periodRange(L.countryPeriods.get(c.id)) }))
    .map((h) => ({ ...h, start: h.range?.start ?? null }));
  const undated = historical.filter((h) => h.start === null);
  if (undated.length > 0) {
    throw new Error(`countries: regime sem ano no período: ${undated.map((h) => `${h.c.id} (${h.c.period})`).join(', ')}`);
  }
  historical.sort((a, b) => a.start - b.start || collator.compare(a.c.name, b.c.name));

  const groups = [
    { ...CURRENT, items: current, count: t.countCurrent },
    ...ERAS.map((era, i) => ({
      ...era,
      count: t.countHistorical,
      items: historical
        .filter((h) => h.start < era.until && (i === 0 || h.start >= ERAS[i - 1].until))
        .map((h) => h.c)
    }))
  ].filter((g) => g.items.length > 0);

  const earliest = historical.length ? historical[0].start : new Date().getFullYear();
  const years = Math.round((new Date().getFullYear() - earliest) / 100) * 100;
  const n = L.countries.length;

  const vars = (g) => `--c:${g.c};--cb:${g.cb}`;
  const abar = groups
    .map((g) => `<a class="ab${g.key === CURRENT.key ? ' cur' : ''}" href="#${g.key}" style="--c:${g.c}"><b>${g.items.length}</b><span>${escapeHtml(t.labels[g.key])}</span></a>`)
    .join('');
  const chips = groups
    .map((g) => `<button type="button" class="chip" data-cat="${g.key}" style="${vars(g)}" aria-pressed="false"><span class="dot"></span>${escapeHtml(t.labels[g.key])}<em>${g.items.length}</em></button>`)
    .join('');
  const legend = dnaLegend(L.axes, escapeHtml);

  const card = (c) => {
    const text = [c.name, c.category, c.period, c.description].filter(Boolean).join(' ').toLowerCase();
    return `<li class="pc" data-text="${escapeHtml(text)}"><a href="${prefix}/countries/${c.id}"><span class="pc-top"><span class="fl"><img src="${c.flagPath}" alt="${escapeHtml(t.flagAlt(c.name))}" loading="lazy" decoding="async"></span><span class="pc-id"><h3>${escapeHtml(c.name)}</h3><span class="meta">${escapeHtml(c.category)}</span>${c.historical && c.period ? `<span class="life">${escapeHtml(c.period)}</span>` : ''}</span></span><p>${escapeHtml(c.description)}</p><span class="ic-foot">${dna(L.axes, profiles.get(c.id), escapeHtml)}<span class="go">${escapeHtml(t.viewProfile)} ${ARROW}</span></span></a></li>`;
  };

  const section = (g) =>
    `<section class="cat" id="${g.key}" data-cat="${g.key}" style="${vars(g)}" aria-labelledby="h-${g.key}"><header class="cat-head"><div class="cat-title"><span class="cat-mark" aria-hidden="true"></span><div><h2 id="h-${g.key}">${escapeHtml(t.labels[g.key])}</h2><p>${escapeHtml(t.descriptions[g.key])}</p></div></div><span class="cat-count" data-one="${escapeHtml(g.count[0])}" data-many="${escapeHtml(g.count[1])}"><b class="cc">${g.items.length}</b> <span class="cl">${escapeHtml(g.count[g.items.length === 1 ? 0 : 1])}</span></span></header><ul class="grid">${g.items.map(card).join('')}</ul></section>`;

  const currentGroup = groups.filter((g) => g.key === CURRENT.key);
  const eraGroups = groups.filter((g) => g.key !== CURRENT.key);
  const sections =
    currentGroup.map(section).join('') +
    (eraGroups.length ? `<h2 class="block-t" id="historicos-t">${escapeHtml(t.historicalBlock)}</h2>${eraGroups.map(section).join('')}` : '');

  const basePath = '/countries';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: L.s.countriesIndexHeading,
    description,
    inLanguage: L.s.htmlLang,
    url: `${site}${prefix}${basePath}`
  };
  const scriptStrings = JSON.stringify({ found: t.found, clear: t.clear });
  const fmt = new Intl.NumberFormat(L.s.htmlLang);

  const html = `<!doctype html>
<html lang="${L.s.htmlLang}">
  ${catalogHead(L, { site, basePath, title, description, ogType: 'website', ogImage: '/logo.png', css: '/countries.css', jsonLd: [jsonLd], gaSnippet, escapeHtml })}
  <body>
${poleSprite(L.axes)}
<a class="skip" href="#lista">${escapeHtml(t.skip)}</a>
<header class="nav"><div class="wrap">
  <a class="logo" href="${L.s.homePath}" aria-label="${escapeHtml(t.homeAria)}"><b>12</b><span>axes</span></a>
  <nav aria-label="${escapeHtml(t.catalogNav)}"><a href="${prefix}/ideologies">${escapeHtml(L.s.navIdeologies)}</a><a href="${prefix}/countries" aria-current="page">${escapeHtml(L.s.navCountries)}</a><a href="${prefix}/personalities">${escapeHtml(L.s.navPersonalities)}</a></nav>
  <a class="btn" href="${L.s.homePath}">${escapeHtml(t.takeTheTest)} ${ARROW}</a>
</div></header>

<div class="wrap hero">
  <p class="crumbs"><a href="${L.s.homePath}">${escapeHtml(L.s.home)}</a> / ${escapeHtml(L.s.navCountries)}</p>
  <p class="eyebrow">${escapeHtml(t.eyebrow)}</p>
  <h1>${escapeHtml(L.s.countriesIndexHeading)}</h1>
  <p class="lead">${escapeHtml(t.lead(current.length, historical.length))}</p>
  <div class="stats"><div><b>${n}</b><span>${escapeHtml(t.stats[0])}</span></div><div><b>${current.length}</b><span>${escapeHtml(t.stats[1])}</span></div><div><b>${historical.length}</b><span>${escapeHtml(t.stats[2])}</span></div><div><b>~${fmt.format(years)}</b><span>${escapeHtml(t.stats[3])}</span></div></div>
  <nav class="abar" aria-label="${escapeHtml(t.erasAria)}">${abar}</nav>
</div>

<div class="tools" role="search"><div class="wrap">
  <label class="search"><span class="sr">${escapeHtml(t.searchLabel)}</span>
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
    <input id="q" type="search" placeholder="${escapeHtml(t.searchPlaceholder)}" autocomplete="off"></label>
  <div class="chips" role="group" aria-label="${escapeHtml(t.filterAria)}">${chips}</div>
</div></div>

<main id="lista" class="wrap">
  <p class="result-info" id="info" aria-live="polite"></p>
  <p class="dna-note">${t.dnaNote}</p>
  <ul class="legend" aria-label="${escapeHtml(t.legendAria)}">${legend}</ul>
  ${sections}
  <div class="empty" id="empty"><h2>${escapeHtml(t.emptyTitle)}</h2><p>${escapeHtml(t.emptyText)}</p></div>
  <aside class="cta"><div><h2>${escapeHtml(t.ctaTitle)}</h2><p>${escapeHtml(t.ctaText)}</p></div><a class="btn" href="${L.s.homePath}">${escapeHtml(t.takeTheTest)} ${ARROW}</a></aside>
</main>
<footer class="foot"><div class="wrap"><a class="logo" href="${L.s.homePath}"><b>12</b><span>axes</span></a><p>${escapeHtml(t.footer)} · ${languageLinks(locale, basePath)}</p></div></footer>
<script>
const S=${scriptStrings};
const q=document.getElementById('q'),chips=[...document.querySelectorAll('.chip')],cats=[...document.querySelectorAll('.cat')];
const info=document.getElementById('info'),empty=document.getElementById('empty'),histT=document.getElementById('historicos-t');
const norm=s=>s.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();
const cards=[...document.querySelectorAll('.pc')].map(li=>({li,t:norm(li.dataset.text),h:li.querySelector('h3'),name:li.querySelector('h3').textContent}));
let active=null;
function esc(s){return s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}
function apply(){
  const term=norm(q.value.trim());let shown=0;
  cards.forEach(c=>{
    const cat=c.li.closest('.cat').dataset.cat;
    const ok=(!term||c.t.includes(term))&&(!active||cat===active);
    c.li.hidden=!ok; if(ok)shown++;
    const i=term&&ok?norm(c.name).indexOf(term):-1;
    if(i>=0)c.h.innerHTML=esc(c.name.slice(0,i))+'<mark>'+esc(c.name.slice(i,i+term.length))+'</mark>'+esc(c.name.slice(i+term.length));else c.h.textContent=c.name;
  });
  let histShown=0;
  cats.forEach(s=>{const n=s.querySelectorAll('.pc:not([hidden])').length;s.hidden=n===0;const cc=s.querySelector('.cat-count');cc.querySelector('.cc').textContent=n;cc.querySelector('.cl').textContent=n===1?cc.dataset.one:cc.dataset.many;if(s.dataset.cat!=='atuais')histShown+=n});
  if(histT)histT.hidden=histShown===0;
  empty.classList.toggle('show',shown===0);
  info.innerHTML=(term||active)?'<b>'+shown+'</b> '+S.found[shown===1?0:1]+'<button type="button" id="clear">'+esc(S.clear)+'</button>':'';
  const cl=document.getElementById('clear'); if(cl) cl.onclick=()=>{q.value='';active=null;chips.forEach(c=>c.setAttribute('aria-pressed','false'));apply()};
}
q.addEventListener('input',apply);
chips.forEach(ch=>ch.addEventListener('click',()=>{
  active=active===ch.dataset.cat?null:ch.dataset.cat;
  chips.forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.cat===active)));apply();
  if(active) document.getElementById(active).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}));
document.addEventListener('keydown',e=>{if(e.key==='/'&&document.activeElement!==q){e.preventDefault();q.focus()}});
</script>
  </body>
</html>`;

  return { basePath, html };
}

export const COUNTRIES_CSS = `${PERSONALITIES_CSS}
.fl{flex:none;width:72px;height:48px;border-radius:8px;overflow:hidden;background:var(--sup);box-shadow:0 0 0 1px var(--borda);display:grid;place-items:center}
.fl img{width:100%;height:100%;object-fit:contain;display:block}
.abar{grid-template-columns:1.6fr repeat(5,1fr)}
.ab{border-top:4px solid var(--c);transition:transform .15s}
.ab:hover{transform:translateY(-2px);border-color:var(--borda);border-top-color:var(--c)}
.ab b{color:var(--c)}
.ab.cur{background:var(--floresta);border-color:var(--floresta);color:var(--papel)}.ab.cur b{color:var(--papel)}.ab.cur span{color:#BFD1C6}
.block-t{font-family:var(--display);font-weight:600;font-size:clamp(28px,3.6vw,44px);letter-spacing:-.035em;margin:56px 0 -8px;padding-top:24px;border-top:1px solid var(--borda)}
.block-t[hidden]{display:none}
@media (max-width:980px){.abar{grid-template-columns:repeat(3,1fr)}}
@media (max-width:640px){.abar{display:grid;grid-template-columns:repeat(2,1fr)}.fl{width:60px;height:40px}}
`;
