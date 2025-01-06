package com.example.whyjo.service;

import com.example.whyjo.domain.dto.CartItemResponse;
import com.example.whyjo.domain.entity.Cart;
import com.example.whyjo.domain.entity.CartItem;
import com.example.whyjo.domain.entity.Product;
import com.example.whyjo.domain.entity.User;
import com.example.whyjo.domain.repository.CartItemRepository;
import com.example.whyjo.domain.repository.CartRepository;
import com.example.whyjo.domain.repository.ProductRepository;
import com.example.whyjo.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public void addToCart(String userId, Long productId, int quantity) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });

        CartItem existingItem = cartItemRepository.findByCartAndProduct(cart, product);
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }
    }

    @Transactional(readOnly = true)
    public List<CartItemResponse> getCartItems(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("장바구니를 찾을 수 없습니다."));

        return cart.getCartItems().stream()
                .map(item -> CartItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getProductname())
                        .productImage(item.getProduct().getImage() != null && !item.getProduct().getImage().isEmpty() 
                                ? item.getProduct().getImage().get(0)
                                : "")
                        .productDescription(item.getProduct().getDescription())
                        .productType(item.getProduct().getType())
                        .seller(item.getProduct().getSeller())
                        .subTitle(item.getProduct().getSubtitle())
                        .price(item.getProduct().getPrice())
                        .quantity(item.getQuantity())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeFromCart(String userId, Long cartItemId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("장바구니 항목을 찾을 수 없습니다."));

        if (!cartItem.getCart().getUser().getUserId().equals(userId)) {
            throw new RuntimeException("권한이 없습니다.");
        }

        cartItemRepository.delete(cartItem);
    }

}