// Página /books (e /en/books): catálogo de livros e obras das personalidades,
// agrupado por área de atuação, com busca, filtro, capa/autor, ano e a faixa de 12 ícones de polo.
import { ARROW, IDEOLOGIES_CSS } from './ideologies-index.mjs';
import { AREA_LABELS, AREA_ORDER, catalogHead, initials } from './personalities-index.mjs';

export const AMAZON_BR_HOST = 'www.amazon.com.br';
export const AMAZON_BR_TAG = '12axes-20';
export const AMAZON_US_HOST = 'www.amazon.com';
export const AMAZON_US_TAG = '12axes0d-20';

export function amazonAffiliateUrl(directUrl, title, authorName, locale) {
  if (directUrl && String(directUrl).trim().length > 0) {
    return directUrl;
  }
  const isEn = locale === 'en';
  const host = isEn ? AMAZON_US_HOST : AMAZON_BR_HOST;
  const tag = isEn ? AMAZON_US_TAG : AMAZON_BR_TAG;
  const query = encodeURIComponent(`${title} ${authorName}`);
  return `https://${host}/s?k=${query}&i=stripbooks&tag=${tag}`;
}

export const AMAZON_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" style="vertical-align:middle;display:inline-block"><g fill="none"><path style="stroke:currentColor;fill:none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3" d="M17.284 17.724h1.967c.543 0 .983.44.983.983v1.967"/><path style="fill:currentColor;stroke:none" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="m6.901 7.111l1.976.2a.57.57 0 0 0 .558-.34c.268-.573.924-1.59 2.209-1.59c.258 0 .478.041.665.108c1.04.373 1.02 1.77 1.02 2.874c0 0-2.415-.058-3.992.476c-.465.157-.934.333-1.36.578c-1.223.705-1.77 2.276-1.969 3.022c-.071.27-.098.549-.08.828c.08 1.178.558 3.184 2.968 3.599c2.247.386 3.749-.64 4.43-1.267c.23-.213.612-.22.817.018l.88 1.017a.59.59 0 0 0 .825.066l1.676-1.402a.59.59 0 0 0 .101-.796l-.267-.374c-.215-.3-.422-.613-.517-.97c-.099-.372-.09-.763-.09-1.148V6.704c0-2.372-2.295-3.681-3.94-3.85l-.592-.057a6 6 0 0 0-.972-.034a6 6 0 0 0-1.162.196c-1.537.399-3.348 1.765-3.597 3.664c-.033.25.162.463.413.488m6.428 4.576v-1.432s-1.905-.047-2.664.363c-.312.168-.574.491-.775.813a2.54 2.54 0 0 0-.291 1.94c.066.275.158.54.282.695c.259.323.876.439 1.166.476q.156.022.311.003c.157-.022.413-.08.67-.23c.39-.229.695-.595.903-.995c.118-.226.208-.471.273-.676a3.2 3.2 0 0 0 .125-.957"/><path style="stroke:currentColor;fill:none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M4.5 18.707c1.933 1.619 4.584 2.548 7.375 2.548c1.853 0 3.643-.41 5.203-1.158a11 11 0 0 0 .573-.295"/></g></svg>`;

export const BOOK_ICO_SVG = `<svg class="e-read-ico" viewBox="0 0 24 24" aria-hidden="true" width="22" height="22"><path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2"/><path d="M4 19a2 2 0 0 1 2-2h13"/></svg>`;

