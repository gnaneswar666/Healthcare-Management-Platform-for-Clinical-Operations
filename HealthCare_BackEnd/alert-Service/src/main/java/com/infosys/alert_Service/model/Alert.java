package com.infosys.alert_Service.model;


import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alert {

    @Id
    private String id;

    private String patientId;

    private String doctorId;

    private String patientName;

    private String message;

    private Severity severity;

    private AlertStatus status;
    private Double heartRate;

    private Double oxygenLevel;

    private Double temperature;

    private Double riskScore;

    private boolean active;

    private Instant createdAt;

    private Instant acknowledgedAt;
    private Instant lastUpdated;
}