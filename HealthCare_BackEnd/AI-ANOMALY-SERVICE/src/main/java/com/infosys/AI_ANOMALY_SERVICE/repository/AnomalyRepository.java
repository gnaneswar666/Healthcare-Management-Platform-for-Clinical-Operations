package com.infosys.AI_ANOMALY_SERVICE.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.infosys.AI_ANOMALY_SERVICE.model.Anomaly;


public interface AnomalyRepository
        extends MongoRepository<Anomaly, String> {

    List<Anomaly> findByPatientId(String patientId);

    List<Anomaly> findByPatientIdAndResolved(
            String patientId,
            boolean resolved);

    List<Anomaly> findBySeverity(String severity);
}