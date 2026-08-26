package com.infosys.explanation_service.service;


import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.infosys.explanation_service.dto.PredictionHistoryDto;
import com.infosys.explanation_service.feign.PredictionClient;
import com.infosys.explanation_service.model.Explanation;
import com.infosys.explanation_service.repository.ExplanationRepository;


@Service
public class ExplanationService {

    @Autowired
    private PredictionClient predictionClient;

    @Autowired
    private ExplanationRepository repository;

    public Explanation generateLatestExplanation(String patientId) {

        PredictionHistoryDto prediction =
                predictionClient.getLatestPrediction(patientId);

        Explanation explanation = new Explanation();

        explanation.setPredictionId(prediction.getId());
        explanation.setPatientId(prediction.getPatientId());
        explanation.setDisease(prediction.getDisease());
        explanation.setPrediction(prediction.getPrediction());
        explanation.setRisk(prediction.getRisk());

        // Dynamic SHAP factors
        explanation.setTopFactors(
                prediction.getTopFactors()
                        .stream()
                        .map(f -> f.getFeature())
                        .toList()
        );

        if ("Heart Disease".equalsIgnoreCase(prediction.getDisease())) {
            explanation.setClinicalGuideline("ACC/AHA Cardiovascular Guideline");
        } else {
            explanation.setClinicalGuideline("Standard Clinical Guideline");
        }
        explanation.setExplanation(buildExplanation(prediction));

        // Save AI recommendations
        explanation.setRecommendations(
                prediction.getRecommendations()
        );

        explanation.setStatus("VALID");
        explanation.setCreatedAt(Instant.now());

        return repository.save(explanation);
    }

    private String buildExplanation(PredictionHistoryDto prediction) {

        StringBuilder sb = new StringBuilder();

        sb.append("The AI model predicts ");

        sb.append(prediction.getPrediction());

        sb.append(" with ");

        sb.append(prediction.getProbability());

        sb.append("% confidence. ");

        sb.append("The most influential factors were ");

        for (int i = 0; i < prediction.getTopFactors().size(); i++) {

            sb.append(prediction.getTopFactors().get(i).getFeature());

            if (i < prediction.getTopFactors().size() - 1) {
                sb.append(", ");
            }
        }

        sb.append(".");

        return sb.toString();
    }
}
