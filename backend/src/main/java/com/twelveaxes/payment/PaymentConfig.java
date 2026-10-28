package com.twelveaxes.payment;

import java.security.SecureRandom;
import java.time.Clock;
import java.util.HexFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PaymentConfig {
    private static final Logger LOG = LoggerFactory.getLogger(PaymentConfig.class);

    @Bean
    @ConditionalOnMissingBean
    Clock paymentClock() {
        return Clock.systemUTC();
    }

    /**
     * Sem ENTITLEMENT_SECRET (pagamentos desligados) o segredo e sorteado a cada inicio: nenhum token sobrevive a um
     * reinicio e nenhum e aceito, o que e o certo enquanto nao ha venda.
     */
    @Bean
    EntitlementToken entitlementToken(@Value("${app.payments.entitlement-secret:}") String secret, Clock clock) {
        if (secret == null || secret.isBlank()) {
            byte[] random = new byte[32];
            new SecureRandom().nextBytes(random);
            secret = HexFormat.of().formatHex(random);
            LOG.info("ENTITLEMENT_SECRET ausente: usando um segredo temporario (so para desenvolvimento ou pagamentos desligados)");
        }
        return new EntitlementToken(secret, clock);
    }

    /**
     * A Stripe real, so com os pagamentos ligados e a chave definida (sk_test_ em teste, sk_live_ no go-live). Esta
     * definicao vem antes do RefundChecker abaixo para ele ja encontrar o gateway (que tambem e um RefundChecker).
     */
    @Bean
    @ConditionalOnProperty(name = "app.payments.enabled", havingValue = "true")
    @ConditionalOnExpression("!'${app.payments.stripe-secret-key:}'.isBlank()")
    StripeGateway stripeGateway(@Value("${app.payments.stripe-secret-key}") String secretKey, Clock clock) {
        return new StripeGatewayImpl(secretKey, clock);
    }

    /** Sem a Stripe ligada, nenhum pagamento consta como reembolsado. */
    @Bean
    @ConditionalOnMissingBean(RefundChecker.class)
    RefundChecker noRefundChecker() {
        return paymentRef -> false;
    }
}
