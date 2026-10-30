// Paddle.js: o pagamento em dólar (no exterior) abre por cima da própria página do resultado. O servidor cria a transação e
// devolve o comprador ao resultado com ?_ptxn=<transação>; o Paddle.js, ao iniciar nessa página, abre o pagamento sozinho.
const SCRIPT_URL = 'https://cdn.paddle.com/paddle/v2/paddle.js';

interface PaddleEvent {
  name?: string;
}

interface PaddleJs {
  Environment: { set(environment: 'sandbox' | 'production'): void };
  Initialize(options: { token: string; eventCallback?: (event: PaddleEvent) => void }): void;
}

declare global {
  interface Window {
    Paddle?: PaddleJs;
  }
}

/** Token do lado do cliente (público de propósito): `test_...` no sandbox, `live_...` em produção. Vazio = sem Paddle. */
export const PADDLE_CLIENT_TOKEN: string = import.meta.env.VITE_PADDLE_CLIENT_TOKEN ?? '';

export function paddleEnvironment(token: string): 'sandbox' | 'production' {
  return token.startsWith('test_') ? 'sandbox' : 'production';
}

/** A transação que o servidor abriu, vinda da volta ao resultado (?_ptxn=txn_...), ou null. */
export function paddleTransactionFromSearch(search: string): string | null {
  const id = new URLSearchParams(search).get('_ptxn');
  return id && /^txn_[a-z0-9]{20,40}$/.test(id) ? id : null;
}

let loading: Promise<PaddleJs> | null = null;

function loadPaddle(): Promise<PaddleJs> {
  loading ??= new Promise<PaddleJs>((resolve, reject) => {
    if (window.Paddle) {
      resolve(window.Paddle);
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => (window.Paddle ? resolve(window.Paddle) : reject(new Error('Paddle.js não carregou')));
    script.onerror = () => {
      loading = null;
      reject(new Error('Paddle.js não carregou'));
    };
    document.head.appendChild(script);
  });
  return loading;
}

/** Carrega e inicia o Paddle.js (que abre o pagamento da transação do endereço) e avisa quando o pagamento termina. */
export async function openPaddleCheckout(token: string, onCompleted: () => void): Promise<void> {
  const paddle = await loadPaddle();
  paddle.Environment.set(paddleEnvironment(token));
  paddle.Initialize({
    token,
    eventCallback: (event) => {
      if (event?.name === 'checkout.completed') onCompleted();
    }
  });
}
