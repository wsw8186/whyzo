package com.example.whyjo.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "productid")
    private Long id;

    private String productname;    //상품명

    private int price;             // 1개 당 가격

    private int discount;          //할인율

    private String type;           //타입 냉장 냉동

    private String unit;           //단위 = 5 kg, 10 g, mL, L - 추가됨

    private List<String> image;    //이미지

    private String seller;         //판매자

    private String subtitle;        // 부제목

    @Column(length = 1000)
    private String description;     // 상품 설명

    @Transient
    private List<String> imagesToDelete;

}
