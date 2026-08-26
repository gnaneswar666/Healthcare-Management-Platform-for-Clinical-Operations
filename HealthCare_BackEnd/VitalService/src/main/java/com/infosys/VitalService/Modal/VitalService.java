package com.infosys.VitalService.Modal;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="Vitals")
public class VitalService {
@Id
private  String id;
private String patientId;
private int heartRate;
private String bloodPressure;
private int oxygenLevel;
private double temperature;
private Instant timestamp;
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
public int getOxygenLevel() {
	return oxygenLevel;
}
public void setOxygenLevel(int oxygenLevel) {
	this.oxygenLevel = oxygenLevel;
}
public double getTemperature() {
	return temperature;
}
public void setTemperature(double temperature) {
	this.temperature = temperature;
}

public Instant getTimestamp() {
	return timestamp;
}
public void setTimestamp(Instant timestamp) {
	this.timestamp = timestamp;
}
@Override
public String toString() {
	return "VitalService [id=" + id + ", patientId=" + patientId + ", heartRate=" + heartRate + ", bloodPressure="
			+ bloodPressure + ", oxygenLevel=" + oxygenLevel + ", temperature=" + temperature + "]";
}

}
