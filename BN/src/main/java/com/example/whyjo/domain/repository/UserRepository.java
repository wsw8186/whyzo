package com.example.whyjo.domain.repository;

import com.example.whyjo.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import org.springframework.data.repository.query.Param;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUserId(String userId);
    @Query("SELECT u FROM User u WHERE u.userId = :userId")
    Optional<User> findByUserId(@Param("userId") String userId);

    /*********************** 아이디 비번찾기 ***********************/
    User findByNameAndEmail(String name,String email);
    User findByUserIdAndEmail(String userId, String email);
    User findByPasswordResetToken(String token);

    @Modifying
    @Query("UPDATE User u SET u.passwordResetToken = ?2, u.tokenExpireDate = ?3 WHERE u.userId = ?1")
    void updateUserPwToken(String userId, String token, LocalDateTime tokenExpireDate);


    Optional<User> findByProviderAndProviderId(String provider, String providerId);

    Optional<User> findByEmail(String email);

    boolean existsByNameAndPhone(String name, String phone);

}