package com.infosys.HealthTwin.Repository;



import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.infosys.HealthTwin.Modal.HealthTwin;

public interface HealthTwinRepository  extends MongoRepository<HealthTwin, String>{
	 Optional<HealthTwin> findByPatientId(String patientId);
}
