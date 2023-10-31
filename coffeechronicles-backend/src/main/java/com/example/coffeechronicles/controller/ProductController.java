package com.example.coffeechronicles.controller;

import com.example.coffeechronicles.entity.Category;
import com.example.coffeechronicles.entity.Product;
import com.example.coffeechronicles.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@CrossOrigin
@RestController
@RequestMapping(path = "/product")
public class ProductController{
    @Autowired
    ProductService productService;

    @PostMapping(path = "/add")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        Product  product1 = this.productService.addProduct(product);
        return ResponseEntity.ok(product1);
    }

    @GetMapping(path = "/{pid}")
    public Product getProduct(@PathVariable("pid") Integer pid) {
        return this.productService.getProduct(pid);
    }



    @GetMapping(path = "/allProduct")
    public List<Product> getProducts() {
        return this.productService.getProducts();
    }

    @PutMapping(path = "/update")
    public Product updateProduct(@RequestBody Product product) {
        return this.productService.updateProduct(product);
    }

    @DeleteMapping(path = "/{pid}")
    public void deleteProduct(@PathVariable("pid") Integer pid) {
        this.productService.deleteProduct(pid);
    }

    @GetMapping(path = "/category/{cid}")
    public List<Product> getProductsOfCategory(@PathVariable("cid") Integer cid) {
        Category category = new Category();
        category.setCid(cid);
        return this.productService.getProductsOfCategory(category);
    }


    @GetMapping(path = "/active")
    public List<Product> getActiveProducts() {
        return this.productService.getActiveProducts();
    }

    @GetMapping(path = "/category/active/{cid}")
    public List<Product> getActiveProductsOfCategory(@PathVariable("cid") Integer cid) {
        Category category = new Category();
        category.setCid(cid);
        return this.productService.getActiveProductsOfCategory(category);
    }
}

