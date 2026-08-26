package com.infosys.doctor_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.infosys.doctor_service.entity.DoctorAssignment;

public interface AssignmentRepository
        extends MongoRepository<DoctorAssignment, String> {

    List<DoctorAssignment> findByDoctorId(String doctorId);

    // Changed from DoctorAssignment to List<DoctorAssignment>
    List<DoctorAssignment> findByPatientId(String patientId);

    // Added for active assignments
    List<DoctorAssignment> findByPatientIdAndStatus(
            String patientId,
            String status);

    Optional<DoctorAssignment> findByDoctorIdAndPatientId(
            String doctorId,
            String patientId);

}