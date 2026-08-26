package com.infosys.SIMULATION_SERVICE.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.infosys.SIMULATION_SERVICE.dto.diagnosis.DiagnosticRequest;
import com.infosys.SIMULATION_SERVICE.dto.patient.PatientResponse;
import com.infosys.SIMULATION_SERVICE.util.RandomValueGenerator;

@Service
public class DiagnosticGenerator {

    @Autowired
    private RandomValueGenerator random;

    public DiagnosticRequest generate(PatientResponse patient) {

        DiagnosticRequest request = new DiagnosticRequest();

        request.setPatientId(patient.getPatientId());

        request.setCp(random.randomInt(0, 3));

        request.setChol(
                Math.round(random.randomDouble(150, 280) * 10.0) / 10.0);

        request.setFbs(random.randomInt(0, 1));

        request.setRestecg(random.randomInt(0, 2));

        request.setExang(random.randomInt(0, 1));

        request.setOldpeak(
                Math.round(random.randomDouble(0.0, 4.0) * 10.0) / 10.0);

        request.setSlope(random.randomInt(0, 2));

        request.setCa(random.randomInt(0, 4));

        request.setThal(random.randomInt(0, 3));

        request.setSource("SIMULATION");

        request.setRecordedBy("SYSTEM");

        return request;
    }
}
