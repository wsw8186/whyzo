package com.example.whyjo.domain.repository;

import com.example.whyjo.domain.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;



@SpringBootTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void te1(){

        User user = userRepository.findByNameAndEmail("우상원","wsw8186@naver.com");
        System.out.println(user);


    }

}