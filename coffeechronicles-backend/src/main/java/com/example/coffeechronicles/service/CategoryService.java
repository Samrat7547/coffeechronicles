package com.example.coffeechronicles.service;

import com.example.coffeechronicles.entity.Category;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface CategoryService {
    public Category addCategory(Category category);

    public Category updateCategory(Category category);

    public List<Category> getCategories();

    public Category getCategory(Integer cid);

    public void deleteCategory(Integer cid);

//    ResponseEntity<String> addNewCategory(Map<String, String> requestMap);
//    ResponseEntity<List<Category>> getAllCategory(String Value);
//
//    ResponseEntity<String> update(Map<String, String> requestMap);
}
