package com.example.coffeechronicles.serivceImpl;

import com.example.coffeechronicles.entity.Category;
import com.example.coffeechronicles.jwt.CustomerUserDetailsService;
import com.example.coffeechronicles.jwt.JwtFilter;
import com.example.coffeechronicles.jwt.JwtUtil;
import com.example.coffeechronicles.repo.CategoryRepo;
import com.example.coffeechronicles.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepo categoryRepo;
    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    JwtFilter jwtFilter;
    @Autowired
    CustomerUserDetailsService customerUserDetailsService;


    @Override
    public Category addCategory(Category category) {

            if(jwtFilter.isAdmin()){
                return this.categoryRepo.save(category);
            }
            else{
                throw new RuntimeException("Unauthorized Access");
            }


    }

    @Override
    public Category updateCategory(Category category) {
        if(jwtFilter.isAdmin()){
            return this.categoryRepo.save(category);
        }
        else{
            throw new RuntimeException("Unauthorized Access");
        }
    }

    @Override
    public List<Category> getCategories() {
        return this.categoryRepo.findAll();
    }

    @Override
    public Category getCategory(Integer cid) {
        return this.categoryRepo.findById(cid).get();
    }

    @Override
    public void deleteCategory(Integer cid) {
        if(jwtFilter.isAdmin()) {
            this.categoryRepo.deleteById(cid);
        }
        else
            throw new RuntimeException("Unauthorized Access");
    }



}
