package com.infosys.ai_predict.dto;

public class PredictionRequest {
	private String patientId;
	private String modelFile;
	private String modelVersion;
    private int age;
    private int sex;
    private int cp;
    private int trestbps;
    private int chol;
    private int fbs;
    private int restecg;
    private int thalach;
    private int exang;
    private double oldpeak;
    private int slope;
    private int ca;
    private int thal;
    
	public String getPatientId() {
		return patientId;
	}
	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}
	
	public String getModelFile() {
		return modelFile;
	}
	public void setModelFile(String modelFile) {
		this.modelFile = modelFile;
	}
	
	public String getModelVersion() {
		return modelVersion;
	}
	public void setModelVersion(String modelVersion) {
		this.modelVersion = modelVersion;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
	public int getSex() {
		return sex;
	}
	public void setSex(int sex) {
		this.sex = sex;
	}
	public int getCp() {
		return cp;
	}
	public void setCp(int cp) {
		this.cp = cp;
	}
	public int getTrestbps() {
		return trestbps;
	}
	public void setTrestbps(int trestbps) {
		this.trestbps = trestbps;
	}
	public int getChol() {
		return chol;
	}
	public void setChol(int chol) {
		this.chol = chol;
	}
	public int getFbs() {
		return fbs;
	}
	public void setFbs(int fbs) {
		this.fbs = fbs;
	}
	public int getRestecg() {
		return restecg;
	}
	public void setRestecg(int restecg) {
		this.restecg = restecg;
	}
	public int getThalach() {
		return thalach;
	}
	public void setThalach(int thalach) {
		this.thalach = thalach;
	}
	public int getExang() {
		return exang;
	}
	public void setExang(int exang) {
		this.exang = exang;
	}
	public double getOldpeak() {
		return oldpeak;
	}
	public void setOldpeak(double oldpeak) {
		this.oldpeak = oldpeak;
	}
	public int getSlope() {
		return slope;
	}
	public void setSlope(int slope) {
		this.slope = slope;
	}
	public int getCa() {
		return ca;
	}
	public void setCa(int ca) {
		this.ca = ca;
	}
	public int getThal() {
		return thal;
	}
	public void setThal(int thal) {
		this.thal = thal;
	}

    // Getters and Setters
    
}