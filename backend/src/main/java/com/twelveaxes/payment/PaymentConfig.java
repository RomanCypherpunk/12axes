package com.twelveaxes.payment;

import java.security.SecureRandom;
import java.time.Clock;
import java.util.HexFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

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

    /** O Mercado Pago real (reais), so com os pagamentos ligados e o Access Token definido (de teste ou de producao). */
    @Bean
    @ConditionalOnProperty(name = "app.payments.enabled", havingValue = "true")
    @ConditionalOnExpression("!'${app.payments.mercadopago-access-token:}'.isBlank()")
    MercadoPagoGatewayImpl mercadoPagoGateway(
            @Value("${app.payments.mercadopago-access-token}") String accessToken,
            @Value("${app.payments.item-picture-url:}") String pictureUrl,
            Clock clock) {
        return new MercadoPagoGatewayImpl(accessToken, pictureUrl, clock);
    }

    /** A Paddle real (dolar), so com os pagamentos ligados, a chave de API e o ID do preco definidos (sandbox ou producao). */
    @Bean
    @ConditionalOnProperty(name = "app.payments.enabled", havingValue = "true")
    @ConditionalOnExpression("!'${app.payments.paddle-api-key:}'.isBlank() && !'${app.payments.paddle-price-id:}'.isBlank()")
    PaddleGatewayImpl paddleGateway(
            @Value("${app.payments.paddle-api-key}") String apiKey,
            @Value("${app.payments.paddle-price-id}") String priceId,
            Clock clock) {
        return new PaddleGatewayImpl(apiKey, priceId, clock);
    }

    /**
     * O gateway que o resto do backend enxerga: roteia por moeda e por formato de referencia. Existe se ao menos um dos
     * dois estiver configurado. Esta definicao vem antes do RefundChecker abaixo para ele ja encontrar o gateway (que
     * tambem e um RefundChecker).
     */
    @Bean
    @Primary
    @ConditionalOnProperty(name = "app.payments.enabled", havingValue = "true")
    @ConditionalOnExpression("!'${app.payments.mercadopago-access-token:}'.isBlank() || (!'${app.payments.paddle-api-key:}'.isBlank() && !'${app.payments.paddle-price-id:}'.isBlank())")
    PaymentGateway paymentGateway(ObjectProvider<MercadoPagoGatewayImpl> brazil, ObjectProvider<PaddleGatewayImpl> paddle) {
        return new RoutingPaymentGateway(brazil.getIfAvailable(), paddle.getIfAvailable());
    }

    /** Sem o gateway ligado, nenhum pagamento consta como reembolsado. */
    @Bean
    @ConditionalOnMissingBean(RefundChecker.class)
    RefundChecker noRefundChecker() {
        return paymentRef -> false;
    }
}
