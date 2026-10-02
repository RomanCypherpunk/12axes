import { FR_PERSONALITIES_INDEX, FR_AREA_LABELS } from './fr-catalogue.mjs';
import { alternateLinks, languageLinks } from './locales.mjs';
// Página /personalities (e /en/personalities): catálogo agrupado por área de
// atuação, com busca, filtro por área, retrato e a "faixa" de 12 ícones de polo.
// Reaproveita o CSS do catálogo de ideologias e soma os estilos do card com foto.
import { ARROW, IDEOLOGIES_CSS, dna, dnaLegend } from './ideologies-index.mjs';
import { poleSprite } from './pole-icons.mjs';

// Ordem das áreas no catálogo (a mesma do mockup de docs/).
export const AREA_ORDER = ['politico', 'teorico', 'filosofo', 'economista', 'intelectual', 'ativista', 'religioso', 'empresario'];

export const AREA_LABELS = {
  fr: FR_AREA_LABELS,
  pt: {
    politico: 'Política',
    religioso: 'Religião',
    economista: 'Economia',
    filosofo: 'Filosofia',
    teorico: 'Teoria política',
    empresario: 'Empresariado',
    intelectual: 'Vida intelectual',
    ativista: 'Ativismo'
  },
  en: {
    politico: 'Politics',
    religioso: 'Religion',
    economista: 'Economics',
    filosofo: 'Philosophy',
    teorico: 'Political theory',
    empresario: 'Business',
    intelectual: 'Intellectual life',
    ativista: 'Activism'
  }
};

const STR = {
  fr: FR_PERSONALITIES_INDEX,
  pt: {
    skip: 'Pular para a lista',
    catalogNav: 'Catálogo',
    homeAria: '12 axes, página inicial',
    eyebrow: 'Catálogo',
    lead: (n) => `${n} líderes, pensadores, economistas e ativistas mapeados pelo 12 Axes, organizados por área de atuação. Cada um tem foto, biografia curta e perfil completo nos 12 eixos.`,
    stats: ['personalidades', 'áreas de atuação', 'eixos por perfil'],
    areasAria: 'Áreas de atuação',
    searchLabel: 'Buscar personalidade',
    searchPlaceholder: 'Buscar nome, cargo ou época',
    filterAria: 'Filtrar por área de atuação',
    count: ['personalidade', 'personalidades'],
    viewProfile: 'Ver perfil',
    dnaNote:
      '<b>Como ler a faixa de 12 ícones:</b> cada ícone é um eixo e mostra o polo para onde a pessoa pende. Quanto mais forte o ícone, mais intensa a posição. Passe o mouse para ver os valores.',
    legendAria: 'Polos de cada eixo, na ordem da faixa',
    emptyTitle: 'Nenhuma personalidade encontrada',
    emptyText: 'Tente outro termo ou limpe os filtros.',
    found: ['personalidade encontrada', 'personalidades encontradas'],
    clear: 'Limpar filtros',
    credit: 'Retratos: Wikimedia Commons / Wikipédia, conforme a fonte indicada em cada perfil.',
    portraitAlt: (name) => `Retrato de ${name}`,
    ctaTitle: 'Com quem você mais se parece?',
    ctaText: (n) => `Responda ao quiz e descubra quais destas ${n} personalidades pensam mais como você.`,
    takeTheTest: 'Fazer o teste',
    footer: 'Quiz político independente · 12axes.vercel.app',
    otherLang: { label: 'English', href: '/en/personalities' },
    descriptions: {
      politico: 'Chefes de Estado, parlamentares, revolucionários e líderes partidários que exerceram o poder ou disputaram-no.',
      teorico: 'Autores que formularam doutrinas, programas e conceitos que orientam movimentos e governos.',
      filosofo: 'Pensadores que discutiram justiça, liberdade, autoridade e a natureza do Estado.',
      economista: 'Economistas cujas ideias moldaram políticas monetárias, fiscais e o debate entre mercado e Estado.',
      intelectual: 'Escritores, historiadores, jornalistas e acadêmicos que influenciaram o debate público.',
      ativista: 'Militantes e líderes de movimentos sociais, de direitos civis, sindicais e de causas específicas.',
      religioso: 'Líderes e pensadores religiosos com influência direta na vida política e moral.',
      empresario: 'Empreendedores e executivos com atuação ou influência relevante na política.'
    }
  },
  en: {
    skip: 'Skip to the list',
    catalogNav: 'Catalog',
    homeAria: '12 axes, home page',
    eyebrow: 'Catalog',
    lead: (n) => `${n} leaders, thinkers, economists and activists mapped by 12 Axes, organized by field. Each one has a photo, a short bio and a full profile across the 12 axes.`,
    stats: ['personalities', 'fields', 'axes per profile'],
    areasAria: 'Fields',
    searchLabel: 'Search personality',
    searchPlaceholder: 'Search name, role or era',
    filterAria: 'Filter by field',
    count: ['personality', 'personalities'],
    viewProfile: 'View profile',
    dnaNote:
      '<b>How to read the 12-icon strip:</b> each icon is an axis and shows the pole the person leans toward. The stronger the icon, the more intense the position. Hover to see the values.',
    legendAria: 'Poles of each axis, in strip order',
    emptyTitle: 'No personality found',
    emptyText: 'Try another term or clear the filters.',
    found: ['personality found', 'personalities found'],
    clear: 'Clear filters',
    credit: 'Portraits: Wikimedia Commons / Wikipedia, as credited on each profile.',
    portraitAlt: (name) => `Portrait of ${name}`,
    ctaTitle: 'Who do you resemble most?',
    ctaText: (n) => `Take the quiz and find out which of these ${n} personalities think most like you.`,
    takeTheTest: 'Take the test',
    footer: 'Independent political quiz · 12axes.vercel.app',
    otherLang: { label: 'Português', href: '/personalities' },
    descriptions: {
      politico: 'Heads of state, lawmakers, revolutionaries and party leaders who held power or fought for it.',
      teorico: 'Authors who formulated the doctrines, programs and concepts that guide movements and governments.',
      filosofo: 'Thinkers who debated justice, liberty, authority and the nature of the state.',
      economista: 'Economists whose ideas shaped monetary and fiscal policy and the market-versus-state debate.',
      intelectual: 'Writers, historians, journalists and academics who shaped public debate.',
      ativista: 'Militants and leaders of social, civil rights, labor and single-issue movements.',
      religioso: 'Religious leaders and thinkers with direct influence on political and moral life.',
      empresario: 'Entrepreneurs and executives with a relevant role or influence in politics.'
    }
  }
};

