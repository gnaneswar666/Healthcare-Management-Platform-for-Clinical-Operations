package com.infosys.HealthTwin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableKafka
public class HealthTwinApplication {

	public static void main(String[] args) {
		SpringApplication.run(HealthTwinApplication.class, args);
	}

}
