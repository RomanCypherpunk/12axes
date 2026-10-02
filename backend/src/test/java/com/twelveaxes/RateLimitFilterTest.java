package com.twelveaxes;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "app.origin-enforcement=false",
        "app.rate-limit.enabled=true",
        "app.rate-limit.heavy-per-minute=3",
        "app.rate-limit.general-per-minute=5"
})
class RateLimitFilterTest {
    private static final String AXES_VECTOR = "50,50,50,50,50,50,50,50,50,50,50,50";

    @Autowired
    private MockMvc mockMvc;

    @Test
    void blocksResultsAfterHeavyLimitPerIp() throws Exception {
        String ip = "203.0.113.10";
        for (int i = 0; i < 3; i++) {
            mockMvc.perform(get("/api/results/by-axes").param("v", AXES_VECTOR).header("X-Forwarded-For", ip))
                    .andExpect(status().isOk());
        }
        mockMvc.perform(get("/api/results/by-axes").param("v", AXES_VECTOR).header("X-Forwarded-For", ip))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().exists(HttpHeaders.RETRY_AFTER))
                .andExpect(jsonPath("$.error").value("too_many_requests"));
    }

    @Test
    void limitsEachIpSeparately() throws Exception {
        for (int i = 0; i < 3; i++) {
            mockMvc.perform(get("/api/results/by-axes").param("v", AXES_VECTOR).header("X-Forwarded-For", "203.0.113.20"))
                    .andExpect(status().isOk());
        }
        mockMvc.perform(get("/api/results/by-axes").param("v", AXES_VECTOR).header("X-Forwarded-For", "203.0.113.21"))
                .andExpect(status().isOk());
    }

    @Test
    void usesTheGeneralLimitForOtherEndpoints() throws Exception {
        String ip = "203.0.113.30";
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(get("/api/quiz").header("X-Forwarded-For", ip)).andExpect(status().isOk());
        }
        mockMvc.perform(get("/api/quiz").header("X-Forwarded-For", ip)).andExpect(status().isTooManyRequests());
    }

    @Test
    void neverLimitsHealthOrPreflight() throws Exception {
        String ip = "203.0.113.40";
        for (int i = 0; i < 12; i++) {
            mockMvc.perform(get("/api/health").header("X-Forwarded-For", ip)).andExpect(status().isOk());
            mockMvc.perform(options("/api/results")
                            .header("X-Forwarded-For", ip)
                            .header(HttpHeaders.ORIGIN, "https://12axes.vercel.app")
                            .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))
                    .andExpect(status().isOk());
        }
    }
}
