package com.example.coffeechronicles.service;

import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface AnalyticsService {
    ResponseEntity<Map<String, Object>> getCount();
}
