package com.twelveaxes.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Limita quantas requisicoes cada IP faz por minuto em /api/**.
 *
 * <p>Roda antes do filtro de Origin de proposito: uma enxurrada de chamadas bloqueadas
 * (clientes de servidor sem Origin) tambem gasta thread e CPU, e responder 429 aqui e
 * mais barato do que montar o 403 com log. Resultados (POST /api/results e
 * /api/results/by-axes) tem limite proprio e menor, porque cada um faz o ranking de
 * ideologias, paises e personalidades.
 *
 * <p>Janela fixa de 1 minuto, em memoria. Com mais de uma instancia cada uma conta
 * separado, o que continua protegendo cada instancia.
 */
@Component
@Order(Ordered.LOWEST_PRECEDENCE - 10)
public class ApiRateLimitFilter extends OncePerRequestFilter {
    private static final Logger LOG = LoggerFactory.getLogger(ApiRateLimitFilter.class);
    private static final long WINDOW_MILLIS = 60_000L;
    private static final int PURGE_THRESHOLD = 20_000;
    private static final String API_PREFIX = "/api/";
    private static final String HEALTH_PATH = "/api/health";
    private static final String RESULTS_PATH = "/api/results";
    private static final String TOO_MANY_BODY =
            "{\"error\":\"too_many_requests\",\"message\":\"Muitas requisicoes. Tente de novo em instantes.\"}";

    private static final class Window {
        private long startedAt;
        private int count;
    }

    private final boolean enabled;
    private final int heavyPerMinute;
    private final int generalPerMinute;
    private final ConcurrentHashMap<String, Window> windows = new ConcurrentHashMap<>();

    public ApiRateLimitFilter(
            @Value("${app.rate-limit.enabled:true}") boolean enabled,
            @Value("${app.rate-limit.heavy-per-minute:60}") int heavyPerMinute,
            @Value("${app.rate-limit.general-per-minute:240}") int generalPerMinute
    ) {
        this.enabled = enabled;
        this.heavyPerMinute = heavyPerMinute;
        this.generalPerMinute = generalPerMinute;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        if (!isLimited(request)) {
            chain.doFilter(request, response);
            return;
        }

        boolean heavy = isHeavy(request.getRequestURI());
        int limit = heavy ? heavyPerMinute : generalPerMinute;
        String key = (heavy ? "heavy|" : "general|") + ClientIps.of(request);
        long now = System.currentTimeMillis();
        long retryAfterMillis = tryAcquire(key, limit, now);
        if (retryAfterMillis == 0) {
            chain.doFilter(request, response);
            return;
        }

        LOG.warn("API_RATE_LIMITED path={} ip={} limit={}/min origin={}",
                request.getRequestURI(), ClientIps.of(request), limit, request.getHeader("Origin"));
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setHeader("Retry-After", String.valueOf(Math.max(1, (retryAfterMillis + 999) / 1000)));
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(TOO_MANY_BODY);
    }

    /** Devolve 0 se a requisicao cabe na janela, ou quantos ms faltam para a janela virar. */
    private long tryAcquire(String key, int limit, long now) {
        if (windows.size() > PURGE_THRESHOLD) {
            windows.entrySet().removeIf(entry -> now - entry.getValue().startedAt > 2 * WINDOW_MILLIS);
        }
        Window window = windows.computeIfAbsent(key, ignored -> new Window());
        synchronized (window) {
            if (now - window.startedAt >= WINDOW_MILLIS) {
                window.startedAt = now;
                window.count = 0;
            }
            if (window.count < limit) {
                window.count++;
                return 0;
            }
            return window.startedAt + WINDOW_MILLIS - now;
        }
    }

    private boolean isLimited(HttpServletRequest request) {
        if (!enabled) {
            return false;
        }
        String path = request.getRequestURI();
        if (!path.startsWith(API_PREFIX) || HEALTH_PATH.equals(path)) {
            return false;
        }
        // Preflight CORS e barato e vem junto de cada POST legitimo.
        return !HttpMethod.OPTIONS.matches(request.getMethod());
    }

    private static boolean isHeavy(String path) {
        return path.equals(RESULTS_PATH) || path.startsWith(RESULTS_PATH + "/");
    }
}
