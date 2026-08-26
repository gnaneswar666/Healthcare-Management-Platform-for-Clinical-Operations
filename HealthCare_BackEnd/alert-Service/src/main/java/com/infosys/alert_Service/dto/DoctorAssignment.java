package com.infosys.alert_Service.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorAssignment {

    private String doctorId;

    private String patientId;

    private String patientName;

}