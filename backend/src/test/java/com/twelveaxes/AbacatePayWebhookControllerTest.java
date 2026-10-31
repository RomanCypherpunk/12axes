package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.twelveaxes.payment.EntitlementToken;
import com.twelveaxes.payment.MailSendException;
import com.twelveaxes.payment.PaymentGateway;
import com.twelveaxes.payment.PaymentGatewayException;
import com.twelveaxes.payment.TransactionalMailSender;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
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

/** O aviso de pagamento da AbacatePay: confere o segredo, reconsulta o pagamento e manda o e-mail com o acesso. */
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "app.payments.enabled=true",
        "app.payments.entitlement-secret=0123456789abcdef0123456789abcdef",
        "app.payments.abacatepay-webhook-secret=whsec-teste",
        // O webhook vem de um servidor, sem Origin: o filtro de origem tem de deixa-lo passar.
        "app.origin-enforcement=true"
})
@Import(AbacatePayWebhookControllerTest.Doubles.class)
class AbacatePayWebhookControllerTest {
    private static final String SECRET = "whsec-teste";
    private static final String NONCE = "AbCdEfGhIjKlMnOpQrSt";
    private static final String HASH = "18d01bba7aa7c961b486b74323df99109415dcc72a22ab6fab349e49f3ac102b";
    private static final String RESULT_URL = "http://localhost:5173/results?est=50&rep=85";
    private static final String BILL = "bill_abc123xyz";

    static class FakeGateway implements PaymentGateway {
        final Map<String, PaidPayment> byNonce = new ConcurrentHashMap<>();
        final List<String> lookups = new ArrayList<>();
        final AtomicBoolean down = new AtomicBoolean();

        void reset() {
            byNonce.clear();
            lookups.clear();
            down.set(false);
        }

        @Override
        public CheckoutSession create(String amount, String currency, String nonce, String vectorHash, String returnUrl, String lang) {
            throw new UnsupportedOperationException();
        }

        @Override
        public Optional<PaidPayment> findBySession(String sessionId) {
            return Optional.empty();
        }

        @Override
        public Optional<PaidPayment> findByNonce(String nonce) {
            lookups.add(nonce);
            if (down.get()) {
                throw new PaymentGatewayException("fora do ar", new RuntimeException("boom"));
            }
            return Optional.ofNullable(byNonce.get(nonce));
        }

        @Override
        public boolean isRefunded(String paymentRef) {
            return false;
        }
    }

    static class FakeMailer implements TransactionalMailSender {
        record Sent(String to, String subject, String html, String text, String key) {
        }

        final List<Sent> sent = new ArrayList<>();
        final AtomicBoolean failing = new AtomicBoolean();

        void reset() {
            sent.clear();
            failing.set(false);
        }

        @Override
        public void send(String to, String subject, String html, String text, String idempotencyKey) {
            if (failing.get()) {
                throw new MailSendException("Resend fora do ar", new RuntimeException("boom"));
            }
            sent.add(new Sent(to, subject, html, text, idempotencyKey));
        }
    }

    static final FakeGateway GATEWAY = new FakeGateway();
    static final FakeMailer MAILER = new FakeMailer();

    @TestConfiguration
    static class Doubles {
        @Bean
        @Primary
        PaymentGateway fakeGateway() {
            return GATEWAY;
        }