const STR = {
  pt: {
    skip: 'Pular para a lista',
    catalogNav: 'Catálogo',
    homeAria: '12 axes, página inicial',
    eyebrow: 'Biblioteca política',
    lead: (n, cats, years) => `Uma biblioteca com ${n} obras políticas, econômicas e filosóficas fundamentais escritas pelas figuras mapeadas pelo 12 Axes. Organize por área, descubra ideias ao longo de ~${years} anos e encontre onde ler cada obra.`,
    stats: ['obras catalogadas', 'áreas de pensamento', 'anos de história'],
    areasAria: 'Áreas de atuação',
    searchLabel: 'Buscar livro ou autor',
    searchPlaceholder: 'Buscar livro, autor, ano ou corrente…  ( / )',
    filterAria: 'Filtrar por área de atuação',
    count: ['livro', 'livros'],
    viewAuthor: 'Ver autor',
    viewOnAmazon: 'Ver na Amazon',
    authorLabel: 'Autor',
    yearBc: (y) => `${y} a.C.`,
    dnaNote:
      '<b>Como ler a faixa de 12 ícones:</b> cada ícone representa a inclinação ideológica do autor nos 12 eixos. Quanto mais forte o ícone, mais nítida a posição. Passe o cursor para ver os valores.',
    legendAria: 'Polos de cada eixo, na ordem da faixa',
    emptyTitle: 'Nenhum livro encontrado',
    emptyText: 'Tente outro termo de busca ou limpe os filtros.',
    found: ['livro encontrado', 'livros encontrados'],
    clear: 'Limpar filtros',
    credit: 'Obras originais escritas pelas personalidades históricas e contemporâneas do catálogo 12 Axes.',
    portraitAlt: (name) => `Retrato de ${name}`,
    ctaTitle: 'Qual livro combina com suas ideias?',
    ctaText: 'Responda ao quiz de 12 eixos e receba uma lista personalizada de livros das personalidades mais compatíveis com o seu resultado.',
    takeTheTest: 'Fazer o teste',
    footer: 'Quiz político independente · 12axes.vercel.app · © 2026. Todos os direitos reservados',
    otherLang: { label: 'English', href: '/en/books' },
    descriptions: {
      filosofo: 'Tratados e diálogos clássicos sobre justiça, liberdade, natureza humana, ética e os fundamentos do Estado.',
      teorico: 'Manifestos, programas doutrinários e teses que estruturaram grandes movimentos e modelos políticos.',
      economista: 'Obras seminais sobre valor, mercado, moeda, comércio, tributação e intervenção estatal.',
      politico: 'Discursos, memórias e escritos de chefes de Estado, governantes e líderes que exerceram o poder.',
      intelectual: 'Ensaios, análises históricas, sociológicas e jornalísticas que moldaram o debate público.',
      ativista: 'Cartas, manifestos e livros de líderes de direitos civis, lutas sindicais e movimentos sociais.',
      religioso: 'Escritos teológicos, encíclicas e textos ético-espirituais com impacto direto na política e na sociedade.',
      empresario: 'Livros e tratados de negócios, estratégia e inovação com forte ressonância política e econômica.'
    }
  },
  en: {
    skip: 'Skip to the list',
    catalogNav: 'Catalog',
    homeAria: '12 axes, home page',
    eyebrow: 'Political library',
    lead: (n, cats, years) => `A library of ${n} foundational political, economic, and philosophical works written by the figures mapped across the 12 Axes. Browse by field, explore ideas across ~${years} years, and find where to read each work.`,
    stats: ['cataloged works', 'fields of thought', 'years of history'],
    areasAria: 'Fields',
    searchLabel: 'Search book or author',
    searchPlaceholder: 'Search book, author, year or doctrine…  ( / )',
    filterAria: 'Filter by field',
    count: ['book', 'books'],
    viewAuthor: 'View author',
    viewOnAmazon: 'See on Amazon',
    authorLabel: 'Author',
    yearBc: (y) => `${y} BC`,
    dnaNote:
      '<b>How to read the 12-icon strip:</b> each icon shows the author\'s ideological leaning across the 12 axes. The stronger the icon, the stronger the position. Hover to see exact values.',
    legendAria: 'Poles of each axis, in strip order',
    emptyTitle: 'No book found',
    emptyText: 'Try another search term or clear the filters.',
    found: ['book found', 'books found'],
    clear: 'Clear filters',
    credit: 'Original works written by historical and contemporary figures mapped in the 12 Axes catalog.',
    portraitAlt: (name) => `Portrait of ${name}`,
    ctaTitle: 'Which book matches your ideas?',
    ctaText: 'Take the 12-axis quiz and receive a tailored list of books written by the political figures closest to your result.',
    takeTheTest: 'Take the test',
    footer: 'Independent political quiz · 12axes.vercel.app · © 2026. All rights reserved',
    otherLang: { label: 'Português', href: '/books' },
    descriptions: {
      filosofo: 'Classical treatises and dialogues on justice, liberty, human nature, ethics, and the state.',
      teorico: 'Manifestos, doctrinal programs, and theses that structured major political movements and systems.',
      economista: 'Seminal works on value, markets, money, trade, taxation, and government intervention.',
      politico: 'Speeches, memoirs, and writings by heads of state, rulers, and leaders who held power.',
      intelectual: 'Essays, historical, sociological, and journalistic analyses that shaped public debate.',
      ativista: 'Letters, manifestos, and books by civil rights, labor, and grassroots movement leaders.',
      religioso: 'Theological treatises, encyclicals, and spiritual-ethical texts with direct political impact.',
      empresario: 'Books and treatises on business, strategy, and innovation with strong political resonance.'
    }
  }
};

