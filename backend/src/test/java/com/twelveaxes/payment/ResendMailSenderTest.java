package com.twelveaxes.payment;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

/** O envio pelo Resend contra um servidor HTTP local que imita a API (sem rede, sem credencial). */
class ResendMailSenderTest {
    private static final ObjectMapper JSON = new ObjectMapper();

    private HttpServer server;
    private String baseUrl;
    private final AtomicInteger status = new AtomicInteger(200);
    private final List<String> requestLines = new ArrayList<>();
    private final List<String> authHeaders = new ArrayList<>();
    private final List<String> idempotencyKeys = new ArrayList<>();
    private final List<String> bodies = new ArrayList<>();

    @BeforeEach
    void startServer() throws IOException {
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/", this::handle);
        server.start();
        baseUrl = "http://127.0.0.1:" + server.getAddress().getPort();
    }

    @AfterEach
    void stopServer() {
        server.stop(0);
    }

    private void handle(HttpExchange exchange) throws IOException {
        requestLines.add(exchange.getRequestMethod() + " " + exchange.getRequestURI().getRawPath());
        authHeaders.add(exchange.getRequestHeaders().getFirst("Authorization"));
        idempotencyKeys.add(exchange.getRequestHeaders().getFirst("Idempotency-Key"));
        bodies.add(new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8));
        byte[] bytes = "{\"id\":\"email_123\"}".getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(status.get(), bytes.length);
        exchange.getResponseBody().write(bytes);
        exchange.close();
    }

    @Test
    void sendsOneEmailWithKeyIdempotencyKeyAndTheMessage() throws Exception {
        new ResendMailSender("re_chave_teste", "12 Axes <relatorio@exemplo.com>", "ajuda@exemplo.com", baseUrl)
                .send("ana@exemplo.com", "Assunto", "<p>oi</p>", "oi", "abacatepay-bill_1");

        assertThat(requestLines).containsExactly("POST /emails");
        assertThat(authHeaders.getFirst()).isEqualTo("Bearer re_chave_teste");
        assertThat(idempotencyKeys.getFirst()).isEqualTo("abacatepay-bill_1");
        JsonNode body = JSON.readTree(bodies.getFirst());
        assertThat(body.at("/from").asText()).isEqualTo("12 Axes <relatorio@exemplo.com>");
        assertThat(body.at("/to/0").asText()).isEqualTo("ana@exemplo.com");
        assertThat(body.at("/to").size()).isEqualTo(1);
        assertThat(body.at("/subject").asText()).isEqualTo("Assunto");
        assertThat(body.at("/html").asText()).isEqualTo("<p>oi</p>");
        assertThat(body.at("/text").asText()).isEqualTo("oi");
        assertThat(body.at("/reply_to").asText()).isEqualTo("ajuda@exemplo.com");
    }

    @Test
    void withoutAReplyToTheFieldIsOmitted() throws Exception {
        new ResendMailSender("re_chave_teste", "relatorio@exemplo.com", "", baseUrl).send("ana@exemplo.com", "A", "<p>x</p>", "x", "k");
        assertThat(JSON.readTree(bodies.getFirst()).has("reply_to")).isFalse();
    }

    @Test
    void aRefusalBecomesAMailSendException() {
        status.set(422);
        assertThatThrownBy(() -> new ResendMailSender("re_chave_teste", "relatorio@exemplo.com", "", baseUrl)
                .send("ana@exemplo.com", "A", "<p>x</p>", "x", "k"))
                .isInstanceOf(MailSendException.class)
                .hasMessageContaining("422");
    }

    @Test
    void anUnreachableServerBecomesAMailSendException() {
        server.stop(0);
        assertThatThrownBy(() -> new ResendMailSender("re_chave_teste", "relatorio@exemplo.com", "", baseUrl)
                .send("ana@exemplo.com", "A", "<p>x</p>", "x", "k"))
                .isInstanceOf(MailSendException.class);
    }
}
