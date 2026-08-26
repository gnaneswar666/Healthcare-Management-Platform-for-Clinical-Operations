package com.infosys.AI_ANOMALY_SERVICE.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnomalyResult {

    private String patientId;

    private boolean anomalyDetected;

    private int anomalyScore;

    private String severity;

    private String message;
}