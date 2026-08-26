package com.infosys.DIABETES_SERVICE.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PredictionRequest {

    private Integer gender;

    private Integer age;

    private Integer hypertension;

    @JsonProperty("heart_disease")
    private Integer heartDisease;

    @JsonProperty("smoking_history")
    private Integer smokingHistory;

    private Double bmi;

    @JsonProperty("HbA1c_level")
    private Double hba1cLevel;

    @JsonProperty("blood_glucose_level")
    private Double bloodGlucoseLevel;

    private String modelFile;

    private String modelVersion;
}