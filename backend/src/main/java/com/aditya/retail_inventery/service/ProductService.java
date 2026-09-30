package com.aditya.retail_inventery.service;

import com.aditya.retail_inventery.entity.Product;
import com.aditya.retail_inventery.repository.ProductRepository;
import org.springframework.stereotype.Service;
// import java.util.Optional;
import java.util.List;

@Service
public class ProductService {
    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    public Product getProduct(String skn) {
        return repo.findBySku(skn).orElse(null);
    }

    public String createProduct(Product product) {
        if (repo.findBySku(product.getSku()).isPresent()) {
            return "Product with SKU " + product.getSku() + " already exists. Updating instead.";
        } else {
            repo.save(product);
            return "New product created successfully with SKU " + product.getSku();
        }
    }

    public String deleteProduct(String skn) {
        repo.findBySku(skn).ifPresent(repo::delete);
        return "Product with SKU " + skn + " deleted successfully.";
    }

    public Product updateProduct(String skn, Product product) {
        Product existingProduct = repo.findBySku(skn).orElse(null);
        if (existingProduct != null) {
            existingProduct.setName(product.getName());
            existingProduct.setPrice(product.getPrice());
            return repo.save(existingProduct);
        }
        return null;
    }
}
