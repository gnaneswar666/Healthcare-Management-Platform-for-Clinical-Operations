package com.infosys.doctor_service.service;


import org.springframework.http.ResponseEntity;

import com.infosys.doctor_service.dto.AssignmentRequest;

public interface AssignmentService {

    ResponseEntity<?> assignPatient(AssignmentRequest request);

    ResponseEntity<?> getAssignedPatients(String doctorId);

    ResponseEntity<?> unAssignPatient(String doctorId,
                                      String patientId);
     ResponseEntity<?> getAssignedDoctor(String patientId);
}
