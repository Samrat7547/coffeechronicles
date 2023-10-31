package com.example.coffeechronicles.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

@Data
@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(unique = true)
    private String userName;
    @JsonIgnore
    private String password;
    private String firstName;
    private String lastName;

    private String email;
    private String phone;
//    private boolean enabled = true;
    private String status;
//    private String profile;
    @Enumerated(EnumType.STRING)
    private UserRole role;
//    @Lob
//    @Column(columnDefinition = "longblob")
//    private byte[] img;
}
