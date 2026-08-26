package com.infosys.AI_ANOMALY_SERVICE.model;


import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "anomalies")
public class Anomaly {

    @Id
    private String id;

    private String patientId;

    private boolean anomalyDetected;

    private int anomalyScore;

    private String severity;

    private String message;

    // Vitals at the time anomaly was detected
    private Integer heartRate;

    private Double temperature;

    private Integer oxygenLevel;

    private String bloodPressure;

    private Instant detectedAt;

    private boolean resolved;
}