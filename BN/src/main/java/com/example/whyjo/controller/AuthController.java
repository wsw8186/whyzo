package com.example.whyjo.controller;

import com.example.whyjo.domain.dto.LoginRequestDto;
import com.example.whyjo.domain.entity.User;
import com.example.whyjo.security.JwtTokenProvider;
import com.example.whyjo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Value("${jwt.expiration}")
    private int jwtExpirationMs;

    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequest, HttpServletResponse response) {
        try {
            if (loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
                return ResponseEntity.badRequest()
                    .body("아이디와 비밀번호를 모두 입력해주세요.");
            }

            UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());

            try {
                Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
                
                // JWT 토큰 생성
                String token = jwtTokenProvider.generateToken(authentication);
                String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

                // 쿠키 생성 및 설정
                Cookie tokenCookie = new Cookie("token", token);
                Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);

                // Remember Me 체크 여부에 따라 쿠키 만료 시간 설정
                if (loginRequest.isRememberMe()) {
                    tokenCookie.setMaxAge(30 * 60); // 30분
                    refreshTokenCookie.setMaxAge(30 * 60);
                }

                tokenCookie.setPath("/");
                refreshTokenCookie.setPath("/");
                tokenCookie.setHttpOnly(true);
                refreshTokenCookie.setHttpOnly(true);

                response.addCookie(tokenCookie);
                response.addCookie(refreshTokenCookie);

                // 사용자 정보 조회
                User user = userService.findByUserId(loginRequest.getUsername());
                
                // 응답 데이터에서 토큰 정보 제거
                Map<String, Object> responseData = new HashMap<>();
                responseData.put("success", true);
                responseData.put("name", user.getName());
                responseData.put("userId", user.getUserId());
                responseData.put("roles", user.getRole());

                return ResponseEntity.ok(responseData);

            } catch (BadCredentialsException e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("아이디 또는 비밀번호가 올바르지 않습니다.");
            }
        } catch (Exception e) {
            log.error("Login failed", e);
            throw e;
        }
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkLoginStatus(HttpServletRequest request, HttpServletResponse response) {
        String token = null;
        String refreshToken = null;
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("token".equals(cookie.getName())) {
                    token = cookie.getValue();
                } else if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                }
            }
        }

        if (token == null || !jwtTokenProvider.validateToken(token)) {
            // 액세스 토큰이 없거나 유효하지 않은 경우
            if (refreshToken != null) {
                try {
                    // 리프레시 토큰으로 새로운 액세스 토큰 발급
                    String newAccessToken = jwtTokenProvider.refreshAccessToken(refreshToken);
                    
                    // 새 액세스 토큰을 쿠키에 설정
                    Cookie newTokenCookie = new Cookie("token", newAccessToken);
                    newTokenCookie.setHttpOnly(true);
                    newTokenCookie.setPath("/");
                    newTokenCookie.setMaxAge(jwtExpirationMs);
                    response.addCookie(newTokenCookie);

                    token = newAccessToken;
                } catch (Exception e) {
                    return ResponseEntity.ok(Map.of("isAuthenticated", false));
                }
            }
        }

        try {
            String userId = jwtTokenProvider.getUserId(token);
            User user = userService.findByUserId(userId);

            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("isAuthenticated", true);
            responseMap.put("name", user.getName());
            responseMap.put("userId", user.getUserId());
            responseMap.put("roles", user.getRole());

            return ResponseEntity.ok(responseMap);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("isAuthenticated", false));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        try {
            // 쿠키 삭제
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("token".equals(cookie.getName()) || "refreshToken".equals(cookie.getName())) {
                        Cookie newCookie = new Cookie(cookie.getName(), null);
                        newCookie.setPath("/");
                        newCookie.setMaxAge(0);
                        newCookie.setHttpOnly(true);
                        response.addCookie(newCookie);
                    }
                }
            }

            // 시큐리티 컨텍스트 클리어
            SecurityContextHolder.clearContext();

            // 응답 데이터
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("success", true);
            responseData.put("message", "Successfully logged out");

            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            log.error("로그아웃 처리 중 오류 발생", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "로그아웃 처리 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
} 