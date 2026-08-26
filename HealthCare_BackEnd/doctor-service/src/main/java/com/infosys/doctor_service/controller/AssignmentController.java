package com.infosys.doctor_service.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.infosys.doctor_service.dto.AssignmentRequest;
import com.infosys.doctor_service.service.AssignmentService;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @PostMapping
    public ResponseEntity<?> assignPatient(
            @RequestBody AssignmentRequest request) {

        return assignmentService.assignPatient(request);
    }

    @GetMapping("/{doctorId}")
    public ResponseEntity<?> getAssignedPatients(
            @PathVariable String doctorId) {

        return assignmentService.getAssignedPatients(doctorId);
    }

    @DeleteMapping("/{doctorId}/{patientId}")
    public ResponseEntity<?> unAssignPatient(
            @PathVariable String doctorId,
            @PathVariable String patientId) {

        return assignmentService.unAssignPatient(
                doctorId,
                patientId);
    }
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getAssignedDoctor(
            @PathVariable String patientId) {

        return assignmentService.getAssignedDoctor(patientId);
    }
}
