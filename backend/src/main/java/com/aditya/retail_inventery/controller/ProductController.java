package com.aditya.retail_inventery.controller;

import com.aditya.retail_inventery.entity.Product;
import com.aditya.retail_inventery.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping ("/all")
    public List<Product> getAllProducts() {
        return service.getAllProducts();
    }

    @GetMapping("get/{skn}")
    public Product getProduct(@PathVariable String skn) {
        return service.getProduct(skn);
    }

    @PostMapping("/create")
    public String createProduct(@RequestBody Product product) {
        return service.createProduct(product);
    }

    @PutMapping("/update/{skn}")
    public Product updateProduct(@PathVariable String skn, @RequestBody Product product    ) {
        return service.updateProduct(skn, product);
    }

    @DeleteMapping("/delete/{skn}")
    public String deleteProduct(@PathVariable String skn) {
        return service.deleteProduct(skn);
    }   
}
