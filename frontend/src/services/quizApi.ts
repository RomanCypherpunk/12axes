import { LANG, t } from '../i18n';
import type {
  CompareDetail,
  CompareItem,
  CompareProfiles,
  CompareType,
  QuizPayload,
  QuizResult,
  QuizVariant,
  SubmittedAnswer
} from '../types/quiz';
import { serializeCompareItems, type CompareRef } from '../utils/compareUrl';
import { PARTIES_ENABLED } from '../utils/partyLogos';

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

/** Erro HTTP do backend; o status deixa a tela distinguir, por exemplo, um perfil inexistente (404). */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit, retries = 1): Promise<T> {
  // Content-Type só quando há corpo: num GET ele transforma a chamada entre origens em uma
  // requisição "não simples", e o navegador gasta uma ida e volta extra (preflight OPTIONS).
  const headers = options?.body ? { 'Content-Type': 'application/json', ...options.headers } : options?.headers;
  try {
    const response = await fetch(`${API_URL}${path}`, { ...options, headers });

    if (!response.ok) {
      const message = await response.text();
      throw new ApiError(formatApiError(message, response.status), response.status);
    }

    return response.json() as Promise<T>;
  } catch (err) {
    const isGet = !options?.method || options.method.toUpperCase() === 'GET';
    if (isGet && retries > 0 && err instanceof TypeError) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return request<T>(path, options, retries - 1);
    }
    throw err;
  }
}

function formatApiError(message: string, status: number): string {
  if (!message) {
    return t.errHttp(status);
  }

  try {
    const payload = JSON.parse(message) as { error?: unknown; message?: unknown };
    if (typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message;
    }
    if (typeof payload.error === 'string' && payload.error.trim()) {
      return payload.error;
    }
  } catch {
    // The backend may return plain text for non-Spring errors.
  }

  return message;
}

// Com os partidos escondidos (VITE_SHOW_PARTIES=false), a linha do tempo não pode trazê-los.
function partiesParam(): string {
  return PARTIES_ENABLED ? '' : '&parties=false';
}

export function fetchQuiz(variant: QuizVariant = 'short'): Promise<QuizPayload> {
  return request<QuizPayload>(`/api/quiz?variant=${variant}&lang=${LANG}`);
}

export function submitResults(
  variant: QuizVariant,
  answers: SubmittedAnswer[],
  archetype: Record<string, string> = {},
  religion: string | null = null
): Promise<QuizResult> {
  const religionParam = religion ? `&religion=${encodeURIComponent(religion)}` : '';
  return request<QuizResult>(`/api/results?lang=${LANG}${religionParam}${partiesParam()}`, {
    method: 'POST',
    body: JSON.stringify({ variant, answers, archetype })
  });
}

export function fetchSharedResult(leftPercents: number[], religion: string | null = null): Promise<QuizResult> {
  const religionParam = religion ? `&religion=${encodeURIComponent(religion)}` : '';
  return request<QuizResult>(`/api/results/by-axes?v=${leftPercents.join(',')}&lang=${LANG}${religionParam}${partiesParam()}`);
}


export function fetchCompareCatalog(religion: string | null = null): Promise<CompareItem[]> {
  const religionParam = religion ? `&religion=${encodeURIComponent(religion)}` : '';
  return request<CompareItem[]>(`/api/compare/catalog?lang=${LANG}${religionParam}`);
}

export function fetchCompare(type: CompareType, id: string, leftPercents: number[]): Promise<CompareDetail> {
  const values = leftPercents.map((value) => Math.round(value * 10) / 10).join(',');
  return request<CompareDetail>(
    `/api/compare?type=${type}&id=${encodeURIComponent(id)}&v=${values}&lang=${LANG}`
  );
}

// `v` acompanha o formato da resposta: o endpoint é cacheado por uma hora e, sem isso, quem já abriu uma
// comparação ficaria com a resposta antiga (sem as ideologias, países e partidos mais próximos).
const COMPARE_PROFILES_VERSION = 2;

export function fetchCompareProfiles(refs: CompareRef[]): Promise<CompareProfiles> {
  return request<CompareProfiles>(
    `/api/compare/profiles?items=${serializeCompareItems(refs)}&lang=${LANG}&v=${COMPARE_PROFILES_VERSION}`
  );
}
