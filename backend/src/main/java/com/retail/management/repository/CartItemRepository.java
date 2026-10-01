package com.retail.management.repository;

import com.retail.management.entity.Cart;
import com.retail.management.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProductId(Cart cart, Long productId);
    void deleteByCartAndProductId(Cart cart, Long productId);
}
