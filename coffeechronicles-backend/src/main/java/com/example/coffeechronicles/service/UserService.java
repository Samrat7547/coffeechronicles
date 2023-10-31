package com.example.coffeechronicles.service;

import com.example.coffeechronicles.entity.User;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface UserService {
    ResponseEntity<String> signup(Map<String, String> requestMap);

    ResponseEntity<String> login(Map<String, String> requestMap);

    public List<User> getAllUser();

    ResponseEntity<String> update(Map<String, String> requestMap);
    ResponseEntity<String> deleteUser(Integer id);

    ResponseEntity<Optional> getCurrentUser();

//    ResponseEntity<String> checkToken();
//
//    ResponseEntity<String> changePassword(Map<String, String> requestMap);
//
//    ResponseEntity<String> forgetPassword(Map<String, String> requestMap);
}
