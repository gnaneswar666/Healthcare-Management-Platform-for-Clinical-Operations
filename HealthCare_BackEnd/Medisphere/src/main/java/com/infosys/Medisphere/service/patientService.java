package com.infosys.Medisphere.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.infosys.Medisphere.Modal.Patient;
import com.infosys.Medisphere.Resources.patientResources;
import com.infosys.Medisphere.dto.CreatePatientRequest;
import com.infosys.Medisphere.exception.ResourceNotFoundException;

@Service
public class patientService {

    @Autowired
    private patientResources repo;

    
    @Autowired
    private KeycloakUserService keycloakService;
    // Get all patients
    public List<Patient> getPatients() {
        return repo.findAll();
    }

    // Get patient by patientId
    public Patient getPatientByPatientId(String patientId) {

        return repo.findByPatientId(patientId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));
    }

    // Save patient
    public Patient savePatient(CreatePatientRequest request) {
    	
    	Patient patient = new Patient();

    	patient.setPatientId(request.getPatientId());
    	patient.setFirstName(request.getFirstName());
    	patient.setLastName(request.getLastName());
    	patient.setGender(request.getGender());
    	patient.setDob(request.getDob());
    	patient.setEmail(request.getEmail());
    	patient.setPhone(request.getPhone());
    	patient.setAddress(request.getAddress());

    	

    	// Next we'll call Keycloak

    	
    	Patient saved = repo.save(patient);

    	keycloakService.createPatientUser(

    	        saved.getPatientId(),          // username

    	        request.getPassword(),

    	        saved.getFirstName(),

    	        saved.getLastName(),

    	        saved.getEmail(),

    	        saved.getPatientId()

    	);

    	return saved;
    }

    // Delete patient
    public void deletePatient(String patientId) {

        Patient patient = repo.findByPatientId(patientId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        repo.delete(patient);
    }

    // Update patient
    public Patient updatePatient(String patientId, Patient patient) {

        Patient existingPatient = repo.findByPatientId(patientId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Patient not found"));

        existingPatient.setFirstName(patient.getFirstName());
        existingPatient.setLastName(patient.getLastName());
        existingPatient.setGender(patient.getGender());
        existingPatient.setDob(patient.getDob());
        existingPatient.setEmail(patient.getEmail());
        existingPatient.setPhone(patient.getPhone());
        existingPatient.setAddress(patient.getAddress());
        existingPatient.setCreatedAt(patient.getCreatedAt());

        return repo.save(existingPatient);
    }
}