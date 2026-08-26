package com.infosys.ai_predict;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class AiPredictApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiPredictApplication.class, args);
	}

}
