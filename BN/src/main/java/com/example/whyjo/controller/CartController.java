package com.example.whyjo.controller;

import com.example.whyjo.domain.dto.CartItemRequest;
import com.example.whyjo.domain.dto.CartItemResponse;
import com.example.whyjo.security.JwtTokenProvider;
import com.example.whyjo.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @RequestBody CartItemRequest request,
            HttpServletRequest httpRequest) {
        
        String token = null;
        Cookie[] cookies = httpRequest.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("로그인이 필요합니다.");
        }

        try {
            String userId = jwtTokenProvider.getUserId(token);
            cartService.addToCart(userId, request.getProductId(), request.getQuantity());
            return ResponseEntity.ok("장바구니에 상품이 추가되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("유효하지 않은 토큰입니다.");
        }
    }

    @GetMapping
    public ResponseEntity<?> getCartItems(HttpServletRequest httpRequest) {
        String token = null;
        Cookie[] cookies = httpRequest.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("로그인이 필요합니다.");
        }

        try {
            String userId = jwtTokenProvider.getUserId(token);
            List<CartItemResponse> items = cartService.getCartItems(userId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("유효하지 않은 토큰입니다.");
        }
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> removeFromCart(
            @PathVariable Long cartItemId,
            HttpServletRequest httpRequest) {
        String token = null;
        Cookie[] cookies = httpRequest.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("token".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("로그인이 필요합니다.");
        }

        try {
            String userId = jwtTokenProvider.getUserId(token);
            cartService.removeFromCart(userId, cartItemId);
            return ResponseEntity.ok("상품이 장바구니에서 제거되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("유효하지 않은 토큰입니다.");
        }
    }
} 