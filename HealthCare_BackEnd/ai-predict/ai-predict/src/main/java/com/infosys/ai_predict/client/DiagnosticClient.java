package com.infosys.ai_predict.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.infosys.ai_predict.dto.DiagnosticResponse;


@FeignClient(name="DIAGNOSTIC-SERVICE")
public interface DiagnosticClient {

    @GetMapping("/api/diagnostic/{patientId}")
    DiagnosticResponse getDiagnostic(@PathVariable String patientId);

}