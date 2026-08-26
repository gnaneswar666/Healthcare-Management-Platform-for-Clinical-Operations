package com.infosys.doctor_service.entity;


import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Document(collection = "doctors")
@Data
public class Doctor {

    @Id
    private String id;

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

    private Instant createdAt;

    public Doctor() {
    }

    // Generate Getters and Setters
}