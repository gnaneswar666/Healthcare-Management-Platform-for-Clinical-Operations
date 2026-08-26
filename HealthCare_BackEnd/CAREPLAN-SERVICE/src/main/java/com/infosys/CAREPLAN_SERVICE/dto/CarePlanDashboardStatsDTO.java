package com.infosys.CAREPLAN_SERVICE.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarePlanDashboardStatsDTO {
    private long activeCarePlans;     // e.g. 1124
    private int averageAdherence;      // e.g. 78%
    private long pendingApproval;      // e.g. 12
    private long recoveredPatients;    // e.g. 320
    private long highRiskPatients;     // e.g. 43
}
