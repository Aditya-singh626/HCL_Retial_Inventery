package com.retail.management.config;

import com.retail.management.entity.Cart;
import com.retail.management.entity.Product;
import com.retail.management.entity.User;
import com.retail.management.repository.CartRepository;
import com.retail.management.repository.ProductRepository;
import com.retail.management.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(ProductRepository productRepository,
                           UserRepository userRepository,
                           CartRepository cartRepository,
                           PasswordEncoder passwordEncoder) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            logger.info("Initializing sample retail products into H2 database...");

            List<Product> sampleProducts = Arrays.asList(
                    new Product("Wireless Noise-Canceling Headphones",
                            "Premium over-ear headphones with active noise cancellation and 30-hour battery life.",
                            199.99, 30),
                    new Product("Mechanical Gaming Keyboard",
                            "RGB backlit mechanical keyboard with tactile switches and aluminum frame.",
                            89.99, 45),
                    new Product("Ultra-Wide 34-Inch Curved Monitor",
                            "144Hz WQHD curved gaming and productivity monitor with HDR support.",
                            349.50, 15),
                    new Product("Ergonomic Wireless Mouse",
                            "Precision optical sensor with dual bluetooth and 2.4GHz wireless connectivity.",
                            49.99, 50),
                    new Product("100W USB-C GaN Charger",
                            "Multi-port fast charging wall adapter for laptops, tablets, and smartphones.",
                            29.99, 75),
                    new Product("Smart Fitness Tracker Watch",
                            "Waterproof fitness watch with heart rate, SpO2, sleep monitor, and GPS tracking.",
                            119.00, 40),
                    new Product("Portable Waterproof Bluetooth Speaker",
                            "Compact speaker with rich bass, IPX7 water resistance, and 12-hour playtime.",
                            59.99, 35),
                    new Product("Adjustable Aluminum Laptop Stand",
                            "Ergonomic foldable desktop riser for all 10 to 17 inch laptops.",
                            39.99, 60)
            );

            productRepository.saveAll(sampleProducts);
            logger.info("Inserted {} products.", sampleProducts.size());
        }

        // Demo user for testing
        if (userRepository.count() == 0) {
            User demoUser = new User(
                    "Demo User",
                    "demo@retail.com",
                    passwordEncoder.encode("password123")
            );
            User savedDemo = userRepository.save(demoUser);
            cartRepository.save(new Cart(savedDemo.getId()));
            logger.info("Created demo user: email=demo@retail.com, password=password123");
        }
    }
}
