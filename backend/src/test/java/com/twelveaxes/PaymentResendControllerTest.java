package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.payment.EntitlementToken;
import com.twelveaxes.payment.MailSendException;
import com.twelveaxes.payment.PaymentGateway;
import com.twelveaxes.payment.PaymentGatewayException;
import com.twelveaxes.payment.TransactionalMailSender;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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

/** O reenvio manual do e-mail de acesso: confere o segredo, reconsulta o pagamento e manda o e-mail. */
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "app.payments.enabled=true",
        "app.payments.entitlement-secret=0123456789abcdef0123456789abcdef",
        "app.payments.resend-secret=resend-teste",
        // Chamado por voce (curl), sem Origin: o caminho de webhooks tem de deixa-lo passar.
        "app.origin-enforcement=true"
})
@Import(PaymentResendControllerTest.Doubles.class)
class PaymentResendControllerTest {
    private static final String SECRET = "resend-teste";
    private static final String PAY = "txn_01m7tg7n7ajkhnm05482hzy2pb";
    private static final String V = "65,32.5,50,40,30,60,70,50,45,55,35,80";
    private static final String OTHER_V = "1,1,1,1,1,1,1,1,1,1,1,1";
    private static final String HASH = "18d01bba7aa7c961b486b74323df99109415dcc72a22ab6fab349e49f3ac102b";
    private static final String RESULT_URL = "http://localhost:5173/results?est=50&rep=85";
    private static final ObjectMapper JSON = new ObjectMapper();

    static class FakeGateway implements PaymentGateway {
        final Map<String, PaidPayment> byNonce = new HashMap<>();
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

    private static void paid(String email, String returnUrl) {
        GATEWAY.byNonce.put(PAY, new PaymentGateway.PaidPayment(PAY, HASH, false, email, returnUrl));
    }

    private static void paid(String email, String returnUrl, String lang) {
        GATEWAY.byNonce.put(PAY, new PaymentGateway.PaidPayment(PAY, HASH, false, email, returnUrl, lang));
    }

    private org.springframework.test.web.servlet.ResultActions call(Map<String, String> fields) throws Exception {
        return mockMvc.perform(post("/api/webhooks/resend-access")
                .contentType(MediaType.APPLICATION_JSON)
                .content(JSON.writeValueAsString(fields)));
    }

    private static Map<String, String> request(String secret, String pay, String v, String email, String returnUrl, String lang) {
        Map<String, String> fields = new HashMap<>();
        fields.put("secret", secret);
        fields.put("pay", pay);
        fields.put("v", v);
        if (email != null) {
            fields.put("email", email);
        }
        if (returnUrl != null) {
            fields.put("returnUrl", returnUrl);
        }
        if (lang != null) {
            fields.put("lang", lang);
        }
        return fields;
    }

    @Test
    void resendsTheEnglishAccessEmailUsingTheEmailAndUrlSavedInThePayment() throws Exception {
        paid("michael@exemplo.com", RESULT_URL);

        call(request(SECRET, PAY, V, null, null, null)).andExpect(status().isOk());

        assertThat(MAILER.sent).hasSize(1);
        FakeMailer.Sent mail = MAILER.sent.getFirst();
        assertThat(mail.to()).isEqualTo("michael@exemplo.com");
        assertThat(mail.key()).isEqualTo("resend-" + PAY);
        assertThat(mail.subject()).isEqualTo("Your full 12 Axes report");
        assertThat(mail.html()).contains("Open my report");
        String link = mail.text().lines().filter(line -> line.startsWith("http")).findFirst().orElseThrow();
        assertThat(link).startsWith(RESULT_URL + "&access=");
        String token = URLDecoder.decode(link.substring((RESULT_URL + "&access=").length()), StandardCharsets.UTF_8);
        assertThat(entitlementToken.isValidFor(token, HASH)).isTrue();
    }

    @Test
    void sendsThePortugueseEmailWhenLangIsPt() throws Exception {
        paid("ana@exemplo.com", RESULT_URL);

        call(request(SECRET, PAY, V, null, null, "pt")).andExpect(status().isOk());

        assertThat(MAILER.sent).hasSize(1);
        assertThat(MAILER.sent.getFirst().subject()).isEqualTo("Seu relatório completo do 12 Axes");
    }

    @Test
    void usesTheLanguageSavedInThePaymentWhenTheRequestDoesNotOverrideIt() throws Exception {
        // Caminho real de producao: o idioma vem do que o gateway gravou (a pagina de resultado no momento da compra),
        // nao do pedido de reenvio.
        paid("ana@exemplo.com", RESULT_URL, "es");

        call(request(SECRET, PAY, V, null, null, null)).andExpect(status().isOk());

        assertThat(MAILER.sent).hasSize(1);
        assertThat(MAILER.sent.getFirst().subject()).isEqualTo("Tu informe completo de 12 Axes");
    }

