package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.payment.EntitlementToken;
import com.twelveaxes.payment.PaymentGatewayException;
import com.twelveaxes.payment.PaymentGateway;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "app.payments.enabled=true",
        "app.payments.entitlement-secret=0123456789abcdef0123456789abcdef",
        "app.payments.price-brl=14.99",
        "app.payments.price-usd=",
        "app.payments.gift-key=gift-test-key"
})
@Import(PaymentControllerTest.GatewayConfig.class)
class PaymentControllerTest {
    private static final String VECTOR = "65,32.5,50,40,30,60,70,50,45,55,35,80";
    private static final String OTHER_VECTOR = "10,10,10,10,10,10,10,10,10,10,10,10";
    private static final String RETURN_URL = "http://localhost:5173/results?v=1";
    private static final String SESSION = "cs_test_a1B2c3D4e5F6";
    private static final String NONCE = "AbCdEfGhIjKlMnOpQrSt";

    /** Duble do gateway de pagamento: guarda o que recebeu e devolve o que o teste preparar. */
    static class FakeGateway implements PaymentGateway {
        record Call(String amount, String currency, String nonce, String vectorHash, String returnUrl, String lang) {
        }

        final List<Call> creates = new ArrayList<>();
        final Map<String, PaidPayment> bySession = new ConcurrentHashMap<>();
        final Map<String, PaidPayment> byNonce = new ConcurrentHashMap<>();
        final AtomicBoolean down = new AtomicBoolean();
        final AtomicBoolean refunded = new AtomicBoolean();

        void reset() {
            creates.clear();
            bySession.clear();
            byNonce.clear();
            down.set(false);
            refunded.set(false);
        }

        private void failIfDown() {
            if (down.get()) {
                throw new PaymentGatewayException("Gateway fora do ar", new RuntimeException("boom"));
            }
        }

        @Override
        public CheckoutSession create(String amount, String currency, String nonce, String vectorHash, String returnUrl, String lang) {
            failIfDown();
            creates.add(new Call(amount, currency, nonce, vectorHash, returnUrl, lang));
            return new CheckoutSession(SESSION, "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=" + SESSION);
        }

        @Override
        public Optional<PaidPayment> findBySession(String sessionId) {
            failIfDown();
            return Optional.ofNullable(bySession.get(sessionId));
        }

        @Override
        public Optional<PaidPayment> findByNonce(String nonce) {
            failIfDown();
            return Optional.ofNullable(byNonce.get(nonce));
        }

        @Override
        public boolean isRefunded(String paymentRef) {
            return refunded.get();
        }
    }

    static final FakeGateway GATEWAY = new FakeGateway();

