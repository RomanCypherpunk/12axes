// Entrada do navegador das páginas da wiki: hidrata o HTML gerado no build com os mesmos componentes e props, para
// abas, fichas e o índice "Nesta página" funcionarem como nos resultados. O idioma vem de window.__WIKI_LANG, definido
// na página antes deste script.
import { hydrateRoot } from 'react-dom/client';
import '../styles/tokens.css';
import '../styles/editorial.css';
import '../styles/wiki.css';
import { wikiElement, type WikiProps } from './element';

const root = document.getElementById('wiki-root');
const data = document.getElementById('wiki-props');
if (root && data?.textContent) {
  hydrateRoot(root, wikiElement(JSON.parse(data.textContent) as WikiProps));
}
