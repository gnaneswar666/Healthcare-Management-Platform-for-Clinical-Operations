package com.infosys.SIMULATION_SERVICE.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.infosys.SIMULATION_SERVICE.dto.diagnosis.DiagnosticRequest;


@FeignClient(name = "DIAGNOSTIC-SERVICE")
public interface DiagnosticClient {

    @PostMapping("/api/diagnostic")
    void saveDiagnostic(
            @RequestBody DiagnosticRequest request);

}
