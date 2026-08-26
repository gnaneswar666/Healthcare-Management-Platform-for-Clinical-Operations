package com.infosys.doctor_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorResponse {

    private String doctorId;
    private String doctorName;
    private String email;
    private String phone;
    private String gender;

    private String specialization;
    private String qualification;
    private int experience;
    private String department;

    private String availability;
    private String status;
}
