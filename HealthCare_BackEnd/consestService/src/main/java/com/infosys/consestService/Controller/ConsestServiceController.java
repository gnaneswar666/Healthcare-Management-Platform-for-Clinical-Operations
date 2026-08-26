package com.infosys.consestService.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.infosys.consestService.Modal.ConsestService;
import com.infosys.consestService.security.AuthorizationUtil;
import com.infosys.consestService.service.ConsestServiceService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/consents")
public class ConsestServiceController {

    @Autowired
    private ConsestServiceService service;
    
    @Autowired
    private AuthorizationUtil authorizationUtil;

    // ADMIN & DOCTOR only
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    @PostMapping
    public ResponseEntity<ConsestService> createConsent(
            @RequestBody ConsestService consent,HttpServletRequest request) {

    	authorizationUtil.validateDoctorOrAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createConsent(consent));
    }

    // ADMIN, DOCTOR -> any patient
    // PATIENT -> only own consent
    @GetMapping("/{patientId}")
    public ResponseEntity<ConsestService> getConsent(
            @PathVariable String patientId,
            HttpServletRequest request) {
    	
    	//here validating patient from util class
    	
    	 authorizationUtil.validatePatientAccess(request, patientId);
        return ResponseEntity.ok(
                service.getConsentByPatientId(patientId));
    }

    
    // ADMIN & DOCTOR only

    @PutMapping("/{consentId}")
    public ResponseEntity<ConsestService> updateConsent(
            @PathVariable String consentId,
            @RequestBody ConsestService consent ,HttpServletRequest request) {
    	
    	 authorizationUtil.validateDoctorOrAdmin(request);
        return ResponseEntity.ok(
                service.updateConsent(consentId, consent));
    }

    // DOCTOR or admin only

    @PatchMapping("/{consentId}/revoke")
    public ResponseEntity<ConsestService> revokeConsent(
            @PathVariable String consentId,HttpServletRequest request) {
    	 authorizationUtil.validateDoctorOrAdmin(request);
        return ResponseEntity.ok(
                service.revokeConsent(consentId));
    }
    @GetMapping
    public ResponseEntity<List<ConsestService>> getAllConsents(
            HttpServletRequest request){

        authorizationUtil.validateDoctorOrAdmin(request);

        return ResponseEntity.ok(
                service.getAllConsents()
        );

    }
    @PatchMapping("/patient/{patientId}/revoke")
    public ResponseEntity<ConsestService> revokeOwnConsent(
            @PathVariable String patientId,
            HttpServletRequest request) {

        authorizationUtil.validatePatientAccess(request, patientId);

        return ResponseEntity.ok(
                service.revokeConsentByPatient(patientId));
    }

    @PatchMapping("/patient/{patientId}/grant")
    public ResponseEntity<ConsestService> grantOwnConsent(
            @PathVariable String patientId,
            @RequestBody(required = false) ConsestService consentBody,
            HttpServletRequest request) {

        authorizationUtil.validatePatientAccess(request, patientId);
        String consentType = (consentBody != null) ? consentBody.getConsentType() : "GENERAL_HEALTHCARE";

        return ResponseEntity.ok(
                service.grantConsentByPatient(patientId, consentType));
    }
}