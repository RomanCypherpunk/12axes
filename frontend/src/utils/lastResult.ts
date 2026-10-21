import { parseSavedAnswers, type SavedAnswers } from './quizProgress';

// Último resultado concluído, guardado no navegador: a home usa para avisar que o teste já foi feito
// e levar de volta ao resultado sem refazer o quiz (o link do resultado já carrega os 12 valores).
// Junto vão as respostas, para "Editar respostas" reabrir o quiz preenchido; ficam só no aparelho.
const STORAGE_KEY = '12axes-last-result';
// v1 guardava só o link e o nome; continua valendo, apenas sem as respostas.
const VERSION = 2;
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_NAME_LENGTH = 120;
// Só caminhos do próprio site: o que veio do disco nunca vira um link para outro domínio.
const RESULT_URL = /^\/results\?[A-Za-z0-9_.=&%-]+$/;

export interface LastResult {
  v: number;
  /** Caminho do resultado compartilhável, como /results?est=65&rep=32.5&... */
  url: string;
  /** Nome da ideologia mais compatível, para o aviso. */
  name: string;
  savedAt: number;
  /** Respostas do quiz, quando este navegador as tem (resultados salvos antes não têm). */
  answers?: SavedAnswers;
}

export function parseLastResult(raw: string | null, now = Date.now()): LastResult | null {
  if (!raw) {
    return null;
  }
  try {
    const data = JSON.parse(raw) as Partial<LastResult> | null;
    if (!data || typeof data !== 'object' || (data.v !== VERSION && data.v !== 1)) {
      return null;
    }
    if (typeof data.savedAt !== 'number' || now - data.savedAt > MAX_AGE_MS || data.savedAt > now + 60_000) {
      return null;
    }
    if (typeof data.url !== 'string' || !RESULT_URL.test(data.url)) {
      return null;
    }
    if (typeof data.name !== 'string' || data.name.length === 0 || data.name.length > MAX_NAME_LENGTH) {
      return null;
    }
    // Respostas inválidas não derrubam o aviso: o resultado continua, só sem a edição.
    const answers = data.answers === undefined ? undefined : (parseSavedAnswers(data.answers) ?? undefined);
    return { v: VERSION, url: data.url, name: data.name, savedAt: data.savedAt, answers };
  } catch {
    return null;
  }
}

export function loadLastResult(): LastResult | null {
  try {
    return parseLastResult(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function saveLastResult(result: Pick<LastResult, 'url' | 'name' | 'answers'>): void {
  try {
    const payload: LastResult = { ...result, v: VERSION, savedAt: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage indisponível ou cheio: o resultado continua na tela, só sem o aviso na home.
  }
}
