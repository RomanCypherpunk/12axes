import { LANG, t } from '../i18n';
import type { CompareDetail, CompareItem, CompareType, QuizPayload, QuizResult, QuizVariant, SubmittedAnswer } from '../types/quiz';

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  // Content-Type só quando há corpo: num GET ele transforma a chamada entre origens em uma
  // requisição "não simples", e o navegador gasta uma ida e volta extra (preflight OPTIONS).
  const headers = options?.body ? { 'Content-Type': 'application/json', ...options.headers } : options?.headers;
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(formatApiError(message, response.status));
  }

  return response.json() as Promise<T>;
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

export function fetchSharedResult(leftPercents: number[], religion: string | null = null): Promise<QuizResult> {
  const religionParam = religion ? `&religion=${encodeURIComponent(religion)}` : '';
  return request<QuizResult>(`/api/results/by-axes?v=${leftPercents.join(',')}&lang=${LANG}${religionParam}`);
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
