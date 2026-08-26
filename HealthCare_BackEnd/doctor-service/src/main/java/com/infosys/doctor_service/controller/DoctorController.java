package com.infosys.doctor_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.infosys.doctor_service.dto.DoctorRequest;
import com.infosys.doctor_service.service.DoctorService;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @PostMapping
    public ResponseEntity<?> addDoctor(@RequestBody DoctorRequest request) {
        return doctorService.addDoctor(request);
    }

    @GetMapping
    public ResponseEntity<?> getAllDoctors() {
        return doctorService.getAllDoctors();
    }
    @GetMapping("/{doctorId}")
    public ResponseEntity<?> getDoctor(@PathVariable String doctorId) {
        return doctorService.getDoctor(doctorId);
    }
    @PutMapping("/{doctorId}")
    public ResponseEntity<?> updateDoctor(
            @PathVariable String doctorId,
            @RequestBody DoctorRequest request) {

        return doctorService.updateDoctor(doctorId, request);
    }
    @DeleteMapping("/{doctorId}")
    public ResponseEntity<?> deleteDoctor(@PathVariable String doctorId) {

        return doctorService.deleteDoctor(doctorId);
    }

}
