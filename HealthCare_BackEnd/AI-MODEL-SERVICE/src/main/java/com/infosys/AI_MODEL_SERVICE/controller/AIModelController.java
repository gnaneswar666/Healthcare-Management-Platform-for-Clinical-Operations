package com.infosys.AI_MODEL_SERVICE.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.infosys.AI_MODEL_SERVICE.model.AIModel;
import com.infosys.AI_MODEL_SERVICE.service.AIModelService;

@RestController
@RequestMapping("/api/models")

public class AIModelController {

    @Autowired
    private AIModelService service;

    // Add Model
    @PostMapping
    public AIModel addModel(@RequestBody AIModel model) {
        return service.addModel(model);
    }

    // Get All Models
    @GetMapping
    public List<AIModel> getAllModels() {
        return service.getAllModels();
    }

    // Get Model By Id
    @GetMapping("/{id}")
    public AIModel getModelById(@PathVariable String id) {
        return service.getModelById(id);
    }

    // Update Model
    @PutMapping("/{id}")
    public AIModel updateModel(@PathVariable String id,
                               @RequestBody AIModel model) {
        return service.updateModel(id, model);
    }

    // Delete Model
    @DeleteMapping("/{id}")
    public String deleteModel(@PathVariable String id) {
        service.deleteModel(id);
        return "Model deleted successfully.";
    }

    // Activate Model
    @PatchMapping("/{id}/activate")
    public AIModel activateModel(@PathVariable String id) {
        return service.activateModel(id);
    }
    
    // Get Active Model
    @GetMapping("/active")
    public AIModel getActiveModel() {
        return service.getActiveModel();
    }
}
