package com.infosys.doctor_service.client;



import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.infosys.doctor_service.dto.PatientResponse;

@FeignClient(name = "Medisphere")
public interface PatientClient {

    @GetMapping("/api/patients/{patientId}")
    PatientResponse getPatient(@PathVariable String patientId);

}
