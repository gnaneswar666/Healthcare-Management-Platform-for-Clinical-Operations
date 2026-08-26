package com.infosys.alert_Service.client;


import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.infosys.alert_Service.dto.DoctorAssignment;
import com.infosys.alert_Service.dto.PatientResponse;

@FeignClient(name = "DOCTOR-SERVICE")
public interface DoctorServiceClient {

    // Used while creating alerts
    @GetMapping("/api/assignments/patient/{patientId}")
    List<DoctorAssignment> getAssignedDoctor(
            @PathVariable String patientId);

    // Used while fetching doctor's alerts
    @GetMapping("/api/assignments/{doctorId}")
    List<PatientResponse> getAssignedPatients(
            @PathVariable String doctorId);

}