package com.infosys.alert_Service.scheduler;


import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.infosys.alert_Service.client.HealthTwinClient;
import com.infosys.alert_Service.dto.HealthTwin;
import com.infosys.alert_Service.service.AlertService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AlertScheduler {

    private final HealthTwinClient healthTwinClient;
    private final AlertService alertService;

    @Scheduled(fixedRate = 15000)
    public void monitorHealthTwins() {
        try {
            List<HealthTwin> twins = healthTwinClient.getAllHealthTwins();

            for (HealthTwin twin : twins) {
                alertService.checkThresholds(twin);
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch Health Twins: " + e.getMessage());
        }
    }
}