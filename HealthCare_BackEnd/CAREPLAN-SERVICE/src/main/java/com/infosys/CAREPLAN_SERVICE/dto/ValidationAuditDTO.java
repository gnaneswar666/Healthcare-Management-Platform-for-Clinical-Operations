package com.infosys.CAREPLAN_SERVICE.dto;

import java.util.List;

import com.infosys.CAREPLAN_SERVICE.model.CarePlan.AuditLogEntry;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ValidationAuditDTO {
    private String patientId;
    private String carePlanId;
    private String clinicalGuidelineCheck; // "Passed"
    private String drugInteractionCheck;  // "No Interaction Found"
    private String safetyChecks;           // "Passed"
    private String doctorApproval;         // "Approved" / "Pending"
    private Integer adherence;             // 78%
    private String outcomeTracking;        // "Risk Reduced"
    private Double previousRisk;           // 24.3%
    private Double currentRisk;            // 16.2%
    private List<AuditLogEntry> auditLogs;
}
