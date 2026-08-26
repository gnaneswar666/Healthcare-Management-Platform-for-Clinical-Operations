package com.infosys.SIMULATION_SERVICE.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.infosys.SIMULATION_SERVICE.client.DiagnosticClient;
import com.infosys.SIMULATION_SERVICE.client.HealthTwinClient;
import com.infosys.SIMULATION_SERVICE.client.PatientClient;
import com.infosys.SIMULATION_SERVICE.dto.diagnosis.DiagnosticRequest;
import com.infosys.SIMULATION_SERVICE.dto.health.HealthTwinRequest;
import com.infosys.SIMULATION_SERVICE.dto.patient.PatientResponse;


@Service
public class SimulationService {

    @Autowired
    private PatientClient patientClient;

    @Autowired
    private HealthTwinClient healthTwinClient;

    @Autowired
    private DiagnosticClient diagnosticClient;

    @Autowired
    private HealthGenerator healthGenerator;

    @Autowired
    private DiagnosticGenerator diagnosticGenerator;

    public void simulatePatients() {

        System.out.println("======================================");
        System.out.println("Simulation Started");
        System.out.println("======================================");

        List<PatientResponse> patients = patientClient.getAllPatients();

        if (patients == null || patients.isEmpty()) {
            System.out.println("No Patients Found");
            return;
        }

        for (PatientResponse patient : patients) {

            try {

            	HealthTwinRequest health =
            	        healthTwinClient.getTwin(patient.getPatientId());

            	health = healthGenerator.generate(health);

            	healthTwinClient.updateTwin(
            	        patient.getPatientId(),
            	        health);

                DiagnosticRequest diagnostic =
                        diagnosticGenerator.generate(patient);

                diagnosticClient.saveDiagnostic(diagnostic);

                System.out.println("Updated : "
                        + patient.getPatientId());

            } catch (Exception e) {

                System.out.println(
                        "Failed for Patient : "
                                + patient.getPatientId());

                System.out.println(e.getMessage());
            }

        }

        System.out.println("Simulation Completed");
    }
}