export function initials(name) {
  const words = name.replace(/[.,]/g, '').split(/\s+/).filter((w) => /^\p{Lu}/u.test(w));
  if (words.length === 0) return name.slice(0, 1).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 1);
  return words[0].slice(0, 1) + words[words.length - 1].slice(0, 1);
}

// <head> comum às páginas de catálogo com a identidade nova (papel/floresta).
export function catalogHead(L, { site, basePath, title, description, ogType, ogImage, css, jsonLd, gaSnippet, escapeHtml }) {
  const url = `${site}${L.s.prefix}${basePath}`;
  const ld = jsonLd.map((block) => `<script type="application/ld+json">${JSON.stringify(block)}</script>`).join('\n    ');
  return `<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#F4F1E8" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${url}" />
    ${alternateLinks(site, basePath)}
    <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:site_name" content="12 Axes" />
    <meta property="og:locale" content="${L.s.ogLocale}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${site}${ogImage}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${site}${ogImage}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@400..800&family=Poppins:wght@400;500;600&display=swap" />
    <link rel="stylesheet" href="${css}" />
    ${ld}
    ${gaSnippet}
  </head>`;
}

export function personalitiesIndexPage(L, { locale, site, gaSnippet, escapeHtml, profiles, title, description }) {
  const t = STR[locale];
  const labels = AREA_LABELS[locale];
  const prefix = L.s.prefix;
  const n = L.personalities.length;
  const collator = new Intl.Collator(L.s.htmlLang);

  const unmapped = L.personalities.filter((p) => !AREA_ORDER.includes(p.category));
  if (unmapped.length > 0) {
    throw new Error(`personalities: área desconhecida: ${unmapped.map((p) => `${p.id} (${p.category})`).join(', ')}`);
  }

  const groups = AREA_ORDER.map((key) => ({
    key,
    label: labels[key],
    items: L.personalities.filter((p) => p.category === key).sort((a, b) => collator.compare(a.name, b.name))
  })).filter((g) => g.items.length > 0);

  const abar = groups
    .map((g) => `<a class="ab" href="#${g.key}"><b>${g.items.length}</b><span>${escapeHtml(g.label)}</span></a>`)
    .join('');

  const chips = groups
    .map((g) => `<button type="button" class="chip" data-cat="${g.key}" aria-pressed="false">${escapeHtml(g.label)}<em>${g.items.length}</em></button>`)
    .join('');

  const legend = dnaLegend(L.axes, escapeHtml);

  const card = (p) => {
    const text = [p.name, p.role, p.lifespan, p.description].filter(Boolean).join(' ').toLowerCase();
    return `<li class="pc" data-text="${escapeHtml(text)}"><a href="${prefix}/personalities/${p.id}"><span class="pc-top"><span class="ph" data-i="${escapeHtml(initials(p.name))}"><img src="${p.imagePath}" alt="${escapeHtml(t.portraitAlt(p.name))}" width="72" height="72" loading="lazy" decoding="async"></span><span class="pc-id"><h3>${escapeHtml(p.name)}</h3><span class="meta">${escapeHtml(p.role)}</span>${p.lifespan ? `<span class="life">${escapeHtml(p.lifespan)}</span>` : ''}</span></span><p>${escapeHtml(p.description)}</p><span class="ic-foot">${dna(L.axes, profiles.get(p.id), escapeHtml)}<span class="go">${escapeHtml(t.viewProfile)} ${ARROW}</span></span></a></li>`;
  };

  const sections = groups
    .map(
      (g) =>
        `<section class="cat" id="${g.key}" data-cat="${g.key}" aria-labelledby="h-${g.key}"><header class="cat-head"><div class="cat-title"><span class="cat-mark" aria-hidden="true"></span><div><h2 id="h-${g.key}">${escapeHtml(g.label)}</h2><p>${escapeHtml(t.descriptions[g.key])}</p></div></div><span class="cat-count"><b class="cc">${g.items.length}</b> <span class="cl">${escapeHtml(t.count[g.items.length === 1 ? 0 : 1])}</span></span></header><ul class="grid">${g.items.map(card).join('')}</ul></section>`
    )
    .join('');

  const basePath = '/personalities';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: L.s.personalitiesIndexHeading,
    description,
    inLanguage: L.s.htmlLang,
    url: `${site}${prefix}${basePath}`
  };
  const scriptStrings = JSON.stringify({ found: t.found, clear: t.clear, count: t.count });

  const html = `<!doctype html>
<html lang="${L.s.htmlLang}">
  ${catalogHead(L, { site, basePath, title, description, ogType: 'website', ogImage: '/logo.png', css: '/personalities.css', jsonLd: [jsonLd], gaSnippet, escapeHtml })}
  <body>
${poleSprite(L.axes)}
<a class="skip" href="#lista">${escapeHtml(t.skip)}</a>
<header class="nav"><div class="wrap">
  <a class="logo" href="${L.s.homePath}" aria-label="${escapeHtml(t.homeAria)}"><b>12</b><span>axes</span></a>
  <nav aria-label="${escapeHtml(t.catalogNav)}"><a href="${prefix}/ideologies">${escapeHtml(L.s.navIdeologies)}</a><a href="${prefix}/countries">${escapeHtml(L.s.navCountries)}</a><a href="${prefix}/personalities" aria-current="page">${escapeHtml(L.s.navPersonalities)}</a></nav>
  <a class="btn" href="${L.s.homePath}">${escapeHtml(t.takeTheTest)} ${ARROW}</a>
</div></header>

<div class="wrap hero">
  <p class="crumbs"><a href="${L.s.homePath}">${escapeHtml(L.s.home)}</a> / ${escapeHtml(L.s.navPersonalities)}</p>
  <p class="eyebrow">${escapeHtml(t.eyebrow)}</p>
  <h1>${escapeHtml(L.s.personalitiesIndexHeading)}</h1>
  <p class="lead">${escapeHtml(t.lead(n))}</p>
  <div class="stats"><div><b>${n}</b><span>${escapeHtml(t.stats[0])}</span></div><div><b>${groups.length}</b><span>${escapeHtml(t.stats[1])}</span></div><div><b>${L.axes.length}</b><span>${escapeHtml(t.stats[2])}</span></div></div>
  <nav class="abar" aria-label="${escapeHtml(t.areasAria)}">${abar}</nav>
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
  <p class="credit">${escapeHtml(t.credit)}</p>
  <aside class="cta"><div><h2>${escapeHtml(t.ctaTitle)}</h2><p>${escapeHtml(t.ctaText(n))}</p></div><a class="btn" href="${L.s.homePath}">${escapeHtml(t.takeTheTest)} ${ARROW}</a></aside>
</main>
<footer class="foot"><div class="wrap"><a class="logo" href="${L.s.homePath}"><b>12</b><span>axes</span></a><p>${escapeHtml(t.footer)} · ${languageLinks(locale, basePath)}</p></div></footer>
<script>
const S=${scriptStrings};
const q=document.getElementById('q'),chips=[...document.querySelectorAll('.chip')],cats=[...document.querySelectorAll('.cat')];
const info=document.getElementById('info'),empty=document.getElementById('empty');
const norm=s=>s.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();
const cards=[...document.querySelectorAll('.pc')].map(li=>({li,t:norm(li.dataset.text),h:li.querySelector('h3'),name:li.querySelector('h3').textContent}));
document.querySelectorAll('.ph img').forEach(im=>{if(im.complete&&!im.naturalWidth)im.remove();else im.addEventListener('error',()=>im.remove())});
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
  cats.forEach(s=>{const n=s.querySelectorAll('.pc:not([hidden])').length;s.hidden=n===0;s.querySelector('.cc').textContent=n;s.querySelector('.cl').textContent=S.count[n===1?0:1]});
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

export const PERSONALITIES_CSS = `${IDEOLOGIES_CSS}
.cat{--c:var(--floresta);--cb:#DCE6E0}.chip{--c:var(--floresta);--cb:#DCE6E0}
.abar{margin-top:32px;display:grid;grid-template-columns:repeat(8,1fr);gap:8px}
.ab{text-decoration:none;background:var(--sup);border:1px solid var(--borda);border-radius:14px;padding:12px 14px;display:flex;flex-direction:column;line-height:1.2;transition:border-color .15s}
.ab:hover{border-color:var(--floresta)}
.ab b{font-family:var(--display);font-size:22px;letter-spacing:-.03em;color:var(--floresta)}
.ab span{font-size:12.5px;color:var(--suave);margin-top:4px}
.life{font-size:12.5px;color:var(--suave);font-variant-numeric:tabular-nums;margin-top:2px;display:inline-block;background:var(--neutro);padding:2px 8px;border-radius:999px;width:fit-content}
@media (max-width:980px){.abar{grid-template-columns:repeat(4,1fr)}}
@media (max-width:640px){.abar{display:none}}
@media (min-width:981px){.tools .wrap{flex-wrap:wrap}.chips{flex:1;min-width:0;flex-wrap:wrap;overflow:visible}}
@media (max-width:980px){.chips{min-width:0;max-width:100%}}
.pc a{height:100%;display:flex;flex-direction:column;gap:12px;text-decoration:none;background:var(--sup);border:1px solid var(--borda);border-radius:20px;padding:18px 18px 14px;position:relative;overflow:hidden;transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease}
.pc a::before{content:"";position:absolute;left:0;right:0;top:0;height:4px;background:var(--c)}
.pc a:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--c) 45%,var(--borda));box-shadow:0 12px 28px rgba(16,16,16,.07)}
.pc-top{display:flex;gap:14px;align-items:center}
.ph{flex:none;width:64px;height:64px;border-radius:18px;overflow:hidden;position:relative;background:var(--cb);box-shadow:inset 0 0 0 2px var(--c)}
.ph::before{content:attr(data-i);position:absolute;inset:0;display:grid;place-items:center;font:700 20px var(--display);color:var(--c);letter-spacing:-.02em}
.ph img{position:relative;display:block;width:100%;height:100%;object-fit:cover;filter:grayscale(.15) contrast(1.03);transition:filter .2s ease}
.pc a:hover .ph img{filter:none}
.pc-id{min-width:0;display:flex;flex-direction:column;gap:2px}
.pc h3{font-family:var(--display);font-weight:600;font-size:17.5px;letter-spacing:-.015em;line-height:1.22}
.meta{font-size:13px;color:var(--suave);line-height:1.35}
.pc p{font-size:14px;color:var(--suave);line-height:1.55;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;flex:1}
.pc .ic-foot{margin-top:0}
.pc a:hover .go svg{transform:translateX(3px)}
.pc[hidden]{display:none}
.credit{font-size:12.5px;color:var(--suave);margin:8px 0 0}
@media (max-width:640px){.ph{width:56px;height:56px;border-radius:16px}}
`;
