package com.infosys.diagnostic_service.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.infosys.diagnostic_service.model.DiagnosticRecord;

public interface DiagnosticRepository
        extends MongoRepository<DiagnosticRecord, String> {

    Optional<DiagnosticRecord> findByPatientId(String patientId);

    boolean existsByPatientId(String patientId);

    void deleteByPatientId(String patientId);
}