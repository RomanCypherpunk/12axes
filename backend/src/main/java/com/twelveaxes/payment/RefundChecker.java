package com.twelveaxes.payment;

/** Pergunta a Stripe se um pagamento foi reembolsado. A implementacao real chega junto com o checkout. */
@FunctionalInterface
public interface RefundChecker {
    boolean isRefunded(String paymentRef);
}
