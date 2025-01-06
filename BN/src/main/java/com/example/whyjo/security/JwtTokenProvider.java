package com.example.whyjo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.Map;
import java.util.HashMap;

@Component
@Slf4j
public class JwtTokenProvider {

    private final SecretKey jwtSecretKey;

    @Value("${jwt.expiration}")
    private int jwtExpirationMs;

    @Value("${jwt.refresh.expiration}")
    private int refreshTokenExpirationMs;

    public JwtTokenProvider(@Value("${jwt.secret}") String jwtSecret) {
        byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
        this.jwtSecretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    // JWT 토큰 생성 (사용자 역할 추가)
    public String generateToken(Authentication authentication) {
        String userId;
        Map<String, Object> claims = new HashMap<>();

        if (authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            String provider = getProvider(oauth2User);
            String providerId = getProviderId(oauth2User);
            userId = provider + "_" + providerId;

            claims.put("provider", provider);
            claims.put("type", "OAUTH");
        } else {
            userId = authentication.getName();
            claims.put("type", "NORMAL");

            // 사용자 역할 추가
            claims.put("roles", authentication.getAuthorities()
                    .stream()
                    .map(auth -> auth.getAuthority())
                    .toList());
        }

        log.info("Generating token for userId: {}", userId);

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setClaims(claims)  // claims를 먼저 설정
                .setSubject(userId) // subject는 claims 이후에 설정
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(jwtSecretKey, SignatureAlgorithm.HS256)
                .compact();
    }


    private String getProvider(OAuth2User oauth2User) {
        if (oauth2User.getAttributes().containsKey("kakao_account")) {
            return "kakao";
        } else if (oauth2User.getAttributes().containsKey("response")) {
            return "naver";
        } else {
            return "google";
        }
    }

    private String getProviderId(OAuth2User oauth2User) {
        Map<String, Object> attributes = oauth2User.getAttributes();
        if (attributes.containsKey("id")) {  // 카카오
            return String.valueOf(attributes.get("id"));
        } else if (attributes.containsKey("response")) {  // 네이버
            Map<String, Object> response = (Map<String, Object>) attributes.get("response");
            return (String) response.get("id");
        } else {  // 구글
            return (String) attributes.get("sub");
        }
    }

    // JWT 토큰에서 userId 추출
    public String getUserId(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(jwtSecretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            
            String userId = claims.getSubject();
            log.info("Extracted userId from token: {}", userId);
            
            if (userId == null) {
                log.error("Token does not contain userId in subject");
                throw new RuntimeException("Invalid token: no userId found");
            }
            
            return userId;
        } catch (Exception e) {
            log.error("Error extracting userId from token", e);
            throw new RuntimeException("Failed to extract userId from token", e);
        }
    }

    // JWT 토큰 유효성 검증
    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(jwtSecretKey)
                .build()
                .parseClaimsJws(authToken);
            log.info("Token is valid");
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            log.error("Invalid JWT token: {}", ex.getMessage());
            return false;
        }
    }

    // Refresh Token 생성
    public String generateRefreshToken(Authentication authentication) {
        String userId;
        Map<String, Object> claims = new HashMap<>();
        
        if (authentication.getPrincipal() instanceof OAuth2User) {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            String provider = getProvider(oauth2User);
            String providerId = getProviderId(oauth2User);
            userId = provider + "_" + providerId;
            claims.put("type", "OAUTH_REFRESH");
        } else {
            userId = authentication.getName();
            claims.put("type", "NORMAL_REFRESH");
        }

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshTokenExpirationMs);

        String refreshToken = Jwts.builder()
                .setClaims(claims)  // claims를 먼저 설정
                .setSubject(userId) // subject는 claims 이후에 설정
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(jwtSecretKey, SignatureAlgorithm.HS256)
                .compact();
                
        log.info("Generated Refresh Token: {}", refreshToken);
        return refreshToken;
    }

    // 토큰 검증 시 OAuth 사용자 구분을 위한 메서드
    public boolean isOAuthToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtSecretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return "OAUTH".equals(claims.get("type")) || "OAUTH_REFRESH".equals(claims.get("type"));
    }

    // 리프레시 토큰 검증 및 액세스 토큰 재발급
    public String refreshAccessToken(String refreshToken) {
        try {
            // 리프레시 토큰의 유효성 검증
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(jwtSecretKey)
                    .build()
                    .parseClaimsJws(refreshToken)
                    .getBody();

            // 리프레시 토큰의 타입 확인
            if (!"OAUTH_REFRESH".equals(claims.get("type")) && !"NORMAL_REFRESH".equals(claims.get("type"))) {
                throw new RuntimeException("Invalid refresh token type");
            }

            // 토큰의 subject에서 userId 추출
            String userId = claims.getSubject();
            if (userId == null) {
                throw new RuntimeException("Invalid refresh token: no userId found");
            }

            log.info("Valid refresh token for userId: {}", userId);

            // 새로운 액세스 토큰 생성
            Date now = new Date();
            Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

            Map<String, Object> newClaims = new HashMap<>();
            newClaims.put("type", claims.get("type").equals("OAUTH_REFRESH") ? "OAUTH" : "NORMAL");

            String newAccessToken = Jwts.builder()
                    .setClaims(newClaims)  // 새로운 claims 설정
                    .setSubject(userId)    // userId 설정
                    .setIssuedAt(now)
                    .setExpiration(expiryDate)
                    .signWith(jwtSecretKey, SignatureAlgorithm.HS256)
                    .compact();

            log.info("Generated new access token for userId: {}", userId);

            return newAccessToken;
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Invalid refresh token: {}", e.getMessage());
            throw new RuntimeException("Failed to refresh access token", e);
        }
    }

} 