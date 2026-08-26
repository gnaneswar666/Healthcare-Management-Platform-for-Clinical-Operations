package com.infosys.CAREPLAN_SERVICE.model;

import java.time.Instant;
import java.time.LocalDate;

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
@Document(collection = "careplan_progress")
public class CarePlanProgress {

    @Id
    private String id;

    private String carePlanId;

    private String patientId;

    private LocalDate date;

    // Step 7 Tracked Activities
    private boolean medicationCompleted; // Medicine Taken
    private boolean exerciseCompleted;   // Exercise Done
    private boolean bpChecked;           // BP Checked
    private boolean sugarChecked;        // Sugar Checked
    private boolean dietCompleted;         // Diet Followed
    private boolean sleepCompleted;        // Sleep Completed

    private Integer adherence; // Calculated: 0%, 20%, 40%, 60%, 80%, 100%

    private Instant createdAt;
    private Instant updatedAt;
}
