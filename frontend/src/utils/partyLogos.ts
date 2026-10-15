const PARTY_LOGOS_PATH = 'parties/logos/';

/**
 * A seção de partidos aparece por padrão. Defina VITE_SHOW_PARTIES=false no build para escondê-la
 * (resultados, PDF e card), por exemplo enquanto o catálogo ainda tem poucos perfis.
 */
export const PARTIES_ENABLED = import.meta.env.VITE_SHOW_PARTIES !== 'false';

/** Caminho público do logo quadrado 1:1 de um partido/organização (respeita o BASE_URL do Vite). */
export function resolvePartyLogoSrc(logoPath?: string): string {
  const path = logoPath?.trim();
  if (!path) {
    return '';
  }
  if (/^(?:https?:|data:|blob:)/i.test(path)) {
    return path;
  }
  const normalized = path.replace(/^\/+/, '').replace(/^public\//, '');
  const relative = normalized.startsWith(PARTY_LOGOS_PATH) ? normalized : `${PARTY_LOGOS_PATH}${normalized}`;
  const baseUrl = import.meta.env.BASE_URL || '/';
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${base}${relative}`;
}
