import type { QuizPayload, QuizResult, QuizVariant, SubmittedAnswer } from '../types/quiz';

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
    throw new Error(message || `Erro HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function fetchQuiz(variant: QuizVariant = 'short'): Promise<QuizPayload> {
  return request<QuizPayload>(`/api/quiz?variant=${variant}`);
}

export function submitResults(variant: QuizVariant, answers: SubmittedAnswer[]): Promise<QuizResult> {
  return request<QuizResult>('/api/results', {
    method: 'POST',
    body: JSON.stringify({ variant, answers })
  });
}
