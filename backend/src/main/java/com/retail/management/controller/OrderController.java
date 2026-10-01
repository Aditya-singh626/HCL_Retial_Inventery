package com.retail.management.controller;

import com.retail.management.dto.CreateOrderRequest;
import com.retail.management.dto.OrderResponse;
import com.retail.management.security.SecurityUtils;
import com.retail.management.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;
    private final SecurityUtils securityUtils;

    public OrderController(OrderService orderService, SecurityUtils securityUtils) {
        this.orderService = orderService;
        this.securityUtils = securityUtils;
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody(required = false) CreateOrderRequest request) {
        try {
            Long userId = null;
            if (request != null && request.getUserId() != null) {
                userId = request.getUserId();
            } else {
                userId = securityUtils.getCurrentUserId()
                        .orElseThrow(() -> new IllegalArgumentException("User not authenticated or userId not provided"));
            }

            OrderResponse order = orderService.createOrderFromCart(userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred: " + e.getMessage()));
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserOrders(@PathVariable Long userId) {
        try {
            List<OrderResponse> orders = orderService.getOrdersByUserId(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
