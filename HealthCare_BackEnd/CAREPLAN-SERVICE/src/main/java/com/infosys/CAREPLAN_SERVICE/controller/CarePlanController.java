package com.infosys.CAREPLAN_SERVICE.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.infosys.CAREPLAN_SERVICE.dto.CarePlanDashboardStatsDTO;
import com.infosys.CAREPLAN_SERVICE.dto.CarePlanGenerateRequest;
import com.infosys.CAREPLAN_SERVICE.dto.DoctorReviewRequest;
import com.infosys.CAREPLAN_SERVICE.dto.ValidationAuditDTO;
import com.infosys.CAREPLAN_SERVICE.model.CarePlan;
import com.infosys.CAREPLAN_SERVICE.service.CarePlanService;
import com.infosys.CAREPLAN_SERVICE.service.GeminiTestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/careplan")
@RequiredArgsConstructor
public class CarePlanController {

    private final CarePlanService carePlanService;
    private final GeminiTestService geminiTestService;

    // =====================================================
    // STEP 3: GENERATE CARE PLAN
    // =====================================================

    @PostMapping("/generate/{patientId}")
    public ResponseEntity<CarePlan> generateCarePlanPath(@PathVariable String patientId) {
        CarePlan carePlan = carePlanService.generateCarePlan(patientId);
        return ResponseEntity.ok(carePlan);
    }

    @PostMapping("/generate")
    public ResponseEntity<CarePlan> generateCarePlanBody(@RequestBody CarePlanGenerateRequest request) {
        CarePlan carePlan = carePlanService.generateCarePlan(request.getPatientId());
        return ResponseEntity.ok(carePlan);
    }

    // =====================================================
    // STEP 3 & STEP 6: GET CARE PLAN BY PATIENT
    // =====================================================

    @GetMapping("/{patientId}")
    public ResponseEntity<CarePlan> getCarePlan(@PathVariable String patientId) {
        CarePlan carePlan = carePlanService.getCarePlanByPatientId(patientId);
        if (carePlan == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(carePlan);
    }

    // =====================================================
    // STEP 3 & STEP 5: DOCTOR APPROVAL
    // =====================================================

    @PutMapping("/{carePlanId}/approve")
    public ResponseEntity<CarePlan> approveCarePlanPath(
            @PathVariable String carePlanId,
            @RequestBody DoctorReviewRequest request) {

        CarePlan carePlan = carePlanService.approveCarePlan(
                carePlanId,
                request != null ? request.getDoctorId() : "DOC101",
                request != null ? request.getDoctorNotes() : "Approved"
        );
        return ResponseEntity.ok(carePlan);
    }

    @PutMapping("/approve")
    public ResponseEntity<CarePlan> approveCarePlanBody(@RequestBody DoctorReviewRequest request) {
        String carePlanId = request.getCarePlanId() != null ? request.getCarePlanId() : request.getDoctorId();
        CarePlan carePlan = carePlanService.approveCarePlan(
                carePlanId,
                request.getDoctorId(),
                request.getDoctorNotes()
        );
        return ResponseEntity.ok(carePlan);
    }

    @PutMapping("/{carePlanId}/reject")
    public ResponseEntity<CarePlan> rejectCarePlanPath(
            @PathVariable String carePlanId,
            @RequestBody DoctorReviewRequest request) {

        CarePlan carePlan = carePlanService.rejectCarePlan(
                carePlanId,
                request != null ? request.getDoctorId() : "DOC101",
                request != null ? request.getDoctorNotes() : "Revision Requested"
        );
        return ResponseEntity.ok(carePlan);
    }

    @PutMapping("/reject")
    public ResponseEntity<CarePlan> rejectCarePlanBody(@RequestBody DoctorReviewRequest request) {
        CarePlan carePlan = carePlanService.rejectCarePlan(
                request.getCarePlanId(),
                request.getDoctorId(),
                request.getDoctorNotes()
        );
        return ResponseEntity.ok(carePlan);
    }

    // =====================================================
    // STEP 5: PENDING CARE PLANS FOR DOCTOR QUEUE
    // =====================================================

    @GetMapping("/pending")
    public ResponseEntity<List<CarePlan>> getPendingCarePlans() {
        List<CarePlan> pendingPlans = carePlanService.getPendingCarePlans();
        return ResponseEntity.ok(pendingPlans);
    }

    // =====================================================
    // STEP 3: CARE PLAN HISTORY
    // =====================================================

    @GetMapping("/history/{patientId}")
    public ResponseEntity<List<CarePlan>> getCarePlanHistoryPath(@PathVariable String patientId) {
        List<CarePlan> history = carePlanService.getCarePlanHistory(patientId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/history")
    public ResponseEntity<List<CarePlan>> getCarePlanHistoryParam(@RequestParam(required = false) String patientId) {
        if (patientId != null && !patientId.isBlank()) {
            return ResponseEntity.ok(carePlanService.getCarePlanHistory(patientId));
        }
        return ResponseEntity.ok(carePlanService.getPendingCarePlans());
    }

    // =====================================================
    // STEP 10: DASHBOARD METRICS
    // =====================================================

    @GetMapping("/dashboard/stats")
    public ResponseEntity<CarePlanDashboardStatsDTO> getDashboardStats() {
        CarePlanDashboardStatsDTO stats = carePlanService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    // =====================================================
    // STEP 11: VALIDATION & AUDIT LOGS
    // =====================================================

    @GetMapping("/validation-audit/{patientId}")
    public ResponseEntity<ValidationAuditDTO> getValidationAudit(@PathVariable String patientId) {
        ValidationAuditDTO audit = carePlanService.getValidationAudit(patientId);
        return ResponseEntity.ok(audit);
    }

    // =====================================================
    // GEMINI CONNECTION TEST
    // =====================================================

    @GetMapping("/gemini-test")
    public ResponseEntity<String> testGemini() {
        String response = geminiTestService.testGemini();
        return ResponseEntity.ok(response);
    }
}