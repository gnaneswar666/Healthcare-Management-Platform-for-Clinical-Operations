package com.infosys.CAREPLAN_SERVICE.model;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "careplans")
public class CarePlan {

    @Id
    private String id;

    private String patientId;

    // AI prediction information
    private Double predictionRisk;
    private String riskLevel;
    private Double previousRisk;
    private Double targetRisk;

    // Care plan recommendations
    private String goal;
    private List<String> medications;
    private String diet;
    private String exercise;
    private String sleep;

    // Doctor approval
    private String doctorId;
    private String doctorStatus; // PENDING, APPROVED, REJECTED
    private String doctorNotes;

    public String getStatus() {
        return doctorStatus != null ? doctorStatus : "PENDING";
    }

    // Patient progress & adherence
    private Integer adherence; // 0 to 100

    // Validation & Clinical Checks
    private String clinicalGuidelineCheck; // Passed
    private String drugInteractionCheck;  // No Interaction Found
    private String safetyChecks;           // Passed

    // Audit trail
    @Builder.Default
    private List<AuditLogEntry> auditLogs = new ArrayList<>();

    // Review
    private LocalDate nextReview;

    private Instant createdAt;
    private Instant updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuditLogEntry {
        private String timestamp;
        private String action;
        private String performedBy;
        private String role;
        private String details;
    }
}
