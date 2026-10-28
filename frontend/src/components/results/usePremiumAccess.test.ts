import { describe, expect, it } from 'vitest';
import { resultUrlWithoutPaymentParams } from './usePremiumAccess';

describe('resultUrlWithoutPaymentParams', () => {
  it('tira o que a volta do pagamento acrescenta e a âncora, e mantém o resultado', () => {
    expect(resultUrlWithoutPaymentParams('https://12axes.vercel.app/results?est=92.3&rep=25.7&unlock=cs_test_abc#bussola')).toBe(
      'https://12axes.vercel.app/results?est=92.3&rep=25.7'
    );
    expect(resultUrlWithoutPaymentParams('https://12axes.vercel.app/results?est=92.3&pay=AbCdEfGhIjKlMnOpQr')).toBe(
      'https://12axes.vercel.app/results?est=92.3'
    );
  });

  it('um endereço sem parâmetros de pagamento fica como está', () => {
    expect(resultUrlWithoutPaymentParams('http://localhost:5173/results?est=1')).toBe('http://localhost:5173/results?est=1');
  });
});
