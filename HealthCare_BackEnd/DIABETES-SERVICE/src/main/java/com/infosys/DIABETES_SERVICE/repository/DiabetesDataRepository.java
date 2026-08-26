package com.infosys.DIABETES_SERVICE.repository;


import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.infosys.DIABETES_SERVICE.entity.DiabetesData;

public interface DiabetesDataRepository extends MongoRepository<DiabetesData, String> {

    Optional<DiabetesData> findByPatientId(String patientId);

}