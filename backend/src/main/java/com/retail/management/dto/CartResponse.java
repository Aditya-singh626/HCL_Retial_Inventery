package com.retail.management.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CartResponse {
    private Long id;
    private Long userId;
    private LocalDateTime createdAt;
    private List<CartItemResponse> items = new ArrayList<>();
    private Double totalAmount = 0.0;
    private Integer totalItems = 0;

    public CartResponse() {}

    public CartResponse(Long id, Long userId, LocalDateTime createdAt, List<CartItemResponse> items) {
        this.id = id;
        this.userId = userId;
        this.createdAt = createdAt;
        this.items = items != null ? items : new ArrayList<>();
        this.totalAmount = this.items.stream()
                .mapToDouble(i -> i.getSubtotal() != null ? i.getSubtotal() : 0.0)
                .sum();
        this.totalItems = this.items.stream()
                .mapToInt(i -> i.getQuantity() != null ? i.getQuantity() : 0)
                .sum();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<CartItemResponse> getItems() {
        return items;
    }

    public void setItems(List<CartItemResponse> items) {
        this.items = items;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }
}
