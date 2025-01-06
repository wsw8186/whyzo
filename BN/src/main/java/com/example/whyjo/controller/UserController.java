package com.example.whyjo.controller;

import com.example.whyjo.domain.dto.UserDto;
import com.example.whyjo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody UserDto userDto) {
        try {
            userService.register(userDto);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Void> checkUserExists(@PathVariable String userId) {
        if (userService.existsByUserId(userId)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<Boolean> findUserId(
            @RequestParam String name, 
            @RequestParam String email) {
        boolean exists = userService.find_user_id(name, email);
        return ResponseEntity.ok(exists);
    }

    @PostMapping("/password-resets")
    public ResponseEntity<Void> requestPasswordReset(
            @RequestParam String userId, 
            @RequestParam String email) {
        userService.reset_user_password(userId, email);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/password-resets/{token}")
    public ResponseEntity<String> validateResetToken(@PathVariable String token) {
        String result = userService.checkToken(token);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/password-resets/{token}")
    public ResponseEntity<String> updatePassword(
            @PathVariable String token,
            @RequestBody Map<String, String> requestBody) {
        String password = requestBody.get("password");
        userService.resetPassword(token, password);
        return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
    }
}