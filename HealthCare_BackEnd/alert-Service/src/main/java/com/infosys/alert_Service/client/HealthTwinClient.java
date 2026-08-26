package com.infosys.alert_Service.client;


import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import com.infosys.alert_Service.dto.HealthTwin;

@FeignClient(name = "HealthTwin")
public interface HealthTwinClient {

    @GetMapping("api/twins")
    List<HealthTwin> getAllHealthTwins();

}
