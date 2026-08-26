package com.infosys.Medisphere.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.infosys.Medisphere.Modal.Patient;
import com.infosys.Medisphere.dto.CreatePatientRequest;
import com.infosys.Medisphere.service.patientService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private patientService service;

    @GetMapping
    public List<Patient> getAllPatients(HttpServletRequest request) {

//        String role = request.getHeader("X-Role");
//
//        if ("PATIENT".equals(role)) {
//            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
//        }

        return service.getPatients();
    }
   // @PreAuthorize("hasAnyRole('ADMIN','DOCTOR','PATIENT')")
    @GetMapping("/{id}")
    public Patient getPatient(
            @PathVariable String id,
            HttpServletRequest request) {

//        String role = request.getHeader("X-Role");
//        String patientId = request.getHeader("X-PatientId");
//
//        if ("PATIENT".equals(role) && !id.equals(patientId)) {
//            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
//        }

        return service.getPatientByPatientId(id);
    }
//    @GetMapping("/test")
//    public String test(
//            @RequestHeader("X-User") String user,
//            @RequestHeader("X-Role") String role) {
//
//        return user + " -> " + role;
//    }
    
   // @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    @PostMapping
    public ResponseEntity<Patient> savePatient(
            @RequestBody CreatePatientRequest request) {

        Patient saved = service.savePatient(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(saved);
    }
    
   // @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    @PutMapping("/{patientId}")
    public ResponseEntity<Patient> updatePatient(
            @PathVariable String patientId,
            @RequestBody Patient patient) {

        Patient updatedPatient =
                service.updatePatient(patientId, patient);

        return ResponseEntity.ok(updatedPatient);
    }
  //  @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePatient(
            @PathVariable String id) {

        service.deletePatient(id);

        return ResponseEntity.ok("Patient deleted successfully");
    }
}