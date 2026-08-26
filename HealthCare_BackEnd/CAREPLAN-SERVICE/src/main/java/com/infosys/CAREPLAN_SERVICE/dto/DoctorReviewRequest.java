package com.infosys.CAREPLAN_SERVICE.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorReviewRequest {
    private String carePlanId;
    private String doctorId;
    private String doctorNotes;
    private String status; // APPROVED, REJECTED
}
