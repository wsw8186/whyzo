package com.example.whyjo.config;

import com.example.whyjo.security.JwtAuthenticationFilter;
import com.example.whyjo.security.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.authentication.AuthenticationManager;
import lombok.RequiredArgsConstructor;
import com.example.whyjo.security.CustomOAuth2UserService;
import com.example.whyjo.security.OAuth2SuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;
    private final AuthenticationConfiguration authenticationConfiguration;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/v1/users/**",
                               "/product/**", "/oauth2/**","/certifications/**","api/orders","/api/cart/**").permitAll()
                .requestMatchers("/api/auth/logout").permitAll()
                .requestMatchers("/api/reviews/product/**").permitAll()
                .anyRequest().authenticated())
            .rememberMe(remember -> remember
                .rememberMeParameter("rememberMe")
                .tokenValiditySeconds(30 * 60)  // 30분
                .userDetailsService(userDetailsService)
                .key("remember-me-key"))
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(customOAuth2UserService))
                .successHandler(oAuth2SuccessHandler))
            .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider, userDetailsService),
                           UsernamePasswordAuthenticationFilter.class)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .logout(logout -> logout
                .logoutUrl("/api/auth/logout")
                .logoutSuccessHandler((request, response, authentication) -> {
                    Cookie tokenCookie = new Cookie("token", null);
                    tokenCookie.setMaxAge(0);
                    tokenCookie.setPath("/");
                    tokenCookie.setHttpOnly(true);
                    response.addCookie(tokenCookie);

                    Cookie refreshTokenCookie = new Cookie("refreshToken", null);
                    refreshTokenCookie.setMaxAge(0);
                    refreshTokenCookie.setPath("/");
                    refreshTokenCookie.setHttpOnly(true);
                    response.addCookie(refreshTokenCookie);

                    response.setStatus(HttpServletResponse.SC_OK);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"success\":true,\"message\":\"Successfully logged out\"}");
                })
                .clearAuthentication(true)
                .invalidateHttpSession(true)
            );
            
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager() throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); 
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Set-Cookie"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}