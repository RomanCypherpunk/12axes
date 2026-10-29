/**
 * Acesso ao Relatório Completo: o token que o backend emite depois do pagamento fica neste navegador, preso ao
 * resultado (os 12 valores dos eixos) que foi pago. Sem conta e sem banco: quem limpar os dados do navegador reabre
 * o relatório pelo link do recibo da Stripe.
 */

const KEY_PREFIX = '12axes:entitlement:';

/**
 * SHA-256 em hex dos 12 valores arredondados a 1 casa, separados por vírgula ("65.0,32.5,..."): o mesmo cálculo do
 * backend (EntitlementToken.hashOf). Ruído abaixo de 1 casa não muda o resultado de ninguém.
 */
export async function vectorHash(values: number[]): Promise<string> {
  const canonical = values
    .map((value) => {
      const tenths = Math.round(value * 10);
      return `${Math.floor(tenths / 10)}.${tenths % 10}`;
    })
    .join(',');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/** Quando o token expira (ms), lido do próprio token; null se ele não tiver o formato esperado. */
export function tokenExpiresAt(token: string): number | null {
  try {
    const payload = token.split('.')[0];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const fields = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')).split('|');
    const expires = Number(fields[4]);
    return fields[0] === 'v2' && Number.isFinite(expires) ? expires * 1000 : null;
  } catch {
    return null;
  }
}

/** Guarda o token deste resultado. Navegador sem armazenamento (aba anônima, bloqueio) só não lembra. */
export function saveToken(hash: string, token: string): void {
  try {
    localStorage.setItem(KEY_PREFIX + hash, token);
  } catch {
    // sem armazenamento: o acesso vale só nesta visita
  }
}

/** O token guardado para este resultado, ou null (nunca guardado, expirado ou armazenamento indisponível). */
export function loadToken(hash: string, now: number = Date.now()): string | null {
  try {
    const token = localStorage.getItem(KEY_PREFIX + hash);
    if (!token) return null;
    const expires = tokenExpiresAt(token);
    if (expires === null || expires <= now) {
      localStorage.removeItem(KEY_PREFIX + hash);
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

interface KeyedStorage {
  readonly length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
}

/** Quando o token foi emitido (ms), lido do próprio token; null se ele não tiver o formato esperado. */
function tokenIssuedAt(token: string): number | null {
  try {
    const base64 = token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/');
    const fields = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')).split('|');
    const issued = Number(fields[3]);
    return fields[0] === 'v2' && Number.isFinite(issued) ? issued * 1000 : null;
  } catch {
    return null;
  }
}

/**
 * O acesso mais recente guardado neste navegador para OUTRO resultado: quem edita as respostas ganha um resultado novo,
 * e o backend troca esse acesso antigo (se o pagamento valer) por um para o resultado atual.
 */
export function findRenewableToken(exceptHash: string, storage: KeyedStorage | null = safeStorage(), now: number = Date.now()): string | null {
  if (!storage) return null;
  let best: { token: string; issuedAt: number } | null = null;
  try {
    for (let index = 0; index < storage.length; index++) {
      const key = storage.key(index);
      if (!key || !key.startsWith(KEY_PREFIX) || key === KEY_PREFIX + exceptHash) continue;
      const token = storage.getItem(key);
      const expires = token ? tokenExpiresAt(token) : null;
      const issuedAt = token ? tokenIssuedAt(token) : null;
      if (!token || expires === null || issuedAt === null || expires <= now) continue;
      if (!best || issuedAt > best.issuedAt) best = { token, issuedAt };
    }
  } catch {
    return null;
  }
  return best?.token ?? null;
}

function safeStorage(): KeyedStorage | null {
  try {
    return localStorage;
  } catch {
    return null;
  }
}

export function removeToken(hash: string): void {
  try {
    localStorage.removeItem(KEY_PREFIX + hash);
  } catch {
    // nada a remover
  }
}
