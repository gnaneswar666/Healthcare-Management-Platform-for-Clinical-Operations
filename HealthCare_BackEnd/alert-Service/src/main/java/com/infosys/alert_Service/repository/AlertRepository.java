package com.infosys.alert_Service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.infosys.alert_Service.model.Alert;
import com.infosys.alert_Service.model.AlertStatus;

@Repository
public interface AlertRepository extends MongoRepository<Alert, String> {

    List<Alert> findByDoctorId(String doctorId);

    List<Alert> findByPatientId(String patientId);

    List<Alert> findByStatus(AlertStatus status);

    Optional<Alert> findByPatientIdAndDoctorIdAndMessage(
            String patientId,
            String doctorId,
            String message);
    List<Alert> findByDoctorIdAndActiveTrue(String doctorId);

    List<Alert> findByActiveTrue();
    List<Alert> findByPatientIdIn(List<String> patientIds);

}