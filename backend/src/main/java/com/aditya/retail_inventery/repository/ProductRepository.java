package com.aditya.retail_inventery.repository;

import com.aditya.retail_inventery.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // You can add custom queries later if needed, for example:
    Optional<Product> findBySku(String sku);
}
