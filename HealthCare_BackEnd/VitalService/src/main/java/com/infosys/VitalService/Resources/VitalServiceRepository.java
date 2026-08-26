package com.infosys.VitalService.Resources;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.infosys.VitalService.Modal.VitalService;

public interface VitalServiceRepository extends MongoRepository<VitalService, String>{

	 List<VitalService> findByPatientId(String patientId);

}
