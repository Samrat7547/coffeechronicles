package com.example.coffeechronicles.repo;

import com.example.coffeechronicles.entity.Bill;
import com.example.coffeechronicles.entity.User;
import jakarta.persistence.NamedQuery;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillRepo extends JpaRepository<Bill,Integer> {

    @Query( "select b from Bill b order by b.id desc")

    List<Bill> getAllBills();


    @Query("select b from Bill b where b.createdBy=:username order by b.id desc")
    List<Bill> getBillByUsername( @Param("username") String username);

    @Transactional
    @Modifying
    @Query("update Bill u set u.active = :active where u.id = :id")
    Integer updateActive(@Param("active") boolean active, @Param("id") Integer id);

}
