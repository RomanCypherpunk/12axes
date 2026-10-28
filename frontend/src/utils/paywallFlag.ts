/**
 * Quem vê a compra do Relatório completo. `VITE_PAYWALL_ENABLED` (decidido na publicação do site):
 * - `true`: todo mundo (só em português, que é onde o preço em reais vale);
 * - `preview`: só os navegadores marcados. Abrir o site com `?paywall=1` marca o navegador (fica guardado), `?paywall=0` desmarca;
 * - qualquer outro valor, ou vazio: ninguém. É o padrão: sem a variável, a compra não existe.
 */
export type PaywallMode = 'on' | 'preview' | 'off';

const STORAGE_KEY = '12axes:paywall';

export function paywallMode(raw: string | undefined): PaywallMode {
  if (raw === 'true') return 'on';
  if (raw === 'preview') return 'preview';
  return 'off';
}

interface MinimalStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

interface PaywallInput {
  mode: PaywallMode;
  lang: 'pt' | 'en';
  /** `window.location.search` da página. */
  search: string;
  storage: MinimalStorage | null;
}

/** Aplica ?paywall=1 / ?paywall=0 e diz se este navegador está marcado. Sem armazenamento, vale só o endereço desta visita. */
function markedBrowser(search: string, storage: MinimalStorage | null): boolean {
  const param = new URLSearchParams(search).get('paywall');
  try {
    if (param === '1') storage?.setItem(STORAGE_KEY, '1');
    if (param === '0') storage?.removeItem(STORAGE_KEY);
    if (param === '1') return true;
    if (param === '0') return false;
    return storage?.getItem(STORAGE_KEY) === '1';
  } catch {
    return param === '1';
  }
}

/** A compra deve aparecer para esta pessoa, neste navegador? */
export function paywallEnabled({ mode, lang, search, storage }: PaywallInput): boolean {
  if (lang !== 'pt' || mode === 'off') return false;
  if (mode === 'on') return true;
  return markedBrowser(search, storage);
}
