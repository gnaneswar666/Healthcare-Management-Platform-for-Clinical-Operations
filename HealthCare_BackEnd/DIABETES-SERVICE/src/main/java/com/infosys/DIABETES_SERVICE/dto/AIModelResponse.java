package com.infosys.DIABETES_SERVICE.dto;

import lombok.Data;

@Data
public class AIModelResponse {

    private String id;

    private String modelName;

    private String modelType;      // <-- ADD THIS

    private String version;        // <-- CHANGE modelVersion -> version

    private String algorithm;

    private String modelFile;

    private boolean active;
}