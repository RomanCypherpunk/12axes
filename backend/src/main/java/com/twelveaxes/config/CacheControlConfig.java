package com.twelveaxes.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * GETs da API são determinísticos (dados estáticos e resultado por vetor), então
 * o navegador pode reaproveitar a resposta em vez de baixá-la de novo a cada visita.
 */
@Configuration
public class CacheControlConfig implements WebMvcConfigurer {
    private static final String CACHE_ONE_DAY = "public, max-age=86400";

    private static boolean isPaymentPath(String path) {
        return path.equals("/api/checkout") || path.equals("/api/unlock") || path.startsWith("/api/premium/");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptor() {
            @Override
            public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
                if ("GET".equals(request.getMethod())) {
                    response.setHeader("Cache-Control", CACHE_ONE_DAY);
                } else if (isPaymentPath(request.getRequestURI())) {
                    // Pagamento e relatorio sao por pessoa: nada disso pode ficar em cache.
                    response.setHeader("Cache-Control", "no-store");
                }
                return true;
            }
        }).addPathPatterns("/api/**").excludePathPatterns("/api/health");
    }
}
