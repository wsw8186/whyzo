package com.example.whyjo.service;

import com.example.whyjo.domain.dto.OrderDto;
import com.example.whyjo.domain.dto.OrderResponseDto;
import com.example.whyjo.domain.entity.Order;
import com.example.whyjo.domain.entity.OrderItem;
import com.example.whyjo.domain.entity.Product;
import com.example.whyjo.domain.entity.User;
import com.example.whyjo.domain.repository.OrderRepository;
import com.example.whyjo.domain.repository.ProductRepository;
import com.example.whyjo.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public Order createOrder(OrderDto orderDto) {
        log.info("Creating order for userId: {}", orderDto.getUserId());
        
        Order order = Order.builder()
            .userId(orderDto.getUserId())
            .totalAmount(orderDto.getTotalAmount())
            .shippingFee(orderDto.getShippingFee())
            .orderDate(LocalDateTime.now())
            .impUid(orderDto.getImpUid())
            .merchantUid(orderDto.getMerchantUid())
            .paymentStatus(orderDto.getPaymentStatus())
            .orderItems(new ArrayList<>())
            .build();

        orderDto.getOrderItems().forEach(orderItemDto -> {
            log.info("Processing order item - ProductId: {}", orderItemDto.getProductId());
            
            Product product = productRepository.findById(orderItemDto.getProductId())
                .orElseThrow(() -> new RuntimeException("상품이 존재하지 않습니다: " + orderItemDto.getProductId()));
            
            OrderItem orderItem = OrderItem.builder()
                .order(order)
                .productId(product.getId())
                .productName(product.getProductname())
                .amount(orderItemDto.getAmount())
                .price(product.getPrice())
                .totalPrice(orderItemDto.getAmount() * product.getPrice())
                .build();
            
            order.getOrderItems().add(orderItem);
        });

        Order savedOrder = orderRepository.save(order);

        // 주문 완료 후 이메일 발송
        try {
            User user = userRepository.findByUserId(orderDto.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            emailService.sendOrderConfirmationEmail(savedOrder, user.getEmail());
        } catch (Exception e) {
            log.error("주문 확인 이메일 발송 실패: {}", e.getMessage());
        }

        return savedOrder;
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByUserId(String userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        log.info("Found orders for userId {}: {}", userId, orders.size());

        List<OrderResponseDto> responseDtos = new ArrayList<>();

        for (Order order : orders) {
            log.info("Processing order ID: {}", order.getId());
            for (OrderItem item : order.getOrderItems()) {
                log.info("Processing order item - ProductId: {}, ProductName: {}", 
                        item.getProductId(), item.getProductName());
                
                try {
                    Product product = productRepository.findById(item.getProductId())
                        .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다: " + item.getProductId()));
                    
                    log.info("Found product: {}", product);
                    
                    String imageUrl = "";
                    if (product.getImage() != null && !product.getImage().isEmpty()) {
                        imageUrl = "/product/" + product.getImage().get(0);
                        log.info("Image URL set to: {}", imageUrl);
                    } else {
                        log.warn("No image found for product ID: {}", item.getProductId());
                    }

                    OrderResponseDto dto = OrderResponseDto.builder()
                        .orderId(order.getId())
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .price(item.getPrice())
                        .quantity(item.getAmount())
                        .orderDate(order.getOrderDate())
                        .productImage(imageUrl)
                        .orderStatus(determineOrderStatus(order))
                        .totalPrice(item.getTotalPrice())
                        .build();

                    responseDtos.add(dto);
                    log.info("Added OrderResponseDto for order item: {}", dto);
                } catch (Exception e) {
                    log.error("Error processing order item - ProductId: {}, Error: {}", 
                            item.getProductId(), e.getMessage());
                    // 에러가 발생해도 계속 진행
                    OrderResponseDto dto = OrderResponseDto.builder()
                        .orderId(order.getId())
                        .productName(item.getProductName())
                        .price(item.getPrice())
                        .quantity(item.getAmount())
                        .orderDate(order.getOrderDate())
                        .productImage("")  // 이미지 없음
                        .orderStatus(determineOrderStatus(order))
                        .totalPrice(item.getTotalPrice())
                        .build();

                    responseDtos.add(dto);
                    log.info("Added OrderResponseDto without product info: {}", dto);
                }
            }
        }

        return responseDtos;
    }

    private String determineOrderStatus(Order order) {
        // paymentStatus에 따른 주문 상태 결정
        switch (order.getPaymentStatus()) {
            case "PAID": //대문자로안바꿔서
                return "결제완료";
            case "cancelled":
                return "주문취소";
            case "failed":
                return "결제실패";
            default:
                return "처리중";
        }
    }
}
