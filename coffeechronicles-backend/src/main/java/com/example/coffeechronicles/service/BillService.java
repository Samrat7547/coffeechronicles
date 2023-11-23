package com.example.coffeechronicles.service;

import com.example.coffeechronicles.entity.Bill;
import com.example.coffeechronicles.entity.TransactionDetails;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface BillService {
    ResponseEntity<String> generateBill(Map<String, Object> requestMap);

    ResponseEntity<List<Bill>> getBill();
    ResponseEntity<byte[]> getPdf(Map<String, Object> requestMap);

    TransactionDetails createTransaction(Double amount);

    ResponseEntity<String> delete(Integer id);
}
