package com.infosys.SIMULATION_SERVICE.service;


import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.infosys.SIMULATION_SERVICE.dto.health.HealthTwinRequest;
import com.infosys.SIMULATION_SERVICE.dto.patient.PatientResponse;
import com.infosys.SIMULATION_SERVICE.util.RandomValueGenerator;

@Service
public class HealthGenerator {

    @Autowired
    private RandomValueGenerator random;

    public HealthTwinRequest generate(HealthTwinRequest health) {

        health.setHeartRate(random.randomInt(65, 100));

        health.setBloodPressure(
                random.randomInt(110, 155) + "/" +
                random.randomInt(60, 90));

        health.setTemperature(
                Math.round(random.randomDouble(32.4, 40.5) * 10.0) / 10.0);

        health.setOxygenLevel(random.randomInt(70, 100));

        health.setLastUpdated(Instant.now());
        System.out.println("Heart Rate : " + health.getHeartRate());
        System.out.println("BP : " + health.getBloodPressure());
        System.out.println("Temp : " + health.getTemperature());
        System.out.println("Oxygen : " + health.getOxygenLevel());

        return health;
    }
}