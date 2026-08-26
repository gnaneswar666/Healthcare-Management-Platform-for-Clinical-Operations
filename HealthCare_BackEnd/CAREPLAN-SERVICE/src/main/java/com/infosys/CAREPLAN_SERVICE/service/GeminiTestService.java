package com.infosys.CAREPLAN_SERVICE.service;

import org.springframework.stereotype.Service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GeminiTestService {

    private final Client geminiClient;

    public String testGemini() {

        GenerateContentResponse response =
                geminiClient.models.generateContent(
                        "gemini-1.5-flash",
                        "Say hello and confirm that you are connected to my Spring Boot CarePlan service.",
                        null
                );

        return response.text();
    }
}