package com.example.coffeechronicles.controller;

import com.example.coffeechronicles.entity.Category;
import com.example.coffeechronicles.entity.Product;
import com.example.coffeechronicles.entity.Review;
import com.example.coffeechronicles.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@CrossOrigin
@RestController
@RequestMapping(path = "/review")
public class ReviewController {


    @Autowired
    ReviewService reviewService;

    @PostMapping(path = "/add")
    public ResponseEntity<Review> addReview(@RequestBody Review review) {
        Review  review1 = this.reviewService.addReview(review);
        return ResponseEntity.ok(review1);
    }

    @GetMapping(path = "/allReview")
    public List<Review> getReviews() {
        return this.reviewService.getReviews();
    }

    @DeleteMapping(path = "/{rid}")
    public void deleteReview(@PathVariable("rid") Integer rid) {
        this.reviewService.deleteReview(rid);
    }

    @GetMapping(path = "/product/{pid}")
    public List<Review> getReviewsOfProduct(@PathVariable("pid") Integer pid) {
        Product product = new Product();
        product.setPid(pid);
        return this.reviewService.getReviewsOfProduct(product);
    }
}
