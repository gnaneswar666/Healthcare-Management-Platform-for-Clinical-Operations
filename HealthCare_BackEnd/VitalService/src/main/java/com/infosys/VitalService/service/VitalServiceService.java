package com.infosys.VitalService.service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.infosys.VitalService.Modal.VitalService;
import com.infosys.VitalService.Resources.VitalServiceRepository;
import com.infosys.VitalService.exception.ResourceNotFoundException;
import com.infosys.VitalService.kafka.VitalProducer;
import com.infosys.events.VitalEvent;

@Service
public class VitalServiceService {

    @Autowired
    private VitalServiceRepository repository;

    @Autowired
    private VitalProducer producer;
    
    // Add Vitals
    public VitalService addVitals(VitalService vitals) {

        vitals.setTimestamp(Instant.now());

        VitalService saved= repository.save(vitals);
        VitalEvent event = new VitalEvent();

        event.setPatientId(saved.getPatientId());
        event.setHeartRate(saved.getHeartRate());
        event.setTemperature(saved.getTemperature());
        event.setOxygenLevel(saved.getOxygenLevel());
        event.setBloodPressure(saved.getBloodPressure());
        event.setTimestamp(saved.getTimestamp());

        try {
           producer.publishVital(event);
            System.out.println("Kafka message sent successfully");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return saved;
    }

    // Latest Vitals
    public VitalService getLatestVitals(String patientId) {

        List<VitalService> list = repository.findByPatientId(patientId);

        return list.stream()
                .max(Comparator.comparing(VitalService::getTimestamp))
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vitals not found"));
    }

    // History
    public List<VitalService> getVitalsHistory(String patientId) {

        List<VitalService> list = repository.findByPatientId(patientId);

        if (list.isEmpty()) {
            throw new ResourceNotFoundException("Vitals history not found");
        }

        return list;
    }

    // Publish Kafka
    public void publishVitals(VitalService vitals) {

        System.out.println("Publishing to Kafka : " + vitals);
    }
    public List<VitalService> getAllVitals(){

        return repository.findAll();

    }
}