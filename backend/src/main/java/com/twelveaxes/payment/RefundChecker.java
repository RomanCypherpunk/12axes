package com.twelveaxes.payment;

/** Pergunta ao gateway de pagamento se um pagamento foi reembolsado. */
@FunctionalInterface
public interface RefundChecker {
    boolean isRefunded(String paymentRef);
}
