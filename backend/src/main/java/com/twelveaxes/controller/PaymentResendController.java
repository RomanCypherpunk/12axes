package com.twelveaxes.controller;

import com.twelveaxes.payment.AccessEmail;
import com.twelveaxes.payment.EntitlementToken;
import com.twelveaxes.payment.MailSendException;
import com.twelveaxes.payment.PaymentGateway;
import com.twelveaxes.payment.PaymentGateway.PaidPayment;
import com.twelveaxes.payment.PaymentGatewayException;
import com.twelveaxes.payment.TransactionalMailSender;
import com.twelveaxes.service.AxisValuesParser;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.net.URI;
import java.net.URISyntaxException;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Reenvio manual do e-mail de acesso ao relatorio pago, acionado por voce (nunca pelo comprador nem por um gateway):
 * cobre o caso de um pagamento que nunca gerou o e-mail (hoje so a AbacatePay tem webhook automatico; a Paddle e o
 * Mercado Pago nao). Protegido por {@code PAYMENTS_RESEND_SECRET}; sem ele definido, o endpoint nao existe (404).
 *
 * <p>O pagamento e sempre reconsultado no gateway (nunca confiamos so no que foi informado). Para pagamentos feitos
 * antes desta funcionalidade existir, o gateway pode nao ter o e-mail nem o endereco do resultado gravados (a Paddle
 * so passou a grava-los a partir de agora); por isso {@code email} e {@code returnUrl} no pedido servem de reforco
 * manual quando o gateway nao os devolve.
 */
@RestController
public class PaymentResendController {
    private static final Logger LOG = LoggerFactory.getLogger(PaymentResendController.class);
    private static final Pattern NONCE = Pattern.compile("[A-Za-z0-9_-]{16,64}");
    private static final Pattern EMAIL = Pattern.compile("[^@\\s]{1,64}@[^@\\s]{1,255}\\.[^@\\s.]{2,}");

    /** {@code lang}: "pt" manda o e-mail em portugues (texto da AbacatePay); qualquer outro valor (ou ausente) manda em ingles (Paddle). */
    public record ResendRequest(@NotBlank String v, @NotBlank String pay, String email, String returnUrl, String lang, @NotBlank String secret) {
    }

    public record ResendResponse(boolean sent) {
    }

    private final ObjectProvider<PaymentGateway> gatewayProvider;
    private final ObjectProvider<TransactionalMailSender> mailProvider;
    private final EntitlementToken entitlementToken;
    private final Duration tokenValidity;
    private final byte[] resendSecret;
    private final Set<String> allowedOrigins;

    public PaymentResendController(
            ObjectProvider<PaymentGateway> gatewayProvider,
            ObjectProvider<TransactionalMailSender> mailProvider,
            EntitlementToken entitlementToken,
            @Value("${app.payments.token-valid-days:365}") long tokenValidDays,
            @Value("${app.payments.resend-secret:}") String resendSecret,
            @Value("${app.frontend-origins}") String origins
    ) {
        this.gatewayProvider = gatewayProvider;
        this.mailProvider = mailProvider;
        this.entitlementToken = entitlementToken;
        this.tokenValidity = Duration.ofDays(tokenValidDays);
        this.resendSecret = resendSecret == null ? new byte[0] : resendSecret.trim().getBytes(StandardCharsets.UTF_8);
        this.allowedOrigins = Arrays.stream(origins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .map(PaymentResendController::normalizeOrigin)
                .collect(Collectors.toUnmodifiableSet());
    }

    // Em /api/webhooks/: chamado por voce (curl/Postman), nunca pelo navegador, entao fica isento da checagem de Origin
    // (OriginEnforcementFilter), igual ao webhook da AbacatePay. Quem autentica e o segredo, nao a origem.
    @PostMapping("/api/webhooks/resend-access")
    public ResendResponse resend(@Valid @RequestBody ResendRequest request) {
        if (resendSecret.length == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        byte[] given = request.secret().getBytes(StandardCharsets.UTF_8);
        if (!MessageDigest.isEqual(resendSecret, given)) {
            LOG.warn("Reenvio de e-mail recusado: segredo invalido");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        if (!NONCE.matcher(request.pay()).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "pay invalido");
        }

        PaymentGateway gateway = gatewayProvider.getIfAvailable();
        if (gateway == null) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Pagamento nao configurado");
        }
        Optional<PaidPayment> found;
        try {
            found = gateway.findByNonce(request.pay());
        } catch (PaymentGatewayException e) {
            LOG.warn("Reenvio: falha ao consultar o pagamento {}: {}", request.pay(), e.getMessage());
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Falha ao consultar o pagamento");
        }
        PaidPayment payment = found.filter(paid -> !paid.pending())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pagamento nao encontrado ou ainda nao confirmado"));

        String vectorHash = EntitlementToken.hashOf(AxisValuesParser.parse(request.v()));
        if (!vectorHash.equals(payment.vectorHash())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "O resultado (v) nao bate com o deste pagamento");
        }

        String email = firstNonBlank(request.email(), payment.email());
        if (email == null || !EMAIL.matcher(email.trim()).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sem e-mail valido: informe 'email' no pedido");
        }
        String returnUrl = validReturnUrl(firstNonBlank(request.returnUrl(), payment.returnUrl()));

        TransactionalMailSender mailer = mailProvider.getIfAvailable();
        if (mailer == null) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Envio de e-mail nao configurado (RESEND_API_KEY e MAIL_FROM)");
        }
        // Mesma validade e emissao do token de acesso normal, presa ao pagamento reconsultado (nao ao que o pedido informou).
        String token = entitlementToken.issue(vectorHash, payment.paymentRef(), tokenValidity);
        String link = AccessEmail.link(returnUrl, token);
        // O idioma vem do pagamento (o que a Paddle/AbacatePay gravou ao abrir o checkout); 'lang' no pedido so reforca
        // pagamentos antigos que nao o gravaram.
        String lang = firstNonBlank(request.lang(), payment.lang());
        try {
            mailer.send(email, AccessEmail.subject(lang), AccessEmail.html(lang, link), AccessEmail.text(lang, link), "resend-" + payment.paymentRef());
        } catch (MailSendException e) {
            LOG.warn("Reenvio: falha ao enviar o e-mail do pagamento {}: {}", payment.paymentRef(), e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Falha ao enviar o e-mail");
        }
        LOG.info("E-mail de acesso reenviado manualmente para o pagamento {}", payment.paymentRef());
        return new ResendResponse(true);
    }

    private static String firstNonBlank(String a, String b) {
        if (a != null && !a.isBlank()) {
            return a.trim();
        }
        return b != null && !b.isBlank() ? b.trim() : null;
    }

    private String validReturnUrl(String returnUrl) {
        if (returnUrl == null || returnUrl.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sem endereco do resultado: informe 'returnUrl' no pedido");
        }
        try {
            URI uri = new URI(returnUrl.trim());
            boolean hasHost = uri.getScheme() != null && uri.getHost() != null;
            if (!hasHost || uri.getFragment() != null || !allowedOrigins.contains(normalizeOrigin(originOf(uri)))) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "returnUrl invalida");
            }
            return uri.toString();
        } catch (URISyntaxException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "returnUrl invalida");
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
