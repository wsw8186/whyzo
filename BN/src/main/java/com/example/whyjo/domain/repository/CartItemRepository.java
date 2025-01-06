package com.example.whyjo.domain.repository;

import com.example.whyjo.domain.entity.Cart;
import com.example.whyjo.domain.entity.CartItem;
import com.example.whyjo.domain.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    CartItem findByCartAndProduct(Cart cart, Product product);
} 