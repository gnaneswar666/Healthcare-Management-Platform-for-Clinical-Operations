package com.infosys.AI_MODEL_SERVICE.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ai_models")
public class AIModel {

    @Id
    private String id;

    private String modelName;
    private String modelType;
    private String version;
    private String algorithm;
    private String modelFile;
    private double accuracy;
    private String status;
    private boolean active;
    private String description;
    private long predictionCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AIModel() {
    }
    public AIModel(String id, String modelName, String version, String algorithm,
                   String modelFile, double accuracy, String status,
                   boolean active, String description,
                   long predictionCount, LocalDateTime createdAt,
                   LocalDateTime updatedAt) {
        this.id = id;
        this.modelName = modelName;
        this.version = version;
        this.algorithm = algorithm;
        this.modelFile = modelFile;
        this.accuracy = accuracy;
        this.status = status;
        this.active = active;
        this.description = description;
        this.predictionCount = predictionCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }

    public String getModelFile() {
        return modelFile;
    }

    public void setModelFile(String modelFile) {
        this.modelFile = modelFile;
    }

    public double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(double accuracy) {
        this.accuracy = accuracy;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public long getPredictionCount() {
        return predictionCount;
    }

    public void setPredictionCount(long predictionCount) {
        this.predictionCount = predictionCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

	public String getModelType() {
		return modelType;
	}

	public void setModelType(String modelType) {
		this.modelType = modelType;
	}

}
