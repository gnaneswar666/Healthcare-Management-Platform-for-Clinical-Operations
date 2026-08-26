package com.infosys.AI_ANOMALY_SERVICE.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.infosys.AI_ANOMALY_SERVICE.model.AnomalyResult;
import com.infosys.AI_ANOMALY_SERVICE.service.AnomalyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/anomaly")
@RequiredArgsConstructor

public class AnomalyController {

    private final AnomalyService anomalyService;

    @GetMapping("/{patientId}")
    public ResponseEntity<AnomalyResult> detectAnomaly(
            @PathVariable String patientId) {

        return ResponseEntity.ok(
                anomalyService.detect(patientId)
        );
    }
}