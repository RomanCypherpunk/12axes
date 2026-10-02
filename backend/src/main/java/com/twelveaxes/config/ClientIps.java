package com.twelveaxes.config;

import jakarta.servlet.http.HttpServletRequest;

/** Resolve o IP do cliente atras do proxy do Render. */
final class ClientIps {
    private ClientIps() {
    }

    /** O Render fica atras de proxy, entao o IP real vem no primeiro salto do X-Forwarded-For. */
    static String of(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded == null || forwarded.isBlank()) {
            return request.getRemoteAddr();
        }
        return forwarded.split(",")[0].trim();
    }
}
