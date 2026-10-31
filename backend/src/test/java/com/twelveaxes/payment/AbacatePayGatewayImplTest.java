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

/** O gateway da AbacatePay contra um servidor HTTP local que imita a API (sem rede, sem credencial). */
class AbacatePayGatewayImplTest {
    private static final String KEY = "abc_dev_chave_teste";
    private static final String PRODUCT = "prod_relatorio123";
    private static final String BILL = "bill_abc123xyz";
    private static final String NONCE = "AbCdEfGhIjKlMnOpQrSt";
    private static final String HASH = "18d01bba7aa7c961b486b74323df99109415dcc72a22ab6fab349e49f3ac102b";
    private static final ObjectMapper JSON = new ObjectMapper();

    private HttpServer server;
    private AbacatePayGatewayImpl gateway;
    private final List<String> requestLines = new ArrayList<>();
    private final List<String> authHeaders = new ArrayList<>();
    private final List<String> bodies = new ArrayList<>();
    private final Map<String, String> routes = new ConcurrentHashMap<>();
    private final Map<String, Integer> statusByRoute = new ConcurrentHashMap<>();
    private final AtomicInteger lookups = new AtomicInteger();

    @BeforeEach
    void startServer() throws IOException {
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/", this::handle);
        server.start();
        gateway = new AbacatePayGatewayImpl(KEY, PRODUCT, "http://127.0.0.1:" + server.getAddress().getPort(), Clock.fixed(Instant.parse("2026-10-30T12:00:00Z"), ZoneOffset.UTC));
    }

    @AfterEach
    void stopServer() {
        server.stop(0);
    }

