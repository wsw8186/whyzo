package com.example.whyjo.security;

import com.example.whyjo.domain.entity.User;
import com.example.whyjo.domain.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUserId(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        List<GrantedAuthority> authorities = Collections.singletonList(
            new SimpleGrantedAuthority(user.getRole())
        );

        return new org.springframework.security.core.userdetails.User(
            user.getUserId(),
            user.getPassword(),
            authorities
        );
    }
} 