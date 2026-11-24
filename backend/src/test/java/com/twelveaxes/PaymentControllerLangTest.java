package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.payment.PaymentGateway;
import com.twelveaxes.payment.PaymentGatewayException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
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

/**
 * Com a venda em dolar liberada (ao contrario de {@link PaymentControllerTest}, onde USD nao tem preco): o idioma que
 * chega ao gateway e o real da pagina (es/de/it/ru/fr), nao so "pt"/"en" normalizado, porque e ele quem decide o
 * idioma do e-mail de acesso depois (ver {@link com.twelveaxes.payment.AccessEmail}).
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "app.payments.enabled=true",
        "app.payments.entitlement-secret=0123456789abcdef0123456789abcdef",
        "app.payments.price-brl=14.99",
        "app.payments.price-usd=3.99"
})
@Import(PaymentControllerLangTest.GatewayConfig.class)
class PaymentControllerLangTest {
    private static final String VECTOR = "65,32.5,50,40,30,60,70,50,45,55,35,80";
    private static final String RETURN_URL = "http://localhost:5173/results?v=1";
    private static final String SESSION = "txn_01test";

    static class FakeGateway implements PaymentGateway {
        record Call(String currency, String lang) {
        }

        final List<Call> creates = new ArrayList<>();
        final Map<String, PaidPayment> byNonce = new ConcurrentHashMap<>();

        void reset() {
            creates.clear();
        }

        @Override
        public CheckoutSession create(String amount, String currency, String nonce, String vectorHash, String returnUrl, String lang) {
            creates.add(new Call(currency, lang));
            return new CheckoutSession(SESSION, "https://checkout.paddle.com/" + SESSION);
        }

        @Override
        public Optional<PaidPayment> findBySession(String sessionId) {
            return Optional.empty();
        }

        @Override
        public Optional<PaidPayment> findByNonce(String nonce) {
            return Optional.ofNullable(byNonce.get(nonce));
        }

        @Override
        public boolean isRefunded(String paymentRef) {
            return false;
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

    @BeforeEach
    void reset() {
        GATEWAY.reset();
    }

    private String checkoutBody(String lang) throws Exception {
        return objectMapper.writeValueAsString(Map.of("v", VECTOR, "lang", lang, "returnUrl", RETURN_URL));
    }

    @Test
    void theRealLanguageOfThePageIsSavedEvenThoughTheCurrencyIsAlwaysDollarForNonPortuguese() throws Exception {
        for (String lang : List.of("es", "de", "it", "ru", "fr")) {
            mockMvc.perform(post("/api/checkout").contentType(MediaType.APPLICATION_JSON).content(checkoutBody(lang)))
                    .andExpect(status().isOk());
        }

        assertThat(GATEWAY.creates).hasSize(5);
        for (FakeGateway.Call call : GATEWAY.creates) {
            assertThat(call.currency()).isEqualTo("USD");
        }
        assertThat(GATEWAY.creates.stream().map(FakeGateway.Call::lang)).containsExactly("es", "de", "it", "ru", "fr");
    }

    @Test
    void anUnrecognizedLanguageFallsBackToPortugueseForTheGatewayToo() throws Exception {
        // QuizDataService.normalizeLang trata qualquer idioma desconhecido como portugues (o idioma padrao do site).
        mockMvc.perform(post("/api/checkout").contentType(MediaType.APPLICATION_JSON).content(checkoutBody("xx")))
                .andExpect(status().isOk());

        assertThat(GATEWAY.creates.getFirst().lang()).isEqualTo("pt");
    }
}
