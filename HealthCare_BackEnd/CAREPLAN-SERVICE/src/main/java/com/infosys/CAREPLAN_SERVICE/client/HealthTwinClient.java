package com.infosys.CAREPLAN_SERVICE.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.infosys.CAREPLAN_SERVICE.dto.HealthTwinDTO;

@FeignClient(name = "HealthTwin")
public interface HealthTwinClient {

    @GetMapping("/api/twins/{patientId}")
    HealthTwinDTO getHealthTwin(
            @PathVariable("patientId") String patientId
    );
}