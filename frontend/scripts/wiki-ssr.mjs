// Páginas da wiki (listas e perfis de personalidades, ideologias, países e partidos) montadas com os componentes da
// página de resultados (src/wiki). O HTML sai pronto no build (para o Google) e é hidratado no navegador pela entrada
// src/wiki/client.tsx.
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { IDEOLOGIES_CSS } from './ideologies-index.mjs';
import { AREA_LABELS, AREA_ORDER, catalogHead } from './personalities-index.mjs';
import { STR as IDEOLOGY_STR } from './ideology-page.mjs';
import { SITE_HEADER_CSS, siteHeader } from './site-header.mjs';
import { resolveIdeologyColor, SPECTRUM_ORDER } from '../src/utils/ideologyColors.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BUNDLE = join(ROOT, 'node_modules/.cache/wiki-ssr/server.mjs');
const CLIENT_ENTRY = 'src/wiki/client.tsx';

/** Estilos da moldura (cabeçalho do site, rodapé e base), tirados do CSS das páginas antigas. */
export const WIKI_SHELL_CSS =
  IDEOLOGIES_CSS.split('\n')
    .filter((line) => /^(:root|\*|html|body|a\{|\.wrap\{|\.skip|\.foot|\.logo)/.test(line))
    .join('\n') +
  '\n' +
  SITE_HEADER_CSS;

/** Empacota src/wiki/server.tsx para o Node (uma vez por build). */
export async function buildWikiServer() {
  mkdirSync(dirname(BUNDLE), { recursive: true });
  await build({
    entryPoints: [join(ROOT, 'src/wiki/server.tsx')],
    outfile: BUNDLE,
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node22',
    jsx: 'automatic',
    packages: 'external',
    loader: { '.css': 'empty', '.png': 'empty', '.svg': 'empty' },
    define: { 'import.meta.env': JSON.stringify({ BASE_URL: '/' }) },
    logLevel: 'warning'
  });
}

/** O módulo do servidor com o dicionário de um idioma (um módulo novo por idioma, pela query na URL). */
export async function loadWikiServer(locale) {
  globalThis.__WIKI_LANG = locale;
  return import(`${pathToFileURL(BUNDLE).href}?lang=${locale}`);
}

/** CSS e JS da entrada do navegador: do manifest do Vite no build; no servidor de desenvolvimento, o próprio arquivo. */
export function wikiAssets(dist, dev) {
  if (dev) return { css: [], js: `/${CLIENT_ENTRY}` };
  const manifestPath = join(dist, '.vite/manifest.json');
  if (!existsSync(manifestPath)) throw new Error('wiki: dist/.vite/manifest.json ausente (rode o vite build antes)');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const entry = manifest[CLIENT_ENTRY];
  if (!entry) throw new Error(`wiki: ${CLIENT_ENTRY} fora do manifest`);
  // O CSS compartilhado com a página de resultados (editorial.css) fica nos pedaços importados, não na própria entrada.
  const css = [];
  const seen = new Set();
  const collect = (key) => {
    if (seen.has(key) || !manifest[key]) return;
    seen.add(key);
    (manifest[key].imports ?? []).forEach(collect);
    (manifest[key].css ?? []).forEach((file) => css.includes(file) || css.push(file));
  };
  collect(CLIENT_ENTRY);
  return { css: css.map((file) => `/${file}`), js: `/${entry.file}` };
}

const json = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

function page(L, { site, basePath, title, description, ogType, ogImage, jsonLd, gaSnippet, escapeHtml, body, props, assets, webView, current }) {
  const head = catalogHead(L, { site, basePath, title, description, ogType, ogImage, css: '/wiki-shell.css', jsonLd, gaSnippet, escapeHtml }).replace(
    '</head>',
    `${assets.css.map((href) => `<link rel="stylesheet" href="${href}" />`).join('\n    ')}
    <script>window.__WIKI_LANG=${json(L.locale)}</script>
    <script type="module" src="${assets.js}"></script>
  </head>`
  );
  const home = L.s.prefix || '/';
  return `<!doctype html>
<html lang="${L.s.htmlLang}">
  ${head}
  <body>
${siteHeader({ L, basePath, current, webView })}
<div id="wiki-root">${body}</div>
<script type="application/json" id="wiki-props">${json(props)}</script>
<footer class="foot"><div class="wrap"><a class="logo" href="${home}"><b>12</b><span>axes</span></a><p>12axes.vercel.app</p></div></footer>
  </body>
</html>`;
}

// ── Catálogos ───────────────────────────────────────────────────────────────

const COUNTRY_KIND = {
  pt: { current: 'País atual', historical: 'Regime histórico' },
  en: { current: 'Present-day country', historical: 'Historical regime' },
  es: { current: 'País actual', historical: 'Régimen histórico' },
  de: { current: 'Heutiges Land', historical: 'Historisches Regime' },
  it: { current: 'Paese attuale', historical: 'Regime storico' },
  fr: { current: 'Pays actuel', historical: 'Régime historique' },
  ru: { current: 'Современная страна', historical: 'Исторический режим' }
};

const PLURAL_PATH = { personality: 'personalities', ideology: 'ideologies', country: 'countries', party: 'parties' };
const TITLE = { personality: 'personalityTitle', ideology: 'ideologyTitle', country: 'countryTitle', party: 'partyTitle' };
const NAV = { personality: 'navPersonalities', ideology: 'navIdeologies', country: 'navCountries', party: 'navParties' };
const SCHEMA = { personality: 'Person', ideology: 'Thing', country: 'Country', party: 'Organization' };

/** Etiquetas, imagem e textos do cabeçalho de cada catálogo. */
function subjectOf(kind, L, item, catalogs) {
  const prefix = L.s.prefix;
  const base = {
    kind,
    id: item.id,
    name: item.name,
    description: item.description ?? '',
    prefix,
    compareHref: `${prefix}/compare?items=${kind}:${item.id}`,
    quizHref: prefix || '/'
  };
  const credit = (url, name) => (url ? name || L.s.imageSource || '' : '');
  if (kind === 'personality') {
    return {
      ...base,
      tags: [{ label: item.role, solid: true }, { label: AREA_LABELS[L.locale][item.category] }, { label: item.lifespan }].filter((tag) => tag.label),
      image: { src: item.imagePath, alt: item.name, fit: 'cover', credit: credit(item.imageSourceUrl, item.imageSourceName), creditUrl: item.imageSourceUrl ?? '' }
    };
  }
  if (kind === 'ideology') {
    const t = IDEOLOGY_STR[L.locale];
    return {
      ...base,
      tags: [{ label: item.category, solid: true }],
      phrase: item.phrase || undefined,
      phraseTitle: t.phraseTitle,
      phraseNote: t.phraseNote(item.name),
      colorCategory: item.category,
      colorIdeologyId: item.id
    };
  }
  if (kind === 'country') {
    const k = COUNTRY_KIND[L.locale];
    return {
      ...base,
      tags: [{ label: item.category, solid: true }, { label: item.historical ? k.historical : k.current }, { label: item.historical ? item.period : '' }].filter(
        (tag) => tag.label
      ),
      image: { src: item.flagPath, alt: item.name, fit: 'contain', credit: credit(item.flagSourceUrl, item.flagSourceName), creditUrl: item.flagSourceUrl ?? '' }
    };
  }
  const country = catalogs.countries.find((c) => c.id === item.countryId);
  return {
    ...base,
    tags: [{ label: item.category, solid: true }, { label: country?.name ?? '' }, { label: item.historical ? item.period : '' }].filter((tag) => tag.label),
    image: { src: item.logoPath, alt: item.name, fit: 'contain', credit: credit(item.logoSourceUrl, item.logoSourceName), creditUrl: item.logoSourceUrl ?? '' }
  };
}

/** Página de um perfil de qualquer catálogo. */
export function wikiProfilePage(server, catalogs, L, kind, item, ctx) {
  const { site, gaSnippet, escapeHtml, truncate, assets } = ctx;
  const prefix = L.s.prefix;
  const path = PLURAL_PATH[kind];
  const basePath = `/${path}/${item.id}`;
  const subject = subjectOf(kind, L, item, catalogs);
  const result = server.buildProfileResult({ catalog: kind, id: item.id }, catalogs);
  const props = { kind: 'profile', lang: L.locale, subject, result, axes: catalogs.axes, religion: server.iconReligion(item.religions) };
  const description = truncate(item.description ?? '');
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '12 Axes', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: L.s[NAV[kind]], item: `${site}${prefix}/${path}` },
        { '@type': 'ListItem', position: 3, name: item.name, item: `${site}${prefix}${basePath}` }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': kind === 'personality' ? 'ProfilePage' : 'WebPage',
      mainEntity: { '@type': SCHEMA[kind], name: item.name, description },
      inLanguage: L.s.htmlLang,
      url: `${site}${prefix}${basePath}`
    }
  ];
  const html = page(L, {
    site,
    basePath,
    title: L.s[TITLE[kind]](item.name),
    description,
    ogType: kind === 'personality' ? 'profile' : 'article',
    ogImage: subject.image?.src ?? '/logo.png',
    jsonLd,
    gaSnippet,
    escapeHtml,
    body: server.renderWiki(props),
    props,
    assets,
    webView: `/tree/${path}?id=${item.id}`,
    current: path
  });
  return { basePath, html };
}

