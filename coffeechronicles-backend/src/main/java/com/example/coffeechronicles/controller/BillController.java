package com.example.coffeechronicles.controller;

import com.example.coffeechronicles.entity.Bill;
import com.example.coffeechronicles.entity.Product;
import com.example.coffeechronicles.entity.TransactionDetails;
import com.example.coffeechronicles.service.BillService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@CrossOrigin
@RestController
@RequestMapping(path = "/bill")
public class BillController {

    @Autowired
    private BillService billService;
    @PostMapping(path = "/generate")
    public ResponseEntity<String> generateBill(@RequestBody Map<String, Object> requestMap) {
        try{
            return billService.generateBill(requestMap);
        }
        catch (Exception ex){
            ex.printStackTrace();
        }
        return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping(path = "/get")
    public ResponseEntity<List<Bill>> geBill() {
        try{
            return billService.getBill();
        }
        catch(Exception ex){
            ex.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>() , HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping(path = "/getPdf")
    public ResponseEntity<byte[]> getPdf(@RequestBody Map<String, Object> requestMap){
        try {
            return billService.getPdf(requestMap);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }
    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<String> deleteBill(@PathVariable("id") Integer id){
        try {
            return billService.delete(id);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping(path = "/transaction/{amount}")
    public TransactionDetails createTransaction(@PathVariable(name = "amount")Double amount){
        return billService.createTransaction(amount);
    }
    @PostMapping("/update")
    public ResponseEntity<String> update(@RequestBody Map<String, String> requestMap) {
        try {
            return billService.update(requestMap);
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
