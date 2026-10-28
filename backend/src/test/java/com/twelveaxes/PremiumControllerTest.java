package com.twelveaxes;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.model.AnswerValue;
import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.ResultRequest;
import com.twelveaxes.model.SubmittedAnswer;
import com.twelveaxes.payment.EntitlementToken;
import com.twelveaxes.payment.RefundChecker;
import com.twelveaxes.service.QuizDataService;
import com.twelveaxes.service.ScoringService;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
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
        "app.payments.entitlement-secret=0123456789abcdef0123456789abcdef"
})
@Import(PremiumControllerTest.RefundConfig.class)
class PremiumControllerTest {
    private static final String SECRET = "0123456789abcdef0123456789abcdef";
    private static final String PAYMENT = "pi_3Test123";

    static final AtomicBoolean REFUNDED = new AtomicBoolean();
    static final AtomicBoolean CHECKER_FAILS = new AtomicBoolean();
    static final AtomicInteger CHECKS = new AtomicInteger();

    @TestConfiguration
    static class RefundConfig {
        @Bean
        @Primary
        RefundChecker testRefundChecker() {
            return paymentRef -> {
                CHECKS.incrementAndGet();
                if (CHECKER_FAILS.get()) {
                    throw new IllegalStateException("Stripe fora do ar");
                }
                return REFUNDED.get();
            };
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private QuizDataService dataService;

    @Autowired
    private ScoringService scoringService;

    @Autowired
    private EntitlementToken entitlementToken;

    @BeforeEach
    void resetRefund() {
        REFUNDED.set(false);
        CHECKER_FAILS.set(false);
        CHECKS.set(0);
    }

    private ResultRequest mixed() {
        return TestAnswers.mixed(dataService);
    }

    private ResultRequest neutral() {
        List<SubmittedAnswer> answers = dataService.getQuestions().stream()
                .map(question -> new SubmittedAnswer(question.id(), AnswerValue.NEUTRAL))
                .toList();
        return new ResultRequest(answers);
    }

    private String hashOf(ResultRequest request) {
        return EntitlementToken.hashOf(scoringService.score(request, "pt").stream().map(AxisResult::leftPercent).toList());
    }

    // Corpo do relatorio: os 12 valores (obrigatorio) e, opcionalmente, as respostas que os originaram.
    private String body(ResultRequest request, boolean withAnswers) throws Exception {
        String vector = scoringService.score(request, "pt").stream().map(axis -> String.valueOf(axis.leftPercent()))
                .collect(java.util.stream.Collectors.joining(","));
        java.util.Map<String, Object> body = new java.util.LinkedHashMap<>();
        body.put("v", vector);
        if (withAnswers) {
            body.put("answers", request.answers());
        }
        return objectMapper.writeValueAsString(body);
    }

    private org.springframework.test.web.servlet.ResultActions report(ResultRequest request, String token) throws Exception {
        return reportWith(body(request, true), token);
    }

    private org.springframework.test.web.servlet.ResultActions reportWith(String json, String token) throws Exception {
        var builder = post("/api/premium/report")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json);
        if (token != null) {
            builder = builder.header("X-Entitlement", token);
        }
        return mockMvc.perform(builder);
    }

    @Test
    void rejectsRequestWithoutToken() throws Exception {
        report(mixed(), null).andExpect(status().isForbidden());
    }

    @Test
    void rejectsTokenIssuedForAnotherVector() throws Exception {
        String tokenForNeutral = entitlementToken.issue(hashOf(neutral()), PAYMENT, Duration.ofDays(365));

        report(mixed(), tokenForNeutral).andExpect(status().isForbidden());
    }

    @Test
    void rejectsExpiredToken() throws Exception {
        String expired = entitlementToken.issue(hashOf(mixed()), PAYMENT, Duration.ofSeconds(-5));

        report(mixed(), expired).andExpect(status().isForbidden());
    }

    @Test
    void rejectsGarbageToken() throws Exception {
        report(mixed(), "isto-nao-e-um-token").andExpect(status().isForbidden());
    }

