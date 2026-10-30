package com.twelveaxes.payment;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;

class RoutingPaymentGatewayTest {
    private static final String TXN = "txn_01m66hdb2rreyh7xd6mjvm40yr";

    /** Duble que diz quem foi chamado. */
    static class Recorder implements PaymentGateway {
        final String name;
        final List<String> calls = new ArrayList<>();
        boolean refunded;

        Recorder(String name) {
            this.name = name;
        }

        @Override
        public CheckoutSession create(String amount, String currency, String nonce, String vectorHash, String returnUrl, String lang) {
            calls.add("create:" + currency);
            return new CheckoutSession(name, "https://" + name + ".example/pay");
        }

        @Override
        public Optional<PaidPayment> findBySession(String sessionId) {
            calls.add("session:" + sessionId);
            return Optional.empty();
        }

        @Override
        public Optional<PaidPayment> findByNonce(String nonce) {
            calls.add("nonce:" + nonce);
            return Optional.of(new PaidPayment(name + "-ref", "hash", false));
        }

        @Override
        public boolean isRefunded(String paymentRef) {
            calls.add("refunded:" + paymentRef);
            return refunded;
        }
    }

    private final Recorder brazil = new Recorder("brazil");
    private final Recorder paddle = new Recorder("paddle");
    private final RoutingPaymentGateway both = new RoutingPaymentGateway(brazil, paddle);

    @Test
    void reaisGoToTheBrazilianGatewayAndDollarsToPaddle() {
        assertThat(both.create("14.99", "BRL", "n", "h", "https://x/r", "pt").id()).isEqualTo("brazil");
        assertThat(both.create("3.99", "USD", "n", "h", "https://x/r", "en").id()).isEqualTo("paddle");
    }

    @Test
    void theReturnCodeDecidesWhoConfirmsThePayment() {
        assertThat(both.findByNonce(TXN)).hasValueSatisfying(paid -> assertThat(paid.paymentRef()).isEqualTo("paddle-ref"));
        assertThat(both.findByNonce("AbCdEfGhIjKlMnOpQrSt")).hasValueSatisfying(paid -> assertThat(paid.paymentRef()).isEqualTo("brazil-ref"));
        assertThat(paddle.calls).containsExactly("nonce:" + TXN);
        assertThat(brazil.calls).containsExactly("nonce:AbCdEfGhIjKlMnOpQrSt");
    }

    @Test
    void theReferenceDecidesWhoChecksTheRefund() {
        paddle.refunded = true;
        assertThat(both.isRefunded(TXN)).isTrue();
        assertThat(both.isRefunded("185778195777")).isFalse();
        assertThat(brazil.calls).containsExactly("refunded:185778195777");
    }

    @Test
    void aCurrencyWithoutGatewayIsAFailureNeverASale() {
        RoutingPaymentGateway onlyBrazil = new RoutingPaymentGateway(brazil, null);
        assertThatThrownBy(() -> onlyBrazil.create("3.99", "USD", "n", "h", "https://x/r", "en")).isInstanceOf(PaymentGatewayException.class);
        RoutingPaymentGateway onlyPaddle = new RoutingPaymentGateway(null, paddle);
        assertThatThrownBy(() -> onlyPaddle.create("14.99", "BRL", "n", "h", "https://x/r", "pt")).isInstanceOf(PaymentGatewayException.class);
    }

    @Test
    void aMissingGatewayNeverConfirmsAPaymentNorBlocksARefundCheck() {
        RoutingPaymentGateway onlyBrazil = new RoutingPaymentGateway(brazil, null);
        assertThat(onlyBrazil.findByNonce(TXN)).isEmpty();
        assertThat(onlyBrazil.isRefunded(TXN)).isFalse();
        RoutingPaymentGateway none = new RoutingPaymentGateway(null, null);
        assertThat(none.findBySession("x")).isEmpty();
        assertThat(none.findByNonce("AbCdEfGhIjKlMnOpQrSt")).isEmpty();
        assertThat(none.isRefunded("1")).isFalse();
    }
}
