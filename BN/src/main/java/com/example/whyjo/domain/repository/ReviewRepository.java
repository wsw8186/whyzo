package com.example.whyjo.domain.repository;

import com.example.whyjo.domain.entity.Product;
import com.example.whyjo.domain.entity.Review;
import com.example.whyjo.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByUserOrderByCreatedDateDesc(User user);
    List<Review> findByProduct_IdOrderByCreatedDateDesc(Long productId);
} 