    private void handle(HttpExchange exchange) throws IOException {
        String key = exchange.getRequestMethod() + " " + exchange.getRequestURI().getRawPath();
        requestLines.add(exchange.getRequestMethod() + " " + exchange.getRequestURI());
        authHeaders.add(exchange.getRequestHeaders().getFirst("Authorization"));
        bodies.add(new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8));
        if (key.equals("GET /checkouts/list")) {
            lookups.incrementAndGet();
        }
        String response = routes.getOrDefault(key, "{\"data\":[],\"success\":true,\"error\":null}");
        int status = statusByRoute.getOrDefault(key, 200);
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(status, bytes.length);
        exchange.getResponseBody().write(bytes);
        exchange.close();
    }

    private static String checkout(String status, String vectorHash) {
        String metadata = vectorHash == null ? "{}" : "{\"vector_hash\":\"" + vectorHash + "\"}";
        return "{\"id\":\"" + BILL + "\",\"status\":\"" + status + "\",\"metadata\":" + metadata + "}";
    }

    private static String list(String... checkouts) {
        return "{\"data\":[" + String.join(",", checkouts) + "],\"success\":true,\"error\":null}";
    }

    @Test
    void createOpensACheckoutOfTheProductWithCodeHashAndReturnUrls() throws Exception {
        routes.put("POST /checkouts/create", "{\"data\":{\"id\":\"" + BILL + "\",\"url\":\"https://app.abacatepay.com/pay/" + BILL + "\",\"status\":\"PENDING\"},\"success\":true,\"error\":null}");

        PaymentGateway.CheckoutSession session = gateway.create("14.99", "BRL", NONCE, HASH, "https://12axes.vercel.app/results?est=1", "pt");

        assertThat(session.id()).isEqualTo(BILL);
        assertThat(session.url()).isEqualTo("https://app.abacatepay.com/pay/" + BILL + "?skip_customer=true&skip_address=true");
        assertThat(authHeaders.getFirst()).isEqualTo("Bearer " + KEY);
        JsonNode body = JSON.readTree(bodies.getFirst());
        assertThat(body.at("/items/0/id").asText()).isEqualTo(PRODUCT);
        assertThat(body.at("/items/0/quantity").asInt()).isEqualTo(1);
        assertThat(body.at("/methods/0").asText()).isEqualTo("PIX");
        assertThat(body.at("/methods").size()).isEqualTo(1);
        assertThat(body.at("/externalId").asText()).isEqualTo(NONCE);
        assertThat(body.at("/metadata/vector_hash").asText()).isEqualTo(HASH);
        assertThat(body.at("/metadata/nonce").asText()).isEqualTo(NONCE);
        assertThat(body.at("/completionUrl").asText()).isEqualTo("https://12axes.vercel.app/results?est=1&pay=" + NONCE);
        assertThat(body.at("/returnUrl").asText()).isEqualTo("https://12axes.vercel.app/results?est=1");
    }

    @Test
    void createWithAnEmailRegistersTheBuyerWithOnlyTheEmailAndLinksTheCheckoutToThem() throws Exception {
        routes.put("POST /customers/create", "{\"data\":{\"id\":\"cust_abc123\",\"email\":\"a@b.com\"},\"success\":true,\"error\":null}");
        routes.put("POST /checkouts/create", "{\"data\":{\"id\":\"" + BILL + "\",\"url\":\"https://app.abacatepay.com/pay/" + BILL + "\"},\"success\":true}");

        gateway.create("14.99", "BRL", NONCE, HASH, "https://12axes.vercel.app/results", "pt", " a@b.com ");

        assertThat(requestLines).containsExactly("POST /customers/create", "POST /checkouts/create");
        JsonNode customer = JSON.readTree(bodies.get(0));
        assertThat(customer.fieldNames()).toIterable().containsExactly("email");
        assertThat(customer.at("/email").asText()).isEqualTo("a@b.com");
        assertThat(JSON.readTree(bodies.get(1)).at("/customerId").asText()).isEqualTo("cust_abc123");
    }

    @Test
    void createWithoutAnEmailDoesNotRegisterAnyBuyer() throws Exception {
        routes.put("POST /checkouts/create", "{\"data\":{\"id\":\"" + BILL + "\",\"url\":\"https://app.abacatepay.com/pay/" + BILL + "\"},\"success\":true}");

        gateway.create("14.99", "BRL", NONCE, HASH, "https://12axes.vercel.app/results", "pt", null);

        assertThat(requestLines).containsExactly("POST /checkouts/create");
        assertThat(JSON.readTree(bodies.getFirst()).has("customerId")).isFalse();
    }

    @Test
    void createFailsWhenTheBuyerRegistrationReturnsNoId() {
        routes.put("POST /customers/create", "{\"data\":{},\"success\":true}");
        assertThatThrownBy(() -> gateway.create("14.99", "BRL", NONCE, HASH, "https://12axes.vercel.app/results", "pt", "a@b.com"))
                .isInstanceOf(PaymentGatewayException.class);
        assertThat(requestLines).containsExactly("POST /customers/create");
    }

    @Test
    void createRefusesAnyCurrencyButBrl() {
        assertThatThrownBy(() -> gateway.create("3.99", "USD", NONCE, HASH, "https://12axes.vercel.app/results", "en"))
                .isInstanceOf(PaymentGatewayException.class);
        assertThat(requestLines).isEmpty();
    }

    @Test
    void createFailsWhenTheResponseHasNoPaymentAddress() {
        routes.put("POST /checkouts/create", "{\"data\":{\"id\":\"" + BILL + "\"},\"success\":true}");
        assertThatThrownBy(() -> gateway.create("14.99", "BRL", NONCE, HASH, "https://12axes.vercel.app/results", "pt"))
                .isInstanceOf(PaymentGatewayException.class);
    }

    @Test
    void apiErrorsBecomeGatewayExceptions() {
        statusByRoute.put("POST /checkouts/create", 403);
        assertThatThrownBy(() -> gateway.create("14.99", "BRL", NONCE, HASH, "https://12axes.vercel.app/results", "pt"))
                .isInstanceOf(PaymentGatewayException.class)
                .hasMessageContaining("403");
    }

    @Test
    void aPaidOrRedeemedCheckoutUnlocksWithItsVectorHash() {
        for (String status : new String[] {"PAID", "REDEEMED"}) {
            routes.put("GET /checkouts/list", list(checkout(status, HASH)));
            assertThat(gateway.findByNonce(NONCE)).as(status).hasValueSatisfying(paid -> {
                assertThat(paid.paymentRef()).isEqualTo(BILL);
                assertThat(paid.vectorHash()).isEqualTo(HASH);
                assertThat(paid.pending()).isFalse();
            });
        }
        assertThat(requestLines.getFirst()).contains("externalId=" + NONCE);
    }

    @Test
    void aPendingCheckoutIsPendingSoTheClientKeepsWaitingForThePix() {
        routes.put("GET /checkouts/list", list(checkout("PENDING", HASH)));
        assertThat(gateway.findByNonce(NONCE)).hasValueSatisfying(paid -> assertThat(paid.pending()).isTrue());
    }

    @Test
    void aPaidCheckoutBeatsAnOlderPendingOne() {
        routes.put("GET /checkouts/list", list(checkout("PENDING", HASH), checkout("PAID", HASH)));
        assertThat(gateway.findByNonce(NONCE)).hasValueSatisfying(paid -> assertThat(paid.pending()).isFalse());
    }

    @Test
    void anExpiredOrCancelledCheckoutDoesNotUnlock() {
        for (String status : new String[] {"EXPIRED", "CANCELLED"}) {
            routes.put("GET /checkouts/list", list(checkout(status, HASH)));
            assertThat(gateway.findByNonce(NONCE)).as(status).isEmpty();
        }
    }

    @Test
    void aCheckoutWithoutHashCarriesAnEmptyOneSoTheControllerRefusesIt() {
        routes.put("GET /checkouts/list", list(checkout("PAID", null)));
        assertThat(gateway.findByNonce(NONCE)).hasValueSatisfying(paid -> assertThat(paid.vectorHash()).isEmpty());
    }

    @Test
    void noCheckoutForTheCodeIsEmptyAndBlankCodesNeverReachTheApi() {
        assertThat(gateway.findByNonce(NONCE)).isEmpty();
        requestLines.clear();
        assertThat(gateway.findByNonce(null)).isEmpty();
        assertThat(gateway.findByNonce(" ")).isEmpty();
        assertThat(requestLines).isEmpty();
    }

    @Test
    void isRefundedIsTrueForARefundedCheckout() {
        routes.put("GET /checkouts/list", list(checkout("REFUNDED", HASH)));
        assertThat(gateway.isRefunded(BILL)).isTrue();
        assertThat(requestLines.getFirst()).contains("id=" + BILL);
    }

    @Test
    void isRefundedIsFalseForAPaidCheckoutAndAnswersAreCached() {
        routes.put("GET /checkouts/list", list(checkout("PAID", HASH)));
        assertThat(gateway.isRefunded(BILL)).isFalse();
        assertThat(gateway.isRefunded(BILL)).isFalse();
        assertThat(lookups.get()).isEqualTo(1);
    }

    @Test
    void referencesFromOtherGatewaysAreNeverBlockedNorLookedUp() {
        assertThat(gateway.isRefunded("185778195777")).isFalse();
        assertThat(gateway.isRefunded("txn_01m66hdb2rreyh7xd6mjvm40yr")).isFalse();
        assertThat(gateway.isRefunded("gift")).isFalse();
        assertThat(gateway.isRefunded("bill_../x")).isFalse();
        assertThat(gateway.isRefunded(null)).isFalse();
        assertThat(requestLines).isEmpty();
    }

    @Test
    void refundCheckFailuresAreGatewayExceptions() {
        statusByRoute.put("GET /checkouts/list", 500);
        assertThatThrownBy(() -> gateway.isRefunded(BILL)).isInstanceOf(PaymentGatewayException.class);
    }

    @Test
    void sessionLookupIsNotUsedByThisGateway() {
        assertThat(gateway.findBySession("cs_test_a1B2c3D4e5F6")).isEmpty();
        assertThat(requestLines).isEmpty();
    }
}
