package com.infosys.ai_predict.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.infosys.ai_predict.dto.HealthResponse;

@FeignClient(name = "HEALTHTWIN")
public interface HealthClient {

    @GetMapping("/api/twins/{patientId}")
    HealthResponse getHealth(@PathVariable("patientId") String patientId);

}