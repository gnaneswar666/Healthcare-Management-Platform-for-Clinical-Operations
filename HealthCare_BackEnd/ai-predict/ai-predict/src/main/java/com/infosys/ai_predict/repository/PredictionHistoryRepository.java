package com.infosys.ai_predict.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.infosys.ai_predict.Model.PredictionHistory;


public interface PredictionHistoryRepository
        extends MongoRepository<PredictionHistory, String> {

    List<PredictionHistory> findByPatientId(String patientId);

    List<PredictionHistory> findTop10ByPatientIdOrderByCreatedAtDesc(String patientId);
    Optional<PredictionHistory> findTopByPatientIdOrderByCreatedAtDesc(String patientId);

}
