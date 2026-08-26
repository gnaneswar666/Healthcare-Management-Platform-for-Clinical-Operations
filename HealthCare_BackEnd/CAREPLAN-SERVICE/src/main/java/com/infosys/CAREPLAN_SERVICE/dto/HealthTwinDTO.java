package com.infosys.CAREPLAN_SERVICE.dto;


import java.util.List;

import lombok.Data;

@Data
public class HealthTwinDTO {

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
}
