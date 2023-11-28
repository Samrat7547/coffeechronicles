package com.example.coffeechronicles.serivceImpl;

import com.example.coffeechronicles.entity.Category;
import com.example.coffeechronicles.entity.Product;
import com.example.coffeechronicles.entity.Review;
import com.example.coffeechronicles.jwt.JwtFilter;
import com.example.coffeechronicles.repo.ReviewRepo;
import com.example.coffeechronicles.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {


    @Autowired
    private ReviewRepo reviewRepo;
    @Autowired
    JwtFilter jwtFilter;
    @Override
    public Review addReview(Review review) {
        return this.reviewRepo.save(review);
    }

    @Override
    public List<Review> getReviews() {

        return this.reviewRepo.findAll();
//        if(jwtFilter.isAdmin()){
//            return this.reviewRepo.findAll();
//        }
//        else{
//            throw new RuntimeException("Unauthorized Access");
//        }
    }

    @Override
    public void deleteReview(Integer rid) {
        this.reviewRepo.deleteById(rid);
    }
    @Override
    public List<Review> getReviewsOfProduct(Product product) {
        return this.reviewRepo.findByproduct(product);
    }
}
