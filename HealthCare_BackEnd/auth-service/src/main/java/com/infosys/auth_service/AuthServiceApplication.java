package com.infosys.auth_service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoTemplate;

@SpringBootApplication
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner checkMongo(MongoTemplate mongoTemplate) {
        return args -> {
            System.out.println("==================================");
            System.out.println("Database = " + mongoTemplate.getDb().getName());
            System.out.println("Collections = " + mongoTemplate.getCollectionNames());
            System.out.println("==================================");
        };
    }
}