package com.twelveaxes.controller;

import com.twelveaxes.payment.EntitlementToken;
import com.twelveaxes.payment.PaymentGatewayException;
import com.twelveaxes.payment.RefundChecker;
import com.twelveaxes.payment.PaymentGateway;
import com.twelveaxes.payment.PaymentGateway.CheckoutSession;
import com.twelveaxes.payment.PaymentGateway.PaidPayment;
import com.twelveaxes.service.AxisValuesParser;
import com.twelveaxes.service.QuizDataService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Arrays;
import java.util.Base64;
import java.util.Locale;
import java.util.Map;
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
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Compra do Relatorio Completo: abre o pagamento no gateway (Mercado Pago) e, depois de pago, troca o pagamento por um
 * token de acesso preso ao resultado. Nao guarda nada: o gateway e a fonte da verdade. Com os pagamentos desligados, 404.
 */
@RestController
public class PaymentController {
    private static final Logger LOG = LoggerFactory.getLogger(PaymentController.class);
    /** Referencia de pagamento dos tokens de cortesia: nao existe no gateway, entao nunca se confere reembolso. */
    public static final String GIFT_REF = "gift";
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final Pattern SESSION_ID = Pattern.compile("cs_(test|live)_[A-Za-z0-9]{8,200}");
    // O nonce vai para uma consulta de busca do gateway: so letras, numeros, '-' e '_'.
    private static final Pattern EMAIL = Pattern.compile("[^@\\s]{1,64}@[^@\\s]{1,255}\\.[^@\\s.]{2,}");
    private static final Pattern NONCE = Pattern.compile("[A-Za-z0-9_-]{16,64}");

    public record CheckoutRequest(@NotBlank String v, String lang, @NotBlank String returnUrl, String email) {
    }

    public record CheckoutResponse(String url) {
    }

    public record UnlockRequest(@NotBlank String v, String sessionId, String pay, String gift, String renew) {
    }

    public record UnlockResponse(String token) {
    }

    private final ObjectProvider<PaymentGateway> gatewayProvider;
    private final EntitlementToken entitlementToken;
    private final RefundChecker refundChecker;
    private final boolean paymentsEnabled;
    private final String priceBrl;
    private final String priceUsd;
    private final Duration tokenValidity;
    private final Set<String> allowedOrigins;
    private final byte[] giftKey;

