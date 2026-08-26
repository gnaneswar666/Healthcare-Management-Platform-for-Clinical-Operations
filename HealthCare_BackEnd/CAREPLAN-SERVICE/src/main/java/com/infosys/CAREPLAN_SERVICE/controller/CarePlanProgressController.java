package com.infosys.CAREPLAN_SERVICE.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.infosys.CAREPLAN_SERVICE.dto.ProgressRequest;
import com.infosys.CAREPLAN_SERVICE.model.CarePlanProgress;
import com.infosys.CAREPLAN_SERVICE.service.CarePlanProgressService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/careplan")
@RequiredArgsConstructor
public class CarePlanProgressController {

    private final CarePlanProgressService progressService;

    // =====================================================
    // GET TODAY'S PROGRESS BY PATIENT
    // =====================================================

    @GetMapping("/progress/{patientId}")
    public ResponseEntity<CarePlanProgress> getTodayProgress(@PathVariable String patientId) {
        CarePlanProgress progress = progressService.getTodayProgress(patientId);
        return ResponseEntity.ok(progress);
    }

    // =====================================================
    // UPDATE TODAY'S PROGRESS (Path variables style)
    // =====================================================

    @PostMapping("/{carePlanId}/progress/{patientId}")
    public ResponseEntity<CarePlanProgress> updateProgress(
            @PathVariable String carePlanId,
            @PathVariable String patientId,
            @RequestBody ProgressRequest request) {

        CarePlanProgress progress = progressService.updateProgress(carePlanId, patientId, request);
        return ResponseEntity.ok(progress);
    }

    // =====================================================
    // UPDATE TODAY'S PROGRESS (Request body style - Step 3)
    // =====================================================

    @PutMapping("/updateProgress")
    public ResponseEntity<CarePlanProgress> updateProgressBody(@RequestBody ProgressRequest request) {
        CarePlanProgress progress = progressService.updateProgress(
                request.getCarePlanId(),
                request.getPatientId(),
                request
        );
        return ResponseEntity.ok(progress);
    }

    @PostMapping("/progress")
    public ResponseEntity<CarePlanProgress> saveProgressPost(@RequestBody ProgressRequest request) {
        return updateProgressBody(request);
    }
}
