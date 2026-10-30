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
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

/** O gateway da Paddle contra um servidor HTTP local que imita a API (sem rede, sem credencial). */
class PaddleGatewayImplTest {
    private static final String KEY = "pdl_sdbx_apikey_teste";
    private static final String PRICE = "pri_01m66gv37xkys7ws259qz0kpwa";
    private static final String TXN = "txn_01m66hdb2rreyh7xd6mjvm40yr";
    private static final String NONCE = "AbCdEfGhIjKlMnOpQrSt";
    private static final String HASH = "18d01bba7aa7c961b486b74323df99109415dcc72a22ab6fab349e49f3ac102b";
    private static final ObjectMapper JSON = new ObjectMapper();

    private HttpServer server;
    private PaddleGatewayImpl gateway;
    private final List<String> requestLines = new ArrayList<>();
    private final List<String> authHeaders = new ArrayList<>();
    private final List<String> versions = new ArrayList<>();
    private final List<String> bodies = new ArrayList<>();
    private final Map<String, String> routes = new ConcurrentHashMap<>();
    private final Map<String, Integer> statusByRoute = new ConcurrentHashMap<>();
    private final AtomicInteger adjustmentLookups = new AtomicInteger();

    @BeforeEach
    void startServer() throws IOException {
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/", this::handle);
        server.start();
        gateway = new PaddleGatewayImpl(KEY, PRICE, "http://127.0.0.1:" + server.getAddress().getPort(), Clock.fixed(Instant.parse("2026-10-30T12:00:00Z"), ZoneOffset.UTC));
    }

    @AfterEach
    void stopServer() {
        server.stop(0);
    }

