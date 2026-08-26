package com.infosys.CAREPLAN_SERVICE.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgressRequest {

    private String carePlanId;
    private String patientId;

    @JsonProperty("medicationCompleted")
    private boolean medicationCompleted;

    @JsonProperty("dietCompleted")
    private boolean dietCompleted;

    @JsonProperty("exerciseCompleted")
    private boolean exerciseCompleted;

    @JsonProperty("sleepCompleted")
    private boolean sleepCompleted;

    @JsonProperty("bpChecked")
    private boolean bpChecked;

    @JsonProperty("sugarChecked")
    private boolean sugarChecked;

    private Integer adherence;
}