        @Bean
        @Primary
        TransactionalMailSender fakeMailer() {
            return MAILER;
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EntitlementToken entitlementToken;

    @BeforeEach
    void reset() {
        GATEWAY.reset();
        MAILER.reset();
    }

    private static String completed(String externalId) {
        return "{\"event\":\"checkout.completed\",\"apiVersion\":2,\"devMode\":false,\"data\":{\"checkout\":{\"id\":\"" + BILL
                + "\",\"externalId\":\"" + externalId + "\",\"status\":\"PAID\"},\"customer\":{\"email\":\"intruso@exemplo.com\"}}}";
    }

    private org.springframework.test.web.servlet.ResultActions call(String secret, String body) throws Exception {
        var request = post("/api/webhooks/abacatepay").contentType(MediaType.APPLICATION_JSON).content(body);
        if (secret != null) {
            request = request.param("webhookSecret", secret);
        }
        return mockMvc.perform(request);
    }

    private static void paid(String email, String returnUrl) {
        GATEWAY.byNonce.put(NONCE, new PaymentGateway.PaidPayment(BILL, HASH, false, email, returnUrl));
    }

    @Test
    void aPaidCheckoutSendsTheAccessEmailToTheEmailSavedInTheCheckout() throws Exception {
        paid("ana@exemplo.com", RESULT_URL);

        call(SECRET, completed(NONCE)).andExpect(status().isOk());

        assertThat(MAILER.sent).hasSize(1);
        FakeMailer.Sent mail = MAILER.sent.getFirst();
        // O destinatario vem do metadata gravado pelo servidor, nunca do corpo do aviso.
        assertThat(mail.to()).isEqualTo("ana@exemplo.com");
        assertThat(mail.key()).isEqualTo("abacatepay-" + BILL);
        assertThat(mail.subject()).isEqualTo("Seu relatório completo do 12 Axes");
        assertThat(mail.html()).contains("Abrir meu relatório").contains("est=50&amp;rep=85#access=");
        String link = mail.text().lines().filter(line -> line.startsWith("http")).findFirst().orElseThrow();
        assertThat(link).startsWith(RESULT_URL + "#access=");
        String token = URLDecoder.decode(link.substring((RESULT_URL + "#access=").length()), StandardCharsets.UTF_8);
        assertThat(entitlementToken.isValidFor(token, HASH)).isTrue();
    }

    @Test
    void theWebhookNeedsNoOriginBecauseTheSecretAuthenticatesIt() throws Exception {
        paid("ana@exemplo.com", RESULT_URL);
        // Sem Origin nem User-Agent, com a protecao de /api/** ligada: o caminho de webhooks tem de passar.
        call(SECRET, completed(NONCE)).andExpect(status().isOk());
        assertThat(MAILER.sent).hasSize(1);
    }

    @Test
    void aWrongOrMissingSecretIsRefusedAndNothingIsLookedUp() throws Exception {
        paid("ana@exemplo.com", RESULT_URL);

        call("errado", completed(NONCE)).andExpect(status().isUnauthorized());
        call(null, completed(NONCE)).andExpect(status().isUnauthorized());

        assertThat(GATEWAY.lookups).isEmpty();
        assertThat(MAILER.sent).isEmpty();
    }

    @Test
    void eventsOtherThanCompletedAreAcknowledgedAndIgnored() throws Exception {
        paid("ana@exemplo.com", RESULT_URL);

        call(SECRET, completed(NONCE).replace("checkout.completed", "checkout.refunded")).andExpect(status().isOk());

        assertThat(GATEWAY.lookups).isEmpty();
        assertThat(MAILER.sent).isEmpty();
    }

    @Test
    void aChargeThatIsNotFromThisSiteIsAcknowledgedWithoutLookup() throws Exception {
        call(SECRET, completed("pedido-123")).andExpect(status().isOk());
        assertThat(GATEWAY.lookups).isEmpty();
        assertThat(MAILER.sent).isEmpty();
    }

    @Test
    void aPendingOrUnknownPaymentAsksForARetry() throws Exception {
        GATEWAY.byNonce.put(NONCE, new PaymentGateway.PaidPayment(BILL, HASH, true, "ana@exemplo.com", RESULT_URL));
        call(SECRET, completed(NONCE)).andExpect(status().isServiceUnavailable());

        GATEWAY.byNonce.clear();
        call(SECRET, completed(NONCE)).andExpect(status().isServiceUnavailable());

        assertThat(MAILER.sent).isEmpty();
    }

    @Test
    void aGatewayFailureAsksForARetry() throws Exception {
        GATEWAY.down.set(true);
        call(SECRET, completed(NONCE)).andExpect(status().isServiceUnavailable());
        assertThat(MAILER.sent).isEmpty();
    }

    @Test
    void aPaymentWithoutEmailSendsNothingAndIsAcknowledged() throws Exception {
        paid(null, RESULT_URL);
        call(SECRET, completed(NONCE)).andExpect(status().isOk());
        assertThat(MAILER.sent).isEmpty();
    }

    @Test
    void aResultAddressOutsideTheSiteIsNeverMailed() throws Exception {
        for (String url : new String[] {null, "", "https://evil.example/results?est=1", "http://localhost:5173/results#access=x", "javascript:alert(1)"}) {
            paid("ana@exemplo.com", url);
            call(SECRET, completed(NONCE)).andExpect(status().isOk());
        }
        assertThat(MAILER.sent).isEmpty();
    }

    @Test
    void aMailFailureAsksForARetry() throws Exception {
        paid("ana@exemplo.com", RESULT_URL);
        MAILER.failing.set(true);

        call(SECRET, completed(NONCE)).andExpect(status().isBadGateway());

        assertThat(MAILER.sent).isEmpty();
    }

    @Test
    void aMalformedBodyIs400() throws Exception {
        call(SECRET, "isto nao e json").andExpect(status().isBadRequest());
    }
}
