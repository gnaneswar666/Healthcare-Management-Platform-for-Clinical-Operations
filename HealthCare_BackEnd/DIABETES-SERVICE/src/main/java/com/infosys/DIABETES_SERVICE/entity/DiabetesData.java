package com.infosys.DIABETES_SERVICE.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "diabetes_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiabetesData {

    @Id
    private String id;

    private String patientId;

    private Integer hypertension;

    private Integer heartDisease;

    private String smokingHistory;

    private Double bmi;

    private Double hba1cLevel;

    private Double bloodGlucoseLevel;

    private LocalDateTime updatedAt;
}
