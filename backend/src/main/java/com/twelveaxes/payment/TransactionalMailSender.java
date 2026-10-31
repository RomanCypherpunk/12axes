package com.twelveaxes.payment;

/**
 * Envia um e-mail transacional (hoje, o acesso ao relatorio pago). A implementacao real fica isolada ({@link ResendMailSender}) e
 * os testes a trocam por um duble. Qualquer falha vira {@link MailSendException}.
 */
public interface TransactionalMailSender {
    /**
     * @param idempotencyKey o mesmo valor para o mesmo e-mail: reenviar com a mesma chave nao manda duas mensagens
     *                       (a AbacatePay repete o aviso de pagamento quando nao recebe 2xx)
     */
    void send(String to, String subject, String html, String text, String idempotencyKey);
}
