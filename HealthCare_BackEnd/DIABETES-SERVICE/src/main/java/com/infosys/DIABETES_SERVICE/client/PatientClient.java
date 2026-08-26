package com.infosys.DIABETES_SERVICE.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.infosys.DIABETES_SERVICE.dto.PatientResponse;

@FeignClient(name = "Medisphere")
public interface PatientClient {

    @GetMapping("/api/patients/{patientId}")
    PatientResponse getPatient(@PathVariable String patientId);

}
