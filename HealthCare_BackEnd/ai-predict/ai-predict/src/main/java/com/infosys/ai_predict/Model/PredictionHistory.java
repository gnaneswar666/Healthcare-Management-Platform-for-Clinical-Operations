package com.infosys.ai_predict.Model;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.infosys.ai_predict.dto.TopFactor;

import lombok.Data;

@Data
@Document(collection = "prediction_history")
public class PredictionHistory {

    @Id
    private String id;

    private String patientId;

    private String prediction;

    private double probability;

    private String risk;

    private double confidence;

    private String modelVersion;
    private String disease;

    private double predictionTime;
    private LocalDateTime createdAt;
    private List<TopFactor> topFactors;

    private List<String> recommendations;
	public String getDisease() {
		return disease;
	}

	public void setDisease(String disease) {
		this.disease = disease;
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

	public double getPredictionTime() {
		return predictionTime;
	}

	public void setPredictionTime(double predictionTime) {
		this.predictionTime = predictionTime;
	}

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

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
    

}