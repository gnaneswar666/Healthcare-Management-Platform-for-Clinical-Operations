package com.infosys.ai_predict.dto;

public class TopFactor {

    private String feature;
    private double value;
    private double impact;
	public String getFeature() {
		return feature;
	}
	public void setFeature(String feature) {
		this.feature = feature;
	}
	public double getValue() {
		return value;
	}
	public void setValue(double value) {
		this.value = value;
	}
	public double getImpact() {
		return impact;
	}
	public void setImpact(double impact) {
		this.impact = impact;
	}

    // getters and setters
    
}
