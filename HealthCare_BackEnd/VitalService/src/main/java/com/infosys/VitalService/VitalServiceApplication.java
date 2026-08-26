package com.infosys.VitalService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication
@EnableKafka
public class VitalServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(VitalServiceApplication.class, args);
	}

}
