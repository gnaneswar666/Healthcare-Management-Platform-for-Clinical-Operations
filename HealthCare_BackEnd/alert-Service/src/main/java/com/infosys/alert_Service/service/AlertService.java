package com.infosys.alert_Service.service;


import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.infosys.alert_Service.client.DoctorServiceClient;
import com.infosys.alert_Service.dto.DoctorAssignment;
import com.infosys.alert_Service.dto.HealthTwin;
import com.infosys.alert_Service.dto.PatientResponse;
import com.infosys.alert_Service.dto.PatientResponse;
import com.infosys.alert_Service.model.Alert;
import com.infosys.alert_Service.model.AlertStatus;
import com.infosys.alert_Service.model.Severity;
import com.infosys.alert_Service.repository.AlertRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;
    private final DoctorServiceClient doctorServiceClient;
    public void checkThresholds(HealthTwin twin) {

        boolean critical = false;

        if (twin.getHeartRate() != null && twin.getHeartRate() > 130) {

            critical = true;

            createOrUpdateAlert(
                    twin,
                    "Heart Rate Critical",
                    Severity.CRITICAL);

        }

        if (twin.getOxygenLevel() != null && twin.getOxygenLevel() < 90) {

            critical = true;

            createOrUpdateAlert(
                    twin,
                    "Low Oxygen Level",
                    Severity.HIGH);

        }

        if (twin.getTemperature() != null && twin.getTemperature() > 39) {

            critical = true;

            createOrUpdateAlert(
                    twin,
                    "High Temperature",
                    Severity.HIGH);

        }

        if (twin.getRiskScore() != null && twin.getRiskScore() >= 80) {

            critical = true;

            createOrUpdateAlert(
                    twin,
                    "High Risk Score",
                    Severity.CRITICAL);

        }

        if (!critical) {
            resolvePatientAlerts(twin.getPatientId());
        }

    }

    private void createOrUpdateAlert(
            HealthTwin twin,
            String message,
            Severity severity) {

        List<DoctorAssignment> assignments =
                doctorServiceClient.getAssignedDoctor(twin.getPatientId());

        if (assignments == null || assignments.isEmpty()) {
            return;
        }

        for (DoctorAssignment assignment : assignments) {

            Optional<Alert> existing =
                    alertRepository.findByPatientIdAndDoctorIdAndMessage(
                            twin.getPatientId(),
                            assignment.getDoctorId(),
                            message);

            Alert alert;

            if (existing.isPresent()) {

                alert = existing.get();

            } else {

                alert = new Alert();

                alert.setDoctorId(assignment.getDoctorId());
                alert.setPatientId(twin.getPatientId());
                alert.setPatientName(twin.getPatientId());
                alert.setMessage(message);
                alert.setCreatedAt(Instant.now());
            }

            alert.setSeverity(severity);

            if (!existing.isPresent()) {
                alert.setStatus(AlertStatus.NEW);
            } else if (alert.getStatus() == AlertStatus.RESOLVED) {
                alert.setStatus(AlertStatus.NEW);
            }

            alert.setHeartRate(twin.getHeartRate());
            alert.setOxygenLevel(twin.getOxygenLevel());
            alert.setTemperature(twin.getTemperature());
            alert.setRiskScore(twin.getRiskScore());

            alert.setActive(true);
            alert.setLastUpdated(Instant.now());

            alertRepository.save(alert);
        }
    }
    public void resolvePatientAlerts(String patientId) {

        List<Alert> alerts = alertRepository.findByPatientId(patientId);

        for (Alert alert : alerts) {

            if (alert.isActive()) {

                alert.setActive(false);
                alert.setStatus(AlertStatus.RESOLVED);
                alert.setLastUpdated(Instant.now());

                alertRepository.save(alert);
            }
        }
    }
    public List<Alert> getAllAlerts() {

        return alertRepository.findAll();

    }

    public List<Alert> getDoctorAlerts(String doctorId) {

        List<PatientResponse> patients =
                doctorServiceClient.getAssignedPatients(doctorId);

        if (patients == null || patients.isEmpty()) {
            return List.of();
        }

        List<String> patientIds = patients.stream()
                .map(PatientResponse::getPatientId)
                .toList();

        return alertRepository.findByPatientIdIn(patientIds);
    }

    public List<Alert> getPatientAlerts(String patientId) {

        return alertRepository.findByPatientId(patientId);

    }

    public Alert acknowledgeAlert(String alertId) {

        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() ->
                        new RuntimeException("Alert Not Found"));

        // Only NEW alerts can be acknowledged
        if (alert.getStatus() == AlertStatus.NEW) {
            alert.setStatus(AlertStatus.ACKNOWLEDGED);
            alert.setAcknowledgedAt(Instant.now());
        }

        return alertRepository.save(alert);
    }

}