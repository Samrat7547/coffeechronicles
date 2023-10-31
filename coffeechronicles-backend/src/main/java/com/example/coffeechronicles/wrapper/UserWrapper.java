package com.example.coffeechronicles.wrapper;

import com.example.coffeechronicles.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserWrapper {
    private Integer id;
    private String userName;
    private String password;
    private String firstName;
    private String lastName;

    private String email;
    private String phone;
    //private boolean enabled = true;
    private String status;
    private UserRole role;

}
