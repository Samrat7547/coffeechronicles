package com.example.coffeechronicles.controller;

import com.example.coffeechronicles.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequiredArgsConstructor
@CrossOrigin
@RestController
@RequestMapping(path = "/analytics")
public class AnalyticsController {
    @Autowired
    AnalyticsService analyticsService;
    @GetMapping(path = "/details")
    public ResponseEntity<Map<String , Object>> getCount(){
        return analyticsService.getCount();
    }
}
