package com.example.coffeechronicles.repo;

import com.example.coffeechronicles.entity.Category;
import com.example.coffeechronicles.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product,Integer> {

    public List<Product> findBycategory(Category category);

    public List<Product> findByActive(Boolean b);

    public List<Product> findByCategoryAndActive(Category c, Boolean b);
}
