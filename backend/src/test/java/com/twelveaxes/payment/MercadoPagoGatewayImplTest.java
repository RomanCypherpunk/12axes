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

/** O gateway do Mercado Pago contra um servidor HTTP local que imita a API (sem rede, sem credencial). */
class MercadoPagoGatewayImplTest {
    private static final String TOKEN = "APP_USR-teste";
    private static final String NONCE = "AbCdEfGhIjKlMnOpQrSt";
    private static final String HASH = "18d01bba7aa7c961b486b74323df99109415dcc72a22ab6fab349e49f3ac102b";
    private static final String PICTURE = "https://12axes.vercel.app/apple-touch-icon.png";
    private static final ObjectMapper JSON = new ObjectMapper();

    private HttpServer server;
    private MercadoPagoGatewayImpl gateway;
    private final List<String> requestLines = new ArrayList<>();
    private final List<String> authHeaders = new ArrayList<>();
    private final List<String> contentTypes = new ArrayList<>();
    private final List<String> bodies = new ArrayList<>();
    private final Map<String, String> routes = new ConcurrentHashMap<>();
    private final Map<String, Integer> statusByRoute = new ConcurrentHashMap<>();
    private final AtomicInteger paymentLookups = new AtomicInteger();

    @BeforeEach
    void startServer() throws IOException {
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/", this::handle);
        server.start();
        gateway = new MercadoPagoGatewayImpl(TOKEN, "http://127.0.0.1:" + server.getAddress().getPort(), PICTURE, Clock.fixed(Instant.parse("2026-10-30T12:00:00Z"), ZoneOffset.UTC));
    }

    @AfterEach
    void stopServer() {
        server.stop(0);
    }