    public PaymentController(
            ObjectProvider<PaymentGateway> gatewayProvider,
            EntitlementToken entitlementToken,
            RefundChecker refundChecker,
            @Value("${app.payments.enabled:false}") boolean paymentsEnabled,
            @Value("${app.payments.price-brl:}") String priceBrl,
            @Value("${app.payments.price-usd:}") String priceUsd,
            @Value("${app.payments.token-valid-days:365}") long tokenValidDays,
            @Value("${app.frontend-origins}") String origins,
            @Value("${app.payments.gift-key:}") String giftKey
    ) {
        this.giftKey = giftKey == null ? new byte[0] : giftKey.trim().getBytes(StandardCharsets.UTF_8);
        this.gatewayProvider = gatewayProvider;
        this.entitlementToken = entitlementToken;
        this.refundChecker = refundChecker;
        this.paymentsEnabled = paymentsEnabled;
        this.priceBrl = priceBrl;
        this.priceUsd = priceUsd;
        this.tokenValidity = Duration.ofDays(tokenValidDays);
        this.allowedOrigins = Arrays.stream(origins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .map(PaymentController::normalizeOrigin)
                .collect(Collectors.toUnmodifiableSet());
    }

    /** Abre o pagamento do resultado {@code v}. O preco vem do servidor (por idioma): o navegador nunca manda valor. */
    @PostMapping("/api/checkout")
    public CheckoutResponse checkout(@Valid @RequestBody CheckoutRequest request) {
        requireEnabled();
        String lang = QuizDataService.LANG_EN.equals(request.lang()) ? QuizDataService.LANG_EN : QuizDataService.LANG_PT;
        boolean english = QuizDataService.LANG_EN.equals(lang);
        String amount = english ? priceUsd : priceBrl;
        if (amount == null || amount.isBlank()) {
            // Moeda ainda nao liberada para venda.
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        String returnUrl = validReturnUrl(request.returnUrl());
        String vectorHash = EntitlementToken.hashOf(AxisValuesParser.parse(request.v()));
        String email = validEmail(request.email());
        String nonce = newNonce();
        CheckoutSession session = gateway().create(amount.trim(), english ? "USD" : "BRL", nonce, vectorHash, returnUrl, lang, email);
        return new CheckoutResponse(session.url());
    }

    /**
     * Troca um pagamento ja feito pelo token do resultado. O pagamento vem da sessao do retorno ({@code sessionId}) ou do
     * codigo do link do recibo ({@code pay}), e precisa ser do MESMO resultado ({@code v}).
     */
    @PostMapping("/api/unlock")
    public UnlockResponse unlock(@Valid @RequestBody UnlockRequest request) {
        requireEnabled();
        String vectorHash = EntitlementToken.hashOf(AxisValuesParser.parse(request.v()));
        boolean hasGift = request.gift() != null && !request.gift().isBlank();
        boolean hasRenew = request.renew() != null && !request.renew().isBlank();
        boolean hasSession = request.sessionId() != null && !request.sessionId().isBlank();
        boolean hasNonce = request.pay() != null && !request.pay().isBlank();
        if ((hasGift ? 1 : 0) + (hasRenew ? 1 : 0) + (hasSession ? 1 : 0) + (hasNonce ? 1 : 0) != 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe so um entre sessionId, pay, gift ou renew");
        }
        if (hasGift) {
            return unlockByGift(request, vectorHash);
        }
        if (hasRenew) {
            return renewAccess(request.renew(), vectorHash);
        }
        Optional<PaidPayment> found;
        if (hasSession) {
            if (!SESSION_ID.matcher(request.sessionId()).matches()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "sessionId invalido");
            }
            found = gateway().findBySession(request.sessionId());
        } else {
            if (!NONCE.matcher(request.pay()).matches()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "pay invalido");
            }
            found = gateway().findByNonce(request.pay());
        }
        // 402: ainda nao ha pagamento confirmado (nao achado, nao pago, ou Pix pendente). O front tenta de novo.
        PaidPayment payment = found.filter(paid -> !paid.pending())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.PAYMENT_REQUIRED, "Pagamento ainda nao confirmado"));
        if (!vectorHash.equals(payment.vectorHash())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Este pagamento e de outro resultado");
        }
        if (refundChecker.isRefunded(payment.paymentRef())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Pagamento reembolsado");
        }
        return new UnlockResponse(entitlementToken.issue(vectorHash, payment.paymentRef(), tokenValidity));
    }

    /** Cortesia: a senha {@code gift} (variavel GIFT_KEY) libera o resultado sem pagamento. Sem GIFT_KEY, nao existe. */
    private UnlockResponse unlockByGift(UnlockRequest request, String vectorHash) {
        boolean valid = giftKey.length > 0 && MessageDigest.isEqual(giftKey, request.gift().trim().getBytes(StandardCharsets.UTF_8));
        if (!valid) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Codigo de cortesia invalido");
        }
        return new UnlockResponse(entitlementToken.issue(vectorHash, GIFT_REF, tokenValidity));
    }

    /**
     * Quem edita as respostas ganha outro resultado: o acesso antigo (assinado, valido e sem reembolso) vira um acesso
     * novo para este resultado, preso ao mesmo pagamento. Sem pagamento antigo valido, 403.
     */
    private UnlockResponse renewAccess(String oldToken, String vectorHash) {
        EntitlementToken.Claims claims = entitlementToken.verifyAnyVector(oldToken.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso anterior invalido"));
        if (!GIFT_REF.equals(claims.paymentRef()) && refundChecker.isRefunded(claims.paymentRef())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Pagamento reembolsado");
        }
        return new UnlockResponse(entitlementToken.issue(vectorHash, claims.paymentRef(), tokenValidity));
    }

    /** Gateway fora do ar ou recusando: nunca libera por engano; o front mostra "tente de novo". */
    @ExceptionHandler(PaymentGatewayException.class)
    public ResponseEntity<Map<String, String>> gatewayFailed(PaymentGatewayException e) {
        LOG.warn("Falha ao falar com o gateway de pagamento: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("error", "payment_unavailable", "message", "Pagamento indisponivel no momento"));
    }

    private void requireEnabled() {
        if (!paymentsEnabled) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    private PaymentGateway gateway() {
        PaymentGateway gateway = gatewayProvider.getIfAvailable();
        if (gateway == null) {
            // Pagamentos ligados mas sem MERCADOPAGO_ACCESS_TOKEN: configuracao incompleta, nunca libera.
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Pagamento nao configurado");
        }
        return gateway;
    }

    /** O e-mail e opcional (a Paddle pede o dela na propria pagina); informado e malformado, 400. */
    private static String validEmail(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }
        String trimmed = email.trim();
        if (trimmed.length() > 254 || !EMAIL.matcher(trimmed).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "email invalido");
        }
        return trimmed;
    }

    private static String newNonce() {
        byte[] bytes = new byte[18];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    // A volta do pagamento so pode apontar para o proprio site: senao o checkout viraria um redirecionador aberto.
    private String validReturnUrl(String returnUrl) {
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
