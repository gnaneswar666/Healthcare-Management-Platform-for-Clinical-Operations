package com.infosys.doctor_service.service;


import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.infosys.doctor_service.client.PatientClient;
import com.infosys.doctor_service.dto.AssignmentRequest;
import com.infosys.doctor_service.dto.PatientResponse;
import com.infosys.doctor_service.entity.Doctor;
import com.infosys.doctor_service.entity.DoctorAssignment;
import com.infosys.doctor_service.repository.AssignmentRepository;
import com.infosys.doctor_service.repository.DoctorRepository;

@Service
public class AssignmentServiceImpl implements AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientClient patientClient;
    
    @Override
    public ResponseEntity<?> assignPatient(AssignmentRequest request) {

        // Check Doctor Exists
        Doctor doctor = doctorRepository.findByDoctorId(request.getDoctorId())
                .orElse(null);

        if (doctor == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Doctor not found");
        }
        
        // Duplicate Assignment Check
        if (assignmentRepository.findByDoctorIdAndPatientId(
                request.getDoctorId(),
                request.getPatientId()).isPresent()) {

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Patient already assigned to this doctor");
        }
        try {
            PatientResponse patient = patientClient.getPatient(request.getPatientId());

            if (patient == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Patient not found");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Patient not found");
        }
        DoctorAssignment assignment = new DoctorAssignment();

        assignment.setDoctorId(request.getDoctorId());
        assignment.setPatientId(request.getPatientId());
        assignment.setAssignedDate(Instant.now());
        assignment.setStatus("ACTIVE");

        assignmentRepository.save(assignment);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Patient assigned successfully");
    }

    @Override
    public ResponseEntity<?> getAssignedPatients(String doctorId) {

        List<DoctorAssignment> assignments =
                assignmentRepository.findByDoctorId(doctorId);

        List<PatientResponse> patients = assignments.stream()
                .map(a -> patientClient.getPatient(a.getPatientId()))
                .toList();

        return ResponseEntity.ok(patients);
    }

    @Override
    public ResponseEntity<?> unAssignPatient(String doctorId,
                                             String patientId) {

        DoctorAssignment assignment =
                assignmentRepository
                .findByDoctorIdAndPatientId(doctorId, patientId)
                .orElse(null);

        if (assignment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Assignment not found");
        }

        assignmentRepository.delete(assignment);

        return ResponseEntity.ok("Patient unassigned successfully");
    }
    @Override
    public ResponseEntity<?> getAssignedDoctor(String patientId) {

        List<DoctorAssignment> assignments =
                assignmentRepository.findByPatientIdAndStatus(
                        patientId,
                        "ACTIVE");

        if (assignments.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(assignments);
    }

}