    @Test
    void aLangInTheRequestOverridesAnOldPaymentThatSavedNone() throws Exception {
        paid("ana@exemplo.com", RESULT_URL, null);

        call(request(SECRET, PAY, V, null, null, "de")).andExpect(status().isOk());

        assertThat(MAILER.sent).hasSize(1);
        assertThat(MAILER.sent.getFirst().subject()).isEqualTo("Dein vollständiger 12-Axes-Bericht");
    }

    @Test
    void anUnknownLanguageFallsBackToEnglish() throws Exception {
        paid("ana@exemplo.com", RESULT_URL, "xx");

        call(request(SECRET, PAY, V, null, null, null)).andExpect(status().isOk());

        assertThat(MAILER.sent).hasSize(1);
        assertThat(MAILER.sent.getFirst().subject()).isEqualTo("Your full 12 Axes report");
    }

    @Test
    void anEmailAndReturnUrlGivenInTheRequestFillInForAnOldPaymentThatSavedNone() throws Exception {
        paid(null, null);

        call(request(SECRET, PAY, V, "michael@exemplo.com", RESULT_URL, null)).andExpect(status().isOk());

        assertThat(MAILER.sent).hasSize(1);
        assertThat(MAILER.sent.getFirst().to()).isEqualTo("michael@exemplo.com");
    }

    @Test
    void savedEmailAndUrlWinOverARequestThatRepeatsThem() throws Exception {
        paid("real@exemplo.com", RESULT_URL);

        call(request(SECRET, PAY, V, "real@exemplo.com", RESULT_URL, null)).andExpect(status().isOk());

        assertThat(MAILER.sent).hasSize(1);
        assertThat(MAILER.sent.getFirst().to()).isEqualTo("real@exemplo.com");
    }

    @Test
    void aWrongOrMissingSecretIsRefusedAndNothingIsLookedUp() throws Exception {
        paid("ana@exemplo.com", RESULT_URL);

        call(request("errado", PAY, V, null, null, null)).andExpect(status().isForbidden());
        call(request("", PAY, V, null, null, null)).andExpect(status().is4xxClientError());

        assertThat(GATEWAY.lookups).isEmpty();
        assertThat(MAILER.sent).isEmpty();
    }

    @Test
    void aPaymentForAnotherResultIsRefused() throws Exception {
        paid("ana@exemplo.com", RESULT_URL);

        call(request(SECRET, PAY, OTHER_V, null, null, null)).andExpect(status().isForbidden());

        assertThat(MAILER.sent).isEmpty();
    }

    @Test
    void aPendingOrUnknownPaymentIsRefused() throws Exception {
        GATEWAY.byNonce.put(PAY, new PaymentGateway.PaidPayment(PAY, HASH, true, "ana@exemplo.com", RESULT_URL));
        call(request(SECRET, PAY, V, null, null, null)).andExpect(status().isNotFound());

        GATEWAY.byNonce.clear();
        call(request(SECRET, PAY, V, null, null, null)).andExpect(status().isNotFound());

        assertThat(MAILER.sent).isEmpty();
    }

    @Test
    void aGatewayFailureIsServiceUnavailable() throws Exception {
        GATEWAY.down.set(true);
        call(request(SECRET, PAY, V, null, null, null)).andExpect(status().isServiceUnavailable());
        assertThat(MAILER.sent).isEmpty();
    }

    @Test
    void withoutAnyValidEmailTheRequestIsRejected() throws Exception {
        paid(null, RESULT_URL);
        call(request(SECRET, PAY, V, null, null, null)).andExpect(status().isBadRequest());
        assertThat(MAILER.sent).isEmpty();
    }

    @Test
    void aResultAddressOutsideTheSiteIsNeverMailed() throws Exception {
        for (String url : new String[] {null, "", "https://evil.example/results?est=50&rep=85", RESULT_URL + "#access=x", "javascript:alert(1)"}) {
            paid("ana@exemplo.com", null);
            call(request(SECRET, PAY, V, null, url, null)).andExpect(status().isBadRequest());
        }
        assertThat(MAILER.sent).isEmpty();
    }

    @Test
    void aMailFailureIsBadGateway() throws Exception {
        paid("ana@exemplo.com", RESULT_URL);
        MAILER.failing.set(true);

        call(request(SECRET, PAY, V, null, null, null)).andExpect(status().isBadGateway());
    }

    @Test
    void anInvalidPayFormatIsRejectedBeforeAnyLookup() throws Exception {
        call(request(SECRET, "../../etc", V, null, null, null)).andExpect(status().isBadRequest());
        assertThat(GATEWAY.lookups).isEmpty();
    }
}
