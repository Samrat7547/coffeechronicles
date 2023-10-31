package com.example.coffeechronicles.repo;

import com.example.coffeechronicles.entity.User;
import com.example.coffeechronicles.entity.UserRole;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {

    User findByEmail(String email);

    User findByRole(UserRole userRole);

    @Query("select u from User u where u.role='CUSTOMER'")
    List<User> getAllUser();

    @Query("select u from User u where u.email=?1")
    List<User> getByUsername(String currentUser);

    @Query("select new com.example.coffeechronicles.wrapper.UserWrapper(u.id,u.userName,u.password,u.firstName,u.lastName,u.email,u.phone,u.status,u.role) from User u where u.email=?1")
    Optional<User> getByName(String currentUser);

    @Transactional
    @Modifying
    @Query("update User u set u.status=:status where u.id =:id")
    Integer updateStatus(@Param("status") String status, @Param("id") Integer id);
}
