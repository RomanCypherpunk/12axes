// As imagens do catálogo (retratos, bandeiras, logos de partido e cartas da home) podem sair de uma CDN
// externa em vez da hospedagem do site: a hospedagem cobra por byte entregue, e são elas que mais pesam.
// VITE_ASSET_BASE aponta para a raiz de `public/` na CDN (ver .env.production); vazio, tudo sai do próprio site,
// como no desenvolvimento local.
const ASSET_BASE = ((import.meta.env.VITE_ASSET_BASE as string | undefined) ?? '').replace(/\/+$/, '');

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
