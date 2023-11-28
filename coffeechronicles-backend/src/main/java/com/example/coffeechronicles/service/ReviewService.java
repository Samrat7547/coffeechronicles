package com.example.coffeechronicles.service;

import com.example.coffeechronicles.entity.Product;
import com.example.coffeechronicles.entity.Review;

import java.util.List;

public interface ReviewService {
    Review addReview(Review review);

    List<Review> getReviews();

    void deleteReview(Integer rid);

    List<Review> getReviewsOfProduct(Product product);
}
