package com.infosys.CAREPLAN_SERVICE.dto;

import java.time.Instant;
import java.util.List;

import lombok.Data;

@Data
public class DiabetesPredictionDTO {

    private String id;

    private String patientId;

    private String prediction;

    private Double probability;

    private Double confidence;

    private String risk;

    private String modelName;

    private String algorithm;

    private String modelVersion;

    private Double predictionTime;

    private List<TopFactorDTO> topFactors;

    private List<String> recommendations;

    private Instant predictionDate;
}