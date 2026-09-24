package com.twelveaxes;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

class OriginEnforcementTest {
    private static final String ALLOWED_ORIGIN = "https://12axes.vercel.app";
    private static final String CLONE_ORIGIN = "https://12axes.net";
    private static final String AXES_VECTOR = "50,50,50,50,50,50,50,50,50,50,50,50";

    @Nested
    @SpringBootTest
    @AutoConfigureMockMvc
    @TestPropertySource(properties = "app.origin-enforcement=true")
    class Enforcing {
        @Autowired
        private MockMvc mockMvc;

        @Test
        void allowsRequestFromAllowlistedOrigin() throws Exception {
            mockMvc.perform(get("/api/quiz").param("variant", "short").header(HttpHeaders.ORIGIN, ALLOWED_ORIGIN))
                    .andExpect(status().isOk());
        }

        @Test
        void allowsRefererFallbackFromAllowlistedOrigin() throws Exception {
            mockMvc.perform(get("/api/quiz").header(HttpHeaders.REFERER, ALLOWED_ORIGIN + "/resultado"))
                    .andExpect(status().isOk());
        }

        @Test
        void blocksRequestWithoutOrigin() throws Exception {
            mockMvc.perform(get("/api/results/by-axes").param("v", AXES_VECTOR).param("lang", "pt"))
                    .andExpect(status().isForbidden())
                    .andExpect(jsonPath("$.error").value("forbidden"));
        }

        @Test
        void blocksRequestFromCloneOrigin() throws Exception {
            mockMvc.perform(get("/api/results/by-axes")
                            .param("v", AXES_VECTOR)
                            .header(HttpHeaders.ORIGIN, CLONE_ORIGIN))
                    .andExpect(status().isForbidden());
        }

        @Test
        void blocksPostResultsWithoutOrigin() throws Exception {
            mockMvc.perform(post("/api/results")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"variant\":\"short\",\"answers\":[]}"))
                    .andExpect(status().isForbidden());
        }

        @Test
        void allowsHealthWithoutOrigin() throws Exception {
            mockMvc.perform(get("/api/health")).andExpect(status().isOk());
        }

        @Test
        void allowsCorsPreflight() throws Exception {
            mockMvc.perform(options("/api/results")
                            .header(HttpHeaders.ORIGIN, ALLOWED_ORIGIN)
                            .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))
                    .andExpect(status().isOk())
                    .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, ALLOWED_ORIGIN));
        }
    }

    @Nested
    @SpringBootTest
    @AutoConfigureMockMvc
    @TestPropertySource(properties = "app.origin-enforcement=false")
    class Disabled {
        @Autowired
        private MockMvc mockMvc;

        /**
         * Com a flag desligada o comportamento volta ao de antes do filtro: requisicoes
         * sem Origin passam. Origin explicitamente fora da allowlist continua barrado
         * pelo CORS do Spring, que e independente deste filtro.
         */
        @Test
        void allowsRequestWithoutOriginWhenFlagIsOff() throws Exception {
            mockMvc.perform(get("/api/results/by-axes").param("v", AXES_VECTOR))
                    .andExpect(status().isOk());
            mockMvc.perform(get("/api/quiz").param("variant", "short"))
                    .andExpect(status().isOk());
        }
    }
}
