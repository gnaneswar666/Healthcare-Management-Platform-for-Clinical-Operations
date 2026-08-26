package com.infosys.SIMULATION_SERVICE.scheduler;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.infosys.SIMULATION_SERVICE.service.SimulationService;


@Component
public class SimulationScheduler {

    @Autowired
    private SimulationService simulationService;

    @Scheduled(fixedRate = 15000)
    public void runSimulation() {

        simulationService.simulatePatients();

    }

}
