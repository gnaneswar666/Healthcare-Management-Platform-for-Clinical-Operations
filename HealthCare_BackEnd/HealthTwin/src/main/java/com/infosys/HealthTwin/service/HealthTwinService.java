package com.infosys.HealthTwin.service;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.infosys.HealthTwin.Modal.HealthTwin;
import com.infosys.HealthTwin.Repository.HealthTwinRepository;
import com.infosys.HealthTwin.exception.ResourceNotFoundException;

@Service
public class HealthTwinService {

    @Autowired
    private HealthTwinRepository repo;

    // Create Digital Twin
    public HealthTwin createTwin(HealthTwin twin) {

        twin.setLastUpdated(Instant.now());

        return repo.save(twin);
    }

    // Get Digital Twin
    public HealthTwin getTwinByPatientId(String patientId) {

        return repo.findByPatientId(patientId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Health Twin not found"));
    }

    // Update Digital Twin
    public HealthTwin updateTwin(String patientId, HealthTwin twin) {

        HealthTwin existing = repo.findByPatientId(patientId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Health Twin not found"));

        // Permanent details
        existing.setHeight(twin.getHeight());
        existing.setWeight(twin.getWeight());
        existing.setBloodGroup(twin.getBloodGroup());
        existing.setAllergies(twin.getAllergies());
        existing.setChronicDiseases(twin.getChronicDiseases());
        existing.setCurrentMedications(twin.getCurrentMedications());

        // Live vitals (ADD THESE)
        existing.setHeartRate(twin.getHeartRate());
        existing.setTemperature(twin.getTemperature());
        existing.setOxygenLevel(twin.getOxygenLevel());
        existing.setBloodPressure(twin.getBloodPressure());

        existing.setRiskScore(twin.getRiskScore());
        existing.setLastUpdated(Instant.now());

        return repo.save(existing);
    }
    // Calculate Health Score
    public double calculateHealthScore(String patientId) {

        HealthTwin twin = repo.findByPatientId(patientId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Health Twin not found"));

        double score = 100;

        if (twin.getWeight() > 80) {
            score -= 10;
        }

        score -= twin.getChronicDiseases().size() * 10;
        score -= twin.getAllergies().size() * 5;
        score -= twin.getRiskScore();

        return Math.max(score, 0);
    }
    public List<HealthTwin> getAllTwins(){

        return repo.findAll();

    }
}