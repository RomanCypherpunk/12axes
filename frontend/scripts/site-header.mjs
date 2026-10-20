// Cabeçalho único das páginas geradas (catálogos, perfis, livros). Visual em site-header.css, igual à
// home; a teia (src/tree/TreePage.tsx) usa as mesmas classes `sh-*`.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const SITE_HEADER_CSS = readFileSync(fileURLToPath(new URL('./site-header.css', import.meta.url)), 'utf8');

const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * @param {object} o
 * @param {object} o.L        contexto do idioma (L.s com os rótulos de navegação)
 * @param {string} o.basePath caminho da página sem prefixo de idioma (ex.: /ideologies/anarquismo)
 * @param {string} [o.current] books | ideologies | personalities | countries | parties
 * @param {string} [o.webView] caminho da teia sem prefixo (ex.: /tree/ideologies?id=anarquismo)
 */
export function siteHeader({ L, basePath, current, webView }) {
  const prefix = L.s.prefix;
  const home = prefix || '/';
  const links = [
    ['books', L.s.navBooks],
    ['ideologies', L.s.navIdeologies],
    ['personalities', L.s.navPersonalities],
    ['countries', L.s.navCountries],
    ['parties', L.s.navParties]
  ]
    .map(([key, label]) => `<a href="${prefix}/${key}"${key === current ? ' aria-current="page"' : ''}>${esc(label)}</a>`)
    .join('');
  const langHref = prefix ? basePath : `/en${basePath}`;
  const langLabel = prefix ? 'PT' : 'EN';
  const web = webView ? `<a class="sh-btn sh-btn-ghost" href="${prefix}${webView}">${esc(L.s.navWebView)}</a>` : '';
  return `<header class="sh"><div class="sh-wrap">
  <a class="sh-logo" href="${home}" aria-label="12 axes"><b>12</b><span>axes</span></a>
  <nav class="sh-links" aria-label="${esc(L.s.navCatalog)}">${links}<a class="sh-lang" href="${langHref}" hreflang="${prefix ? 'pt-BR' : 'en'}">${langLabel}</a></nav>
  <div class="sh-actions">${web}<a class="sh-btn sh-btn-primary" href="${home}">${esc(L.s.navStart)} ${ARROW}</a></div>
</div></header>`;
}
