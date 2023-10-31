package com.example.coffeechronicles.serivceImpl;

import com.example.coffeechronicles.entity.User;
import com.example.coffeechronicles.entity.UserRole;
import com.example.coffeechronicles.jwt.CustomerUserDetailsService;
import com.example.coffeechronicles.jwt.JwtFilter;
import com.example.coffeechronicles.jwt.JwtUtil;
import com.example.coffeechronicles.repo.UserRepository;
import com.example.coffeechronicles.service.UserService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepo;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    CustomerUserDetailsService customerUserDetailsService;
    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    JwtFilter jwtFilter;


    @Override
    public ResponseEntity<String> signup(Map<String, String> requestMap) {
        try {
            if (this.validateSignupMap(requestMap, false)) {
                User user = userRepo.findByEmail(requestMap.get("email"));
                if (Objects.isNull(user)) {
                    userRepo.save(this.getUserFromMap(requestMap, false));
                    return new ResponseEntity<>("Successfully Registered", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Email already exists", HttpStatus.BAD_REQUEST);
                }
            } else {
                return new ResponseEntity<>("Invalid Data", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return new ResponseEntity<>("Something Went Wrong", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private boolean validateSignupMap(Map<String, String> requestMap, boolean validateId) {
        if(requestMap.containsKey("firstName")
                && requestMap.containsKey("lastName")
                && requestMap.containsKey("userName")
                && requestMap.containsKey("email")
                && requestMap.containsKey("password")
                && requestMap.containsKey("phone")){
            return true;
//        if (requestMap.containsKey("email")) {
//            if (requestMap.containsKey("id") && validateId) {
//                return true;
//            } else return !validateId;
        }
        return false;
    }

    private User getUserFromMap(Map<String, String> requestMap, boolean isAdd) {
        User user = new User();
        if (isAdd) {
            user.setId(Integer.parseInt(requestMap.get("id")));
        } else user.setStatus("true");
        user.setFirstName(requestMap.get("firstName"));
        user.setLastName(requestMap.get("lastName"));
        user.setUserName(requestMap.get("userName"));
        user.setEmail(requestMap.get("email"));
//        user.setPassword(requestMap.get("password"));
        user.setPassword(passwordEncoder.encode(requestMap.get("password")));
        user.setPhone(requestMap.get("phone"));

        user.setStatus("true");
        user.setRole(UserRole.CUSTOMER);
        return user;
    }

    @Override
    public ResponseEntity<String> login(Map<String, String> requestMap) {
        log.info("Inside login");
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(requestMap.get("userName"), requestMap.get("password")));
            if (authentication.isAuthenticated()) {
                if (customerUserDetailsService.getUserDetail().getStatus().equalsIgnoreCase("true")) {
//                    return  new ResponseEntity<String>("{\"token\":\""+
//                            jwtUtil.generateToken(customerUserDetailsService.getUserDetail().getEmail(),
//                                    customerUserDetailsService.getUserDetail().getRole())+"\"}",HttpStatus.OK);
                    return new ResponseEntity<String>("{\"token\":\"" + jwtUtil.generateToken(customerUserDetailsService.getUserDetail().getEmail(), String.valueOf(customerUserDetailsService.getUserDetail().getRole())) + "\",\"role\":\"" + customerUserDetailsService.getUserDetail().getRole() + "\"}", HttpStatus.OK);

                } else {
                    return new ResponseEntity<String>("{\"message\":\"" + "Wait for admin approval" + "\"}", HttpStatus.BAD_REQUEST);
                }
            }
        } catch (Exception exception) {
            log.error("{}", exception);
        }
        return new ResponseEntity<String>("{\"message\":\"" + "Bad credentials" + "\"}", HttpStatus.BAD_REQUEST);
    }

    @PostConstruct
    public void createAdminAccount(){
        User adminAccount = userRepo.findByRole(UserRole.ADMIN);
        if(null == adminAccount){
            User user= new User();
            user.setFirstName("admin");
            user.setLastName("admin");
            user.setUserName("admin");
            user.setEmail("admin@test.com");
//        user.setPassword(requestMap.get("password"));
            user.setPassword(passwordEncoder.encode("admin"));
            user.setPhone("1111111111");

        user.setStatus("true");
            user.setRole(UserRole.ADMIN);
            userRepo.save(user);
        }
    }

    @Override
    public List<User> getAllUser() {
        if (jwtFilter.isAdmin()) {
            return this.userRepo.getAllUser();
        }
        return this.userRepo.getByUsername(jwtFilter.getCurrentUser());
    }

    @Override
    public ResponseEntity<Optional> getCurrentUser() {

        try {

            return new ResponseEntity<>(userRepo.getByName(jwtFilter.getCurrentUser()), HttpStatus.OK);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> update(Map<String, String> requestMap) {
        try {
            if (jwtFilter.isAdmin()) {
                Optional<User> optional = userRepo.findById(Integer.parseInt(requestMap.get("id")));
                if (!optional.isEmpty()) {

                    userRepo.updateStatus(requestMap.get("status"), Integer.parseInt(requestMap.get("id")));

                    return new ResponseEntity<>("User Status is updated Successfully", HttpStatus.OK);

                } else {
                    return new ResponseEntity<>("User id doesn't exist", HttpStatus.OK);
                }
            } else {
                return new ResponseEntity<>("UNAUTHORIZED_ACCESS", HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>("SOMETHING_WENT_WRONG", HttpStatus.INTERNAL_SERVER_ERROR);

    }

    @Override
    public ResponseEntity<String> deleteUser(Integer id) {
        try {
            if (jwtFilter.isAdmin()) {
                Optional<User> optional = userRepo.findById(id);
                if (optional.isPresent()) {
                    userRepo.deleteById(id);
                    return new ResponseEntity<>("User was deleted successfully", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("User with id:" + id + "does not exist", HttpStatus.NOT_FOUND);
                }
            } else {
                return new ResponseEntity<>("You are not authorized for this action", HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return new ResponseEntity<>("Something went wrong due to server", HttpStatus.INTERNAL_SERVER_ERROR);
    }


}