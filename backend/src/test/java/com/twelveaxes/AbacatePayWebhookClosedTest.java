package com.twelveaxes;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

/** Sem ABACATEPAY_WEBHOOK_SECRET o endpoint do webhook nao existe, mesmo com os pagamentos ligados. */
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "app.payments.enabled=true",
        "app.payments.entitlement-secret=0123456789abcdef0123456789abcdef",
        "app.payments.abacatepay-webhook-secret="
})
class AbacatePayWebhookClosedTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void withoutAConfiguredSecretTheEndpointIs404EvenForAnEmptySecret() throws Exception {
        mockMvc.perform(post("/api/webhooks/abacatepay").param("webhookSecret", "").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isNotFound());
        mockMvc.perform(post("/api/webhooks/abacatepay").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isNotFound());
    }
}
