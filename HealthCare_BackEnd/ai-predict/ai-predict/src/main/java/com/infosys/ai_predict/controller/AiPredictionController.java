package com.infosys.ai_predict.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.infosys.ai_predict.Model.PredictionHistory;
import com.infosys.ai_predict.dto.PredictionRequest;
import com.infosys.ai_predict.dto.PredictionResponse;
import com.infosys.ai_predict.service.AiPredictionService;

@RestController
@RequestMapping("/api/predict")

public class AiPredictionController {

    @Autowired
    private AiPredictionService service;

    @PostMapping()
    public PredictionResponse predict(
            @RequestBody PredictionRequest request) {
    	System.out.println("===== POST REACHED AI PREDICTION =====");
        System.out.println("Patient ID = " + request.getPatientId());
        return service.predict(request);

    }
    @GetMapping("/{predictionId}")
    public PredictionHistory getPrediction(
            @PathVariable String predictionId) {

        return service.getPrediction(predictionId);
    }
    @GetMapping("/history/{patientId}")
    public List<PredictionHistory> history(
            @PathVariable String patientId) {

        return service.getHistory(patientId);

    }
    @GetMapping("/latest/{patientId}")
    public PredictionHistory getLatestPrediction(@PathVariable String patientId) {

        return service.getLatestPrediction(patientId);
    }
    @GetMapping("/test")
    public String test() {
        return "AI Prediction Gateway Working";
    }

}
