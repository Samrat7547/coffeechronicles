package com.example.coffeechronicles.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pid;

    private String name;
    private Long price;
    @Column(length = 5000)
    private String description;

    private boolean active = true;
//    @Lob
//    @Column(columnDefinition = "longblob")
//    private byte[] img;


//    @ManyToOne(fetch = FetchType.LAZY , optional = false)
//    @JoinColumn(name = "cid",nullable = false)
//    @OnDelete(action = OnDeleteAction.CASCADE)
//    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    private Category category;


}