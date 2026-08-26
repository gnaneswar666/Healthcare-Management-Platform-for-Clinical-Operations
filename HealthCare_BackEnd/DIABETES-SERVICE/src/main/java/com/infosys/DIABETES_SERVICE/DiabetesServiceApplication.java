package com.infosys.DIABETES_SERVICE;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class DiabetesServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(DiabetesServiceApplication.class, args);
	}

}
