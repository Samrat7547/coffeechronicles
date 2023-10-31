package com.example.coffeechronicles.serivceImpl;

import com.example.coffeechronicles.repo.BillRepo;
import com.example.coffeechronicles.repo.CategoryRepo;
import com.example.coffeechronicles.repo.ProductRepo;
import com.example.coffeechronicles.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    CategoryRepo categoryRepo;

    @Autowired
    ProductRepo productRepo;

    @Autowired
    BillRepo billRepo;


    @Override
    public ResponseEntity<Map<String, Object>> getCount() {
        System.out.println("inside getCount");

        Map<String, Object> map = new HashMap<>();
        map.put("category", categoryRepo.count());
        map.put("product", productRepo.count());
        map.put("bill", billRepo.count());
        return new ResponseEntity<>(map, HttpStatus.OK);
    }
}
