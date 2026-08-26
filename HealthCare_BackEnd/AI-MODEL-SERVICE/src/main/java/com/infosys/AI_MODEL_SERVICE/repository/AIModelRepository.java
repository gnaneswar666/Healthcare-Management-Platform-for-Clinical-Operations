package com.infosys.AI_MODEL_SERVICE.repository;


import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.infosys.AI_MODEL_SERVICE.model.AIModel;


public interface AIModelRepository extends MongoRepository<AIModel, String> {

    Optional<AIModel> findByActiveTrue();

}
