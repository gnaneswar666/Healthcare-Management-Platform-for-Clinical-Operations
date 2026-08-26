package com.infosys.diagnostic_service.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.infosys.diagnostic_service.dto.DiagnosticRequest;
import com.infosys.diagnostic_service.dto.DiagnosticResponse;
import com.infosys.diagnostic_service.service.DiagnosticService;

@RestController
@RequestMapping("/api/diagnostic")
public class DiagnosticController {

    private final DiagnosticService service;

    public DiagnosticController(DiagnosticService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<DiagnosticResponse> saveOrUpdate(
            @RequestBody DiagnosticRequest request) {

        return new ResponseEntity<>(
                service.saveOrUpdate(request),
                HttpStatus.CREATED);
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<DiagnosticResponse> getByPatientId(
            @PathVariable String patientId) {

        return ResponseEntity.ok(service.getByPatientId(patientId));
    }

    @GetMapping
    public ResponseEntity<List<DiagnosticResponse>> getAll() {

        return ResponseEntity.ok(service.getAll());
    }

    @DeleteMapping("/{patientId}")
    public ResponseEntity<String> delete(
            @PathVariable String patientId) {

        service.delete(patientId);

        return ResponseEntity.ok("Diagnostic Record Deleted Successfully");
    }

}