    @TestConfiguration
    static class GatewayConfig {
        @Bean
        @Primary
        PaymentGateway fakeGateway() {
            return GATEWAY;
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EntitlementToken entitlementToken;

    @BeforeEach
    void resetGateway() {
        GATEWAY.reset();
    }

    private String checkoutBody(String vector, String lang, String returnUrl, Map<String, Object> extra) throws Exception {
        Map<String, Object> body = new java.util.LinkedHashMap<>(extra);
        body.put("v", vector);
        body.put("lang", lang);
        body.put("returnUrl", returnUrl);
        return objectMapper.writeValueAsString(body);
    }

    private String unlockBody(String vector, String sessionId, String pay) throws Exception {
        Map<String, Object> body = new java.util.LinkedHashMap<>();
        body.put("v", vector);
        if (sessionId != null) {
            body.put("sessionId", sessionId);
        }
        if (pay != null) {
            body.put("pay", pay);
        }
        return objectMapper.writeValueAsString(body);
    }

    private org.springframework.test.web.servlet.ResultActions unlock(String vector, String sessionId, String pay) throws Exception {
        return mockMvc.perform(post("/api/unlock").contentType(MediaType.APPLICATION_JSON).content(unlockBody(vector, sessionId, pay)));
    }

    @Test
    void checkoutReturnsGatewayUrlAndBindsNonceToVectorHash() throws Exception {
        mockMvc.perform(post("/api/checkout").contentType(MediaType.APPLICATION_JSON)
                        .content(checkoutBody(VECTOR, "pt", RETURN_URL, Map.of())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.url").value("https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=" + SESSION));

        assertThat(GATEWAY.creates).hasSize(1);
        FakeGateway.Call call = GATEWAY.creates.getFirst();
        assertThat(call.vectorHash()).isEqualTo("18d01bba7aa7c961b486b74323df99109415dcc72a22ab6fab349e49f3ac102b");
        assertThat(call.nonce()).matches("[A-Za-z0-9_-]{16,64}");
        assertThat(call.returnUrl()).isEqualTo(RETURN_URL);
        assertThat(call.lang()).isEqualTo("pt");
    }

    @Test
    void everyCheckoutGetsItsOwnNonce() throws Exception {
        for (int i = 0; i < 2; i++) {
            mockMvc.perform(post("/api/checkout").contentType(MediaType.APPLICATION_JSON)
                    .content(checkoutBody(VECTOR, "pt", RETURN_URL, Map.of()))).andExpect(status().isOk());
        }
        assertThat(GATEWAY.creates.get(0).nonce()).isNotEqualTo(GATEWAY.creates.get(1).nonce());
    }

    @Test
    void checkoutRejectsReturnUrlOutsideAllowedOrigins() throws Exception {
        for (String url : new String[] {"https://evil.example.com/results", "http://localhost:5173.evil.com/x", "javascript:alert(1)",
                "/results", "http://localhost:5173/results#bussola"}) {
            mockMvc.perform(post("/api/checkout").contentType(MediaType.APPLICATION_JSON)
                            .content(checkoutBody(VECTOR, "pt", url, Map.of())))
                    .andExpect(status().isBadRequest());
        }
        assertThat(GATEWAY.creates).isEmpty();
    }

    @Test
    void checkoutUsesBrlPriceForPtAndIgnoresPriceFromClient() throws Exception {
        mockMvc.perform(post("/api/checkout").contentType(MediaType.APPLICATION_JSON)
                        .content(checkoutBody(VECTOR, "pt", RETURN_URL, Map.of("priceId", "price_cheap", "amount", 1, "price", "0.01"))))
                .andExpect(status().isOk());

        assertThat(GATEWAY.creates.getFirst().amount()).isEqualTo("14.99");
        assertThat(GATEWAY.creates.getFirst().currency()).isEqualTo("BRL");
    }

    @Test
    void checkoutAcceptsAWellFormedEmailAndRefusesAMalformedOne() throws Exception {
        mockMvc.perform(post("/api/checkout").contentType(MediaType.APPLICATION_JSON)
                        .content(checkoutBody(VECTOR, "pt", RETURN_URL, Map.of("email", "ana@exemplo.com.br"))))
                .andExpect(status().isOk());
        for (String email : new String[] {"sem-arroba", "a@b", "a b@c.com", "a@@c.com"}) {
            mockMvc.perform(post("/api/checkout").contentType(MediaType.APPLICATION_JSON)
                            .content(checkoutBody(VECTOR, "pt", RETURN_URL, Map.of("email", email))))
                    .andExpect(status().isBadRequest());
        }
    }

    @Test
    void checkoutInACurrencyWithoutPriceIs404() throws Exception {
        // USD nao esta liberado (sem preco): a moeda simplesmente nao e vendida.
        mockMvc.perform(post("/api/checkout").contentType(MediaType.APPLICATION_JSON)
                        .content(checkoutBody(VECTOR, "en", RETURN_URL, Map.of())))
                .andExpect(status().isNotFound());
        assertThat(GATEWAY.creates).isEmpty();
    }

    @Test
    void unlockBySessionIssuesTokenForThatVector() throws Exception {
        String vectorHash = hashOf(VECTOR);
        GATEWAY.bySession.put(SESSION, new PaymentGateway.PaidPayment("pi_3Paid", vectorHash, false));

        String body = unlock(VECTOR, SESSION, null).andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andReturn().getResponse().getContentAsString();

        String token = objectMapper.readTree(body).get("token").asText();
        assertThat(entitlementToken.verify(token, vectorHash)).get().extracting(EntitlementToken.Claims::paymentRef).isEqualTo("pi_3Paid");
        assertThat(entitlementToken.isValidFor(token, hashOf(OTHER_VECTOR))).isFalse();
    }

    @Test
    void unlockByNonceIssuesToken() throws Exception {
        GATEWAY.byNonce.put(NONCE, new PaymentGateway.PaidPayment("pi_3Paid", hashOf(VECTOR), false));

        unlock(VECTOR, null, NONCE).andExpect(status().isOk()).andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void unlockRejectsPaymentBoundToOtherVector() throws Exception {
        GATEWAY.bySession.put(SESSION, new PaymentGateway.PaidPayment("pi_3Paid", hashOf(VECTOR), false));

        unlock(OTHER_VECTOR, SESSION, null).andExpect(status().isForbidden());
    }

    @Test
    void unlockPendingPixReturns402() throws Exception {
        GATEWAY.bySession.put(SESSION, new PaymentGateway.PaidPayment("pi_3Pix", hashOf(VECTOR), true));

        unlock(VECTOR, SESSION, null).andExpect(status().isPaymentRequired());
    }

    @Test
    void unlockUnpaidOrUnknownReturns402() throws Exception {
        unlock(VECTOR, SESSION, null).andExpect(status().isPaymentRequired());
        unlock(VECTOR, null, NONCE).andExpect(status().isPaymentRequired());
    }

    @Test
    void unlockReturns503WhenGatewayFails() throws Exception {
        GATEWAY.down.set(true);

        unlock(VECTOR, SESSION, null).andExpect(status().isServiceUnavailable());
        mockMvc.perform(post("/api/checkout").contentType(MediaType.APPLICATION_JSON)
                        .content(checkoutBody(VECTOR, "pt", RETURN_URL, Map.of())))
                .andExpect(status().isServiceUnavailable());
    }

    @Test
    void unlockDoesNotIssueTokenForARefundedPayment() throws Exception {
        GATEWAY.bySession.put(SESSION, new PaymentGateway.PaidPayment("pi_3Paid", hashOf(VECTOR), false));
        GATEWAY.refunded.set(true);

        unlock(VECTOR, SESSION, null).andExpect(status().isForbidden());
    }

    @Test
    void unlockNeedsExactlyOneOfSessionOrPayAndValidFormats() throws Exception {
        unlock(VECTOR, null, null).andExpect(status().isBadRequest());
        unlock(VECTOR, SESSION, NONCE).andExpect(status().isBadRequest());
        unlock(VECTOR, "not-a-session", null).andExpect(status().isBadRequest());
        // o nonce vai para uma busca do gateway: aspas e espacos nunca passam
        unlock(VECTOR, null, "x' OR metadata['a']:'b").andExpect(status().isBadRequest());
    }

    private org.springframework.test.web.servlet.ResultActions unlockGift(String vector, String gift, String pay) throws Exception {
        Map<String, Object> body = new java.util.LinkedHashMap<>();
        body.put("v", vector);
        body.put("gift", gift);
        if (pay != null) {
            body.put("pay", pay);
        }
        return mockMvc.perform(post("/api/unlock").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(body)));
    }

    @Test
    void giftKeyIssuesTokenForThatVectorWithoutCallingGateway() throws Exception {
        String body = unlockGift(VECTOR, "gift-test-key", null).andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        String token = objectMapper.readTree(body).get("token").asText();
        assertThat(entitlementToken.verify(token, hashOf(VECTOR))).get().extracting(EntitlementToken.Claims::paymentRef).isEqualTo("gift");
        assertThat(entitlementToken.isValidFor(token, hashOf(OTHER_VECTOR))).isFalse();
    }

    @Test
    void wrongOrMixedGiftIsRefused() throws Exception {
        unlockGift(VECTOR, "outra-senha", null).andExpect(status().isForbidden());
        unlockGift(VECTOR, "gift-test-key", NONCE).andExpect(status().isBadRequest());
    }

    private String paidToken() throws Exception {
        GATEWAY.bySession.put(SESSION, new PaymentGateway.PaidPayment("pi_3Paid", hashOf(VECTOR), false));
        String body = unlock(VECTOR, SESSION, null).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(body).get("token").asText();
    }

    private org.springframework.test.web.servlet.ResultActions renew(String vector, String oldToken, String pay) throws Exception {
        Map<String, Object> body = new java.util.LinkedHashMap<>();
        body.put("v", vector);
        body.put("renew", oldToken);
        if (pay != null) {
            body.put("pay", pay);
        }
        return mockMvc.perform(post("/api/unlock").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(body)));
    }

    @Test
    void renewMovesAPaidAccessToTheEditedResult() throws Exception {
        String oldToken = paidToken();

        String body = renew(OTHER_VECTOR, oldToken, null).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

        String token = objectMapper.readTree(body).get("token").asText();
        assertThat(entitlementToken.verify(token, hashOf(OTHER_VECTOR))).get().extracting(EntitlementToken.Claims::paymentRef).isEqualTo("pi_3Paid");
    }

    @Test
    void renewIsRefusedAfterARefund() throws Exception {
        String oldToken = paidToken();
        GATEWAY.refunded.set(true);

        renew(OTHER_VECTOR, oldToken, null).andExpect(status().isForbidden());
    }

    @Test
    void renewNeedsAValidSignedToken() throws Exception {
        renew(OTHER_VECTOR, "lixo.lixo", null).andExpect(status().isForbidden());
        String valid = paidToken();
        renew(OTHER_VECTOR, valid.substring(0, valid.length() - 2) + "xx", null).andExpect(status().isForbidden());
    }

    @Test
    void renewCannotBeMixedWithAnotherProof() throws Exception {
        renew(OTHER_VECTOR, paidToken(), NONCE).andExpect(status().isBadRequest());
    }

    @Test
    void renewKeepsAGiftAccessWithoutCallingGatewayForRefunds() throws Exception {
        String body = unlockGift(VECTOR, "gift-test-key", null).andReturn().getResponse().getContentAsString();
        String giftToken = objectMapper.readTree(body).get("token").asText();
        GATEWAY.refunded.set(true);

        renew(OTHER_VECTOR, giftToken, null).andExpect(status().isOk());
    }

    @Test
    void paymentResponsesAreNoStore() throws Exception {
        mockMvc.perform(post("/api/checkout").contentType(MediaType.APPLICATION_JSON)
                        .content(checkoutBody(VECTOR, "pt", RETURN_URL, Map.of())))
                .andExpect(header().string("Cache-Control", "no-store"));
        unlock(VECTOR, SESSION, null).andExpect(header().string("Cache-Control", "no-store"));
    }

    private static String hashOf(String vector) {
        return EntitlementToken.hashOf(java.util.Arrays.stream(vector.split(",")).map(Double::valueOf).toList());
    }
}
