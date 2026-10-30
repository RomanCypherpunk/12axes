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

  it('tira também a senha de cortesia', () => {
    expect(resultUrlWithoutPaymentParams('https://12axes.vercel.app/results?est=92.3&gift=abc')).toBe('https://12axes.vercel.app/results?est=92.3');
  });

  it('na volta do Mercado Pago, tira também o que o gateway acrescenta', () => {
    const back =
      'https://12axes.vercel.app/results?est=92.3&pay=AbCdEfGhIjKlMnOpQr&collection_id=123&collection_status=approved&payment_id=123&status=approved' +
      '&external_reference=AbCdEfGhIjKlMnOpQr&payment_type=credit_card&merchant_order_id=9&preference_id=3804-abc&site_id=MLB&processing_mode=aggregator&merchant_account_id=null';
    expect(resultUrlWithoutPaymentParams(back)).toBe('https://12axes.vercel.app/results?est=92.3');
  });

  it('tira também a transação da Paddle (?_ptxn=)', () => {
    expect(resultUrlWithoutPaymentParams('https://12axes.vercel.app/results?est=92.3&_ptxn=txn_01m66hdb2rreyh7xd6mjvm40yr')).toBe(
      'https://12axes.vercel.app/results?est=92.3'
    );
  });

  it('um "status" qualquer fora da volta do pagamento não é apagado', () => {
    expect(resultUrlWithoutPaymentParams('https://12axes.vercel.app/results?est=92.3&status=x')).toBe('https://12axes.vercel.app/results?est=92.3&status=x');
  });

  it('um endereço sem parâmetros de pagamento fica como está', () => {
    expect(resultUrlWithoutPaymentParams('http://localhost:5173/results?est=1')).toBe('http://localhost:5173/results?est=1');
  });
});
