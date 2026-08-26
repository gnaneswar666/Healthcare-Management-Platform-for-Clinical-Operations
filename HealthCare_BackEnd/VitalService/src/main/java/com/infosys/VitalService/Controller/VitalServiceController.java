package com.infosys.VitalService.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.infosys.VitalService.Modal.VitalService;
import com.infosys.VitalService.security.AuthorizationUtil;
import com.infosys.VitalService.service.VitalServiceService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/vitals")
public class VitalServiceController {
	
	//dependencies
    @Autowired
    private VitalServiceService service;
    
    @Autowired
    private AuthorizationUtil authorization;
    
    
    // Add Vitals

    @PostMapping
    public ResponseEntity<VitalService> addVitals(
            @RequestBody VitalService vitals,HttpServletRequest request) {

    	authorization.validateDoctorOrAdmin(request);
        VitalService savedVitals = service.addVitals(vitals);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedVitals);
    }

    // Latest Vitals

    @GetMapping("/{patientId}/latest")
    public ResponseEntity<VitalService> getLatestVitals(
            @PathVariable String patientId,HttpServletRequest request) {
    	
    	authorization.validatePatientAccess(request, patientId);
        return ResponseEntity.ok(
                service.getLatestVitals(patientId));
    }

    // History

    @GetMapping("/{patientId}/history")
    public ResponseEntity<List<VitalService>> getVitalsHistory(
            @PathVariable String patientId,HttpServletRequest request) {
     	authorization.validatePatientAccess(request, patientId);
        return ResponseEntity.ok(
                service.getVitalsHistory(patientId));
    }

    // Publish Kafka
    @PostMapping("/publish")
    public ResponseEntity<String> publishVitals(
            @RequestBody VitalService vitals,HttpServletRequest request) {
    	authorization.validateDoctorOrAdmin(request);

        service.publishVitals(vitals);

        return ResponseEntity.ok("Vitals Published Successfully");
    }
    @GetMapping
    public ResponseEntity<List<VitalService>> getAllVitals(
            HttpServletRequest request){

        authorization.validateDoctorOrAdmin(request);

        return ResponseEntity.ok(
                service.getAllVitals()
        );

    }
}