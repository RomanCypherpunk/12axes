import { FR_IDEOLOGIES_INDEX } from './fr-catalogue.mjs';
import { alternateLinks, languageLinks } from './locales.mjs';
// Página /ideologies (e /en/ideologies): catálogo agrupado por espectro, com busca,
// filtro por espectro e a "faixa" de 12 ícones de polo que resume o vetor de cada
// ideologia. Tem layout e CSS próprios (ideologies.css), separados do pages.css
// das páginas de detalhe.

import { poleSprite, poleUse } from './pole-icons.mjs';

// Mesma paleta de frontend/src/utils/ideologyColors.ts, na ordem do espectro.
export const SPECTRUM = [
  { key: 'esq-radical', c: '#830214', cb: '#ECD5D8' },
  { key: 'esquerda', c: '#035732', cb: '#D5ECE2' },
  { key: 'centro', c: '#4B5058', cb: '#DDE0E3' },
  { key: 'direita', c: '#2D4778', cb: '#D6E0F2' },
  { key: 'ext-direita', c: '#001743', cb: '#D5DAE6' },
  { key: 'terceira', c: '#4B2A63', cb: '#E2D5EC' },
  { key: 'libertario', c: '#946201', cb: '#F0E4C8' },
  { key: 'anarquismo', c: '#2B2B2B', cb: '#E2DFD8' }
];

export const CATEGORY_KEY = {
  'gauche radicale': 'esq-radical', gauche: 'esquerda', centre: 'centro', droite: 'direita',
  'extrême droite': 'ext-direita', 'troisième position': 'terceira', libertarien: 'libertario', anarchisme: 'anarquismo',

  'esquerda radical': 'esq-radical',
  'radical left': 'esq-radical',
  esquerda: 'esquerda',
  left: 'esquerda',
  centro: 'centro',
  center: 'centro',
  direita: 'direita',
  right: 'direita',
  'extrema direita': 'ext-direita',
  'far-right': 'ext-direita',
  'terceira posição': 'terceira',
  'third position': 'terceira',
  libertário: 'libertario',
  libertarian: 'libertario',
  anarquismo: 'anarquismo',
  anarchist: 'anarquismo'
};

