import { LANG, t } from '../i18n';
import type { Candidate, ElectionResult, QuizPayload, QuizResult, QuizVariant, SubmittedAnswer } from '../types/quiz';

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    ...options
  });

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

export function submitResults(variant: QuizVariant, answers: SubmittedAnswer[]): Promise<QuizResult> {
  return request<QuizResult>(`/api/results?lang=${LANG}`, {
    method: 'POST',
    body: JSON.stringify({ variant, answers })
  });
}

export function fetchSharedResult(leftPercents: number[]): Promise<QuizResult> {
  return request<QuizResult>(`/api/results/by-axes?v=${leftPercents.join(',')}&lang=${LANG}`);
}

export function fetchElectionQuiz(): Promise<QuizPayload> { return request<ElectionResult extends never ? never : QuizPayload>('/api/election/quiz'); }
export function fetchElectionCandidates(): Promise<Candidate[]> { return request<Candidate[]>('/api/election/candidates'); }
export function submitElectionResults(answers: SubmittedAnswer[]): Promise<ElectionResult> { return request<ElectionResult>('/api/election/results', { method: 'POST', body: JSON.stringify({ variant: 'short', answers }) }); }
export function fetchSharedElectionResult(leftPercents: number[]): Promise<ElectionResult> { return request<ElectionResult>(`/api/election/results/by-axes?v=${leftPercents.join(',')}`); }
