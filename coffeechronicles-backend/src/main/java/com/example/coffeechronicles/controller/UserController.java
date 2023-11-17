package com.example.coffeechronicles.controller;

import com.example.coffeechronicles.entity.User;
import com.example.coffeechronicles.repo.UserRepository;
import com.example.coffeechronicles.service.UserService;
import com.example.coffeechronicles.wrapper.AuthenticationResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@CrossOrigin
@RestController
@RequestMapping(path = "/user")
public class UserController {
    @Autowired
    UserService userService;
    @Autowired
    UserRepository userRepo;

    @PostMapping(path = "/signup")
    public ResponseEntity<String> signup(@RequestBody Map<String, String> requestMap) {
        try {
            return userService.signup(requestMap);
        } catch (Exception ex) {
            ex.printStackTrace();

        }
        return new ResponseEntity<>("Something Went Wrong", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> requestMap) {
        try {
            return userService.login(requestMap);
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @GetMapping(path = "/allUser")
    public List<User> getAllUsers() {
        return this.userService.getAllUser();
    }

    @GetMapping("/userDetails")
    public ResponseEntity<Optional> getCurrentUser() {
        try {
            return userService.getCurrentUser();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }



    @PostMapping("/update")
    public ResponseEntity<String> update(@RequestBody Map<String, String> requestMap) {
        try {
            return userService.update(requestMap);
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {
        try {
            return userService.deleteUser(id);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    @PostMapping(path = "/changePassword")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> requestMap){
        try {
            return userService.changePassword(requestMap);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>("SOMETHING_WENT_WRONG", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping(path = "/forgotPassword")
    public ResponseEntity<String> forgetPassword(@RequestBody Map<String, String> requestMap){
        try {
//            return userService.forgetPassword(requestMap);
            User user = userRepo.findByEmail(requestMap.get("email"));
            if (user != null) {
                ResponseEntity<String> response = userService.forgetPassword(requestMap);
                return response;
            } else {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>("SOMETHING_WENT_WRONG", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping(path = "/updatePassword")
    public ResponseEntity<String> updatePassword(@RequestBody Map<String, String> requestMap){
        try {
            return userService.updatePassword(requestMap);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>("SOMETHING_WENT_WRONG", HttpStatus.INTERNAL_SERVER_ERROR);
    }


    @PostMapping("/google")
    public ResponseEntity<String> authenticateGoogle(@RequestBody String idToken) throws  Exception{
        try {
            // Initialize the Google API client
            HttpTransport transport = GoogleNetHttpTransport.newTrustedTransport();
            JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();


            // Build the Google ID token verifier
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                    .setAudience(Collections.singletonList("70674515851-as87gs0v1dsuf9fsslu8on3lnd1d960j.apps.googleusercontent.com")) // Replace with your actual client ID
                    .build();


            // Verify the ID token
            GoogleIdToken googleIdToken = verifier.verify(idToken);
            if (googleIdToken != null) {
                // Extract user information from the payload
                GoogleIdToken.Payload payload = googleIdToken.getPayload();
                String userId = payload.getSubject();
                System.out.println("User ID: " + userId);
                System.out.println(payload.getEmail());

                // Add your logic to process the verified ID token
                // ...
//                AuthenticationResponse response = userService.authenticateViaGoogle(payload.getEmail());
               return userService.authenticateViaGoogle(payload.getEmail());
//                System.out.println("response.toString()");
//                System.out.println(response.toString());
//                return ResponseEntity.ok().body("{\"token\": \""+response.getToken()+"\"}");
            } else {
                System.out.println("Invalid ID token.");
                return ResponseEntity.badRequest().body("{\"error\": \"Invalid ID token\"}");
            }
        } catch (GeneralSecurityException | IOException e) {
            // Handle exceptions appropriately
            e.printStackTrace();
            return ResponseEntity.status(500).body("{\"error\": \"Internal Server Error\"}");
        }


    }


}
