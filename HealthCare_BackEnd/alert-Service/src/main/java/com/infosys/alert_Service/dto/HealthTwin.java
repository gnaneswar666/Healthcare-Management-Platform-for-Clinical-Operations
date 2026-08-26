package com.infosys.alert_Service.dto;


import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthTwin {

    private String id;

    private String patientId;

    private Double heartRate;

    private Double oxygenLevel;

    private Double temperature;

    private Double riskScore;

    private Double height;

    private Double weight;

    private String bloodPressure;

    private String bloodGroup;

    private List<String> allergies;

    private List<String> chronicDiseases;

    private List<String> currentMedications;

    private Instant lastUpdated;
}