function formatYear(year, t) {
  if (year === null || year === undefined) return '';
  return year < 0 ? t.yearBc(-year) : String(year);
}

export function booksIndexPage(L, { locale, site, gaSnippet, escapeHtml, profiles, title, description }) {
  const t = STR[locale];
  const labels = AREA_LABELS[locale];
  const prefix = L.s.prefix;
  const collator = new Intl.Collator(L.s.htmlLang);

  // Mapeia cada livro para o autor correspondente
  const booksWithAuthor = L.books
    .map((b) => {
      const author = L.personalityById.get(b.personalityId);
      if (!author) return null;
      return {
        ...b,
        author,
        category: author.category
      };
    })
    .filter(Boolean);

  const n = booksWithAuthor.length;

  const validYears = booksWithAuthor.map((b) => b.year).filter((y) => typeof y === 'number');
  const minYear = validYears.length > 0 ? Math.min(...validYears) : 0;
  const maxYear = validYears.length > 0 ? Math.max(...validYears) : 2026;
  const historyYears = Math.abs(minYear) + maxYear;
  const fmt = new Intl.NumberFormat(L.s.htmlLang);

  // Agrupa livros pela área do autor (AREA_ORDER)
  const groups = AREA_ORDER.map((key) => {
    const items = booksWithAuthor
      .filter((b) => b.category === key)
      .sort((a, b) => {
        // Ordena por ano de publicação (cronológico), depois pelo título do livro
        const ya = a.year ?? 0;
        const yb = b.year ?? 0;
        if (ya !== yb) return ya - yb;
        return collator.compare(a.title, b.title);
      });
    return {
      key,
      label: labels[key],
      items
    };
  }).filter((g) => g.items.length > 0);

  const abar = groups
    .map((g) => `<a class="ab" href="#${g.key}"><b>${g.items.length}</b><span>${escapeHtml(g.label)}</span></a>`)
    .join('');

  const chips = groups
    .map((g) => `<button type="button" class="chip" data-cat="${g.key}" aria-pressed="false">${escapeHtml(g.label)}<em>${g.items.length}</em></button>`)
    .join('');

  const card = (b) => {
    const author = b.author;
    const yrStr = formatYear(b.year, t);
    const textParts = [
      b.title,
      author.name,
      author.role,
      author.lifespan,
      String(b.year ?? ''),
      labels[b.category] ?? ''
    ].filter(Boolean).join(' ').toLowerCase();

    const amzUrl = amazonAffiliateUrl(b.url, b.title, author.name, locale);

    return `<li class="bc" data-text="${escapeHtml(textParts)}" data-cat="${b.category}">
      <article class="e-read-card bc-card">
        <header class="e-read-top-wrap">
          <a class="bc-author" href="${prefix}/personalities/${author.id}">
            <span class="ph" data-i="${escapeHtml(initials(author.name))}">
              <img src="${author.imagePath}" alt="${escapeHtml(t.portraitAlt(author.name))}" width="56" height="56" loading="lazy" decoding="async">
            </span>
            <div class="bc-author-id">
              <span class="e-read-label">${escapeHtml(t.authorLabel)}</span>
              <strong class="bc-author-name">${escapeHtml(author.name)}</strong>
              <span class="meta">${escapeHtml(author.role)}</span>
            </div>
          </a>
          ${yrStr ? `<span class="life">${escapeHtml(yrStr)}</span>` : ''}
        </header>

        <div class="e-read-book">
          ${BOOK_ICO_SVG}
          <div>
            <h3 class="bc-title">${escapeHtml(b.title)}</h3>
          </div>
        </div>

        <a class="e-read-btn" href="${escapeHtml(amzUrl)}" target="_blank" rel="sponsored noopener noreferrer">
          ${escapeHtml(t.viewOnAmazon)} ${AMAZON_SVG}
        </a>
      </article>
    </li>`;
  };

  const sections = groups
    .map(
      (g) =>
        `<section class="cat" id="${g.key}" data-cat="${g.key}" aria-labelledby="h-${g.key}">
          <header class="cat-head">
            <div class="cat-title">
              <span class="cat-mark" aria-hidden="true"></span>
              <div>
                <h2 id="h-${g.key}">${escapeHtml(g.label)}</h2>
                <p>${escapeHtml(t.descriptions[g.key])}</p>
              </div>
            </div>
            <span class="cat-count"><b class="cc">${g.items.length}</b> <span class="cl">${escapeHtml(t.count[g.items.length === 1 ? 0 : 1])}</span></span>
          </header>
          <ul class="grid">${g.items.map(card).join('')}</ul>
        </section>`
    )
    .join('');

  const basePath = '/books';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: `${site}${prefix}${basePath}`,
    inLanguage: L.s.htmlLang,
    isPartOf: { '@type': 'WebSite', name: '12 Axes', url: site },
    numberOfItems: n
  };

  const scriptStrings = JSON.stringify({ found: t.found, clear: t.clear, count: t.count });

  const html = `<!doctype html>
<html lang="${L.s.htmlLang}">
  ${catalogHead(L, { site, basePath, title, description, ogType: 'website', ogImage: '/logo.png', css: '/books.css', jsonLd: [jsonLd], gaSnippet, escapeHtml })}
  <body>
<a class="skip" href="#lista">${escapeHtml(t.skip)}</a>
<header class="nav"><div class="wrap">
  <a class="logo" href="${prefix || '/'}" aria-label="${escapeHtml(t.homeAria)}"><b>12</b><span>axes</span></a>
  <nav aria-label="${escapeHtml(t.catalogNav)}">
    <a href="${prefix}/books" aria-current="page">${escapeHtml(L.s.navBooks)}</a>
    <a href="${prefix}/ideologies">${escapeHtml(L.s.navIdeologies)}</a>
    <a href="${prefix}/personalities">${escapeHtml(L.s.navPersonalities)}</a>
    <a href="${prefix}/countries">${escapeHtml(L.s.navCountries)}</a>
    <a href="${prefix}/parties">${escapeHtml(L.s.navParties)}</a>
  </nav>
  <a class="btn" href="${prefix || '/'}">${escapeHtml(t.takeTheTest)} ${ARROW}</a>
</div></header>

<div class="wrap hero">
  <p class="crumbs"><a href="${prefix || '/'}">${escapeHtml(L.s.home)}</a> / ${escapeHtml(L.s.navBooks)}</p>
  <p class="eyebrow">${escapeHtml(t.eyebrow)}</p>
  <h1>${escapeHtml(L.s.booksIndexHeading)}</h1>
  <p class="lead">${escapeHtml(t.lead(n, groups.length, fmt.format(historyYears)))}</p>
  <div class="stats">
    <div><b>${n}</b><span>${escapeHtml(t.stats[0])}</span></div>
    <div><b>${groups.length}</b><span>${escapeHtml(t.stats[1])}</span></div>
    <div><b>~${fmt.format(historyYears)}</b><span>${escapeHtml(t.stats[2])}</span></div>
  </div>
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
  ${sections}
  <div class="empty" id="empty"><h2>${escapeHtml(t.emptyTitle)}</h2><p>${escapeHtml(t.emptyText)}</p></div>
  <p class="credit">${escapeHtml(t.credit)}</p>
  <aside class="cta">
    <div><h2>${escapeHtml(t.ctaTitle)}</h2><p>${escapeHtml(t.ctaText)}</p></div>
    <a class="btn" href="${prefix || '/'}">${escapeHtml(t.takeTheTest)} ${ARROW}</a>
  </aside>
</main>
<footer class="foot"><div class="wrap"><a class="logo" href="${prefix || '/'}"><b>12</b><span>axes</span></a><p>${escapeHtml(t.footer)} · <a href="${t.otherLang.href}">${escapeHtml(t.otherLang.label)}</a></p></div></footer>
<script>
const S = ${scriptStrings};
const q = document.getElementById('q'), chips = [...document.querySelectorAll('.chip')], cats = [...document.querySelectorAll('.cat')];
const info = document.getElementById('info'), empty = document.getElementById('empty');
const norm = s => s.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase();
const cards = [...document.querySelectorAll('.bc')].map(li => ({ li, t: norm(li.dataset.text), h: li.querySelector('.bc-title'), name: li.querySelector('.bc-title').textContent }));
document.querySelectorAll('.ph img').forEach(im => { if (im.complete && !im.naturalWidth) im.remove(); else im.addEventListener('error', () => im.remove()); });
let active = null;
function esc(s) { return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
function updateUrl() {
  const params = new URLSearchParams();
  const term = q.value.trim();
  if (term) params.set('q', term);
  if (active) params.set('cat', active);
  const qs = params.toString();
  const newUrl = window.location.pathname + (qs ? '?' + qs : '');
  window.history.replaceState({}, '', newUrl);
}
function apply(pushUrl = true) {
  const term = norm(q.value.trim());
  let shown = 0;
  cards.forEach(c => {
    const cat = c.li.dataset.cat;
    const ok = (!term || c.t.includes(term)) && (!active || cat === active);
    c.li.hidden = !ok;
    if (ok) shown++;
    const i = term && ok ? norm(c.name).indexOf(term) : -1;
    if (i >= 0) c.h.innerHTML = esc(c.name.slice(0, i)) + '<mark>' + esc(c.name.slice(i, i + term.length)) + '</mark>' + esc(c.name.slice(i + term.length));
    else c.h.textContent = c.name;
  });
  cats.forEach(s => {
    const n = s.querySelectorAll('.bc:not([hidden])').length;
    s.hidden = n === 0;
    s.querySelector('.cc').textContent = n;
    s.querySelector('.cl').textContent = S.count[n === 1 ? 0 : 1];
  });
  empty.classList.toggle('show', shown === 0);
  info.innerHTML = (term || active) ? '<b>' + shown + '</b> ' + S.found[shown === 1 ? 0 : 1] + '<button type="button" id="clear">' + esc(S.clear) + '</button>' : '';
  const cl = document.getElementById('clear');
  if (cl) cl.onclick = () => {
    q.value = '';
    active = null;
    chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
    apply();
  };
  if (pushUrl) updateUrl();
}
const initParams = new URLSearchParams(window.location.search);
const initQ = initParams.get('q');
const initCat = initParams.get('cat');
if (initQ) q.value = initQ;
if (initCat && chips.some(c => c.dataset.cat === initCat)) {
  active = initCat;
  chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.cat === active)));
}
if (initQ || initCat) apply(false);

q.addEventListener('input', () => apply());
chips.forEach(ch => ch.addEventListener('click', () => {
  active = active === ch.dataset.cat ? null : ch.dataset.cat;
  chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.cat === active)));
  apply();
  if (active) {
    const target = document.getElementById(active);
    if (target) target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
}));
document.addEventListener('keydown', e => { if (e.key === '/' && document.activeElement !== q) { e.preventDefault(); q.focus(); } });
</script>
  </body>
</html>`;

  return { basePath, html };
}

