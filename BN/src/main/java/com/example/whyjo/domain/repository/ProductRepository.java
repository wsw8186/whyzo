package com.example.whyjo.domain.repository;

import com.example.whyjo.domain.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Product findSellerById(long id);
    List<Product> findByProductnameContainingIgnoreCase(String keyword);
}
