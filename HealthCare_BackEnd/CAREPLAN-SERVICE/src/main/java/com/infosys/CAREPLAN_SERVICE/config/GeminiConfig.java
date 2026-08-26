package com.infosys.CAREPLAN_SERVICE.config;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.genai.Client;

@Configuration
public class GeminiConfig {

    @Value("${gemini.api-key:}")
    private String apikey;

    @PostConstruct
    public void checkKey() {
        System.out.println(
            "Gemini key loaded: " +
            (apikey != null && !apikey.isBlank())
        );
    }

    @Bean
    public Client geminiClient() {
        String envKey = System.getenv("GEMINI_API_KEY");
        String effectiveKey = (apikey != null && !apikey.isBlank()) ? apikey
                : (envKey != null && !envKey.isBlank() ? envKey : "");
        return Client.builder()
                .apiKey(effectiveKey)
                .build();
    }
}