export const BOOKS_CSS = `${IDEOLOGIES_CSS}
.cat{--c:var(--floresta);--cb:#DCE6E0}.chip{--c:var(--floresta);--cb:#DCE6E0}
.abar{margin-top:32px;display:grid;grid-template-columns:repeat(8,1fr);gap:8px}
.ab{text-decoration:none;background:var(--sup);border:1px solid var(--borda);border-radius:14px;padding:12px 14px;display:flex;flex-direction:column;line-height:1.2;transition:border-color .15s}
.ab:hover{border-color:var(--floresta)}
.ab b{font-family:var(--display);font-size:22px;letter-spacing:-.03em;color:var(--floresta)}
.ab span{font-size:12.5px;color:var(--suave);margin-top:4px}
.life{font-size:12.5px;color:var(--suave);font-variant-numeric:tabular-nums;display:inline-block;background:var(--neutro);padding:3px 10px;border-radius:999px;width:fit-content;flex-shrink:0}
@media (max-width:980px){.abar{grid-template-columns:repeat(4,1fr)}}
@media (max-width:640px){.abar{display:none}}
@media (min-width:981px){.tools .wrap{flex-wrap:wrap}.chips{flex:1;min-width:0;flex-wrap:wrap;overflow:visible}}
@media (max-width:980px){.chips{min-width:0;max-width:100%}}

.bc{list-style:none}
.e-read-card{height:100%;display:flex;flex-direction:column;gap:18px;background:var(--sup);border:1.5px solid var(--borda);border-radius:24px;padding:24px;position:relative;overflow:hidden;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}
.e-read-card:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--floresta) 45%,var(--borda));box-shadow:0 14px 30px rgba(16,16,16,.07)}

.e-read-top-wrap{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
.bc-author{display:flex;gap:12px;align-items:center;text-decoration:none;color:inherit;min-width:0}
.bc-author:hover .bc-author-name{color:var(--floresta)}
.bc-author-id{min-width:0;display:flex;flex-direction:column;gap:2px}
.e-read-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--suave)}
.bc-author-name{font-family:var(--display);font-size:15px;font-weight:600;line-height:1.25;color:var(--texto);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.ph{flex:none;width:56px;height:56px;border-radius:50%;overflow:hidden;position:relative;background:var(--cb);box-shadow:0 0 0 3px var(--sup),0 0 0 4px var(--borda)}
.ph::before{content:attr(data-i);position:absolute;inset:0;display:grid;place-items:center;font:700 18px var(--display);color:var(--floresta);letter-spacing:-.02em}
.ph img{position:relative;display:block;width:100%;height:100%;object-fit:cover;filter:grayscale(.15) contrast(1.03);transition:filter .2s ease}
.e-read-card:hover .ph img{filter:none}

.e-read-book{flex:1;display:flex;gap:12px;align-items:flex-start;padding-top:16px;border-top:1px solid var(--borda)}
.e-read-ico{width:22px;height:22px;flex:none;margin-top:3px;fill:none;stroke:var(--floresta);stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.bc-title{font-family:var(--display);font-weight:600;font-size:18px;letter-spacing:-.015em;line-height:1.25;color:var(--texto)}

.e-read-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px 18px;border-radius:999px;font-size:14.5px;font-weight:500;text-decoration:none;color:var(--tinta);border:1.5px solid var(--tinta);background:transparent;width:100%;box-sizing:border-box;margin-top:auto;transition:background .15s ease,color .15s ease,border-color .15s ease}
.e-read-btn svg{width:18px;height:18px;flex:none}
.e-read-btn svg path[fill="currentColor"]{fill:currentColor !important;stroke:none !important}
.e-read-btn svg path[fill-rule="evenodd"]{fill:currentColor !important;stroke:none !important}
.e-read-btn:hover{background:var(--tinta);color:var(--papel)}
@media (prefers-reduced-motion:reduce){.e-read-card,.e-read-btn{transition:none}}

.bc[hidden]{display:none}
.credit{font-size:12.5px;color:var(--suave);margin:8px 0 0}
`;

