package com.example.whyjo.security;

import com.example.whyjo.domain.entity.User;
import com.example.whyjo.domain.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Date;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    
    private final JwtTokenProvider jwtTokenProvider;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;
    
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                      Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        log.info("OAuth2 User Attributes: {}", oAuth2User.getAttributes());
        
        final String provider = getProvider(oAuth2User.getAttributes());
        final String providerId = getProviderId(provider, oAuth2User.getAttributes());
        
        if (providerId == null) {
            throw new RuntimeException("Provider ID not found");
        }

        // User 조회
        String userId = provider + "_" + providerId;
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // 토큰 생성
        String token = jwtTokenProvider.generateToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);
        
        // 쿠키 생성 및 설정
        Date expirationDate = new Date(System.currentTimeMillis() + 30 * 60 * 1000); // 30분
        
        Cookie tokenCookie = new Cookie("token", token);
        tokenCookie.setHttpOnly(true);
        tokenCookie.setPath("/");
        tokenCookie.setMaxAge(30 * 60); // 30분
        
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(24 * 60 * 60); // 1일
        
        response.addCookie(tokenCookie);
        response.addCookie(refreshTokenCookie);
        
        // HTML 응답 생성 - 부모 창으로 메시지 전송
        String html = String.format("""
            <html>
            <body>
                <script>
                    window.opener.postMessage({
                        type: 'LOGIN_SUCCESS',
                        data: {
                            token: '%s',
                            refreshToken: '%s',
                            userId: '%s',
                            name: '%s',
                            isOAuth: true
                        }
                    }, '*');
                    window.close();
                </script>
            </body>
            </html>
        """, token, refreshToken, user.getUserId(), user.getName());
        
        response.setContentType("text/html;charset=UTF-8");
        response.getWriter().write(html);
    }

    private String getProvider(Map<String, Object> attributes) {
        if (attributes.containsKey("kakao_account")) {
            return "kakao";
        } else if (attributes.containsKey("response")) {
            return "naver";
        } else if (attributes.containsKey("sub")) {
            return "google";
        }
        throw new RuntimeException("Unknown OAuth2 provider");
    }

    private String getProviderId(String provider, Map<String, Object> attributes) {
        switch (provider) {
            case "kakao":
                return String.valueOf(attributes.get("id"));
            case "naver":
                Map<String, Object> response = (Map<String, Object>) attributes.get("response");
                return response != null ? (String) response.get("id") : null;
            case "google":
                return (String) attributes.get("sub");
            default:
                return null;
        }
    }
}