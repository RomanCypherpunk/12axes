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
  return request<QuizResult>(`/api/results?lang=${LANG}${religionParam}`, {
    method: 'POST',
    body: JSON.stringify({ variant, answers, archetype })
  });
}

// O endpoint é cacheado pelo navegador por uma hora; `rv` acompanha o formato da resposta para quem já abriu
// o mesmo link não ficar com uma versão antiga (sem os valores políticos, por exemplo).
const SHARED_RESULT_VERSION = 2;

export function fetchSharedResult(leftPercents: number[], religion: string | null = null): Promise<QuizResult> {
  const religionParam = religion ? `&religion=${encodeURIComponent(religion)}` : '';
  return request<QuizResult>(`/api/results/by-axes?v=${leftPercents.join(',')}&lang=${LANG}${religionParam}&rv=${SHARED_RESULT_VERSION}`);
}


// A busca de perfis acha qualquer um do catálogo: o filtro de religião dos rankings não vale aqui, porque quem digita o nome
// de um perfil (Distributismo, que é só para cristãos nos rankings) quer encontrá-lo. `rv` troca a URL em cache de uma hora.
const COMPARE_CATALOG_VERSION = 2;

export function fetchCompareCatalog(_religion: string | null = null): Promise<CompareItem[]> {
  return request<CompareItem[]>(`/api/compare/catalog?lang=${LANG}&rv=${COMPARE_CATALOG_VERSION}`);
}

// `rv` acompanha o formato da resposta: o endpoint é cacheado por uma hora e, sem isso, quem já abriu uma
// comparação ficaria com a resposta antiga (sem `religions`).
const COMPARE_DETAIL_VERSION = 2;

export function fetchCompare(type: CompareType, id: string, leftPercents: number[]): Promise<CompareDetail> {
  const values = leftPercents.map((value) => Math.round(value * 10) / 10).join(',');
  return request<CompareDetail>(
    `/api/compare?type=${type}&id=${encodeURIComponent(id)}&v=${values}&lang=${LANG}&rv=${COMPARE_DETAIL_VERSION}`
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
