import { LANG } from '../i18n';
import type { PremiumReport } from '../types/quiz';
import type { SavedAnswers } from '../utils/quizProgress';
import { request } from './quizApi';

/**
 * Relatório Completo. O resultado é definido pelos 12 valores dos eixos (ordem de axes.json); as respostas são
 * opcionais e só acrescentam, por eixo, o que mais pesou. O backend só entrega o relatório com um token válido para
 * esse resultado (header X-Entitlement); em desenvolvimento local, com PREMIUM_DEV_OPEN ligado nele, abre sem token.
 */
// As escolhas de religião ficam junto das de arquétipo no progresso salvo, mas não são perguntas de arquétipo: o
// servidor recusa o pedido (400) se elas forem junto. O envio do resultado também as tira.
const NON_ARCHETYPE_STEP_IDS = ['religiao', 'denominacao'];

export function archetypeOnly(choices: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(choices).filter(([id]) => !NON_ARCHETYPE_STEP_IDS.includes(id)));
}

export function fetchPremiumReport(
  vector: number[],
  saved: Pick<SavedAnswers, 'variant' | 'answers' | 'archetypeChoices'> | null,
  token: string | null,
  religion: string | null
): Promise<PremiumReport> {
  const religionParam = religion ? `&religion=${encodeURIComponent(religion)}` : '';
  return request<PremiumReport>(`/api/premium/report?lang=${LANG}${religionParam}`, {
    method: 'POST',
    headers: token ? { 'X-Entitlement': token } : undefined,
    body: JSON.stringify({
      v: vector.join(','),
      answers: saved ? Object.entries(saved.answers).map(([questionId, answer]) => ({ questionId, answer })) : undefined,
      archetype: saved ? archetypeOnly(saved.archetypeChoices) : undefined
    })
  });
}

/** Abre o pagamento deste resultado e devolve o endereço da página de pagamento (Mercado Pago). O preço é decidido pelo servidor. */
export async function startCheckout(vector: number[], returnUrl: string): Promise<string> {
  const { url } = await request<{ url: string }>('/api/checkout', {
    method: 'POST',
    body: JSON.stringify({ v: vector.join(','), lang: LANG, returnUrl })
  });
  return url;
}

/**
 * Troca um pagamento feito (sessão da volta do checkout, ou código do link do recibo) pelo token deste resultado.
 * 402 = ainda não confirmado (Pix pendente); 403 = o pagamento é de outro resultado ou foi reembolsado.
 */
export async function unlockPayment(input: { vector: number[]; sessionId?: string; pay?: string; gift?: string; renew?: string }): Promise<string> {
  const { token } = await request<{ token: string }>('/api/unlock', {
    method: 'POST',
    body: JSON.stringify({ v: input.vector.join(','), sessionId: input.sessionId, pay: input.pay, gift: input.gift, renew: input.renew })
  });
  return token;
}
