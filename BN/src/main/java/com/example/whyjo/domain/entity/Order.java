package com.example.whyjo.domain.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems = new ArrayList<>();

    private int totalAmount;
    private int shippingFee;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    // 결제 관련 필드 추가
    private String impUid;        // 포트원 결제 고유번호
    private String merchantUid;    // 주문번호
    private String paymentStatus; // 결제상태
}