package com.twelveaxes.payment;

import java.util.Optional;

/**
 * Tudo o que o backend precisa da Stripe, numa interface pequena: os testes a trocam por um duble e a implementacao
 * real fica isolada em {@link StripeGatewayImpl}. Qualquer falha de rede ou da Stripe vira {@link PaymentGatewayException}.
 */
public interface StripeGateway extends RefundChecker {
    /** Uma sessao de pagamento aberta: o endereco da pagina hospedada pela Stripe. */
    record CheckoutSession(String id, String url) {
    }

    /**
     * Um pagamento encontrado. {@code pending} e verdadeiro enquanto o dinheiro ainda nao entrou (Pix aguardando);
     * so um pagamento que nao esta pendente libera o relatorio.
     */
    record PaidPayment(String paymentRef, String vectorHash, boolean pending) {
    }

    /** Abre o pagamento de um resultado. O {@code nonce} e o hash do vetor ficam nos metadados do pagamento. */
    CheckoutSession create(String priceId, String nonce, String vectorHash, String returnUrl, String lang);

    /** O pagamento da sessao ({@code ?unlock=}), ou vazio se ela nao existe. */
    Optional<PaidPayment> findBySession(String sessionId);

    /** O pagamento pelo codigo do link do recibo ({@code ?pay=}), ou vazio se ainda nao foi encontrado. */
    Optional<PaidPayment> findByNonce(String nonce);
}
