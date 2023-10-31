package com.example.coffeechronicles.service;

import com.example.coffeechronicles.entity.Category;
import com.example.coffeechronicles.entity.Product;

import java.util.List;

public interface ProductService {
    public Product addProduct(Product quiz);

    public Product updateProduct(Product quiz);

    public List<Product> getProducts();

    public Product getProduct(Integer qId);

    public void deleteProduct(Integer qId);


    public List<Product> getProductsOfCategory(Category category);

    public  List<Product> getActiveProducts();

    public List<Product> getActiveProductsOfCategory(Category c);
}