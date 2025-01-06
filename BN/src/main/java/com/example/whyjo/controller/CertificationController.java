package com.example.whyjo.controller;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/certifications")
@Slf4j
public class CertificationController {

    @Value("${import.api.key}")
    private String impApiKey;
    @Value("${import.api.secret}")
    private String impApiSecret;
    private static final String GET_TOKEN_URL = "https://api.iamport.kr/users/getToken";
    private static final String GET_CERTIFICATION_URL = "https://api.iamport.kr/certifications/";

    @PostMapping
    public ResponseEntity<?> verifyCertification(@RequestBody Map<String, String> request) {
        String impUid = request.get("imp_uid");

        if (impUid == null || impUid.isEmpty()) {
            return ResponseEntity.badRequest().body("imp_uid가 필요합니다");
        }

        try {
            // 1. 액세스 토큰 얻기
            RestTemplate restTemplate = new RestTemplate();
            
            // 요청 바디 생성
            String tokenRequestBody = String.format(
                "{\"imp_key\":\"%s\",\"imp_secret\":\"%s\"}", 
                impApiKey,
                impApiSecret
            );
            
            // 헤더 설정
            HttpHeaders tokenHeaders = new HttpHeaders();
            tokenHeaders.setContentType(MediaType.APPLICATION_JSON);
            
            // HTTP 엔티티 생성
            HttpEntity<String> tokenRequest = new HttpEntity<>(tokenRequestBody, tokenHeaders);

            // 토큰 요청
            ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(
                GET_TOKEN_URL,
                tokenRequest,
                Map.class
            );


            // 응답 처리
            Map<String, Object> tokenBody = tokenResponse.getBody();
            if (tokenBody == null || tokenBody.get("response") == null) {
                return ResponseEntity.status(500).body("액세스 토큰 획득 실패");
            }

            String accessToken = (String) ((Map<String, Object>) tokenBody.get("response")).get("access_token");

            // 2. 인증 정보 조회
            HttpHeaders certHeaders = new HttpHeaders();
            certHeaders.setContentType(MediaType.APPLICATION_JSON);
            certHeaders.setBearerAuth(accessToken);

            HttpEntity<Void> certRequest = new HttpEntity<>(certHeaders);
            
            String certUrl = GET_CERTIFICATION_URL + impUid;

            ResponseEntity<Map> certResponse = restTemplate.exchange(
                certUrl,
                HttpMethod.GET,
                certRequest,
                Map.class
            );

            
            return ResponseEntity.ok(certResponse.getBody());

        } catch (Exception e) {
            log.error("인증 처리 중 오류 발생", e);
            return ResponseEntity.status(500).body("처리 중 오류 발생: " + e.getMessage());
        }
    }
}
