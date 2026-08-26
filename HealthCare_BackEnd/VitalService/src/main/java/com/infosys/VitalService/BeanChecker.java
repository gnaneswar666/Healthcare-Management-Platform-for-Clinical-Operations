package com.infosys.VitalService;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

@Component
public class BeanChecker implements CommandLineRunner {

    private final ApplicationContext context;

    public BeanChecker(ApplicationContext context) {
        this.context = context;
    }

    @Override
    public void run(String... args) {

        String[] beans = context.getBeanNamesForType(
                org.springframework.kafka.core.KafkaTemplate.class);

        System.out.println("KafkaTemplate beans : " + beans.length);

        for(String bean : beans){
            System.out.println(bean);
        }
    }
}