package com.twelveaxes.payment;

import java.util.Optional;

/**
 * Escolhe o gateway: reais vao para o do Brasil (Mercado Pago), dolar para a Paddle. A volta do pagamento e a conferencia
 * de reembolso olham o formato da referencia ({@code txn_...} e da Paddle; o resto, do gateway do Brasil). Qualquer um dos
 * dois pode faltar: pedir uma moeda sem gateway e uma falha de pagamento ({@link PaymentGatewayException}), nunca uma venda.
 */
public class RoutingPaymentGateway implements PaymentGateway {
    private static final String PADDLE_PREFIX = "txn_";

    private final PaymentGateway brazil;
    private final PaymentGateway paddle;

    /** Qualquer um pode ser nulo (gateway nao configurado). */
    public RoutingPaymentGateway(PaymentGateway brazil, PaymentGateway paddle) {
        this.brazil = brazil;
        this.paddle = paddle;
    }

    @Override
    public CheckoutSession create(String amount, String currency, String nonce, String vectorHash, String returnUrl, String lang) {
        return create(amount, currency, nonce, vectorHash, returnUrl, lang, null);
    }

    @Override
    public CheckoutSession create(String amount, String currency, String nonce, String vectorHash, String returnUrl, String lang, String email) {
        PaymentGateway gateway = "USD".equals(currency) ? paddle : brazil;
        if (gateway == null) {
            throw new PaymentGatewayException("Nenhum gateway configurado para " + currency, new IllegalStateException(currency));
        }
        return gateway.create(amount, currency, nonce, vectorHash, returnUrl, lang, email);
    }

    @Override
    public Optional<PaidPayment> findBySession(String sessionId) {
        return brazil == null ? Optional.empty() : brazil.findBySession(sessionId);
    }

    @Override
    public Optional<PaidPayment> findByNonce(String nonce) {
        PaymentGateway gateway = nonce != null && nonce.startsWith(PADDLE_PREFIX) ? paddle : brazil;
        return gateway == null ? Optional.empty() : gateway.findByNonce(nonce);
    }

    @Override
    public boolean isRefunded(String paymentRef) {
        PaymentGateway gateway = paymentRef != null && paymentRef.startsWith(PADDLE_PREFIX) ? paddle : brazil;
        return gateway != null && gateway.isRefunded(paymentRef);
    }
}
