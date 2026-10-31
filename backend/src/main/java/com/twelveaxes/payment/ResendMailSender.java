package com.twelveaxes.payment;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

/** Resend (https://resend.com): um POST em /emails por mensagem, com a chave de API e a chave de idempotencia. */
public class ResendMailSender implements TransactionalMailSender {
    public static final String DEFAULT_BASE_URL = "https://api.resend.com";
    private static final Duration TIMEOUT = Duration.ofSeconds(10);

    private final String apiKey;
    private final String from;
    private final String replyTo;
    private final String baseUrl;
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(TIMEOUT).build();
    private final ObjectMapper json = new ObjectMapper();

    /**
     * {@code from}: o remetente ja no formato do Resend, de um dominio verificado (ex.: {@code 12 Axes <relatorio@dominio>}).
     * {@code replyTo}: para onde vao as respostas do comprador (pode ser vazio).
     */
    public ResendMailSender(String apiKey, String from, String replyTo) {
        this(apiKey, from, replyTo, DEFAULT_BASE_URL);
    }

    ResendMailSender(String apiKey, String from, String replyTo, String baseUrl) {
        this.apiKey = apiKey.trim();
        this.from = from.trim();
        this.replyTo = replyTo == null ? "" : replyTo.trim();
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
    }

    @Override
    public void send(String to, String subject, String html, String text, String idempotencyKey) {
        ObjectNode body = json.createObjectNode();
        body.put("from", from);
        body.putArray("to").add(to);
        body.put("subject", subject);
        body.put("html", html);
        body.put("text", text);
        if (!replyTo.isBlank()) {
            body.put("reply_to", replyTo);
        }
        HttpRequest request = HttpRequest.newBuilder(URI.create(baseUrl + "/emails"))
                .timeout(TIMEOUT)
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json; charset=utf-8")
                .header("User-Agent", "12axes-backend")
                .header("Idempotency-Key", idempotencyKey)
                .POST(HttpRequest.BodyPublishers.ofString(body.toString(), StandardCharsets.UTF_8))
                .build();
        try {
            HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            int status = response.statusCode();
            if (status < 200 || status >= 300) {
                throw new MailSendException("O Resend respondeu HTTP " + status, new IOException(response.body()));
            }
        } catch (IOException e) {
            throw new MailSendException("Nao foi possivel falar com o Resend", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new MailSendException("Conexao com o Resend interrompida", e);
        }
    }
}