    @Test
    void returnsTheReportForAValidToken() throws Exception {
        String token = entitlementToken.issue(hashOf(mixed()), PAYMENT, Duration.ofDays(365));

        report(mixed(), token)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.axisAnalysis.length()").value(12))
                .andExpect(jsonPath("$.topCountries.length()").value(10))
                .andExpect(jsonPath("$.idealGovernment.length()").value(9))
                .andExpect(jsonPath("$.disagreements.length()").value(3))
                .andExpect(jsonPath("$.ranking.ideologies").isNotEmpty())
                .andExpect(jsonPath("$.personalitiesByArea").isNotEmpty());
    }

    @Test
    void worksFromTheTwelveValuesAloneWithoutAnswers() throws Exception {
        String token = entitlementToken.issue(hashOf(mixed()), PAYMENT, Duration.ofDays(365));

        reportWith(body(mixed(), false), token)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.axisAnalysis.length()").value(12))
                .andExpect(jsonPath("$.axisAnalysis[0].impacts.length()").value(0))
                .andExpect(jsonPath("$.axisAnalysis[0].text").isNotEmpty());
    }

    @Test
    void withAnswersTheAxisAnalysisCarriesTheImpacts() throws Exception {
        String token = entitlementToken.issue(hashOf(mixed()), PAYMENT, Duration.ofDays(365));

        report(mixed(), token)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.axisAnalysis[0].impacts.length()").isNotEmpty());
    }

    @Test
    void rejectsAnswersThatDoNotProduceTheGivenVector() throws Exception {
        String token = entitlementToken.issue(hashOf(mixed()), PAYMENT, Duration.ofDays(365));
        java.util.Map<String, Object> mismatch = new java.util.LinkedHashMap<>();
        mismatch.put("v", scoringService.score(mixed(), "pt").stream().map(axis -> String.valueOf(axis.leftPercent()))
                .collect(java.util.stream.Collectors.joining(",")));
        mismatch.put("answers", neutral().answers());

        reportWith(objectMapper.writeValueAsString(mismatch), token).andExpect(status().isBadRequest());
    }

    @Test
    void rejectsAMalformedVector() throws Exception {
        reportWith("{\"v\":\"1,2,3\"}", "qualquer").andExpect(status().isBadRequest());
        reportWith("{\"v\":\"a,b\"}", "qualquer").andExpect(status().isBadRequest());
        reportWith("{}", "qualquer").andExpect(status().isBadRequest());
    }

    @Test
    void doesNotAcceptTheSameTokenForADifferentResult() throws Exception {
        String token = entitlementToken.issue(hashOf(mixed()), PAYMENT, Duration.ofDays(365));

        report(neutral(), token).andExpect(status().isForbidden());
    }

    @Test
    void rejectsARefundedPaymentWithinSevenDays() throws Exception {
        REFUNDED.set(true);
        String token = entitlementToken.issue(hashOf(mixed()), PAYMENT, Duration.ofDays(365));

        report(mixed(), token).andExpect(status().isForbidden());
    }

    @Test
    void doesNotAskStripeAfterEightDays() throws Exception {
        REFUNDED.set(true);
        EntitlementToken nineDaysAgo = new EntitlementToken(SECRET,
                Clock.fixed(Instant.now().minus(Duration.ofDays(9)), ZoneOffset.UTC));
        String old = nineDaysAgo.issue(hashOf(mixed()), PAYMENT, Duration.ofDays(365));

        report(mixed(), old).andExpect(status().isOk());

        org.assertj.core.api.Assertions.assertThat(CHECKS.get()).isZero();
    }

    @Test
    void aStripeFailureDuringTheRefundCheckDoesNotLockOutAPaidUser() throws Exception {
        CHECKER_FAILS.set(true);
        String token = entitlementToken.issue(hashOf(mixed()), PAYMENT, Duration.ofDays(365));

        report(mixed(), token).andExpect(status().isOk());
    }

    @Test
    void theFreeResultNeverCarriesPaidFields() throws Exception {
        String vector = "65,32.5,50,40,30,60,70,50,45,55,35,80";

        mockMvc.perform(get("/api/results/by-axes").param("v", vector))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.axisAnalysis").doesNotExist())
                .andExpect(jsonPath("$.idealGovernment").doesNotExist())
                .andExpect(jsonPath("$.disagreements").doesNotExist())
                .andExpect(jsonPath("$.ranking").doesNotExist())
                .andExpect(jsonPath("$.personalitiesByArea").doesNotExist());
    }
}
