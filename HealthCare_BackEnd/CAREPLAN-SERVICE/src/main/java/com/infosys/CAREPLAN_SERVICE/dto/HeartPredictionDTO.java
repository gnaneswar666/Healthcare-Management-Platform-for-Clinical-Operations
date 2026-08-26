package com.infosys.CAREPLAN_SERVICE.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class HeartPredictionDTO {

    private String id;

    private String patientId;

    private String prediction;

    private double probability;

    private String risk;

    private double confidence;

    private String modelVersion;

    private String disease;

    private double predictionTime;

    private LocalDateTime createdAt;

    private List<TopFactorDTO> topFactors;

    private List<String> recommendations;
}