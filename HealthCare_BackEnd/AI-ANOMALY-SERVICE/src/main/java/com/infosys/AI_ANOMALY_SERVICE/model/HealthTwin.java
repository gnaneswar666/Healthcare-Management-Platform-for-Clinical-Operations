package com.infosys.AI_ANOMALY_SERVICE.model;




import java.time.Instant;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


public class HealthTwin {
	@Id
	private String id;
	private String patientId;
	private int height;
	private int weight;
	private String bloodGroup;
	private List<String> allergies;
	private List<String> chronicDiseases;
	private List<String> currentMedications;
	private Integer heartRate;
	

	private Double temperature;

	private Integer oxygenLevel;

	private String bloodPressure;

	private double riskScore;
	private Instant lastUpdated;
	public HealthTwin() {
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
	public int getHeight() {
		return height;
	}
	public void setHeight(int height) {
		this.height = height;
	}
	public int getWeight() {
		return weight;
	}
	public void setWeight(int weight) {
		this.weight = weight;
	}
	
	public Integer getHeartRate() {
		return heartRate;
	}

	public void setHeartRate(Integer heartRate) {
		this.heartRate = heartRate;
	}

	public Double getTemperature() {
		return temperature;
	}

	public void setTemperature(Double temperature) {
		this.temperature = temperature;
	}

	public Integer getOxygenLevel() {
		return oxygenLevel;
	}

	public void setOxygenLevel(Integer oxygenLevel) {
		this.oxygenLevel = oxygenLevel;
	}

	public String getBloodPressure() {
		return bloodPressure;
	}

	public void setBloodPressure(String bloodPressure) {
		this.bloodPressure = bloodPressure;
	}

	public String getBloodGroup() {
		return bloodGroup;
	}
	public void setBloodGroup(String bloodGroup) {
		this.bloodGroup = bloodGroup;
	}
	public List<String> getAllergies() {
		return allergies;
	}
	public void setAllergies(List<String> allergies) {
		this.allergies = allergies;
	}
	public List<String> getChronicDiseases() {
		return chronicDiseases;
	}
	public void setChronicDiseases(List<String> chronicDiseases) {
		this.chronicDiseases = chronicDiseases;
	}
	public List<String> getCurrentMedications() {
		return currentMedications;
	}
	public void setCurrentMedications(List<String> currentMedications) {
		this.currentMedications = currentMedications;
	}
	public double getRiskScore() {
		return riskScore;
	}
	public void setRiskScore(double riskScore) {
		this.riskScore = riskScore;
	}
	public Instant getLastUpdated() {
		return lastUpdated;
	}
	public void setLastUpdated(Instant instant) {
		this.lastUpdated = instant;
	}

	@Override
	public String toString() {
		return "HealthTwin [patientId=" + patientId + ", height=" + height + ", weight=" + weight + ", bloodGroup="
				+ bloodGroup + ", allergies=" + allergies + ", chronicDiseases=" + chronicDiseases
				+ ", currentMedications=" + currentMedications + ", riskScore=" + riskScore + ", lastUpdated="
				+ lastUpdated + "]";
	}
	
}
