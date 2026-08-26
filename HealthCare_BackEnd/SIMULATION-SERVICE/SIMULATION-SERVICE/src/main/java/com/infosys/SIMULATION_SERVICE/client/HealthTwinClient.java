package com.infosys.SIMULATION_SERVICE.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.infosys.SIMULATION_SERVICE.dto.health.HealthTwinRequest;

@FeignClient(name = "HEALTHTWIN")
public interface HealthTwinClient {

    @GetMapping("/api/twins/{patientId}")
    HealthTwinRequest getTwin(
            @PathVariable String patientId);

    @PutMapping("/api/twins/{patientId}")
    HealthTwinRequest updateTwin(
            @PathVariable String patientId,
            @RequestBody HealthTwinRequest request);

}