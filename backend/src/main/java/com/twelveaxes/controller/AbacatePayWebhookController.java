package com.twelveaxes.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.twelveaxes.payment.AccessEmail;
import com.twelveaxes.payment.EntitlementToken;
import com.twelveaxes.payment.MailSendException;
import com.twelveaxes.payment.PaymentGateway;
import com.twelveaxes.payment.PaymentGateway.PaidPayment;
import com.twelveaxes.payment.PaymentGatewayException;
import com.twelveaxes.payment.TransactionalMailSender;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.Arrays;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Aviso de "pagamento confirmado" da AbacatePay ({@code checkout.completed}): manda ao comprador o e-mail com o acesso ao
 * relatorio, sem depender de ele voltar ao site (a volta do pagamento pode falhar ou a aba pode ser fechada). Nada do que
 * chega no corpo e acreditado: o pagamento e consultado de novo na API da AbacatePay, e o e-mail e o endereco do resultado vem
 * do {@code metadata} que o proprio servidor gravou ao abrir o checkout.
 *
 * <p>Autenticacao: o segredo no endereco cadastrado no painel ({@code ?webhookSecret=}). Respostas: 2xx encerra o aviso; 5xx faz
 * a AbacatePay tentar de novo (ate 7 vezes em cerca de 18 horas), o que e seguro porque o e-mail sai com chave de idempotencia.
 */
@RestController
public class AbacatePayWebhookController {
    private static final Logger LOG = LoggerFactory.getLogger(AbacatePayWebhookController.class);
    private static final String EVENT_COMPLETED = "checkout.completed";
    // O codigo do pagamento vai a uma consulta de busca do gateway: so letras, numeros, '-' e '_' (o mesmo formato de PaymentController).
    private static final Pattern NONCE = Pattern.compile("[A-Za-z0-9_-]{16,64}");

    private final ObjectProvider<PaymentGateway> gatewayProvider;
    private final ObjectProvider<TransactionalMailSender> mailProvider;
    private final EntitlementToken entitlementToken;
    private final boolean paymentsEnabled;
    private final byte[] webhookSecret;
    private final Duration tokenValidity;
    private final Set<String> allowedOrigins;
    private final ObjectMapper json = new ObjectMapper();

