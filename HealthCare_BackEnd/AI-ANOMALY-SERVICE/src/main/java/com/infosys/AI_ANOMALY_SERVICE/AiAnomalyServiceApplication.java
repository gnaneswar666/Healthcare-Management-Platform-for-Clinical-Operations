package com.infosys.AI_ANOMALY_SERVICE;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class AiAnomalyServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiAnomalyServiceApplication.class, args);
	}

}