    private void handle(HttpExchange exchange) throws IOException {
        String key = exchange.getRequestMethod() + " " + exchange.getRequestURI().getRawPath();
        requestLines.add(exchange.getRequestMethod() + " " + exchange.getRequestURI());
        authHeaders.add(exchange.getRequestHeaders().getFirst("Authorization"));
        contentTypes.add(exchange.getRequestHeaders().getFirst("Content-Type"));
        bodies.add(new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8));
        if (key.startsWith("GET /v1/payments/") && !key.equals("GET /v1/payments/search")) {
            paymentLookups.incrementAndGet();
        }
        String response = routes.getOrDefault(key, "{}");
        int status = statusByRoute.getOrDefault(key, 200);
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(status, bytes.length);
        exchange.getResponseBody().write(bytes);
        exchange.close();
    }

    private static String payment(String id, String status, String vectorHashInMetadata) {
        String metadata = vectorHashInMetadata == null ? "{}" : "{\"vector_hash\":\"" + vectorHashInMetadata + "\"}";
        return "{\"id\":" + id + ",\"status\":\"" + status + "\",\"metadata\":" + metadata + "}";
    }

    @Test
    void createOpensAPreferenceWithNonceHashAndReturnUrls() throws Exception {
        routes.put("POST /checkout/preferences", "{\"id\":\"3804833912-abc\",\"init_point\":\"https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=3804833912-abc\"}");

        PaymentGateway.CheckoutSession session = gateway.create("14.99", "BRL", NONCE, HASH, "https://12axes.vercel.app/results?v=1", "pt");

        assertThat(session.id()).isEqualTo("3804833912-abc");
        assertThat(session.url()).isEqualTo("https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=3804833912-abc");
        assertThat(authHeaders.getFirst()).isEqualTo("Bearer " + TOKEN);
        JsonNode body = JSON.readTree(bodies.getFirst());
        assertThat(body.at("/items/0/unit_price").decimalValue()).isEqualByComparingTo("14.99");
        assertThat(body.at("/items/0/currency_id").asText()).isEqualTo("BRL");
        assertThat(body.at("/items/0/quantity").asInt()).isEqualTo(1);
        assertThat(body.at("/items/0/id").asText()).isEqualTo(HASH);
        assertThat(body.get("external_reference").asText()).isEqualTo(NONCE);
        assertThat(body.at("/metadata/vector_hash").asText()).isEqualTo(HASH);
        assertThat(body.at("/back_urls/success").asText()).isEqualTo("https://12axes.vercel.app/results?v=1&pay=" + NONCE);
        assertThat(body.at("/back_urls/pending").asText()).isEqualTo("https://12axes.vercel.app/results?v=1&pay=" + NONCE);
        assertThat(body.at("/back_urls/failure").asText()).isEqualTo("https://12axes.vercel.app/results?v=1");
        assertThat(body.get("auto_return").asText()).isEqualTo("approved");
    }

    @Test
    void createExcludesBoletoAndCashPaymentsAndInstallments() throws Exception {
        routes.put("POST /checkout/preferences", "{\"id\":\"p\",\"init_point\":\"https://mp/x\"}");
        gateway.create("14.99", "BRL", NONCE, HASH, "https://12axes.vercel.app/results", "pt");
        JsonNode body = JSON.readTree(bodies.getFirst());
        assertThat(body.at("/payment_methods/excluded_payment_types/0/id").asText()).isEqualTo("ticket");
        assertThat(body.at("/payment_methods/excluded_payment_types/1/id").asText()).isEqualTo("atm");
        assertThat(body.at("/payment_methods/installments").asInt()).isEqualTo(1);
        assertThat(body.at("/items/0/description").asText()).isNotBlank();
        assertThat(body.at("/items/0/category_id").asText()).isEqualTo("services");
    }

    @Test
    void createShowsTheProductNameWithAccentsAndItsPicture() throws Exception {
        routes.put("POST /checkout/preferences", "{\"id\":\"p\",\"init_point\":\"https://mp/x\"}");
        gateway.create("14.99", "BRL", NONCE, HASH, "https://12axes.vercel.app/results", "pt");
        JsonNode item = JSON.readTree(bodies.getFirst()).at("/items/0");
        assertThat(item.get("title").asText()).isEqualTo("12 Axes: Relatório Completo");
        assertThat(item.get("picture_url").asText()).isEqualTo(PICTURE);
    }

    @Test
    void createDeclaresUtf8SoAccentsArriveIntact() {
        routes.put("POST /checkout/preferences", "{\"id\":\"p\",\"init_point\":\"https://mp/x\"}");
        gateway.create("14.99", "BRL", NONCE, HASH, "https://12axes.vercel.app/results", "pt");
        assertThat(contentTypes.getFirst()).containsIgnoringCase("charset=utf-8");
    }

    @Test
    void createOmitsThePictureWhenNoneIsConfigured() throws Exception {
        routes.put("POST /checkout/preferences", "{\"id\":\"p\",\"init_point\":\"https://mp/x\"}");
        var noPicture = new MercadoPagoGatewayImpl(TOKEN, "http://127.0.0.1:" + server.getAddress().getPort(), "", Clock.systemUTC());
        noPicture.create("14.99", "BRL", NONCE, HASH, "https://12axes.vercel.app/results", "pt");
        assertThat(JSON.readTree(bodies.getFirst()).at("/items/0").has("picture_url")).isFalse();
    }

    @Test
    void createSkipsAutoReturnForNonHttpsReturnUrls() throws Exception {
        routes.put("POST /checkout/preferences", "{\"id\":\"p\",\"init_point\":\"https://mp/x\"}");
        gateway.create("14.99", "BRL", NONCE, HASH, "http://localhost:5173/results", "pt");
        assertThat(JSON.readTree(bodies.getFirst()).has("auto_return")).isFalse();
    }

    @Test
    void createRefusesAnyCurrencyButBrl() {
        assertThatThrownBy(() -> gateway.create("3.99", "USD", NONCE, HASH, "https://12axes.vercel.app/results", "en"))
                .isInstanceOf(PaymentGatewayException.class);
        assertThat(requestLines).isEmpty();
    }

    @Test
    void createFailsWhenTheResponseHasNoPaymentAddress() {
        routes.put("POST /checkout/preferences", "{\"id\":\"x\"}");
        assertThatThrownBy(() -> gateway.create("14.99", "BRL", NONCE, HASH, "https://12axes.vercel.app/results", "pt"))
                .isInstanceOf(PaymentGatewayException.class);
    }

    @Test
    void apiErrorsBecomeGatewayExceptions() {
        statusByRoute.put("POST /checkout/preferences", 401);
        assertThatThrownBy(() -> gateway.create("14.99", "BRL", NONCE, HASH, "https://12axes.vercel.app/results", "pt"))
                .isInstanceOf(PaymentGatewayException.class)
                .hasMessageContaining("401");
    }

    @Test
    void findByNonceSearchesByExternalReference() {
        routes.put("GET /v1/payments/search", "{\"results\":[" + payment("111", "approved", HASH) + "]}");

        var found = gateway.findByNonce(NONCE);

        assertThat(found).hasValueSatisfying(paid -> {
            assertThat(paid.paymentRef()).isEqualTo("111");
            assertThat(paid.vectorHash()).isEqualTo(HASH);
            assertThat(paid.pending()).isFalse();
        });
        assertThat(requestLines.getFirst()).contains("external_reference=" + NONCE);
    }

    @Test
    void findByNonceReportsPendingPixAsPending() {
        routes.put("GET /v1/payments/search", "{\"results\":[" + payment("222", "pending", HASH) + "]}");
        assertThat(gateway.findByNonce(NONCE)).hasValueSatisfying(paid -> assertThat(paid.pending()).isTrue());
    }

    @Test
    void findByNonceIgnoresRejectedAndPrefersAnApprovedPayment() {
        routes.put("GET /v1/payments/search", "{\"results\":["
                + payment("1", "rejected", HASH) + "," + payment("2", "pending", HASH) + "," + payment("3", "approved", HASH) + "]}");
        assertThat(gateway.findByNonce(NONCE)).hasValueSatisfying(paid -> {
            assertThat(paid.paymentRef()).isEqualTo("3");
            assertThat(paid.pending()).isFalse();
        });
    }

    @Test
    void findByNonceWithOnlyRejectedOrNoPaymentIsEmpty() {
        routes.put("GET /v1/payments/search", "{\"results\":[" + payment("1", "rejected", HASH) + "]}");
        assertThat(gateway.findByNonce(NONCE)).isEmpty();
        routes.put("GET /v1/payments/search", "{\"results\":[]}");
        assertThat(gateway.findByNonce(NONCE)).isEmpty();
    }

    @Test
    void findByNonceReadsTheVectorHashFromTheItemWhenMetadataIsMissing() {
        routes.put("GET /v1/payments/search", "{\"results\":[{\"id\":9,\"status\":\"approved\",\"metadata\":{},\"additional_info\":{\"items\":[{\"id\":\"" + HASH + "\"}]}}]}");
        assertThat(gateway.findByNonce(NONCE)).hasValueSatisfying(paid -> assertThat(paid.vectorHash()).isEqualTo(HASH));
    }

    @Test
    void aRefundedPaymentIsStillFoundSoTheRefundCheckRefusesIt() {
        routes.put("GET /v1/payments/search", "{\"results\":[" + payment("5", "refunded", HASH) + "]}");
        assertThat(gateway.findByNonce(NONCE)).hasValueSatisfying(paid -> assertThat(paid.pending()).isFalse());
    }

    @Test
    void isRefundedIsTrueForRefundedChargedBackOrPartiallyRefunded() {
        routes.put("GET /v1/payments/10", payment("10", "refunded", HASH));
        routes.put("GET /v1/payments/11", payment("11", "charged_back", HASH));
        routes.put("GET /v1/payments/12", "{\"id\":12,\"status\":\"approved\",\"transaction_amount_refunded\":5.0}");
        assertThat(gateway.isRefunded("10")).isTrue();
        assertThat(gateway.isRefunded("11")).isTrue();
        assertThat(gateway.isRefunded("12")).isTrue();
    }

    @Test
    void isRefundedIsFalseForAnApprovedPaymentAndAnswersAreCached() {
        routes.put("GET /v1/payments/20", "{\"id\":20,\"status\":\"approved\",\"transaction_amount_refunded\":0}");
        assertThat(gateway.isRefunded("20")).isFalse();
        assertThat(gateway.isRefunded("20")).isFalse();
        assertThat(paymentLookups.get()).isEqualTo(1);
    }

    @Test
    void referencesFromOtherGatewaysAreNeverBlockedNorLookedUp() {
        assertThat(gateway.isRefunded("pi_3OldStripePayment")).isFalse();
        assertThat(gateway.isRefunded("gift")).isFalse();
        assertThat(gateway.isRefunded(null)).isFalse();
        assertThat(requestLines).isEmpty();
    }

    @Test
    void isRefundedTreatsAnUnknownPaymentAsNotRefundedButOtherErrorsAsFailures() {
        statusByRoute.put("GET /v1/payments/30", 404);
        assertThat(gateway.isRefunded("30")).isFalse();
        statusByRoute.put("GET /v1/payments/31", 500);
        assertThatThrownBy(() -> gateway.isRefunded("31")).isInstanceOf(PaymentGatewayException.class);
    }

    @Test
    void sessionLookupIsNotUsedByThisGateway() {
        assertThat(gateway.findBySession("cs_test_a1B2c3D4e5F6")).isEmpty();
        assertThat(requestLines).isEmpty();
    }
}
