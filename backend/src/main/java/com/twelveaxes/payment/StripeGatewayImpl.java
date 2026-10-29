package com.twelveaxes.payment;

import com.stripe.StripeClient;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import com.stripe.param.PaymentIntentRetrieveParams;
import com.stripe.param.PaymentIntentSearchParams;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.param.checkout.SessionRetrieveParams;
import java.time.Clock;
import java.time.Duration;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Implementacao real, em modo de teste ou ao vivo conforme a chave. A versao da API e a que o stripe-java fixa
 * (Stripe.API_VERSION): subir a biblioteca e o unico jeito de mudar de versao.
 */
public class StripeGatewayImpl implements StripeGateway {
    /** Quanto tempo uma resposta de "foi reembolsado?" vale: o relatorio e pedido varias vezes por visita. */
    private static final Duration REFUND_CACHE = Duration.ofMinutes(5);

    private record CachedRefund(boolean refunded, long checkedAtMillis) {
    }

    private final StripeClient client;
    private final Clock clock;
    private final ConcurrentHashMap<String, CachedRefund> refundCache = new ConcurrentHashMap<>();

    public StripeGatewayImpl(String secretKey, Clock clock) {
        this.client = new StripeClient(secretKey);
        this.clock = clock;
    }

    @Override
    public CheckoutSession create(String priceId, String nonce, String vectorHash, String returnUrl, String lang) {
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setUiMode(SessionCreateParams.UiMode.HOSTED_PAGE)
                .addLineItem(SessionCreateParams.LineItem.builder().setPrice(priceId).setQuantity(1L).build())
                .setClientReferenceId(nonce)
                // A moeda segue o idioma e nunca a localizacao de quem paga (o preco tem uma opcao por moeda).
                .setCurrency("en".equals(lang) ? "usd" : "brl")
                // Em ingles o site mostra o preco em dolar e o checkout converte para a moeda de quem paga; em portugues o preco e sempre em reais.
                .setAdaptivePricing(SessionCreateParams.AdaptivePricing.builder().setEnabled("en".equals(lang)).build())
                .setLocale("en".equals(lang) ? SessionCreateParams.Locale.EN : SessionCreateParams.Locale.PT_BR)
                .setPaymentIntentData(SessionCreateParams.PaymentIntentData.builder()
                        .putMetadata("nonce", nonce)
                        .putMetadata("vectorHash", vectorHash)
                        // Vai no recibo: o link para reabrir o relatorio depois, em qualquer aparelho.
                        .setDescription("12 Axes - Relatorio completo. Para reabrir: " + withParam(returnUrl, "pay", nonce))
                        .build())
                .setSuccessUrl(withParam(returnUrl, "unlock", "{CHECKOUT_SESSION_ID}"))
                .setCancelUrl(returnUrl)
                .build();
        try {
            Session session = client.v1().checkout().sessions().create(params);
            return new CheckoutSession(session.getId(), session.getUrl());
        } catch (StripeException e) {
            throw new PaymentGatewayException("Nao foi possivel abrir o pagamento", e);
        }
    }

    @Override
    public Optional<PaidPayment> findBySession(String sessionId) {
        try {
            Session session = client.v1().checkout().sessions().retrieve(
                    sessionId, SessionRetrieveParams.builder().addExpand("payment_intent").build());
            PaymentIntent intent = session.getPaymentIntentObject();
            if (intent == null) {
                return Optional.empty();
            }
            // "paid" = dinheiro na conta (cartao, ou Pix ja compensado); "unpaid" = ainda pendente (Pix aguardando).
            boolean paid = "paid".equals(session.getPaymentStatus());
            return Optional.of(new PaidPayment(intent.getId(), intent.getMetadata().get("vectorHash"), !paid));
        } catch (StripeException e) {
            if (e.getStatusCode() != null && e.getStatusCode() == 404) {
                return Optional.empty();
            }
            throw new PaymentGatewayException("Nao foi possivel consultar a sessao", e);
        }
    }

    @Override
    public Optional<PaidPayment> findByNonce(String nonce) {
        try {
            // O nonce so tem letras, numeros, '-' e '_': nao ha o que escapar na consulta.
            var result = client.v1().paymentIntents().search(
                    PaymentIntentSearchParams.builder().setQuery("metadata['nonce']:'" + nonce + "'").build());
            for (PaymentIntent intent : result.getData()) {
                boolean paid = "succeeded".equals(intent.getStatus());
                boolean pending = "processing".equals(intent.getStatus()) || "requires_action".equals(intent.getStatus());
                if (paid || pending) {
                    return Optional.of(new PaidPayment(intent.getId(), intent.getMetadata().get("vectorHash"), pending));
                }
            }
            return Optional.empty();
        } catch (StripeException e) {
            throw new PaymentGatewayException("Nao foi possivel consultar o pagamento", e);
        }
    }

    @Override
    public boolean isRefunded(String paymentRef) {
        long now = clock.millis();
        CachedRefund cached = refundCache.get(paymentRef);
        if (cached != null && now - cached.checkedAtMillis() < REFUND_CACHE.toMillis()) {
            return cached.refunded();
        }
        try {
            PaymentIntent intent = client.v1().paymentIntents().retrieve(
                    paymentRef, PaymentIntentRetrieveParams.builder().addExpand("latest_charge").build());
            Charge charge = intent.getLatestChargeObject();
            boolean refunded = charge != null && (Boolean.TRUE.equals(charge.getRefunded())
                    || (charge.getAmountRefunded() != null && charge.getAmountRefunded() > 0));
            refundCache.put(paymentRef, new CachedRefund(refunded, now));
            return refunded;
        } catch (StripeException e) {
            throw new PaymentGatewayException("Nao foi possivel conferir o reembolso", e);
        }
    }

    // O marcador {CHECKOUT_SESSION_ID} precisa ir sem codificacao: a Stripe o troca pelo id da sessao.
    static String withParam(String url, String name, String value) {
        return url + (url.contains("?") ? "&" : "?") + name + "=" + value;
    }
}
