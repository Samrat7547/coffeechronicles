package com.example.coffeechronicles.controller;

import com.example.coffeechronicles.entity.Category;
import com.example.coffeechronicles.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RequestMapping(path = "/category")
@RequiredArgsConstructor
@RestController
public class CategoryController{
    @Autowired
    CategoryService categoryService;

    @PostMapping(path= "/add")
    public ResponseEntity<Category> addCategory(@RequestBody Category category) {
        Category category1 = this.categoryService.addCategory(category);
        return ResponseEntity.ok(category1);
    }

    @GetMapping(path = "/{cid}")
    public Category getCategory (@PathVariable("cid") Integer cid) {
        return this.categoryService.getCategory(cid);
    }

    @GetMapping(path = "/allCategory")
    public List<Category> getCategories() {
        return this.categoryService.getCategories();
    }

    @PutMapping(path = "/update")
    public Category updateCategory(@RequestBody Category category) {
        return this.categoryService.updateCategory(category);
    }

    @DeleteMapping(path = "/{cid}")
    public  void deleteCategory(@PathVariable("cid") Integer cid) {
        this.categoryService.deleteCategory(cid);
    }
}