const STR = {
  fr: FR_IDEOLOGIES_INDEX,
  pt: {
    skip: 'Pular para a lista',
    catalogNav: 'Catálogo',
    homeAria: '12 axes, página inicial',
    eyebrow: 'Catálogo',
    lead: (n) => `As ${n} correntes políticas mapeadas pelo 12 Axes, organizadas por espectro. Cada uma tem descrição e perfil completo nos 12 eixos.`,
    stats: ['correntes', 'espectros', 'eixos por perfil'],
    distribution: 'Distribuição no espectro',
    distributionAria: (label, n) => `${label}: ${n} ideologias`,
    searchLabel: 'Buscar ideologia',
    searchPlaceholder: 'Buscar ideologia…  ( / )',
    filterAria: 'Filtrar por espectro',
    count: 'correntes',
    viewProfile: 'Ver perfil',
    dnaNote:
      '<b>Como ler a faixa de 12 ícones:</b> cada ícone é um eixo e mostra o polo para onde a ideologia pende. Quanto mais forte o ícone, mais intensa a posição. Passe o mouse para ver os valores.',
    legendAria: 'Polos de cada eixo, na ordem da faixa',
    emptyTitle: 'Nenhuma ideologia encontrada',
    emptyText: 'Tente outro termo ou limpe os filtros.',
    found: ['ideologia encontrada', 'ideologias encontradas'],
    clear: 'Limpar filtros',
    ctaTitle: 'E você, onde se encaixa?',
    ctaText: (n) => `Responda ao quiz e veja com quais dessas ${n} ideologias você é mais compatível.`,
    takeTheTest: 'Fazer o teste',
    footer: 'Quiz político independente · 12axes.vercel.app',
    otherLang: { label: 'English', href: '/en/ideologies' },
    descriptions: {
      'esq-radical': 'Comunismo revolucionário ou de partido único, com economia planificada e forte concentração do poder do Estado.',
      esquerda: 'Social-democracia, progressismo e maior intervenção do Estado na economia dentro da democracia liberal.',
      centro: 'Equilíbrio entre mercado e Estado, reformas e estabilidade, com posicionamento moderado ou pragmático.',
      direita: 'Conservadorismo, liberalismo econômico e nacionalismo moderado dentro da democracia liberal.',
      'ext-direita': 'Rejeição explícita da democracia liberal, nacionalismo radical e concentração autoritária do poder.',
      terceira: 'Síntese nacionalista e corporativista que rejeita tanto o capitalismo liberal quanto o marxismo.',
      libertario: 'Estado mínimo, livre mercado, propriedade privada e liberdades individuais, sem abolir o Estado.',
      anarquismo: 'Rejeição do Estado e de toda autoridade coercitiva, com organização social livre e voluntária.'
    }
  },
  en: {
    skip: 'Skip to the list',
    catalogNav: 'Catalog',
    homeAria: '12 axes, home page',
    eyebrow: 'Catalog',
    lead: (n) => `The ${n} political currents mapped by 12 Axes, organized by spectrum. Each one has a description and a full profile across the 12 axes.`,
    stats: ['currents', 'spectrums', 'axes per profile'],
    distribution: 'Distribution across the spectrum',
    distributionAria: (label, n) => `${label}: ${n} ideologies`,
    searchLabel: 'Search ideology',
    searchPlaceholder: 'Search ideology…  ( / )',
    filterAria: 'Filter by spectrum',
    count: 'currents',
    viewProfile: 'View profile',
    dnaNote:
      '<b>How to read the 12-icon strip:</b> each icon is an axis and shows the pole the ideology leans toward. The stronger the icon, the more intense the position. Hover to see the values.',
    legendAria: 'Poles of each axis, in strip order',
    emptyTitle: 'No ideology found',
    emptyText: 'Try another term or clear the filters.',
    found: ['ideology found', 'ideologies found'],
    clear: 'Clear filters',
    ctaTitle: 'And you, where do you fit?',
    ctaText: (n) => `Take the quiz and see which of these ${n} ideologies you are most compatible with.`,
    takeTheTest: 'Take the test',
    footer: 'Independent political quiz · 12axes.vercel.app',
    otherLang: { label: 'Português', href: '/ideologies' },
    descriptions: {
      'esq-radical': 'Revolutionary or one-party communism, with a planned economy and strong concentration of state power.',
      esquerda: 'Social democracy, progressivism and greater state intervention in the economy within liberal democracy.',
      centro: 'Balance between market and state, reform and stability, with a moderate or pragmatic stance.',
      direita: 'Conservatism, economic liberalism and moderate nationalism within liberal democracy.',
      'ext-direita': 'Explicit rejection of liberal democracy, radical nationalism and authoritarian concentration of power.',
      terceira: 'Nationalist and corporatist synthesis that rejects both liberal capitalism and Marxism.',
      libertario: 'Minimal state, free market, private property and individual liberties, without abolishing the state.',
      anarquismo: 'Rejection of the state and of all coercive authority, with free and voluntary social organization.'
    }
  }
};

export const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';

// Um ícone por eixo: o do polo dominante, na cor do card (--c), com opacidade
// pela intensidade (0.35 no centro até 1.0 no extremo).
export function dna(axes, vector, escapeHtml) {
  const icons = [];
  const titles = [];
  for (const axis of axes) {
    const left = vector?.[axis.id] ?? 50;
    const leansLeft = left >= 50;
    const pct = leansLeft ? left : 100 - left;
    const opacity = 0.35 + (Math.abs(left - 50) / 50) * 0.65;
    icons.push(poleUse(axis.id, leansLeft ? 'left' : 'right', ` width="14" height="14" style="opacity:${opacity.toFixed(2)}"`));
    titles.push(`${leansLeft ? axis.leftPole : axis.rightPole} ${Math.round(pct)}%`);
  }
  return `<span class="dna" title="${escapeHtml(titles.join(' · '))}" aria-hidden="true">${icons.join('')}</span>`;
}

