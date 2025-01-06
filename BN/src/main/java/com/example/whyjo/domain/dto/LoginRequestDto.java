package com.example.whyjo.domain.dto;

import lombok.Data;

@Data
public class LoginRequestDto {
    private String username;
    private String password;
    private boolean rememberMe;
}