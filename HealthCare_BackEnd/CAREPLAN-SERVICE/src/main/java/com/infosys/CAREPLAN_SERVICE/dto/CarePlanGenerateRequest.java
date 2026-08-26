package com.infosys.CAREPLAN_SERVICE.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarePlanGenerateRequest {
    private String patientId;
    private String doctorNotes;
}
