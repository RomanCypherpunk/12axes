package com.twelveaxes.payment;

/** O servico de e-mail nao respondeu ou recusou a mensagem. O webhook responde 5xx e a AbacatePay tenta de novo. */
public class MailSendException extends RuntimeException {
    public MailSendException(String message, Throwable cause) {
        super(message, cause);
    }
}
