package com.infosys.CAREPLAN_SERVICE.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.infosys.CAREPLAN_SERVICE.dto.DiabetesPredictionDTO;

@FeignClient(name = "DIABETES-SERVICE")
public interface DiabetesPredictionClient {

    @GetMapping("/api/diabetes/latest/{patientId}")
    DiabetesPredictionDTO getLatestPrediction(
            @PathVariable("patientId") String patientId
    );
}