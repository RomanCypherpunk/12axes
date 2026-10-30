package com.twelveaxes.payment;

import java.util.Optional;

/**
 * Tudo o que o backend precisa do gateway de pagamento, numa interface pequena: os testes a trocam por um duble e a
 * implementacao real fica isolada (hoje {@link MercadoPagoGatewayImpl}). Qualquer falha de rede ou do gateway vira
 * {@link PaymentGatewayException}.
 */
public interface PaymentGateway extends RefundChecker {
    /** Um pagamento aberto: o endereco da pagina de pagamento hospedada pelo gateway. */
    record CheckoutSession(String id, String url) {
    }

    /**
     * Um pagamento encontrado. {@code pending} e verdadeiro enquanto o dinheiro ainda nao entrou (Pix aguardando);
     * so um pagamento que nao esta pendente libera o relatorio.
     */
    record PaidPayment(String paymentRef, String vectorHash, boolean pending) {
    }

    /**
     * Abre o pagamento de um resultado. O valor ({@code amount}, decimal com ponto, ex.: "14.99") e a moeda vem do
     * servidor, nunca do navegador. O {@code nonce} e o hash do vetor ficam gravados no pagamento.
     */
    CheckoutSession create(String amount, String currency, String nonce, String vectorHash, String returnUrl, String lang);

    /** O pagamento de uma sessao devolvida pelo gateway, ou vazio. Gateways que voltam por {@code ?pay=} nao usam. */
    Optional<PaidPayment> findBySession(String sessionId);

    /** O pagamento pelo codigo da volta do pagamento ({@code ?pay=}), ou vazio se ainda nao foi encontrado. */
    Optional<PaidPayment> findByNonce(String nonce);
}
