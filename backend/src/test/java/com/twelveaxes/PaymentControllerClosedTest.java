package com.twelveaxes;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/** Com os pagamentos desligados (o padrao), os endpoints de compra nao existem. */
@SpringBootTest
@AutoConfigureMockMvc
class PaymentControllerClosedTest {
    private static final String VECTOR = "65,32.5,50,40,30,60,70,50,45,55,35,80";

    @Autowired
    private MockMvc mockMvc;

    @Test
    void checkoutIs404WhenPaymentsDisabled() throws Exception {
        mockMvc.perform(post("/api/checkout").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"v\":\"" + VECTOR + "\",\"lang\":\"pt\",\"returnUrl\":\"http://localhost:5173/results\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void unlockIs404WhenPaymentsDisabled() throws Exception {
        mockMvc.perform(post("/api/unlock").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"v\":\"" + VECTOR + "\",\"sessionId\":\"cs_test_a1B2c3D4e5F6\"}"))
                .andExpect(status().isNotFound());
    }
}
