package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.twelveaxes.payment.EntitlementToken;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.List;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.junit.jupiter.api.Test;

class EntitlementTokenTest {
    private static final String SECRET = "0123456789abcdef0123456789abcdef";
    private static final Instant NOW = Instant.parse("2026-10-28T12:00:00Z");
    private static final String HASH_A = "a".repeat(64);
    private static final String HASH_B = "b".repeat(64);
    private static final String PAYMENT = "pi_3Test123";

    // Vetor e hash fixos: o front (entitlement.test.ts) usa os mesmos valores para provar que os dois lados concordam.
    private static final List<Double> FIXTURE_VECTOR =
            List.of(65.0, 32.5, 50.0, 40.0, 30.0, 60.0, 70.0, 50.0, 45.0, 55.0, 35.0, 80.0);
    private static final String FIXTURE_HASH = "18d01bba7aa7c961b486b74323df99109415dcc72a22ab6fab349e49f3ac102b";

    private static Clock clockAt(Instant instant) {
        return Clock.fixed(instant, ZoneOffset.UTC);
    }

    private static EntitlementToken tokenAt(Instant instant) {
        return new EntitlementToken(SECRET, clockAt(instant));
    }

    // Monta e assina um token com o payload dado, no mesmo formato do EntitlementToken (para testar versoes antigas e adulteradas).
    private static String signed(String payload, String secret) throws Exception {
        byte[] bytes = payload.getBytes(StandardCharsets.UTF_8);
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        Base64.Encoder encoder = Base64.getUrlEncoder().withoutPadding();
        return encoder.encodeToString(bytes) + "." + encoder.encodeToString(mac.doFinal(bytes));
    }

    @Test
    void issuedTokenValidatesForSameVector() {
        EntitlementToken token = tokenAt(NOW);

        String issued = token.issue(HASH_A, PAYMENT, Duration.ofDays(365));

        assertThat(token.isValidFor(issued, HASH_A)).isTrue();
    }

    @Test
    void verifyReturnsPaymentRefAndIssueTime() {
        EntitlementToken token = tokenAt(NOW);
        String issued = token.issue(HASH_A, PAYMENT, Duration.ofDays(365));

        var claims = tokenAt(NOW.plus(Duration.ofDays(3))).verify(issued, HASH_A);

        assertThat(claims).isPresent();
        assertThat(claims.get().paymentRef()).isEqualTo(PAYMENT);
        assertThat(claims.get().issuedAt()).isEqualTo(NOW);
    }

    @Test
    void rejectsOtherVector() {
        EntitlementToken token = tokenAt(NOW);

        String issued = token.issue(HASH_A, PAYMENT, Duration.ofDays(365));

        assertThat(token.isValidFor(issued, HASH_B)).isFalse();
        assertThat(token.verify(issued, HASH_B)).isEmpty();
    }

    @Test
    void rejectsTamperedPayload() {
        EntitlementToken token = tokenAt(NOW);
        String issued = token.issue(HASH_A, PAYMENT, Duration.ofDays(365));
        String signature = issued.substring(issued.indexOf('.') + 1);
        String forgedPayload = Base64.getUrlEncoder().withoutPadding().encodeToString(
                ("v2|" + HASH_B + "|" + PAYMENT + "|" + NOW.getEpochSecond() + "|"
                        + NOW.plus(Duration.ofDays(365)).getEpochSecond()).getBytes(StandardCharsets.UTF_8));

        assertThat(token.isValidFor(forgedPayload + "." + signature, HASH_B)).isFalse();
    }

    @Test
    void tamperingWithPaymentRefInvalidatesSignature() {
        EntitlementToken token = tokenAt(NOW);
        String issued = token.issue(HASH_A, PAYMENT, Duration.ofDays(365));
        String signature = issued.substring(issued.indexOf('.') + 1);
        String forgedPayload = Base64.getUrlEncoder().withoutPadding().encodeToString(
                ("v2|" + HASH_A + "|pi_OutroPagamento|" + NOW.getEpochSecond() + "|"
                        + NOW.plus(Duration.ofDays(365)).getEpochSecond()).getBytes(StandardCharsets.UTF_8));

        assertThat(token.verify(forgedPayload + "." + signature, HASH_A)).isEmpty();
    }

    @Test
    void rejectsV1Token() throws Exception {
        String v1 = signed("v1|" + HASH_A + "|" + NOW.plus(Duration.ofDays(365)).getEpochSecond(), SECRET);

        assertThat(tokenAt(NOW).isValidFor(v1, HASH_A)).isFalse();
    }

    @Test
    void rejectsExpiredToken() {
        String issued = tokenAt(NOW).issue(HASH_A, PAYMENT, Duration.ofDays(30));

        EntitlementToken later = tokenAt(NOW.plus(Duration.ofDays(30)).plusSeconds(1));

        assertThat(later.isValidFor(issued, HASH_A)).isFalse();
    }

    @Test
    void acceptsTokenUntilTheLastSecond() {
        String issued = tokenAt(NOW).issue(HASH_A, PAYMENT, Duration.ofDays(30));

        EntitlementToken edge = tokenAt(NOW.plus(Duration.ofDays(30)));

        assertThat(edge.isValidFor(issued, HASH_A)).isTrue();
    }

    @Test
    void rejectsMalformedToken() {
        EntitlementToken token = tokenAt(NOW);

        assertThat(token.isValidFor(null, HASH_A)).isFalse();
        assertThat(token.isValidFor("", HASH_A)).isFalse();
        assertThat(token.isValidFor("sem-ponto", HASH_A)).isFalse();
        assertThat(token.isValidFor("a.b.c", HASH_A)).isFalse();
        assertThat(token.isValidFor("!!!.???", HASH_A)).isFalse();
        assertThat(token.isValidFor(".", HASH_A)).isFalse();
    }

    @Test
    void rejectsTokenSignedWithOtherSecret() {
        String issued = new EntitlementToken("fedcba9876543210fedcba9876543210", clockAt(NOW))
                .issue(HASH_A, PAYMENT, Duration.ofDays(365));

        assertThat(tokenAt(NOW).isValidFor(issued, HASH_A)).isFalse();
    }

    @Test
    void rejectsShortSecret() {
        assertThatThrownBy(() -> new EntitlementToken("curto", clockAt(NOW)))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void rejectsPaymentRefThatWouldBreakThePayloadFormat() {
        EntitlementToken token = tokenAt(NOW);

        assertThatThrownBy(() -> token.issue(HASH_A, "pi_1|2", Duration.ofDays(1)))
                .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> token.issue(HASH_A, "", Duration.ofDays(1)))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void hashMatchesFixtureSharedWithFrontend() {
        assertThat(EntitlementToken.hashOf(FIXTURE_VECTOR)).isEqualTo(FIXTURE_HASH);
    }

    @Test
    void hashIgnoresFloatNoiseBelowOneDecimal() {
        List<Double> noisy = List.of(65.04, 32.5, 50.0, 40.0, 30.0, 60.0, 70.0, 50.0, 45.0, 55.0, 35.0, 80.0);

        assertThat(EntitlementToken.hashOf(noisy)).isEqualTo(FIXTURE_HASH);
    }

    @Test
    void hashChangesWhenAValueChangesByOneDecimal() {
        List<Double> other = List.of(65.1, 32.5, 50.0, 40.0, 30.0, 60.0, 70.0, 50.0, 45.0, 55.0, 35.0, 80.0);

        assertThat(EntitlementToken.hashOf(other)).isNotEqualTo(FIXTURE_HASH);
    }
}
