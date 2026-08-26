package com.infosys.ai_predict.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import com.infosys.ai_predict.dto.AIModelResponse;

@FeignClient(name = "AI-MODEL-SERVICE")
public interface AIModelClient {

    @GetMapping("/api/models/active")
    AIModelResponse getActiveModel();

}