// Legenda: os ícones dos dois polos de cada eixo.
export function dnaLegend(axes, escapeHtml) {
  return axes
    .map((a) => `<li>${poleUse(a.id, 'left', ' width="13" height="13"')}${poleUse(a.id, 'right', ' width="13" height="13"')}${escapeHtml(a.label)}</li>`)
    .join('');
}

export function ideologiesIndexPage(L, { locale, site, gaSnippet, escapeHtml, profiles, title, description }) {
  const t = STR[locale];
  const prefix = L.s.prefix;
  const n = L.ideologies.length;
  const collator = new Intl.Collator(L.s.htmlLang);

  const groups = SPECTRUM.map((spec) => {
    const items = L.ideologies
      .filter((i) => CATEGORY_KEY[i.category.trim().toLowerCase()] === spec.key)
      .sort((a, b) => collator.compare(a.name, b.name));
    return { ...spec, label: items[0]?.category ?? spec.key, items };
  }).filter((g) => g.items.length > 0);

  const unmapped = L.ideologies.filter((i) => !CATEGORY_KEY[i.category.trim().toLowerCase()]);
  if (unmapped.length > 0) {
    throw new Error(`ideologies: categoria sem espectro: ${unmapped.map((i) => `${i.id} (${i.category})`).join(', ')}`);
  }

  const vars = (g) => `--c:${g.c};--cb:${g.cb}`;

  const sbar = groups
    .map(
      (g) =>
        `<a class="sb-seg" href="#${g.key}" style="--c:${g.c};flex:${g.items.length}" aria-label="${escapeHtml(t.distributionAria(g.label, g.items.length))}"><span class="sb-fill"></span><span class="sb-lbl"><b>${escapeHtml(g.label)}</b><em>${g.items.length}</em></span></a>`
    )
    .join('');

  const chips = groups
    .map(
      (g) =>
        `<button type="button" class="chip" data-cat="${g.key}" style="${vars(g)}" aria-pressed="false"><span class="dot"></span>${escapeHtml(g.label)}<em>${g.items.length}</em></button>`
    )
    .join('');

  const legend = dnaLegend(L.axes, escapeHtml);

  const sections = groups
    .map((g) => {
      const cards = g.items
        .map(
          (i) =>
            `<li class="ic" data-text="${escapeHtml(`${i.name} ${i.description}`.toLowerCase())}"><a href="${prefix}/ideologies/${i.id}"><h3>${escapeHtml(i.name)}</h3><p>${escapeHtml(i.description)}</p><span class="ic-foot">${dna(L.axes, profiles.get(i.id), escapeHtml)}<span class="go">${escapeHtml(t.viewProfile)} ${ARROW}</span></span></a></li>`
        )
        .join('');
      return `<section class="cat" id="${g.key}" data-cat="${g.key}" style="${vars(g)}" aria-labelledby="h-${g.key}"><header class="cat-head"><div class="cat-title"><span class="cat-mark" aria-hidden="true"></span><div><h2 id="h-${g.key}">${escapeHtml(g.label)}</h2><p>${escapeHtml(t.descriptions[g.key])}</p></div></div><span class="cat-count"><b class="cc">${g.items.length}</b> ${escapeHtml(t.count)}</span></header><ul class="grid">${cards}</ul></section>`;
    })
    .join('');

  const basePath = '/ideologies';
  const url = `${site}${prefix}${basePath}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: L.s.ideologiesIndexHeading,
    description,
    inLanguage: L.s.htmlLang,
    url
  };
  const scriptStrings = JSON.stringify({ found: t.found, clear: t.clear });

  const html = `<!doctype html>
<html lang="${L.s.htmlLang}">
  <head>
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
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="12 Axes" />
    <meta property="og:locale" content="${L.s.ogLocale}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${site}/logo.png" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${site}/logo.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@400..800&family=Poppins:wght@400;500;600&display=swap" />
    <link rel="stylesheet" href="/ideologies.css" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    ${gaSnippet}
  </head>
  <body>
${poleSprite(L.axes)}
<a class="skip" href="#lista">${escapeHtml(t.skip)}</a>
<header class="nav"><div class="wrap">
  <a class="logo" href="${L.s.homePath}" aria-label="${escapeHtml(t.homeAria)}"><b>12</b><span>axes</span></a>
  <nav aria-label="${escapeHtml(t.catalogNav)}"><a href="${prefix}/ideologies" aria-current="page">${escapeHtml(L.s.navIdeologies)}</a><a href="${prefix}/countries">${escapeHtml(L.s.navCountries)}</a><a href="${prefix}/personalities">${escapeHtml(L.s.navPersonalities)}</a></nav>
  <a class="btn" href="${L.s.homePath}">${escapeHtml(t.takeTheTest)} ${ARROW}</a>
</div></header>

<div class="wrap hero">
  <p class="crumbs"><a href="${L.s.homePath}">${escapeHtml(L.s.home)}</a> / ${escapeHtml(L.s.navIdeologies)}</p>
  <p class="eyebrow">${escapeHtml(t.eyebrow)}</p>
  <h1>${escapeHtml(L.s.ideologiesIndexHeading)}</h1>
  <p class="lead">${escapeHtml(t.lead(n))}</p>
  <div class="stats"><div><b>${n}</b><span>${escapeHtml(t.stats[0])}</span></div><div><b>${groups.length}</b><span>${escapeHtml(t.stats[1])}</span></div><div><b>${L.axes.length}</b><span>${escapeHtml(t.stats[2])}</span></div></div>
  <div class="sbar"><p class="sbar-t">${escapeHtml(t.distribution)}</p><div class="sb">${sbar}</div></div>
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
  <aside class="cta"><div><h2>${escapeHtml(t.ctaTitle)}</h2><p>${escapeHtml(t.ctaText(n))}</p></div><a class="btn" href="${L.s.homePath}">${escapeHtml(t.takeTheTest)} ${ARROW}</a></aside>
</main>
<footer class="foot"><div class="wrap"><a class="logo" href="${L.s.homePath}"><b>12</b><span>axes</span></a><p>${escapeHtml(t.footer)} · ${languageLinks(locale, basePath)}</p></div></footer>
<script>
const S=${scriptStrings};
const q=document.getElementById('q'),chips=[...document.querySelectorAll('.chip')],cats=[...document.querySelectorAll('.cat')];
const info=document.getElementById('info'),empty=document.getElementById('empty');
const norm=s=>s.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();
const cards=[...document.querySelectorAll('.ic')].map(li=>({li,t:norm(li.dataset.text),h:li.querySelector('h3'),name:li.querySelector('h3').textContent}));
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
  cats.forEach(s=>{const n=s.querySelectorAll('.ic:not([hidden])').length;s.hidden=n===0;s.querySelector('.cc').textContent=n});
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

export const IDEOLOGIES_CSS = `:root{--papel:#F4F1E8;--floresta:#102E24;--carmim:#880912;--tinta:#101010;--sup:#FBF9F3;--borda:#E2DDCF;--neutro:#ECE8DC;--suave:#5B5A55;
--display:'Sora',system-ui,sans-serif;--body:'Poppins',system-ui,sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;scroll-padding-top:150px}
body{background:var(--papel);color:var(--tinta);font-family:var(--body);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit}
:focus-visible{outline:3px solid var(--carmim);outline-offset:3px;border-radius:8px}
.skip{position:absolute;left:-999px}.skip:focus{left:16px;top:12px;z-index:99;background:var(--tinta);color:var(--papel);padding:8px 16px;border-radius:40px}
.sr{position:absolute;left:-999px}
.wrap{max-width:1200px;margin:0 auto;padding:0 24px}
svg{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.nav{border-bottom:1px solid var(--borda);background:var(--papel)}
.nav .wrap{height:64px;display:flex;align-items:center;justify-content:space-between;gap:24px}
.logo{display:inline-flex;align-items:baseline;gap:.16em;font-size:23px;line-height:1;text-decoration:none}
.logo b{font-family:var(--display);font-weight:800;letter-spacing:-.04em;color:var(--floresta)}
.nav nav{display:flex;gap:24px;font-size:14.5px}
.nav nav a{text-decoration:none;color:var(--suave)}
.nav nav a[aria-current]{color:var(--tinta);font-weight:600}
.btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:999px;background:var(--floresta);color:var(--papel);text-decoration:none;font-weight:500;font-size:14.5px;white-space:nowrap}
.btn svg{width:16px;height:16px}
.hero{padding:56px 0 28px}
.hero.wrap{padding-left:24px;padding-right:24px}
.crumbs{font-size:13px;color:var(--suave);margin-bottom:18px}
.crumbs a{text-decoration:none}.crumbs a:hover{text-decoration:underline}
.eyebrow{font-size:12.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--carmim)}
.eyebrow::before{content:"— "}
h1{font-family:var(--display);font-weight:600;font-size:clamp(38px,5.4vw,64px);letter-spacing:-.035em;line-height:1.04;margin:10px 0 14px}
.lead{color:var(--suave);font-size:17px;max-width:680px}
.stats{display:flex;gap:28px;margin-top:24px;flex-wrap:wrap}
.stats div{display:flex;flex-direction:column}
.stats b{font-family:var(--display);font-size:28px;letter-spacing:-.03em;line-height:1.1}
.stats span{font-size:13px;color:var(--suave)}
.sbar{margin-top:36px}
.sbar-t{font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--suave);margin-bottom:10px}
.sb{display:flex;gap:4px}
.sb-seg{min-width:0;text-decoration:none;display:flex;flex-direction:column;gap:8px}
.sb-fill{height:14px;border-radius:5px;background:var(--c);transition:transform .15s ease}
.sb-seg:hover .sb-fill{transform:scaleY(1.35)}
.sb-lbl{display:flex;flex-direction:column;line-height:1.2;font-size:12.5px;overflow:hidden}
.sb-lbl b{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-lbl em{font-style:normal;color:var(--suave);font-size:12px}
.tools{position:sticky;top:0;z-index:20;background:rgba(244,241,232,.94);backdrop-filter:blur(10px);border-bottom:1px solid var(--borda);margin-top:28px}
.tools .wrap{display:flex;gap:16px;align-items:center;padding-top:12px;padding-bottom:12px}
.search{position:relative;flex:0 0 300px}
.search svg{position:absolute;left:14px;top:50%;width:18px;height:18px;transform:translateY(-50%);color:var(--suave)}
.search input{width:100%;font:inherit;font-size:15px;padding:11px 14px 11px 42px;border:1.5px solid var(--borda);border-radius:999px;background:var(--sup);color:var(--tinta)}
.search input:focus{outline:none;border-color:var(--tinta)}
.chips{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:2px}
.chips::-webkit-scrollbar{display:none}
.chip{flex:none;display:inline-flex;align-items:center;gap:7px;font:500 13.5px var(--body);padding:8px 14px;border-radius:999px;border:1.5px solid var(--borda);background:var(--sup);color:var(--tinta);cursor:pointer;transition:all .15s ease}
.chip .dot{width:9px;height:9px;border-radius:50%;background:var(--c)}
.chip em{font-style:normal;font-size:12px;color:var(--suave)}
.chip:hover{border-color:var(--c)}
.chip[aria-pressed=true]{background:var(--cb);border-color:var(--c);color:var(--c);font-weight:600}
.chip[aria-pressed=true] em{color:var(--c)}
.result-info{font-size:13.5px;color:var(--suave);padding:18px 0 0}
.result-info:empty{padding:0}
.result-info button{font:inherit;color:var(--tinta);text-decoration:underline;background:none;border:0;cursor:pointer;margin-left:6px}
main{padding-bottom:40px}
.cat{padding:40px 0 16px}
.cat-head{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;padding-bottom:20px;margin-bottom:20px;border-bottom:2px solid var(--c)}
.cat-title{display:flex;gap:16px;align-items:flex-start}
.cat-mark{width:14px;height:44px;border-radius:5px;background:var(--c);flex:none;margin-top:4px}
.cat h2{font-family:var(--display);font-weight:600;font-size:clamp(26px,3vw,36px);letter-spacing:-.03em;line-height:1.1;color:var(--c)}
.cat-head p{font-size:14.5px;color:var(--suave);max-width:620px;margin-top:6px}
.cat-count{flex:none;font-size:13px;color:var(--c);background:var(--cb);padding:6px 14px;border-radius:999px;white-space:nowrap}
.cat-count b{font-family:var(--display)}
.grid{list-style:none;display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.ic a{height:100%;display:flex;flex-direction:column;gap:8px;text-decoration:none;background:var(--sup);border:1px solid var(--borda);border-radius:20px;padding:20px 20px 16px;position:relative;overflow:hidden;transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease}
.ic a::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--c);opacity:.85}
.ic a:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--c) 45%,var(--borda));box-shadow:0 12px 28px rgba(16,16,16,.07)}
.ic h3{font-family:var(--display);font-weight:600;font-size:18px;letter-spacing:-.015em;line-height:1.25}
.ic p{font-size:14px;color:var(--suave);line-height:1.55;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;flex:1}
.ic-foot{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:6px;padding-top:12px;border-top:1px solid var(--borda)}
.dna{display:flex;gap:5px;flex-wrap:wrap}
.dna svg,.legend svg{fill:currentColor;stroke:none;display:block}
.dna svg{width:14px;height:14px;color:var(--c)}
.go{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--c);white-space:nowrap}
.go svg{width:15px;height:15px;transition:transform .15s ease}
.ic a:hover .go svg{transform:translateX(3px)}
.ic[hidden],.cat[hidden]{display:none}
mark{background:var(--cb);color:inherit;border-radius:3px;padding:0 1px}
.empty{display:none;text-align:center;padding:64px 16px;color:var(--suave)}
.empty h2{font-family:var(--display);color:var(--tinta);font-size:24px;margin-bottom:6px}
.empty.show{display:block}
.legend{margin-top:18px;display:flex;gap:10px 18px;flex-wrap:wrap;font-size:12.5px;color:var(--suave);list-style:none}
.legend li{display:flex;align-items:center;gap:4px}
.legend svg{width:13px;height:13px;color:var(--tinta)}
.legend li svg+svg{margin-right:5px}
.dna-note{font-size:13px;color:var(--suave);margin-top:28px}
.dna-note b{color:var(--tinta)}
.cta{background:var(--floresta);color:var(--papel);border-radius:32px;padding:48px;display:flex;justify-content:space-between;align-items:center;gap:24px;margin:48px 0 64px}
.cta h2{font-family:var(--display);font-weight:600;font-size:clamp(26px,3.4vw,38px);letter-spacing:-.03em;line-height:1.1}
.cta p{color:#BFD1C6;margin-top:8px}
.cta .btn{background:var(--papel);color:var(--floresta);padding:15px 28px;font-size:15.5px}
.foot{background:var(--tinta);color:var(--papel);padding:32px 0}
.foot .wrap{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-size:13.5px}
.foot .logo b{color:var(--papel)}
.foot p{color:#9A968C}
.foot p a{color:#D8D4C8}
@media (max-width:980px){.grid{grid-template-columns:1fr 1fr}.tools .wrap{flex-direction:column;align-items:stretch;gap:10px}.search{flex:auto}}
@media (max-width:640px){
  html{scroll-padding-top:170px}
  .wrap,.hero.wrap{padding:0 16px}.nav nav{display:none}.hero{padding:32px 0 16px}
  .grid{grid-template-columns:1fr}
  .sb{flex-wrap:wrap}.sb-lbl{display:none}.sb-seg{flex:1 1 0!important}
  .cat-head{flex-direction:column;align-items:flex-start;gap:10px}
  .cta{flex-direction:column;align-items:flex-start;padding:32px 24px;border-radius:24px}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}
`;
