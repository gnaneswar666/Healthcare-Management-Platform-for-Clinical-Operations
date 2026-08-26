package com.infosys.explanation_service.dto;


import java.time.LocalDateTime;
import java.util.List;
 
public class PredictionHistoryDto {

    private String id;
    private String patientId;
    private String disease;
    private String prediction;
    private double probability;
    private String risk;
    private double confidence;
    private String modelVersion;
    private double predictionTime;
    private LocalDateTime createdAt;
    private List<TopFactor> topFactors;

    private List<String> recommendations;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getPatientId() {
		return patientId;
	}
	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}
	public String getDisease() {
		return disease;
	}
	public void setDisease(String disease) {
		this.disease = disease;
	}
	public String getPrediction() {
		return prediction;
	}
	public void setPrediction(String prediction) {
		this.prediction = prediction;
	}
	public double getProbability() {
		return probability;
	}
	public void setProbability(double probability) {
		this.probability = probability;
	}
	public String getRisk() {
		return risk;
	}
	public void setRisk(String risk) {
		this.risk = risk;
	}
	public double getConfidence() {
		return confidence;
	}
	public void setConfidence(double confidence) {
		this.confidence = confidence;
	}
	public String getModelVersion() {
		return modelVersion;
	}
	public void setModelVersion(String modelVersion) {
		this.modelVersion = modelVersion;
	}
	public double getPredictionTime() {
		return predictionTime;
	}
	public void setPredictionTime(double predictionTime) {
		this.predictionTime = predictionTime;
	}
	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public List<TopFactor> getTopFactors() {
		return topFactors;
	}
	public void setTopFactors(List<TopFactor> topFactors) {
		this.topFactors = topFactors;
	}
	public List<String> getRecommendations() {
		return recommendations;
	}
	public void setRecommendations(List<String> recommendations) {
		this.recommendations = recommendations;
	}

    // Generate Getters and Setters
    
}
