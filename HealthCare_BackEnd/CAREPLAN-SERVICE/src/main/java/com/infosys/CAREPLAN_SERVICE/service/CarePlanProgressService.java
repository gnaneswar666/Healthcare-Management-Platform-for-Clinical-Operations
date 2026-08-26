package com.infosys.CAREPLAN_SERVICE.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.infosys.CAREPLAN_SERVICE.dto.ProgressRequest;
import com.infosys.CAREPLAN_SERVICE.model.CarePlan;
import com.infosys.CAREPLAN_SERVICE.model.CarePlan.AuditLogEntry;
import com.infosys.CAREPLAN_SERVICE.model.CarePlanProgress;
import com.infosys.CAREPLAN_SERVICE.repository.CarePlanProgressRepository;
import com.infosys.CAREPLAN_SERVICE.repository.CarePlanRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CarePlanProgressService {

    private final CarePlanProgressRepository progressRepository;
    private final CarePlanRepository carePlanRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public CarePlanProgress getTodayProgress(String patientId) {
        CarePlan carePlan = carePlanRepository.findByPatientId(patientId).orElse(null);
        String carePlanId = carePlan != null ? carePlan.getId() : null;
        LocalDate today = LocalDate.now();

        if (carePlanId != null) {
            java.util.Optional<CarePlanProgress> progressOpt = progressRepository.findByCarePlanIdAndDate(carePlanId, today);
            if (progressOpt.isPresent()) {
                return progressOpt.get();
            }
        }

        return progressRepository.findByPatientIdAndDate(patientId, today)
                .orElseGet(() -> progressRepository.findTopByPatientIdOrderByDateDesc(patientId)
                        .orElseGet(() -> CarePlanProgress.builder()
                                .patientId(patientId)
                                .carePlanId(carePlanId)
                                .date(today)
                                .adherence(carePlan != null && carePlan.getAdherence() != null ? carePlan.getAdherence() : 0)
                                .build()));
    }

    public CarePlanProgress updateProgress(
            String carePlanId,
            String patientId,
            ProgressRequest request) {

        CarePlan carePlan = null;
        if (carePlanId != null && !carePlanId.isBlank()) {
            carePlan = carePlanRepository.findById(carePlanId).orElse(null);
        }
        if (carePlan == null && patientId != null && !patientId.isBlank()) {
            carePlan = carePlanRepository.findByPatientId(patientId).orElse(null);
        }
        if (carePlan == null) {
            throw new RuntimeException("Care plan not found for ID: " + carePlanId + " or patientId: " + patientId);
        }

        String effectiveCarePlanId = carePlan.getId();
        String effectivePatientId = carePlan.getPatientId();
        LocalDate today = LocalDate.now();

        CarePlanProgress progress = progressRepository
                .findByCarePlanIdAndDate(effectiveCarePlanId, today)
                .orElseGet(() -> progressRepository.findByPatientIdAndDate(effectivePatientId, today)
                        .orElseGet(CarePlanProgress::new));

        progress.setCarePlanId(effectiveCarePlanId);
        progress.setPatientId(effectivePatientId);
        progress.setDate(today);

        // Update 5 Tracked Activity Checkboxes (Step 7)
        progress.setMedicationCompleted(request.isMedicationCompleted());
        progress.setExerciseCompleted(request.isExerciseCompleted());
        progress.setBpChecked(request.isBpChecked());
        progress.setSugarChecked(request.isSugarChecked());
        progress.setDietCompleted(request.isDietCompleted());
        progress.setSleepCompleted(request.isSleepCompleted());

        // Adherence Calculation (6 activities, 0% to 100%)
        int completedCount = 0;
        if (request.isMedicationCompleted()) completedCount++;
        if (request.isExerciseCompleted()) completedCount++;
        if (request.isBpChecked()) completedCount++;
        if (request.isSugarChecked()) completedCount++;
        if (request.isDietCompleted()) completedCount++;
        if (request.isSleepCompleted()) completedCount++;

        int adherence = (int) Math.round(((double) completedCount / 6.0) * 100.0);

        progress.setAdherence(adherence);

        if (progress.getCreatedAt() == null) {
            progress.setCreatedAt(Instant.now());
        }
        progress.setUpdatedAt(Instant.now());

        CarePlanProgress savedProgress = progressRepository.save(progress);

        // Update overall CarePlan document adherence
        carePlan.setAdherence(adherence);
        carePlan.setUpdatedAt(Instant.now());

        if (carePlan.getAuditLogs() == null) {
            carePlan.setAuditLogs(new ArrayList<>());
        }
        carePlan.getAuditLogs().add(new AuditLogEntry(
                DATE_FORMATTER.format(java.time.LocalDateTime.now()),
                "Patient Progress Updated",
                effectivePatientId,
                "Patient",
                "Adherence updated to " + adherence + "% (" + getAdherenceSummary(request) + ")"
        ));

        carePlanRepository.save(carePlan);

        return savedProgress;
    }

    private String getAdherenceSummary(ProgressRequest req) {
        List<String> done = new ArrayList<>();
        if (req.isMedicationCompleted()) done.add("Medicine Taken");
        if (req.isExerciseCompleted()) done.add("Exercise Done");
        if (req.isBpChecked()) done.add("BP Checked");
        if (req.isSugarChecked()) done.add("Sugar Checked");
        if (req.isDietCompleted()) done.add("Diet Followed");
        if (req.isSleepCompleted()) done.add("Sleep Completed");
        return done.isEmpty() ? "No activities completed today" : String.join(", ", done);
    }
}
