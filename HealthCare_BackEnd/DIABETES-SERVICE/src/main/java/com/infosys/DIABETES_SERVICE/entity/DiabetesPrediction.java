package com.infosys.DIABETES_SERVICE.entity;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.infosys.DIABETES_SERVICE.dto.TopFactorDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "diabetes_prediction_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiabetesPrediction {

    @Id
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