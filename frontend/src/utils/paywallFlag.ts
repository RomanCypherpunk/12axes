/**
 * Quem vê a compra do Relatório completo. `VITE_PAYWALL_ENABLED` (decidido na publicação do site):
 * - `true`: todo mundo (só em português, que é onde o preço em reais vale);
 * - `preview`: só os navegadores marcados. Abrir o site com `?paywall=1` marca o navegador (fica guardado), `?paywall=0` desmarca;
 * - `paused`: vendas pausadas. Ninguém vê a compra, mas quem já pagou continua com o relatório (o acesso guardado segue valendo);
 * - qualquer outro valor, ou vazio: ninguém. É o padrão: sem a variável, a compra não existe.
 */
export type PaywallMode = 'on' | 'preview' | 'paused' | 'off';

const STORAGE_KEY = '12axes:paywall';

export function paywallMode(raw: string | undefined): PaywallMode {
  if (raw === 'true') return 'on';
  if (raw === 'preview') return 'preview';
  if (raw === 'paused') return 'paused';
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

/**
 * O Relatório completo existe para esta pessoa, neste navegador? Vale para o acesso de quem já pagou (o token guardado
 * só é lido com isto ligado) e, fora das vendas pausadas, também para a compra.
 */
export function paywallEnabled({ mode, lang, search, storage }: PaywallInput): boolean {
  if (lang !== 'pt' || mode === 'off') return false;
  if (mode === 'on' || mode === 'paused') return true;
  return markedBrowser(search, storage);
}

/** A compra (convite, botão e modal) deve aparecer? Pausada, o relatório segue aberto só para quem já pagou. */
export function salesOpen(mode: PaywallMode, enabled: boolean): boolean {
  return enabled && mode !== 'paused';
}
