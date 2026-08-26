package com.infosys.VitalService.kafka;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.infosys.events.VitalEvent;

@Service
public class VitalProducer {

    private final KafkaTemplate<String, VitalEvent> kafkaTemplate;

    public VitalProducer(KafkaTemplate<String, VitalEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishVital(VitalEvent event) {

        try {
            kafkaTemplate.send("vital-events", event).whenComplete((result, ex) -> {

                if (ex != null) {
                    System.out.println("FAILED");
                    ex.printStackTrace();
                } else {
                    System.out.println("SUCCESS");
                    System.out.println(result.getRecordMetadata().topic());
                    System.out.println(result.getRecordMetadata().partition());
                    System.out.println(result.getRecordMetadata().offset());
                }

            });

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}