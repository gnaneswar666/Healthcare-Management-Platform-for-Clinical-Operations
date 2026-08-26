package com.infosys.doctor_service.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.infosys.doctor_service.dto.DoctorRequest;
import com.infosys.doctor_service.dto.DoctorResponse;

public interface DoctorService {

	ResponseEntity<?> addDoctor(DoctorRequest request);

	ResponseEntity<?> getAllDoctors();

	ResponseEntity<?> getDoctor(String doctorId);

	ResponseEntity<?> updateDoctor(String doctorId, DoctorRequest request);

	ResponseEntity<?> deleteDoctor(String doctorId);

}
