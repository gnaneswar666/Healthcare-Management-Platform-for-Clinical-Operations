package com.infosys.SIMULATION_SERVICE.client;


import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import com.infosys.SIMULATION_SERVICE.dto.patient.PatientResponse;

@FeignClient(name = "Medisphere")
public interface PatientClient {

    @GetMapping("/api/patients")
    List<PatientResponse> getAllPatients();

}
