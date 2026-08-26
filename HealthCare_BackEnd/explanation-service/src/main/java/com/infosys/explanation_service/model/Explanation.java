package com.infosys.explanation_service.model;


import java.util.Date;
import java.util.List;
import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "explanations")
public class Explanation {

    @Id
    private String id;

    private String predictionId;

    private String patientId;

    private String disease;

    private String prediction;

    private String risk;

    private List<String> topFactors;

    private String clinicalGuideline;

    private String explanation;

    private String status;

    private List<String> recommendations;
private Instant createdAt;

    public Explanation() {
    }

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getPredictionId() {
		return predictionId;
	}

	public void setPredictionId(String predictionId) {
		this.predictionId = predictionId;
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

	public String getRisk() {
		return risk;
	}

	public void setRisk(String risk) {
		this.risk = risk;
	}

	public List<String> getTopFactors() {
		return topFactors;
	}

	public void setTopFactors(List<String> topFactors) {
		this.topFactors = topFactors;
	}

	public String getClinicalGuideline() {
		return clinicalGuideline;
	}

	public void setClinicalGuideline(String clinicalGuideline) {
		this.clinicalGuideline = clinicalGuideline;
	}

	public String getExplanation() {
		return explanation;
	}

	public void setExplanation(String explanation) {
		this.explanation = explanation;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	public List<String> getRecommendations() {
		return recommendations;
	}

	public void setRecommendations(List<String> recommendations) {
		this.recommendations = recommendations;
	}

	
    
}