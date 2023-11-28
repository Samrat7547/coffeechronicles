package com.example.coffeechronicles.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@Entity
@Data
@DynamicInsert
@DynamicUpdate
@Table(name = "bill")
public class Bill {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Integer id;
    private String uuid;
    private String name;
    private String email;
    private String paymentMethod;
    private String totalAmount;
    private String orderType;
    private String contactNumber;

    @Column( columnDefinition = "json")
    private String productDetail;
    private String createdBy;
    private boolean active = true;
}
