package com.example.whyjo.domain.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CartItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private String productDescription;
    private String productType;
    private String seller;
    private String subTitle;
    private int price;
    private int quantity;
} 