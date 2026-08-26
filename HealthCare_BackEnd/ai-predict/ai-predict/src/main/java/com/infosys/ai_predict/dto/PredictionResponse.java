package com.infosys.ai_predict.dto;

import java.util.List;

public class PredictionResponse {

	 private String disease;
	    private String prediction;
	    private double probability;
	    private String risk;
	    private double confidence;
	    private String modelVersion;
	    private double predictionTime;
	    private List<TopFactor> topFactors;
	    private List<String> recommendations;
	public String getPrediction() {
		return prediction;
	}
	public void setPrediction(String prediction) {
		this.prediction = prediction;
	}
	
	public String getDisease() {
		return disease;
	}
	public void setDisease(String disease) {
		this.disease = disease;
	}
	public double getPredictionTime() {
		return predictionTime;
	}
	public void setPredictionTime(double predictionTime) {
		this.predictionTime = predictionTime;
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

    // Getters and Setters
    
}