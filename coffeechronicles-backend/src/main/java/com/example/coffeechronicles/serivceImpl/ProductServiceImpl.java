package com.example.coffeechronicles.serivceImpl;

import com.example.coffeechronicles.entity.Category;
import com.example.coffeechronicles.entity.Product;
import com.example.coffeechronicles.repo.ProductRepo;
import com.example.coffeechronicles.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepo productRepo;

    @Override
    public Product addProduct(Product product) {
        return this.productRepo.save(product);
    }

    @Override
    public Product updateProduct(Product product) {
        return this.productRepo.save(product);
    }

    @Override
    public List<Product> getProducts() {
        return this.productRepo.findAll();
    }

    @Override
    public Product getProduct(Integer pid) {
        return this.productRepo.findById(pid).get();
    }

    @Override
    public void deleteProduct(Integer pid) {
        this.productRepo.deleteById(pid);
    }

    @Override
    public List<Product> getProductsOfCategory(Category category) {
        return this.productRepo.findBycategory(category);
    }

    @Override
    public List<Product> getActiveProducts() {
        return this.productRepo.findByActive(true);
    }

    @Override
    public List<Product> getActiveProductsOfCategory(Category c) {
        return this.productRepo.findByCategoryAndActive(c,true);
    }
}

