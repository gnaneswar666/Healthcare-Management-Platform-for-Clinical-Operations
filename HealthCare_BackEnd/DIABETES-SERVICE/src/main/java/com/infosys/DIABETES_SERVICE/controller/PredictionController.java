package com.infosys.DIABETES_SERVICE.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.infosys.DIABETES_SERVICE.dto.PredictionResponse;
import com.infosys.DIABETES_SERVICE.entity.DiabetesPrediction;
import com.infosys.DIABETES_SERVICE.service.DiabetesService;

@RestController
@RequestMapping("/api/diabetes")
public class PredictionController {

    @Autowired
    private DiabetesService diabetesService;

    @PostMapping("/predict/{patientId}")
    public PredictionResponse predictDiabetes(@PathVariable String patientId) {
        return diabetesService.predictDiabetes(patientId);
    }

    @GetMapping("/history/{patientId}")
    public List<DiabetesPrediction> getPredictionHistory(@PathVariable String patientId) {
        return diabetesService.getPredictionHistory(patientId);
    }
    @GetMapping("/latest/{patientId}")
    public DiabetesPrediction getLatestPrediction(@PathVariable String patientId) {
        return diabetesService.getLatestPrediction(patientId);
    }
    @GetMapping("/{predictionId}")
    public DiabetesPrediction getPrediction(@PathVariable String predictionId) {
        return diabetesService.getPrediction(predictionId);
    }
}