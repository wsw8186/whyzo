package com.example.whyjo.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
@ToString
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String userId;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Embedded
    private Address address;

    @Embedded
    private MarketingConsent marketingConsent;

    @Column(nullable = false)
    @Builder.Default
    private String role = "ROLE_USER";

    private String gender;
    private String birthDate;

    //OAUTH2 CLIENT
    @Column
    private String provider;
    private String providerId;

    //비밀번호 리셋
    private String passwordResetToken;
    private LocalDateTime tokenExpireDate;



    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Address {
        private String zipCode;
        private String address;
        private String addressDetail;
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MarketingConsent {
        private boolean smsConsent;
        private boolean emailConsent;
    }

    @Builder
    public User(String name, String email, String userId, String role, String provider) {
        this.name = name;
        this.email = email;
        this.userId = userId;
        this.role = role;
        this.provider = provider;
    }
} 