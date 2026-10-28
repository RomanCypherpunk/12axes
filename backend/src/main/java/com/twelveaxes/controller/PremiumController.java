package com.twelveaxes.controller;

import com.twelveaxes.model.AxisResult;
import com.twelveaxes.model.PremiumReport;
import com.twelveaxes.model.PremiumRequest;
import com.twelveaxes.model.ResultRequest;
import com.twelveaxes.payment.EntitlementToken;
import com.twelveaxes.payment.RefundChecker;
import com.twelveaxes.service.AxisValuesParser;
import com.twelveaxes.service.PremiumReportService;
import com.twelveaxes.service.QuizDataService;
import com.twelveaxes.service.ReligionFilter;
import com.twelveaxes.service.ScoringService;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Relatorio Completo (pago). Recebe as mesmas respostas do quiz, recalcula o resultado e so entrega o relatorio a
 * quem tem um token valido para ESSE resultado. Com os pagamentos desligados o endpoint nao existe (404).
 */
@RestController
public class PremiumController {
    private static final Logger LOG = LoggerFactory.getLogger(PremiumController.class);

    /** Reembolso vale por 7 dias; um dia de folga para fuso e atraso. Depois disso a Stripe nao e mais consultada. */
    private static final Duration REFUND_WINDOW = Duration.ofDays(8);

    private final PremiumReportService premiumReportService;
    private final ScoringService scoringService;
    private final EntitlementToken entitlementToken;
    private final RefundChecker refundChecker;
    private final Clock clock;
    private final boolean paymentsEnabled;
    private final boolean devOpen;

    public PremiumController(
            PremiumReportService premiumReportService,
            ScoringService scoringService,
            EntitlementToken entitlementToken,
            RefundChecker refundChecker,
            Clock clock,
            @Value("${app.payments.enabled:false}") boolean paymentsEnabled,
            @Value("${app.premium.dev-open:false}") boolean devOpen
    ) {
        this.premiumReportService = premiumReportService;
        this.scoringService = scoringService;
        this.entitlementToken = entitlementToken;
        this.refundChecker = refundChecker;
        this.clock = clock;
        this.paymentsEnabled = paymentsEnabled;
        this.devOpen = devOpen;
    }

    @PostConstruct
    void warnIfDevOpen() {
        if (devOpen) {
            LOG.warn("PREMIUM_DEV_OPEN ligado: o relatorio pago abre sem pagamento para chamadas da propria maquina. Nunca ligar em producao.");
        }
    }

    @PostMapping("/api/premium/report")
    public PremiumReport report(
            @Valid @RequestBody PremiumRequest request,
            @RequestParam(defaultValue = QuizDataService.LANG_PT) String lang,
            @RequestParam(required = false) String religion,
            @RequestHeader(value = "X-Entitlement", required = false) String token,
            HttpServletRequest http
    ) {
        // Modo local: so quem chama do proprio computador, mesmo que a variavel seja esquecida ligada em producao.
        boolean local = devOpen && isLoopback(http.getRemoteAddr());
        if (!local && !paymentsEnabled) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        List<Double> values = AxisValuesParser.parse(request.v());
        List<AxisResult> axes = scoringService.scoreFromLeftPercents(values, lang);
        if (!local) {
            authorize(values, token);
        }

        String normalizedReligion = ReligionFilter.normalize(religion);
        if (request.answers() == null || request.answers().isEmpty()) {
            return premiumReportService.report(axes, lang, normalizedReligion);
        }
        // Com respostas, elas precisam produzir exatamente estes 12 valores: o relatorio de um resultado nao
        // mostra o que pesou nas respostas de outro.
        ResultRequest answers = new ResultRequest(request.answers(), "short", request.archetype());
        List<Double> fromAnswers = scoringService.score(answers, lang).stream().map(AxisResult::leftPercent).toList();
        if (!EntitlementToken.hashOf(fromAnswers).equals(EntitlementToken.hashOf(values))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "As respostas nao correspondem ao resultado informado");
        }
        return premiumReportService.report(answers, lang, normalizedReligion);
    }

    private void authorize(List<Double> values, String token) {
        String vectorHash = EntitlementToken.hashOf(values);
        EntitlementToken.Claims claims = entitlementToken.verify(token, vectorHash)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso ao relatorio nao liberado para este resultado"));
        if (Duration.between(claims.issuedAt(), Instant.now(clock)).compareTo(REFUND_WINDOW) < 0 && wasRefunded(claims.paymentRef())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Pagamento reembolsado");
        }
    }

    // A Stripe fora do ar nao pode trancar quem pagou: na duvida, o relatorio sai e a falha fica registrada.
    private boolean wasRefunded(String paymentRef) {
        try {
            return refundChecker.isRefunded(paymentRef);
        } catch (RuntimeException e) {
            LOG.warn("Nao foi possivel conferir o reembolso de {}: {}", paymentRef, e.toString());
            return false;
        }
    }

    private static boolean isLoopback(String remoteAddr) {
        if (remoteAddr == null) {
            return false;
        }
        try {
            return InetAddress.getByName(remoteAddr).isLoopbackAddress();
        } catch (UnknownHostException e) {
            return false;
        }
    }
}
