package com.example.whyjo.security;

import com.example.whyjo.domain.entity.User;
import com.example.whyjo.domain.entity.Cart;
import com.example.whyjo.domain.repository.UserRepository;
import com.example.whyjo.domain.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    
    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        try {
            OAuth2User oauth2User = super.loadUser(userRequest);
            log.info("OAuth2User attributes: {}", oauth2User.getAttributes());
            
            final String provider = userRequest.getClientRegistration().getRegistrationId();
            
            // 프로바이더별 데이터 추출
            final Map<String, Object> attributes = oauth2User.getAttributes();
            log.info("Provider: {}, Attributes: {}", provider, attributes);
            
            // 프로바이더별 데이터 추출 로직을 별도의 메소드로 분리
            final Map<String, String> userData = extractUserData(provider, attributes);
            final String providerId = userData.get("providerId");
            final String email = userData.get("email");
            final String name = userData.get("name");

            if (providerId == null) {
                throw new OAuth2AuthenticationException(
                    new OAuth2Error("provider_id_not_found", "Provider ID not found", null)
                );
            }

            final String userId = provider + "_" + providerId;
            
            // User 저장 또는 업데이트
            User user = userRepository.findByProviderAndProviderId(provider, providerId)
                .orElseGet(() -> {
                    User newUser = User.builder()
                        .userId(userId)
                        .name(name)
                        .email(email)
                        .provider(provider)
                        .providerId(providerId)
                        .password("")  // OAuth 사용자는 비밀번호 불필요
                        .phone("")     // 필수 필드이므로 빈 문자열
                        .role("ROLE_USER")
                        .build();
                    User savedUser = userRepository.save(newUser);

                    // 새로운 사용자의 경우 장바구니 생성
                    Cart cart = new Cart();
                    cart.setUser(savedUser);
                    cartRepository.save(cart);

                    return savedUser;
                });

            return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(user.getRole())),
                attributes,
                provider.equals("kakao") ? "id" : 
                provider.equals("naver") ? "response" : "sub"
            );
            
        } catch (Exception e) {
            log.error("Error processing OAuth2 user: ", e);
            throw new OAuth2AuthenticationException(
                new OAuth2Error("processing_error", "Failed to process OAuth2 user: " + e.getMessage(), null),
                e
            );
        }
    }

    private Map<String, String> extractUserData(String provider, Map<String, Object> attributes) {
        Map<String, String> userData = new HashMap<>();
        
        switch (provider) {
            case "kakao":
                userData.put("providerId", String.valueOf(attributes.get("id")));
                Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
                Map<String, Object> profile = kakaoAccount != null ? 
                    (Map<String, Object>) kakaoAccount.get("profile") : null;
                    
                userData.put("email", kakaoAccount != null ? (String) kakaoAccount.get("email") : null);
                userData.put("name", profile != null ? (String) profile.get("nickname") : null);
                break;
                
            case "naver":
                Map<String, Object> response = (Map<String, Object>) attributes.get("response");
                if (response != null) {
                    userData.put("providerId", (String) response.get("id"));
                    userData.put("email", (String) response.get("email"));
                    userData.put("name", (String) response.get("name"));
                }
                break;
                
            case "google":
                userData.put("providerId", (String) attributes.get("sub"));
                userData.put("email", (String) attributes.get("email"));
                userData.put("name", (String) attributes.get("name"));
                break;
        }
        
        return userData;
    }
} 