package com.infosys.alert_Service.controller;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.infosys.alert_Service.model.Alert;
import com.infosys.alert_Service.service.AlertService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    // Admin - Get all alerts
    @GetMapping
    public ResponseEntity<List<Alert>> getAllAlerts() {

        return ResponseEntity.ok(alertService.getAllAlerts());

    }

    // Doctor - Get assigned alerts
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Alert>> getDoctorAlerts(
            @PathVariable String doctorId) {

        return ResponseEntity.ok(alertService.getDoctorAlerts(doctorId));
    }

    // Patient History
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Alert>> getPatientAlerts(
            @PathVariable String patientId) {

        return ResponseEntity.ok(
                alertService.getPatientAlerts(patientId));

    }

    // Doctor acknowledges alert
    @PutMapping("/{alertId}/acknowledge")
    public ResponseEntity<Alert> acknowledgeAlert(
            @PathVariable String alertId) {

        return ResponseEntity.ok(
                alertService.acknowledgeAlert(alertId));

    }
  

}