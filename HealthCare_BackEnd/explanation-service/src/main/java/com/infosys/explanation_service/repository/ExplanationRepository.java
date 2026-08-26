package com.infosys.explanation_service.repository;


import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.infosys.explanation_service.model.Explanation;

@Repository
public interface ExplanationRepository extends MongoRepository<Explanation, String> {

    Optional<Explanation> findByPredictionId(String predictionId);

}