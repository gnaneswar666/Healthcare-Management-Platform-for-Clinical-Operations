package com.infosys.explanation_service.feign;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.infosys.explanation_service.dto.PredictionHistoryDto;


@FeignClient(name = "AI-PREDICTION-SERVICE")
public interface PredictionClient {

    @GetMapping("/api/predict/latest/{patientId}")
    PredictionHistoryDto getLatestPrediction(@PathVariable String patientId);
}