package com.infosys.SIMULATION_SERVICE.dto.health;

import java.time.Instant;
import java.util.List;

public class HealthTwinRequest {

    private String patientId;

    private double height;
    private double weight;

    private int heartRate;
    private String bloodPressure;
    private double temperature;
    private int oxygenLevel;
    private String bloodGroup;

    private List<String> allergies;

    private List<String> chronicDiseases;

    private List<String> currentMedications;

    private int riskScore;
    private Instant lastUpdated;

    public HealthTwinRequest() {
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public int getHeartRate() {
        return heartRate;
    }

    public void setHeartRate(int heartRate) {
        this.heartRate = heartRate;
    }

    public String getBloodPressure() {
        return bloodPressure;
    }

    public void setBloodPressure(String bloodPressure) {
        this.bloodPressure = bloodPressure;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public int getOxygenLevel() {
        return oxygenLevel;
    }

    public void setOxygenLevel(int oxygenLevel) {
        this.oxygenLevel = oxygenLevel;
    }

    public Instant getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Instant lastUpdated) {
        this.lastUpdated = lastUpdated;
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

	public int getRiskScore() {
		return riskScore;
	}

	public void setRiskScore(int riskScore) {
		this.riskScore = riskScore;
	}
    
}
