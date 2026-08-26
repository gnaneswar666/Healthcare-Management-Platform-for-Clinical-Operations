package com.infosys.AI_MODEL_SERVICE.service;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.infosys.AI_MODEL_SERVICE.model.AIModel;
import com.infosys.AI_MODEL_SERVICE.repository.AIModelRepository;

@Service
public class AIModelService {

    @Autowired
    private AIModelRepository repository;

    // Add Model
    public AIModel addModel(AIModel model) {
        model.setCreatedAt(LocalDateTime.now());
        model.setUpdatedAt(LocalDateTime.now());

        if (model.isActive()) {
            deactivateAllModels();
        }

        return repository.save(model);
    }

    // Get All Models
    public List<AIModel> getAllModels() {
        return repository.findAll();
    }

    // Get Model By Id
    public AIModel getModelById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Model not found"));
    }

    // Update Model
    public AIModel updateModel(String id, AIModel model) {

        AIModel existing = getModelById(id);

        existing.setModelName(model.getModelName());
        existing.setVersion(model.getVersion());
        existing.setAlgorithm(model.getAlgorithm());
        existing.setModelFile(model.getModelFile());
        existing.setAccuracy(model.getAccuracy());
        existing.setStatus(model.getStatus());
        existing.setDescription(model.getDescription());
        existing.setPredictionCount(model.getPredictionCount());

        existing.setUpdatedAt(LocalDateTime.now());

        return repository.save(existing);
    }

    // Delete Model
    public void deleteModel(String id) {
        repository.deleteById(id);
    }

    // Get Active Model
    public AIModel getActiveModel() {
        return repository.findByActiveTrue()
                .orElseThrow(() -> new RuntimeException("No active model found"));
    }

    // Activate Model
    public AIModel activateModel(String id) {

        deactivateAllModels();

        AIModel model = getModelById(id);

        model.setActive(true);
        model.setUpdatedAt(LocalDateTime.now());

        return repository.save(model);
    }

    // Helper Method
    private void deactivateAllModels() {

        List<AIModel> models = repository.findAll();

        for (AIModel model : models) {
            if (model.isActive()) {
                model.setActive(false);
                repository.save(model);
            }
        }
    }
}