/** Itens e filtros da lista de cada catálogo. */
function listOf(kind, L, catalogs) {
  const prefix = L.s.prefix;
  const collator = new Intl.Collator(L.s.htmlLang);
  const byName = (a, b) => collator.compare(a.name, b.name);
  const href = (item) => `${prefix}/${PLURAL_PATH[kind]}/${item.id}`;
  if (kind === 'personality') {
    const labels = AREA_LABELS[L.locale];
    const unmapped = catalogs.personalities.filter((p) => !AREA_ORDER.includes(p.category));
    if (unmapped.length > 0) throw new Error(`personalities: área desconhecida: ${unmapped.map((p) => `${p.id} (${p.category})`).join(', ')}`);
    const items = [...catalogs.personalities].sort(byName).map((p) => ({
      id: p.id,
      name: p.name,
      subtitle: p.role ?? '',
      group: p.category,
      groupLabel: labels[p.category] ?? '',
      href: href(p),
      image: p.imagePath ?? '',
      imageShape: 'round'
    }));
    const groups = AREA_ORDER.map((id) => ({ id, label: labels[id], count: items.filter((i) => i.group === id).length })).filter((g) => g.count > 0);
    return { items, groups };
  }
  if (kind === 'ideology') {
    const items = [...catalogs.ideologies].sort(byName).map((i) => ({
      id: i.id,
      name: i.name,
      subtitle: i.category,
      group: resolveIdeologyColor(i.category).key,
      groupLabel: i.category,
      category: i.category,
      href: href(i)
    }));
    const groups = SPECTRUM_ORDER.map((color) => {
      const inGroup = items.filter((i) => i.group === color.key);
      return { id: color.key, label: inGroup[0]?.groupLabel ?? color.key, count: inGroup.length };
    }).filter((g) => g.count > 0);
    const groupColors = Object.fromEntries(SPECTRUM_ORDER.map((color) => [color.key, color.base]));
    return { items, groups, groupColors };
  }
  if (kind === 'country') {
    const k = COUNTRY_KIND[L.locale];
    const items = [...catalogs.countries].sort(byName).map((c) => ({
      id: c.id,
      name: c.name,
      subtitle: [c.category, c.historical ? c.period : ''].filter(Boolean).join(' · '),
      group: c.historical ? 'historical' : 'current',
      groupLabel: c.historical ? k.historical : k.current,
      href: href(c),
      image: c.flagPath ?? '',
      imageShape: 'flag'
    }));
    const groups = [
      { id: 'current', label: k.current, count: items.filter((i) => i.group === 'current').length },
      { id: 'historical', label: k.historical, count: items.filter((i) => i.group === 'historical').length }
    ].filter((g) => g.count > 0);
    return { items, groups };
  }
  const countryName = new Map(catalogs.countries.map((c) => [c.id, c.name]));
  const items = [...catalogs.parties].sort(byName).map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: [countryName.get(p.countryId), p.historical ? p.period : ''].filter(Boolean).join(' · '),
    group: p.category,
    groupLabel: p.category,
    href: href(p),
    image: p.logoPath ?? '',
    imageShape: 'logo'
  }));
  const order = [...new Set(catalogs.parties.map((p) => p.category))];
  return { items, groups: order.map((id) => ({ id, label: id, count: items.filter((i) => i.group === id).length })) };
}

/** Lista de um catálogo (/personalities, /ideologies, /countries, /parties). */
export function wikiIndexPage(server, catalogs, L, kind, ctx) {
  const { site, gaSnippet, escapeHtml, title, description, assets } = ctx;
  const prefix = L.s.prefix;
  const path = PLURAL_PATH[kind];
  const { items, groups, groupColors } = listOf(kind, L, catalogs);
  const props = { kind: 'index', lang: L.locale, catalog: kind, items, groups, groupColors };
  const basePath = `/${path}`;
  const jsonLd = [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description, inLanguage: L.s.htmlLang, url: `${site}${prefix}${basePath}` }];
  const html = page(L, {
    site,
    basePath,
    title,
    description,
    ogType: 'website',
    ogImage: '/logo.png',
    jsonLd,
    gaSnippet,
    escapeHtml,
    body: server.renderWiki(props),
    props,
    assets,
    webView: `/tree/${path}`,
    current: path
  });
  return { basePath, html };
}
