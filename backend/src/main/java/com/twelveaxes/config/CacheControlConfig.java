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

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptor() {
            @Override
            public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
                if ("GET".equals(request.getMethod())) {
                    response.setHeader("Cache-Control", CACHE_ONE_DAY);
                }
                return true;
            }
        }).addPathPatterns("/api/**").excludePathPatterns("/api/health");
    }
}
