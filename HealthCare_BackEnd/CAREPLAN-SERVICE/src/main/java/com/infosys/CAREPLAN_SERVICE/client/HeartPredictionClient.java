package com.infosys.CAREPLAN_SERVICE.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.infosys.CAREPLAN_SERVICE.dto.HeartPredictionDTO;

@FeignClient(name = "AI-PREDICTION-SERVICE")
public interface HeartPredictionClient {

    @GetMapping("/api/predict/latest/{patientId}")
    HeartPredictionDTO getLatestPrediction(
            @PathVariable("patientId") String patientId
    );
}