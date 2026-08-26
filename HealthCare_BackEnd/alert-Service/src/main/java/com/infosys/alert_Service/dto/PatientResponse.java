package com.infosys.alert_Service.dto;


import lombok.Data;

@Data
public class PatientResponse {

    private String patientId;
    private String firstName;
    private String lastName;
    private String gender;
    private String phone;

}