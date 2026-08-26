package com.infosys.CAREPLAN_SERVICE.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.infosys.CAREPLAN_SERVICE.model.CarePlan;

@Repository
public interface CarePlanRepository extends MongoRepository<CarePlan, String> {

    Optional<CarePlan> findByPatientId(String patientId);

    List<CarePlan> findAllByPatientIdOrderByCreatedAtDesc(String patientId);

    List<CarePlan> findByDoctorStatus(String doctorStatus);
    Optional<CarePlan> findTopByPatientIdOrderByCreatedAtDesc(
            String patientId
    );
}
