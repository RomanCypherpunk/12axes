import { useCallback, useEffect, useState } from 'react';
import { startCheckout, unlockPayment } from '../../services/premiumApi';
import { ApiError } from '../../services/quizApi';
import { track } from '../../utils/analytics';
import { loadToken, removeToken, saveToken, vectorHash } from '../../utils/entitlement';

/** Por que o acesso não abriu: outro resultado ou reembolso ("denied"), Stripe/servidor fora ("unavailable"), ou o Pix demorou ("timeout"). */
export type AccessProblem = 'denied' | 'unavailable' | 'timeout';

export type AccessState =
  | { status: 'off' }
  | { status: 'checking' }
  | { status: 'locked'; problem: AccessProblem | null; busy: boolean }
  | { status: 'unlocked'; token: string };

export interface PremiumAccess {
  state: AccessState;
  /** Abre o pagamento (leva o navegador à página da Stripe). */
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

/** O endereço deste resultado sem o que a volta do pagamento acrescenta e sem âncora: para onde a Stripe devolve a pessoa. */
export function resultUrlWithoutPaymentParams(href: string = window.location.href): string {
  const url = new URL(href);
  url.hash = '';
  for (const name of PAYMENT_PARAMS) url.searchParams.delete(name);
  return url.toString();
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Acesso ao Relatório Completo deste resultado: o token guardado, ou a confirmação do pagamento na volta da Stripe.
 * Desligado (`enabled` falso), não faz nada e não chama o servidor.
 */
export function usePremiumAccess(vector: number[], enabled: boolean): PremiumAccess {
  const [state, setState] = useState<AccessState>(enabled ? { status: 'checking' } : { status: 'off' });
  const [attempt, setAttempt] = useState(0);
  const key = vector.join(',');

  useEffect(() => {
    if (!enabled) {
      setState({ status: 'off' });
      return;
    }
    let cancelled = false;

    (async () => {
      const hash = await vectorHash(vector);
      const payment = paymentFromUrl();

      if (!payment) {
        const stored = loadToken(hash);
        if (!cancelled) setState(stored ? { status: 'unlocked', token: stored } : { status: 'locked', problem: null, busy: false });
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
            // Pix ainda pendente, ou a Stripe ainda não indexou o pagamento: espera e tenta de novo.
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
