package com.infosys.CAREPLAN_SERVICE.repository;


import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.infosys.CAREPLAN_SERVICE.model.CarePlanProgress;

public interface CarePlanProgressRepository
        extends MongoRepository<CarePlanProgress, String> {

    Optional<CarePlanProgress> findByCarePlanIdAndDate(
            String carePlanId,
            LocalDate date
    );

    Optional<CarePlanProgress> findByPatientIdAndDate(
            String patientId,
            LocalDate date
    );

    Optional<CarePlanProgress> findTopByPatientIdOrderByDateDesc(String patientId);
}
