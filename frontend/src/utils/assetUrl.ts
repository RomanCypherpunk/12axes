// As imagens do catálogo (retratos, bandeiras, logos de partido e cartas da home) e os dados da teia saem da CDN
// em vez da hospedagem do site: a hospedagem cobra por byte entregue, e são eles que mais pesam.
// A CDN é a mesma que serve /assets (VITE_ASSETS_CDN, o Cloudflare Pages, que publica `public/` junto com o site, então
// um perfil novo já está lá no mesmo deploy). VITE_ASSET_BASE, se definida, aponta para outra raiz de `public/`.
// Sem nenhuma das duas, tudo sai do próprio site, como no desenvolvimento local.
const ASSET_BASE = (
  ((import.meta.env.VITE_ASSET_BASE as string | undefined) || (import.meta.env.VITE_ASSETS_CDN as string | undefined)) ??
  ''
).replace(/\/+$/, '');

/** Endereço de um arquivo de `public/` ("/personalities/portraits/x.jpg"): na CDN quando configurada, senão local. */
export function assetUrl(path: string): string {
  if (!ASSET_BASE || !path.startsWith('/') || path.startsWith('//')) return path;
  return `${ASSET_BASE}${path}`;
}

/** O mesmo arquivo servido pelo próprio site, para quando a CDN falha ou ainda não tem a imagem (um perfil recém-adicionado). */
export function localAssetUrl(src: string): string {
  return ASSET_BASE && src.startsWith(ASSET_BASE) ? src.slice(ASSET_BASE.length) : src;
}

/** `onError` de um <img> da CDN: tenta uma vez a cópia local antes de desistir. */
export function retryLocalAsset(event: { currentTarget: HTMLImageElement }): void {
  const image = event.currentTarget;
  const local = localAssetUrl(image.getAttribute('src') ?? '');
  if (local !== image.getAttribute('src')) image.src = local;
}
