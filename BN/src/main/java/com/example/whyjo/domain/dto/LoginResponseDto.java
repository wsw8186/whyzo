package com.example.whyjo.domain.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDto {
    private String token;
    private String refreshToken;
    private String userId;
    private String name;
    private String roles;
} 