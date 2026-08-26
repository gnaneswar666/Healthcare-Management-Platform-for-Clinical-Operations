package com.infosys.DIABETES_SERVICE.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import com.infosys.DIABETES_SERVICE.dto.AIModelResponse;

@FeignClient(name = "AI-MODEL-SERVICE")
public interface AIModelClient {

    @GetMapping("/api/models/active")
    AIModelResponse getActiveModel();

}