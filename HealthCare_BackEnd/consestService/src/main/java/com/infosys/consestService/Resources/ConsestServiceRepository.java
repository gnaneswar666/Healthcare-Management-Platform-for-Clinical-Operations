package com.infosys.consestService.Resources;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.infosys.consestService.Modal.ConsestService;

public interface ConsestServiceRepository extends MongoRepository<ConsestService, String>{

	Optional<ConsestService> findByPatientId(String patientId);
}
