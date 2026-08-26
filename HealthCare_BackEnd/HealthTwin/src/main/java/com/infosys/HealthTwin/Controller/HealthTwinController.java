package com.infosys.HealthTwin.Controller;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.infosys.HealthTwin.Modal.HealthTwin;
import com.infosys.HealthTwin.security.AuthorizationUtil;
import com.infosys.HealthTwin.service.HealthTwinService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/twins")
public class HealthTwinController {

    @Autowired
    private HealthTwinService healthService;
    
    @Autowired
    private AuthorizationUtil authorization;
    
    
    // Create
    @PostMapping
    public ResponseEntity<HealthTwin> createTwin(
            @RequestBody HealthTwin twin,HttpServletRequest request) {

    	//authorization.validateDoctorOrAdmin(request);
    	
    	HealthTwin saved = healthService.createTwin(twin);

    	return ResponseEntity.status(HttpStatus.CREATED)
    	        .body(saved);
    }

    // Get
    @GetMapping("/{id}")
    public ResponseEntity<HealthTwin> getTwin(
            @PathVariable String id, HttpServletRequest request) {
    	
    	// authorization.validatePatientAccess(request, id);
        return ResponseEntity.ok(
                healthService.getTwinByPatientId(id));
    }

    // Update
    @PutMapping("/{patientId}")
    public ResponseEntity<HealthTwin> updateTwin(
            @PathVariable String patientId,
            @RequestBody HealthTwin twin,HttpServletRequest request) {
    	
    	//authorization.validateDoctorOrAdmin(request);
        HealthTwin updatedTwin =
                healthService.updateTwin(patientId, twin);

        return ResponseEntity.ok(updatedTwin);
    }
    @GetMapping("/{patientId}/health-score")
    public ResponseEntity<Double> calculateHealthScore(
            @PathVariable String patientId,
            HttpServletRequest request) {

        authorization.validatePatientAccess(request, patientId);

        return ResponseEntity.ok(
                healthService.calculateHealthScore(patientId));
    }
    @GetMapping
    public ResponseEntity<List<HealthTwin>> getAllTwins(HttpServletRequest request){

       // authorization.validateDoctorOrAdmin(request);

        return ResponseEntity.ok(
                healthService.getAllTwins()
        );
    }
}