package com.example.coffeechronicles.repo;


import com.example.coffeechronicles.entity.Product;
import com.example.coffeechronicles.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepo extends JpaRepository<Review,Integer> {

    public List<Review> findByproduct(Product product);
}


