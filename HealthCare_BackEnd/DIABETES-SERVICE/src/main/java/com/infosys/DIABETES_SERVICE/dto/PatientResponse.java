package com.infosys.DIABETES_SERVICE.dto;


import java.time.LocalDate;

import lombok.Data;

@Data
public class PatientResponse {

    private String patientId;

    private String gender;

    private LocalDate dob;
}
