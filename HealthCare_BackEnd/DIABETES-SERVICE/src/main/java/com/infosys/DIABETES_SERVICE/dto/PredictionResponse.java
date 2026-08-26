package com.infosys.DIABETES_SERVICE.dto;

import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PredictionResponse {

    private String prediction;

    private Double probability;

    private Double confidence;

    private String risk;

    private String modelVersion;

    private Double predictionTime;

    private List<TopFactorDTO> topFactors;

    private List<String> recommendations;
    private Instant predictionDate;
}