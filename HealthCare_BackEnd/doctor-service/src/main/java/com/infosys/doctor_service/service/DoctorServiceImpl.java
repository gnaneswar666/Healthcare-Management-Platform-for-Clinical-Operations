package com.infosys.doctor_service.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.infosys.doctor_service.dto.DoctorRequest;
import com.infosys.doctor_service.dto.DoctorResponse;
import com.infosys.doctor_service.entity.Doctor;
import com.infosys.doctor_service.repository.DoctorRepository;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;
    @Override
    public ResponseEntity<?> addDoctor(DoctorRequest request) {

        // Check duplicate email
    	if (doctorRepository.existsByDoctorId(request.getDoctorId())) {
    	    return ResponseEntity
    	            .status(HttpStatus.CONFLICT)
    	            .body("Doctor ID already exists");
    	}

    	if (doctorRepository.existsByEmail(request.getEmail())) {
    	    return ResponseEntity
    	            .status(HttpStatus.CONFLICT)
    	            .body("Email already exists");
    	}

        Doctor doctor = new Doctor();

        doctor.setDoctorId(request.getDoctorId());

        doctor.setDoctorName(request.getDoctorName());
        doctor.setEmail(request.getEmail());
        doctor.setPhone(request.getPhone());
        doctor.setGender(request.getGender());

        doctor.setSpecialization(request.getSpecialization());
        doctor.setQualification(request.getQualification());
        doctor.setExperience(request.getExperience());
        doctor.setDepartment(request.getDepartment());

        doctor.setAvailability(request.getAvailability());

        doctor.setStatus("ACTIVE");
        doctor.setCreatedAt(Instant.now());
        
        doctorRepository.save(doctor);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(mapToResponse(doctor));
    }
    @Override
    public ResponseEntity<?> getAllDoctors() {

        List<Doctor> doctors = doctorRepository.findAll();

        List<DoctorResponse> responses = doctors.stream()
                .map(this::mapToResponse)
                .toList();

        return ResponseEntity.ok(responses);
    }
	@Override
	public ResponseEntity<?> getDoctor(String doctorId) {
		// TODO Auto-generated method stub
		
		Optional<Doctor> optionalDoctor = doctorRepository.findByDoctorId(doctorId);
		if (optionalDoctor.isEmpty()) {
	        return ResponseEntity
	                .status(HttpStatus.NOT_FOUND)
	                .body("Doctor not found");
	    }

	    Doctor doctor = optionalDoctor.get();

	    return ResponseEntity
	            .ok(mapToResponse(doctor));
	}
	
	@Override
	public ResponseEntity<?> updateDoctor(String doctorId, DoctorRequest request) {

	    Optional<Doctor> optionalDoctor = doctorRepository.findByDoctorId(doctorId);

	    if (optionalDoctor.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                .body("Doctor not found");
	    }

	    Doctor doctor = optionalDoctor.get();

	    doctor.setDoctorName(request.getDoctorName());
	    doctor.setEmail(request.getEmail());
	    doctor.setPhone(request.getPhone());
	    doctor.setGender(request.getGender());

	    doctor.setSpecialization(request.getSpecialization());
	    doctor.setQualification(request.getQualification());
	    doctor.setExperience(request.getExperience());
	    doctor.setDepartment(request.getDepartment());

	    doctor.setAvailability(request.getAvailability());

	    doctorRepository.save(doctor);

	    return ResponseEntity.ok(mapToResponse(doctor));
	}
	@Override
	
	public ResponseEntity<?> deleteDoctor(String doctorId) {

	    Optional<Doctor> optionalDoctor = doctorRepository.findByDoctorId(doctorId);

	    if (optionalDoctor.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                .body("Doctor not found");
	    }

	    doctorRepository.delete(optionalDoctor.get());

	    return ResponseEntity.ok("Doctor deleted successfully");
	}
	
	
	private DoctorResponse mapToResponse(Doctor doctor) {

	    DoctorResponse response = new DoctorResponse();

	    response.setDoctorId(doctor.getDoctorId());
	    response.setDoctorName(doctor.getDoctorName());
	    response.setEmail(doctor.getEmail());
	    response.setPhone(doctor.getPhone());
	    response.setGender(doctor.getGender());

	    response.setSpecialization(doctor.getSpecialization());
	    response.setQualification(doctor.getQualification());
	    response.setExperience(doctor.getExperience());
	    response.setDepartment(doctor.getDepartment());

	    response.setAvailability(doctor.getAvailability());
	    response.setStatus(doctor.getStatus());

	    return response;
	}

}
