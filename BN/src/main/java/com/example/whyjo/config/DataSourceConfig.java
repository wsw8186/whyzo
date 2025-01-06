package com.example.whyjo.config;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() {

        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setJdbcUrl("jdbc:mysql://localhost:3306/whyzo");
        dataSource.setUsername("root");
        dataSource.setPassword("1234");

        dataSource.setMaximumPoolSize(10);

        return dataSource;
    }
}