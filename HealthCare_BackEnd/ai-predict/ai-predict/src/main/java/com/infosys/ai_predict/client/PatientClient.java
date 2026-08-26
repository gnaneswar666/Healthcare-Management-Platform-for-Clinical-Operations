package com.infosys.ai_predict.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.infosys.ai_predict.dto.PatientResponse;

@FeignClient(name = "MEDISPHERE")
public interface PatientClient {

    @GetMapping("/api/patients/{id}")
    PatientResponse getPatient(@PathVariable("id") String id);

}