    private void handle(HttpExchange exchange) throws IOException {
        String key = exchange.getRequestMethod() + " " + exchange.getRequestURI().getRawPath();
        requestLines.add(exchange.getRequestMethod() + " " + exchange.getRequestURI());
        authHeaders.add(exchange.getRequestHeaders().getFirst("Authorization"));
        versions.add(exchange.getRequestHeaders().getFirst("Paddle-Version"));
        bodies.add(new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8));
        if (key.equals("GET /adjustments")) {
            adjustmentLookups.incrementAndGet();
        }
        String response = routes.getOrDefault(key, "{\"data\":[]}");
        int status = statusByRoute.getOrDefault(key, 200);
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(status, bytes.length);
        exchange.getResponseBody().write(bytes);
        exchange.close();
    }

    private static String transaction(String status, String vectorHash) {
        String custom = vectorHash == null ? "null" : "{\"vector_hash\":\"" + vectorHash + "\"}";
        return "{\"data\":{\"id\":\"" + TXN + "\",\"status\":\"" + status + "\",\"custom_data\":" + custom + "}}";
    }

    @Test
    void createOpensATransactionWithPriceCustomDataAndReturnUrl() throws Exception {
        routes.put("POST /transactions", "{\"data\":{\"id\":\"" + TXN + "\",\"checkout\":{\"url\":\"https://12axes.vercel.app/results?_ptxn=" + TXN + "&est=1\"}}}");

        PaymentGateway.CheckoutSession session = gateway.create("3.99", "USD", NONCE, HASH, "https://12axes.vercel.app/results?est=1", "en");

        assertThat(session.id()).isEqualTo(TXN);
        assertThat(session.url()).isEqualTo("https://12axes.vercel.app/results?_ptxn=" + TXN + "&est=1");
        assertThat(authHeaders.getFirst()).isEqualTo("Bearer " + KEY);
        assertThat(versions.getFirst()).isEqualTo("1");
        JsonNode body = JSON.readTree(bodies.getFirst());
        assertThat(body.at("/items/0/price_id").asText()).isEqualTo(PRICE);
        assertThat(body.at("/items/0/quantity").asInt()).isEqualTo(1);
        assertThat(body.at("/custom_data/vector_hash").asText()).isEqualTo(HASH);
        assertThat(body.at("/custom_data/nonce").asText()).isEqualTo(NONCE);
        assertThat(body.at("/checkout/url").asText()).isEqualTo("https://12axes.vercel.app/results?est=1");
    }

    @Test
    void createRefusesAnyCurrencyButUsd() {
        assertThatThrownBy(() -> gateway.create("14.99", "BRL", NONCE, HASH, "https://12axes.vercel.app/results", "pt"))
                .isInstanceOf(PaymentGatewayException.class);
        assertThat(requestLines).isEmpty();
    }

    @Test
    void createFailsWhenTheResponseHasNoPaymentAddress() {
        routes.put("POST /transactions", "{\"data\":{\"id\":\"" + TXN + "\"}}");
        assertThatThrownBy(() -> gateway.create("3.99", "USD", NONCE, HASH, "https://12axes.vercel.app/results", "en"))
                .isInstanceOf(PaymentGatewayException.class);
    }

    @Test
    void apiErrorsBecomeGatewayExceptions() {
        statusByRoute.put("POST /transactions", 400);
        assertThatThrownBy(() -> gateway.create("3.99", "USD", NONCE, HASH, "https://localhost/results", "en"))
                .isInstanceOf(PaymentGatewayException.class)
                .hasMessageContaining("400");
    }

    @Test
    void aPaidOrCompletedTransactionUnlocksWithItsVectorHash() {
        for (String status : new String[] {"paid", "completed"}) {
            routes.put("GET /transactions/" + TXN, transaction(status, HASH));
            assertThat(gateway.findByNonce(TXN)).hasValueSatisfying(paid -> {
                assertThat(paid.paymentRef()).isEqualTo(TXN);
                assertThat(paid.vectorHash()).isEqualTo(HASH);
                assertThat(paid.pending()).isFalse();
            });
        }
    }

    @Test
    void aTransactionThatIsNotPaidYetDoesNotUnlock() {
        for (String status : new String[] {"draft", "ready", "billed", "past_due", "canceled"}) {
            routes.put("GET /transactions/" + TXN, transaction(status, HASH));
            assertThat(gateway.findByNonce(TXN)).as(status).isEmpty();
        }
    }

    @Test
    void aTransactionWithoutHashCarriesAnEmptyOneSoTheControllerRefusesIt() {
        routes.put("GET /transactions/" + TXN, transaction("completed", null));
        assertThat(gateway.findByNonce(TXN)).hasValueSatisfying(paid -> assertThat(paid.vectorHash()).isEmpty());
    }

    @Test
    void anUnknownTransactionIsEmptyAndOtherCodesNeverReachThePaddle() {
        statusByRoute.put("GET /transactions/" + TXN, 404);
        assertThat(gateway.findByNonce(TXN)).isEmpty();
        requestLines.clear();
        assertThat(gateway.findByNonce("AbCdEfGhIjKlMnOpQrSt")).isEmpty();
        assertThat(gateway.findByNonce("txn_../../etc")).isEmpty();
        assertThat(gateway.findByNonce(null)).isEmpty();
        assertThat(requestLines).isEmpty();
    }

    @Test
    void isRefundedIsTrueForAnApprovedRefundOrChargeback() {
        routes.put("GET /adjustments", "{\"data\":[{\"id\":\"adj_1\",\"action\":\"refund\",\"status\":\"approved\"}]}");
        assertThat(gateway.isRefunded(TXN)).isTrue();
        assertThat(requestLines.getFirst()).contains("transaction_id=" + TXN).contains("status=approved");
    }

    @Test
    void isRefundedIsFalseWithoutAdjustmentsAndAnswersAreCached() {
        routes.put("GET /adjustments", "{\"data\":[]}");
        assertThat(gateway.isRefunded(TXN)).isFalse();
        assertThat(gateway.isRefunded(TXN)).isFalse();
        assertThat(adjustmentLookups.get()).isEqualTo(1);
    }

    @Test
    void aCreditAdjustmentIsNotAReturn() {
        routes.put("GET /adjustments", "{\"data\":[{\"id\":\"adj_1\",\"action\":\"credit\",\"status\":\"approved\"}]}");
        assertThat(gateway.isRefunded(TXN)).isFalse();
    }

    @Test
    void referencesFromOtherGatewaysAreNeverBlockedNorLookedUp() {
        assertThat(gateway.isRefunded("185778195777")).isFalse();
        assertThat(gateway.isRefunded("gift")).isFalse();
        assertThat(gateway.isRefunded(null)).isFalse();
        assertThat(requestLines).isEmpty();
    }

    @Test
    void refundCheckFailuresAreGatewayExceptions() {
        statusByRoute.put("GET /adjustments", 500);
        assertThatThrownBy(() -> gateway.isRefunded(TXN)).isInstanceOf(PaymentGatewayException.class);
    }

    @Test
    void aSandboxKeyTalksToTheSandboxAndAnyOtherKeyToProduction() {
        assertThat(PaddleGatewayImpl.SANDBOX_URL).isEqualTo("https://sandbox-api.paddle.com");
        assertThat(PaddleGatewayImpl.PRODUCTION_URL).isEqualTo("https://api.paddle.com");
        // Os dois construtores publicos escolhem pelo prefixo da chave; aqui so se confere que constroem.
        new PaddleGatewayImpl("pdl_sdbx_x", PRICE, Clock.systemUTC());
        new PaddleGatewayImpl("pdl_live_x", PRICE, Clock.systemUTC());
    }

    @Test
    void sessionLookupIsNotUsedByThisGateway() {
        assertThat(gateway.findBySession("cs_test_a1B2c3D4e5F6")).isEmpty();
        assertThat(requestLines).isEmpty();
    }
}
