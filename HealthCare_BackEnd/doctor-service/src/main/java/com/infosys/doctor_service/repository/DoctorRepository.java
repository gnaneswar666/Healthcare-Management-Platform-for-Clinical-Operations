package com.infosys.doctor_service.repository;


import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.infosys.doctor_service.entity.Doctor;


public interface DoctorRepository extends MongoRepository<Doctor, String> {

    Optional<Doctor> findByDoctorId(String doctorId);

    boolean existsByDoctorId(String doctorId);

    boolean existsByEmail(String email);
}
