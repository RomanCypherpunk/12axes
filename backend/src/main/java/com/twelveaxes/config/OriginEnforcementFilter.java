package com.twelveaxes.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.Set;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Restringe /api/** às origens da allowlist (a mesma de {@link CorsConfig}).
 *
 * <p>O CORS do navegador não protege contra proxies server-side, que chamam a API
 * sem {@code Origin}. Este filtro exige o header explicitamente e devolve 403 caso
 * contrário, registrando a tentativa em WARN para servir de evidência.

 * <p>Origin é texto e pode ser forjado por um cliente server-side, então isto é
 * uma barreira e não uma tranca: derruba o uso casual da API por terceiros. Para
 * subir o custo de quem forja só o Origin, o filtro também exige o que todo
 * navegador moderno manda e um cliente de servidor comum não manda: User-Agent e os
 * cabeçalhos de metadados de busca ({@code Sec-Fetch-Site}). Quem quiser passar
 * precisa forjar vários cabeçalhos coerentes, e a amostra de acessos aceitos no log
 * ({@code API_ACCESS_SAMPLE}) mostra o que de fato está passando.
 */
@Component
public class OriginEnforcementFilter extends OncePerRequestFilter {
    private static final Logger LOG = LoggerFactory.getLogger(OriginEnforcementFilter.class);
    private static final String HEALTH_PATH = "/api/health";
    private static final String API_PREFIX = "/api/";
    private static final String FETCH_SITE_HEADER = "Sec-Fetch-Site";
    private static final String FORBIDDEN_BODY =
            "{\"error\":\"forbidden\",\"message\":\"API de uso exclusivo de 12axes.vercel.app\"}";

    private final Set<String> allowedOrigins;
    private final boolean enforcementEnabled;
    private final boolean requireFetchMetadata;
    private final int accessSampleEvery;
    private final AtomicLong acceptedCount = new AtomicLong();

    public OriginEnforcementFilter(
            @Value("${app.frontend-origins}") String origins,
            @Value("${app.origin-enforcement:true}") boolean enforcementEnabled,
            @Value("${app.require-fetch-metadata:true}") boolean requireFetchMetadata,
            @Value("${app.access-sample-every:200}") int accessSampleEvery
    ) {
        this.allowedOrigins = Arrays.stream(origins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .map(OriginEnforcementFilter::normalize)
                .collect(Collectors.toUnmodifiableSet());
        this.enforcementEnabled = enforcementEnabled;
        this.requireFetchMetadata = requireFetchMetadata;
        this.accessSampleEvery = accessSampleEvery;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String blockReason = blockReason(request);
        if (blockReason == null) {
            logAcceptedSample(request);
            chain.doFilter(request, response);
            return;
        }

        logBlocked(request, blockReason);
        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(FORBIDDEN_BODY);
    }

    /** Devolve o motivo do bloqueio, ou null se a requisição pode seguir. */
    private String blockReason(HttpServletRequest request) {
        if (!enforcementEnabled) {
            return null;
        }
        String path = request.getRequestURI();
        if (!path.startsWith(API_PREFIX) || HEALTH_PATH.equals(path)) {
            return null;
        }
        // Preflight CORS chega sem credenciais e é respondido pelo próprio Spring.
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return null;
        }

        String userAgent = request.getHeader(HttpHeaders.USER_AGENT);
        if (userAgent == null || userAgent.isBlank()) {
            return "no_user_agent";
        }

        String origin = request.getHeader(HttpHeaders.ORIGIN);
        if (origin != null && !origin.isBlank()) {
            if (!allowedOrigins.contains(normalize(origin))) {
                return "origin_not_allowed";
            }
        } else {
            // Fallback: alguns navegadores omitem Origin em navegação direta, mas mandam Referer.
            String referer = request.getHeader(HttpHeaders.REFERER);
            if (referer == null || !allowedOrigins.contains(originOf(referer))) {
                return "no_origin";
            }
        }

        if (requireFetchMetadata && isBlank(request.getHeader(FETCH_SITE_HEADER))) {
            return "no_fetch_metadata";
        }
        return null;
    }

    private void logAcceptedSample(HttpServletRequest request) {
        if (accessSampleEvery <= 0 || !request.getRequestURI().startsWith(API_PREFIX)
                || HEALTH_PATH.equals(request.getRequestURI())) {
            return;
        }
        if (acceptedCount.incrementAndGet() % accessSampleEvery != 0) {
            return;
        }
        LOG.info(
                "API_ACCESS_SAMPLE path={} ip={} userAgent={} origin={} referer={} secFetchSite={} secFetchMode={}",
                request.getRequestURI(),
                ClientIps.of(request),
                request.getHeader(HttpHeaders.USER_AGENT),
                request.getHeader(HttpHeaders.ORIGIN),
                request.getHeader(HttpHeaders.REFERER),
                request.getHeader(FETCH_SITE_HEADER),
                request.getHeader("Sec-Fetch-Mode"));
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private void logBlocked(HttpServletRequest request, String reason) {
        LOG.warn(
                "API_ORIGIN_BLOCKED reason={} path={} query={} ip={} userAgent={} origin={} referer={}",
                reason,
                request.getRequestURI(),
                request.getQueryString(),
                ClientIps.of(request),
                request.getHeader(HttpHeaders.USER_AGENT),
                request.getHeader(HttpHeaders.ORIGIN),
                request.getHeader(HttpHeaders.REFERER));
    }

    @Override
    protected void initFilterBean() {
        if (!enforcementEnabled) {
            LOG.warn("API_ORIGIN_ENFORCEMENT=false: /api/** esta aberto");
        } else {
            LOG.info("Protecao de /api/**: allowlist de Origin {}, User-Agent obrigatorio, Sec-Fetch obrigatorio={}",
                    allowedOrigins, requireFetchMetadata);
        }
    }

    private static String originOf(String url) {
        try {
            URI uri = new URI(url);
            if (uri.getScheme() == null || uri.getHost() == null) {
                return "";
            }
            String base = uri.getScheme() + "://" + uri.getHost();
            return uri.getPort() == -1 ? base : base + ":" + uri.getPort();
        } catch (URISyntaxException exception) {
            return "";
        }
    }

    private static String normalize(String origin) {
        String trimmed = origin.trim();
        while (trimmed.endsWith("/")) {
            trimmed = trimmed.substring(0, trimmed.length() - 1);
        }
        return trimmed.toLowerCase();
    }
}
