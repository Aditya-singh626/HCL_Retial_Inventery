package com.retail.management;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.retail.management.dto.AddToCartRequest;
import com.retail.management.dto.AuthResponse;
import com.retail.management.dto.LoginRequest;
import com.retail.management.dto.SignupRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class RetailManagementApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void contextLoads() {
    }

    @Test
    void testFullRetailFlow() throws Exception {
        // 1. Signup new user
        SignupRequest signupRequest = new SignupRequest("Alice Tester", "alice@test.com", "secret123");
        MvcResult signupResult = mockMvc.perform(post("/users/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        AuthResponse auth = objectMapper.readValue(signupResult.getResponse().getContentAsString(), AuthResponse.class);
        assertThat(auth.getToken()).isNotBlank();
        Long userId = auth.getId();
        String token = "Bearer " + auth.getToken();

        // 2. Login
        LoginRequest loginRequest = new LoginRequest("alice@test.com", "secret123");
        mockMvc.perform(post("/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk());

        // 3. List products (public endpoint)
        MvcResult productsResult = mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andReturn();
        assertThat(productsResult.getResponse().getContentAsString()).contains("Wireless Noise-Canceling Headphones");

        // 4. Add product to cart (protected)
        AddToCartRequest addToCartRequest = new AddToCartRequest(userId, 1L, 2);
        mockMvc.perform(post("/cart/add")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addToCartRequest)))
                .andExpect(status().isOk());

        // 5. Get cart
        MvcResult cartResult = mockMvc.perform(get("/cart/" + userId)
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andReturn();
        assertThat(cartResult.getResponse().getContentAsString()).contains("Wireless Noise-Canceling Headphones");

        // 6. Place order from cart
        MvcResult orderResult = mockMvc.perform(post("/orders")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"userId\":" + userId + "}"))
                .andExpect(status().isCreated())
                .andReturn();
        assertThat(orderResult.getResponse().getContentAsString()).contains("CONFIRMED");

        // 7. Get user orders
        MvcResult userOrdersResult = mockMvc.perform(get("/orders/" + userId)
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andReturn();
        assertThat(userOrdersResult.getResponse().getContentAsString()).contains("CONFIRMED");
    }
}
