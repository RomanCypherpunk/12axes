package com.twelveaxes.payment;

/** A Stripe nao respondeu ou recusou o pedido: o backend responde 503 e nunca libera nada por engano. */
public class PaymentGatewayException extends RuntimeException {
    public PaymentGatewayException(String message, Throwable cause) {
        super(message, cause);
    }
}
