package com.example.coffeechronicles.repo;

import com.example.coffeechronicles.entity.Bill;
import com.example.coffeechronicles.entity.User;
import jakarta.persistence.NamedQuery;
import org.springframework.data.jpa.repository.JpaRepository;
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
}
