package com.example.whyjo.controller;

import com.example.whyjo.domain.dto.OrderDto;
import com.example.whyjo.domain.dto.OrderResponseDto;
import com.example.whyjo.domain.entity.Order;
import com.example.whyjo.service.OrderService;
import com.example.whyjo.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    private final OrderService orderService;
    private final CartService cartService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderDto orderDTO) {
        try {
            // 주문 처리 로직
            System.out.println(orderDTO);
            Order order = orderService.createOrder(orderDTO);

            // 주문된 상품들을 장바구니에서 삭제
            orderDTO.getOrderItems().forEach(item -> {
                try {
                    cartService.removeFromCart(orderDTO.getUserId(), item.getProductId());
                } catch (Exception e) {
                    log.error("장바구니 아이템 삭제 실패: {}", e.getMessage());
                }
            });

            return ResponseEntity.ok().body("주문이 성공적으로 처리되었습니다.");
        } catch (Exception e) {
            log.error("주문 처리 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("주문 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            String userId = userDetails.getUsername();  // JWT 토큰에서 추출된 사용자 정보
            List<OrderResponseDto> orders = orderService.getOrdersByUserId(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            log.error("주문 목록 조회 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("주문 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}