package com.aditya.retail_inventery.repository;

import com.aditya.retail_inventery.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    // You can add custom queries later if needed
}