    public AbacatePayWebhookController(
            ObjectProvider<PaymentGateway> gatewayProvider,
            ObjectProvider<TransactionalMailSender> mailProvider,
            EntitlementToken entitlementToken,
            @Value("${app.payments.enabled:false}") boolean paymentsEnabled,
            @Value("${app.payments.abacatepay-webhook-secret:}") String webhookSecret,
            @Value("${app.payments.token-valid-days:365}") long tokenValidDays,
            @Value("${app.frontend-origins}") String origins
    ) {
        this.gatewayProvider = gatewayProvider;
        this.mailProvider = mailProvider;
        this.entitlementToken = entitlementToken;
        this.paymentsEnabled = paymentsEnabled;
        this.webhookSecret = webhookSecret == null ? new byte[0] : webhookSecret.trim().getBytes(StandardCharsets.UTF_8);
        this.tokenValidity = Duration.ofDays(tokenValidDays);
        this.allowedOrigins = Arrays.stream(origins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .map(AbacatePayWebhookController::normalizeOrigin)
                .collect(Collectors.toUnmodifiableSet());
    }

    @PostMapping("/api/webhooks/abacatepay")
    public ResponseEntity<Void> abacatePay(
            @RequestParam(name = "webhookSecret", required = false) String secret,
            @RequestBody String body
    ) {
        // Sem segredo configurado (ou com os pagamentos desligados) o endpoint nao existe.
        if (!paymentsEnabled || webhookSecret.length == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        byte[] given = secret == null ? new byte[0] : secret.getBytes(StandardCharsets.UTF_8);
        if (!MessageDigest.isEqual(webhookSecret, given)) {
            LOG.warn("Webhook da AbacatePay recusado: segredo invalido");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        JsonNode event;
        try {
            event = json.readTree(body);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        if (!EVENT_COMPLETED.equals(event.path("event").asText())) {
            return ResponseEntity.ok().build();
        }
        String externalId = event.path("data").path("checkout").path("externalId").asText("");
        if (!NONCE.matcher(externalId).matches()) {
            // Cobranca que nao e deste site (outro produto da mesma loja): nao e com a gente.
            LOG.info("Webhook da AbacatePay ignorado: externalId fora do formato");
            return ResponseEntity.ok().build();
        }

        PaymentGateway gateway = gatewayProvider.getIfAvailable();
        if (gateway == null) {
            LOG.warn("Webhook da AbacatePay sem gateway de pagamento configurado");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
        Optional<PaidPayment> found;
        try {
            found = gateway.findByNonce(externalId);
        } catch (PaymentGatewayException e) {
            LOG.warn("Webhook da AbacatePay: falha ao consultar o pagamento: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
        // Nao achado ou ainda pendente na API: o aviso chegou antes do registro. 503 faz a AbacatePay repetir em instantes.
        if (found.isEmpty() || found.get().pending()) {
            LOG.info("Webhook da AbacatePay: pagamento ainda nao confirmado na API, pedindo nova tentativa");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
        PaidPayment payment = found.get();

        String email = payment.email();
        if (email == null || email.isBlank()) {
            LOG.info("Webhook da AbacatePay: pagamento {} sem e-mail gravado, nada a enviar", payment.paymentRef());
            return ResponseEntity.ok().build();
        }
        Optional<String> resultUrl = allowedResultUrl(payment.returnUrl());
        if (resultUrl.isEmpty() || payment.vectorHash().isBlank()) {
            LOG.warn("Webhook da AbacatePay: pagamento {} sem endereco de resultado valido, nada a enviar", payment.paymentRef());
            return ResponseEntity.ok().build();
        }

        TransactionalMailSender mailer = mailProvider.getIfAvailable();
        if (mailer == null) {
            LOG.warn("Webhook da AbacatePay: envio de e-mail nao configurado (RESEND_API_KEY e MAIL_FROM)");
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
        String token = entitlementToken.issue(payment.vectorHash(), payment.paymentRef(), tokenValidity);
        String link = resultUrl.get() + "#access=" + URLEncoder.encode(token, StandardCharsets.UTF_8);
        try {
            mailer.send(email.trim(), AccessEmail.SUBJECT, AccessEmail.html(link), AccessEmail.text(link), "abacatepay-" + payment.paymentRef());
        } catch (MailSendException e) {
            LOG.warn("Webhook da AbacatePay: falha ao enviar o e-mail do pagamento {}: {}", payment.paymentRef(), e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
        }
        LOG.info("E-mail de acesso enviado para o pagamento {}", payment.paymentRef());
        return ResponseEntity.ok().build();
    }

    // O endereco vem do metadata que este servidor gravou, mas so segue para o e-mail se ainda for do proprio site e sem fragmento.
    private Optional<String> allowedResultUrl(String returnUrl) {
        if (returnUrl == null || returnUrl.isBlank()) {
            return Optional.empty();
        }
        try {
            URI uri = new URI(returnUrl.trim());
            boolean hasHost = uri.getScheme() != null && uri.getHost() != null;
            if (!hasHost || uri.getFragment() != null || !allowedOrigins.contains(normalizeOrigin(originOf(uri)))) {
                return Optional.empty();
            }
            return Optional.of(uri.toString());
        } catch (URISyntaxException e) {
            return Optional.empty();
        }
    }

    private static String originOf(URI uri) {
        return uri.getScheme() + "://" + uri.getHost() + (uri.getPort() == -1 ? "" : ":" + uri.getPort());
    }

    private static String normalizeOrigin(String origin) {
        String lower = origin.toLowerCase(Locale.ROOT);
        return lower.endsWith("/") ? lower.substring(0, lower.length() - 1) : lower;
    }
}
