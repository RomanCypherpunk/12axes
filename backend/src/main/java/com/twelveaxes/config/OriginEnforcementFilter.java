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
 * uma barreira e não uma tranca: derruba o uso casual da API por terceiros.
 */
@Component
public class OriginEnforcementFilter extends OncePerRequestFilter {
    private static final Logger LOG = LoggerFactory.getLogger(OriginEnforcementFilter.class);
    private static final String HEALTH_PATH = "/api/health";
    private static final String API_PREFIX = "/api/";
    private static final String FORBIDDEN_BODY =
            "{\"error\":\"forbidden\",\"message\":\"API de uso exclusivo de 12axes.vercel.app\"}";

    private final Set<String> allowedOrigins;
    private final boolean enforcementEnabled;

    public OriginEnforcementFilter(
            @Value("${app.frontend-origins}") String origins,
            @Value("${app.origin-enforcement:true}") boolean enforcementEnabled
    ) {
        this.allowedOrigins = Arrays.stream(origins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .map(OriginEnforcementFilter::normalize)
                .collect(Collectors.toUnmodifiableSet());
        this.enforcementEnabled = enforcementEnabled;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        if (isAllowed(request)) {
            chain.doFilter(request, response);
            return;
        }

        logBlocked(request);
        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(FORBIDDEN_BODY);
    }

    private boolean isAllowed(HttpServletRequest request) {
        if (!enforcementEnabled) {
            return true;
        }
        String path = request.getRequestURI();
        if (!path.startsWith(API_PREFIX) || HEALTH_PATH.equals(path)) {
            return true;
        }
        // Preflight CORS chega sem credenciais e é respondido pelo próprio Spring.
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        String origin = request.getHeader(HttpHeaders.ORIGIN);
        if (origin != null && !origin.isBlank()) {
            return allowedOrigins.contains(normalize(origin));
        }

        // Fallback: alguns navegadores omitem Origin em navegação direta, mas mandam Referer.
        String referer = request.getHeader(HttpHeaders.REFERER);
        return referer != null && allowedOrigins.contains(originOf(referer));
    }

    private void logBlocked(HttpServletRequest request) {
        LOG.warn(
                "API_ORIGIN_BLOCKED path={} query={} ip={} userAgent={} origin={} referer={}",
                request.getRequestURI(),
                request.getQueryString(),
                clientIp(request),
                request.getHeader(HttpHeaders.USER_AGENT),
                request.getHeader(HttpHeaders.ORIGIN),
                request.getHeader(HttpHeaders.REFERER));
    }

    @Override
    protected void initFilterBean() {
        if (!enforcementEnabled) {
            LOG.warn("API_ORIGIN_ENFORCEMENT=false: /api/** esta aberto");
        } else {
            LOG.info("Protecao de /api/**: allowlist de Origin {} (fase 1)", allowedOrigins);
        }
    }

    /** O Render fica atrás de proxy, então o IP real vem no primeiro salto do X-Forwarded-For. */
    private static String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded == null || forwarded.isBlank()) {
            return request.getRemoteAddr();
        }
        return forwarded.split(",")[0].trim();
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
