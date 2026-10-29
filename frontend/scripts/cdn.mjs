// Tudo o que as páginas geradas pedem além do HTML sai da CDN (o Cloudflare Pages, mesma origem que serve /assets):
// na Vercel todo pedido e todo byte entregue são cobrados, e o HTML só precisa dela porque o endereço do site é o dela.
// VITE_ASSETS_CDN vazio (build local): nada muda, tudo continua relativo ao próprio site.
const CDN = (process.env.VITE_ASSETS_CDN ?? '').trim().replace(/\/+$/, '');
const SITE = 'https://12axes.vercel.app';

// Pastas de public/ que moram na CDN, mais o logo usado nas metatags de compartilhamento.
const ASSET_DIRS = 'personalities/portraits|countries/flags|parties/logos|share-examples|candidates';

// <link> dos ícones. Cada visita pede de 3 a 4 deles.
export function iconLinks() {
  return `<link rel="icon" type="image/x-icon" href="${CDN}/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="${CDN}/favicon-32x32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="${CDN}/apple-touch-icon.png" />`;
}

// Se uma imagem da CDN falhar (ou ainda não existir lá, num deploy que a Vercel termina antes), tenta uma vez a cópia
// do próprio site. Um único ouvinte em captura cobre todas as <img>, inclusive as preguiçosas. Na primeira falha ele
// segura o evento (stopPropagation) para que os handlers da página, que removem a imagem quebrada e mostram as iniciais,
// só rodem se a cópia local também falhar.
const IMAGE_FALLBACK = `document.addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='IMG'&&!t.getAttribute('data-f')){var s=t.getAttribute('src')||'';if(s.indexOf(${JSON.stringify(CDN)})===0){t.setAttribute('data-f','1');e.stopPropagation();t.src=s.slice(${CDN.length})}}},true)`;

/** Reescreve o HTML de uma página gerada para buscar imagens, CSS e imagens de compartilhamento na CDN. */
export function cdnifyHtml(html) {
  if (!CDN) return html;
  return html
    // Imagens de public/ citadas por caminho absoluto no site (src, data-*, strings dos scripts da página).
    .replace(new RegExp(`(["'])/((?:${ASSET_DIRS})/[^"'\\s]+)`, 'g'), `$1${CDN}/$2`)
    // og:image, twitter:image e "image" do JSON-LD, que levam o endereço completo do site.
    .replace(new RegExp(`${SITE.replace(/[.]/g, '\\.')}/((?:logo\\.png|(?:${ASSET_DIRS})/[^"'\\s<\\\\]+))`, 'g'), `${CDN}/$1`)
    // CSS das páginas de catálogo (ideologies.css, profile.css...), com volta ao próprio site se a CDN falhar.
    .replace(
      /<link rel="stylesheet" href="\/([A-Za-z0-9_-]+\.css)"/g,
      (_match, file) => `<link rel="stylesheet" href="${CDN}/${file}" onerror="this.onerror=null;this.href='/${file}'"`
    )
    .replace('</head>', `<script>${IMAGE_FALLBACK}</script></head>`);
}
