package com.example.coffeechronicles.entity;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionDetails {
    private String orderId;
    private String currency;
    private Integer amount;
    private String key;
}
