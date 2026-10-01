package com.retail.management.controller;

import com.retail.management.dto.AddToCartRequest;
import com.retail.management.dto.CartResponse;
import com.retail.management.security.SecurityUtils;
import com.retail.management.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;
    private final SecurityUtils securityUtils;

    public CartController(CartService cartService, SecurityUtils securityUtils) {
        this.cartService = cartService;
        this.securityUtils = securityUtils;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@Valid @RequestBody AddToCartRequest request) {
        try {
            Long userId = request.getUserId();
            if (userId == null) {
                userId = securityUtils.getCurrentUserId()
                        .orElseThrow(() -> new IllegalArgumentException("User not authenticated or userId not provided"));
            }

            int quantity = request.getQuantity() != null ? request.getQuantity() : 1;
            CartResponse cart = cartService.addToCart(userId, request.getProductId(), quantity);
            return ResponseEntity.ok(cart);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getCart(@PathVariable Long userId) {
        try {
            CartResponse cart = cartService.getCartByUserId(userId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{userId}/item/{productId}")
    public ResponseEntity<?> updateItemQuantity(@PathVariable Long userId,
                                                @PathVariable Long productId,
                                                @RequestBody Map<String, Integer> body) {
        try {
            int quantity = body.getOrDefault("quantity", 1);
            CartResponse cart = cartService.updateItemQuantity(userId, productId, quantity);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{userId}/item/{productId}")
    public ResponseEntity<?> removeItem(@PathVariable Long userId, @PathVariable Long productId) {
        try {
            CartResponse cart = cartService.removeItem(userId, productId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {
        try {
            cartService.clearCart(userId);
            return ResponseEntity.ok(Map.of("message", "Cart cleared successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
