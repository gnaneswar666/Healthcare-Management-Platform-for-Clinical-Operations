package com.infosys.Medisphere.Resources;


import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.infosys.Medisphere.Modal.Patient;

public interface patientResources extends MongoRepository<Patient, String> {
	 Optional<Patient> findByPatientId(String patientId);
}
