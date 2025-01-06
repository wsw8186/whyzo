package com.example.whyjo.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDto {
    private Long orderId;
    private Long productId;
    private String productName;
    private int price;
    private int quantity;
    private LocalDateTime orderDate;
    private String productImage;
    private String orderStatus;
    private int totalPrice;
} 