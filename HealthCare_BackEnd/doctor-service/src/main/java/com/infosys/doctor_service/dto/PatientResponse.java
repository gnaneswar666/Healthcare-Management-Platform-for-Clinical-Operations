package com.infosys.doctor_service.dto;

import lombok.Data;

@Data
public class PatientResponse {

    private String id;
    private String patientId;
    private String firstName;
    private String lastName;
    private String gender;
    private String dob;
    private String email;
    private Long phone;
    private String address;
    private String createdAt;

    // Generate Getters and Setters
}