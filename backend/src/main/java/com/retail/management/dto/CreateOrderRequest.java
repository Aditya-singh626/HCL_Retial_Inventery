package com.retail.management.dto;

public class CreateOrderRequest {
    private Long userId;

    public CreateOrderRequest() {}

    public CreateOrderRequest(Long userId) {
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
