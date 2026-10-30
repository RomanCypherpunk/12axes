import { useCallback, useEffect, useState } from 'react';
import { startCheckout, unlockPayment } from '../../services/premiumApi';
import { ApiError } from '../../services/quizApi';
import { track } from '../../utils/analytics';
import { openPaddleCheckout, PADDLE_CLIENT_TOKEN, paddleTransactionFromSearch } from '../../utils/paddle';
import { accessTokenFromHash, findRenewableToken, loadToken, removeToken, saveToken, tokenExpiresAt, vectorHash } from '../../utils/entitlement';

/** Por que o acesso não abriu: outro resultado ou reembolso ("denied"), gateway/servidor fora ("unavailable"), ou o Pix demorou ("timeout"). */
export type AccessProblem = 'denied' | 'unavailable' | 'timeout';

export type AccessState =
  | { status: 'off' }
  | { status: 'checking' }
  | { status: 'locked'; problem: AccessProblem | null; busy: boolean }
  | { status: 'unlocked'; token: string };

export interface PremiumAccess {
  state: AccessState;
  /** Abre o pagamento (leva o navegador à página de pagamento do Mercado Pago). */
  purchase: () => void;
  /** O relatório recusou o token (reembolso, por exemplo): esquece o acesso guardado e volta ao convite. */
  revoke: () => void;
  /** Tenta de novo confirmar o pagamento depois de uma falha. */
  retry: () => void;
}

const POLL_MS = 3000;
const MAX_ATTEMPTS = 20;

// A volta do pagamento traz ?unlock=<sessão> (retorno do checkout) ou ?pay=<código> (link do recibo).
// ?gift=<senha> é o link de cortesia (GIFT_KEY no servidor): libera sem pagamento; o token é salvo e o parâmetro permanece na URL.
const PAYMENT_PARAMS = ['unlock', 'pay', 'gift'] as const;

function paymentFromUrl(): { sessionId?: string; pay?: string; gift?: string } | null {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('unlock');
  const pay = params.get('pay');
  const gift = params.get('gift');
  if (sessionId) return { sessionId };
  if (pay) return { pay };
  if (gift) return { gift };
  return null;
}

// O que o Mercado Pago acrescenta ao endereço de volta (além do ?pay= que o servidor põe). Saem só quando a pessoa está
// voltando de um pagamento: "status" e afins são nomes genéricos que não devem sumir de um endereço qualquer.
const GATEWAY_RETURN_PARAMS = [
  'collection_id',
  'collection_status',
  'payment_id',
  'status',
  'external_reference',
  'payment_type',
  'merchant_order_id',
  'preference_id',
  'site_id',
  'processing_mode',
  'merchant_account_id'
] as const;

