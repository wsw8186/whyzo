package com.example.whyjo.service;

import com.example.whyjo.domain.dto.UserDto;
import com.example.whyjo.domain.entity.User;
import com.example.whyjo.domain.entity.Cart;
import com.example.whyjo.domain.repository.UserRepository;
import com.example.whyjo.domain.repository.CartRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final CartRepository cartRepository;

    private final String SEND_EMAIL_FROM = "wsw8186@naver.com";
    private final int PASSWORD_RESET_TOKEN_EXPIRE_MINUTE = 15;

    @Transactional
    public void register(UserDto userDto) {
        if (existsByUserId(userDto.getUserId())) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        if (userRepository.existsByNameAndPhone(userDto.getName(), userDto.getPhone())) {
            throw new RuntimeException("이미 가입된 회원입니다. 아이디 찾기를 이용해주세요.");
        }

        User.Address address = null;
        if (userDto.getAddress() != null) {
            address = User.Address.builder()
                    .zipCode(userDto.getAddress().getZipCode())
                    .address(userDto.getAddress().getAddress())
                    .addressDetail(userDto.getAddress().getAddressDetail())
                    .build();
        }

        User.MarketingConsent marketingConsent = null;
        if (userDto.getMarketingConsent() != null) {
            marketingConsent = User.MarketingConsent.builder()
                    .smsConsent(userDto.getMarketingConsent().isSmsConsent())
                    .emailConsent(userDto.getMarketingConsent().isEmailConsent())
                    .build();
        }

        String gender = userDto.getGender() != null ? userDto.getGender() : "선택안함";
        String birthDate = userDto.getBirthDate() != null ? userDto.getBirthDate() : "";

        User user = User.builder()
                .userId(userDto.getUserId())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .name(userDto.getName())
                .email(userDto.getEmail())
                .phone(userDto.getPhone())
                .address(address)
                .marketingConsent(marketingConsent)
                .gender(gender)
                .birthDate(birthDate)
                .role("ROLE_USER")
                .build();

        userRepository.save(user);

        // 장바구니 생성
        Cart cart = new Cart();
        cart.setUser(user);
        cartRepository.save(cart);
    }

    public boolean existsByUserId(String userId) {
        return userRepository.existsByUserId(userId);
    }

    //유저 정보를 반환
    public User findByUserId(String userId) {
        log.info("Finding user by userId: {}", userId);
        return userRepository.findByUserId(userId)
            .orElseThrow(() -> {
                log.error("User not found with userId: {}", userId);
                return new RuntimeException("User not found with userId: " + userId);
            });
    }


    /*********************** 아이디 비번찾기 ***********************/
    public Boolean find_user_id(String name,String email){
//        log.info("Finding user with name: {} and email: {}", name,email);
        log.info(name);
        log.info(email);

        User findedUser = userRepository.findByNameAndEmail(name, email);

        if(Objects.isNull(findedUser)){
            log.info("User not found");
            return false;
        }
        
        log.info("User found with ID: {}", findedUser.getUserId());
        String subject = "[마켓컬리] 아이디 찾기 결과입니다";
        String text = "<b>아이디: </b>" + findedUser.getUserId();
        
        try {
            log.info("Attempting to send email to: {}", email);
            send_mail(email, subject, text);
            log.info("Email sent successfully");
            return true;
        }catch (MessagingException e){
            log.error("send_mail Error: {}", e.getMessage(), e);
            return false;
        }
    }

    //비밀번호 이메일 토큰 보내기
    @Transactional
    public Boolean reset_user_password(String userId, String email) {
        User findedUser = userRepository.findByUserIdAndEmail(userId, email);
        if (Objects.isNull(findedUser)) {
            log.info("Userpw not found");
            return false;
        }

        String token = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        LocalDateTime tokenExpireDate = LocalDateTime.now().plusMinutes(PASSWORD_RESET_TOKEN_EXPIRE_MINUTE);
        
        userRepository.updateUserPwToken(userId, token, tokenExpireDate);
        
        try {
            String subject = "[마켓컬리] 비밀번호 재설정";
            String text = "<a href='http://localhost:3000/user/resetpw?token=" + token + "'>재설정 링크로 이동</a>";
            log.info("이메일 발송 요청: {}", email);
            send_mail(email, subject, text);
            return true;
        } catch (MessagingException e) {
            log.error("send_mail Error: " + e.getMessage());
        }
        return false;
    }

    public String checkToken(String token) {
        User user = userRepository.findByPasswordResetToken(token);

        if (user == null) {
            throw new IllegalArgumentException("Token is invalid or expired");
        }

        if (user.getTokenExpireDate().isAfter(LocalDateTime.now())) {
            return "Token is valid";
        } else {
            throw new IllegalArgumentException("Token is invalid or expired");
        }
    }

    public void resetPassword(String token, String password) {
        User user = userRepository.findByPasswordResetToken(token);

        if (user == null) {
            throw new IllegalArgumentException("Token is invalid or expired");
        }

        if (!user.getTokenExpireDate().isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token is invalid or expired");
        }

        user.setPassword(passwordEncoder.encode(password));

        user.setPasswordResetToken(null);
        user.setTokenExpireDate(null);

        userRepository.save(user);
    }



    public void send_mail(String to, String subject, String text) throws MessagingException {
        log.info("Sending email to: {}", to);
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        helper.setFrom(SEND_EMAIL_FROM);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text, true);
        log.info("Email configuration complete, attempting to send...");
        mailSender.send(mimeMessage);
        log.info("Email sent successfully");
    }

//    public User findUserByNameAndEmail(String name, String email) {
//        User user = userRepository.findByNameAndEmail(name, email);
//        if (user == null) {
//            throw new RuntimeException("해당하는 사용자를 찾을 수 없습니다");
//        }
//        return user;
//    }
//
//    public User findByProviderAndProviderId(String provider, String providerId) {
//        log.info("Finding OAuth user - provider: {}, providerId: {}", provider, providerId);
//        return userRepository.findByProviderAndProviderId(provider, providerId)
//            .orElseThrow(() -> new RuntimeException("OAuth 사용자를 찾을 수 없습니다."));
//    }
//
//    public User createOAuthUser(String provider, String providerId, String email, String name) {
//        String userId = provider + "_" + providerId;
//
//        if (existsByUserId(userId)) {
//            throw new RuntimeException("이미 존재하는 사용자입니다.");
//        }
//
//        User user = User.builder()
//            .userId(userId)
//            .name(name)
//            .email(email)
//            .provider(provider)
//            .providerId(providerId)
//            .password("")
//            .phone("")
//            .role("ROLE_USER")
//            .build();
//
//        return userRepository.save(user);
//    }
//
//    // OAuth 사용자 정보 업데이트
//    @Transactional
//    public User updateOAuthUser(String provider, String providerId, String email, String name) {
//        return userRepository.findByProviderAndProviderId(provider, providerId)
//            .map(user -> {
//                user.setEmail(email);
//                user.setName(name);
//                return userRepository.save(user);
//            })
//            .orElseThrow(() -> new RuntimeException("OAuth 사용자를 찾을 수 없습니다."));
//    }




}