/** O endereço deste resultado sem o que a volta do pagamento acrescenta e sem âncora: para onde o gateway devolve a pessoa. */
export function resultUrlWithoutPaymentParams(href: string = window.location.href): string {
  const url = new URL(href);
  url.hash = '';
  const returningFromGateway = url.searchParams.has('preference_id') || url.searchParams.has('collection_id');
  for (const name of PAYMENT_PARAMS) url.searchParams.delete(name);
  url.searchParams.delete('_ptxn');
  if (returningFromGateway) for (const name of GATEWAY_RETURN_PARAMS) url.searchParams.delete(name);
  return url.toString();
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Acesso ao Relatório Completo deste resultado: o token guardado, ou a confirmação do pagamento na volta do pagamento (Mercado Pago).
 * Desligado (`enabled` falso), não faz nada e não chama o servidor.
 */
export function usePremiumAccess(vector: number[], enabled: boolean): PremiumAccess {
  const [state, setState] = useState<AccessState>(enabled ? { status: 'checking' } : { status: 'off' });
  const [attempt, setAttempt] = useState(0);
  const key = vector.join(',');

  // Volta do servidor com ?_ptxn= (pagamento em dólar): inicia o Paddle.js, que abre o pagamento por cima da página. Pago, o site
  // volta ao resultado com ?pay=<transação>, o mesmo caminho dos outros pagamentos.
  useEffect(() => {
    if (!enabled || !PADDLE_CLIENT_TOKEN) return;
    const transaction = paddleTransactionFromSearch(window.location.search);
    if (!transaction) return;
    openPaddleCheckout(PADDLE_CLIENT_TOKEN, () => {
      const back = new URL(resultUrlWithoutPaymentParams());
      back.searchParams.set('pay', transaction);
      window.location.assign(back.toString());
    }).catch(() => setState({ status: 'locked', problem: 'unavailable', busy: false }));
  }, [enabled]);

  // Colar o link guardado (#access=) na aba já aberta só muda o fragmento: a página não recarrega, então avisa o efeito abaixo.
  useEffect(() => {
    if (!enabled) return;
    const onHashChange = () => {
      if (accessTokenFromHash(window.location.hash)) setAttempt((value) => value + 1);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setState({ status: 'off' });
      return;
    }
    let cancelled = false;

    (async () => {
      const hash = await vectorHash(vector);
      const payment = paymentFromUrl();

      // Link guardado do relatório (#access=): o acesso vem no próprio endereço. Sai do endereço logo; se o servidor o
      // recusar (outro resultado, vencido, reembolsado), o relatório pede o acesso de novo, como com qualquer token.
      const fromLink = accessTokenFromHash(window.location.hash);
      if (fromLink) {
        window.history.replaceState(null, '', resultUrlWithoutPaymentParams());
        const expiresAt = tokenExpiresAt(fromLink);
        if (expiresAt !== null && expiresAt > Date.now()) {
          saveToken(hash, fromLink);
          if (!cancelled) setState({ status: 'unlocked', token: fromLink });
          return;
        }
      }

      if (!payment) {
        const stored = loadToken(hash);
        if (stored) {
          if (!cancelled) setState({ status: 'unlocked', token: stored });
          return;
        }
        // Resultado novo (as respostas foram editadas) em um navegador que já pagou outro: renova o acesso, sem cobrar de novo.
        const previous = findRenewableToken(hash);
        if (previous) {
          if (!cancelled) setState({ status: 'checking' });
          try {
            const renewed = await unlockPayment({ vector, renew: previous });
            if (cancelled) return;
            saveToken(hash, renewed);
            setState({ status: 'unlocked', token: renewed });
            return;
          } catch {
            // Pagamento reembolsado, acesso vencido ou servidor fora: segue como quem ainda não pagou.
          }
        }
        if (!cancelled) setState({ status: 'locked', problem: null, busy: false });
        return;
      }

      setState({ status: 'checking' });
      for (let tries = 0; tries < MAX_ATTEMPTS && !cancelled; tries++) {
        try {
          const token = await unlockPayment({ vector, ...payment });
          if (cancelled) return;
          saveToken(hash, token);
          track('purchase_unlocked');
          // O código sai do endereço: o link copiado dali em diante é o do resultado, não o do pagamento.
          // O link de cortesia (?gift=) é a exceção: fica, para a pessoa guardar a URL e reabrir o relatório.
          if (!payment.gift) window.history.replaceState(null, '', resultUrlWithoutPaymentParams());
          setState({ status: 'unlocked', token });
          return;
        } catch (error) {
          const status = error instanceof ApiError ? error.status : 0;
          if (status === 402) {
            // Pix ainda pendente, ou o gateway ainda não registrou o pagamento: espera e tenta de novo.
            await wait(POLL_MS);
            continue;
          }
          if (!cancelled) setState({ status: 'locked', problem: status === 403 ? 'denied' : 'unavailable', busy: false });
          return;
        }
      }
      if (!cancelled) setState({ status: 'locked', problem: 'timeout', busy: false });
    })();

    return () => {
      cancelled = true;
    };
    // `key` representa o vetor (o array é novo a cada render em alguns chamadores).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, key, attempt]);

  const purchase = useCallback(() => {
    track('checkout_start');
    setState((current) => (current.status === 'locked' ? { ...current, busy: true } : current));
    startCheckout(vector, resultUrlWithoutPaymentParams())
      .then((url) => window.location.assign(url))
      .catch(() => setState({ status: 'locked', problem: 'unavailable', busy: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const revoke = useCallback(() => {
    void vectorHash(vector).then((hash) => {
      removeToken(hash);
      setState({ status: 'locked', problem: 'denied', busy: false });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  return { state, purchase, revoke, retry };
}
