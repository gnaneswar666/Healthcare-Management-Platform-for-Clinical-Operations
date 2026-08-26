package com.infosys.ai_predict.service;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.infosys.ai_predict.Model.PredictionHistory;
import com.infosys.ai_predict.client.AIModelClient;
import com.infosys.ai_predict.client.DiagnosticClient;
import com.infosys.ai_predict.client.HealthClient;
import com.infosys.ai_predict.client.PatientClient;
import com.infosys.ai_predict.dto.AIModelResponse;
import com.infosys.ai_predict.dto.DiagnosticResponse;
import com.infosys.ai_predict.dto.HealthResponse;
import com.infosys.ai_predict.dto.PatientResponse;
import com.infosys.ai_predict.dto.PredictionRequest;
import com.infosys.ai_predict.dto.PredictionResponse;
import com.infosys.ai_predict.repository.PredictionHistoryRepository;

@Service
public class AiPredictionService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private PredictionHistoryRepository repository;
    @Autowired
    private DiagnosticClient diagnosticClient;

    @Autowired
    private PatientClient patientClient;
    @Autowired
    private HealthClient healthClient;
    @Autowired
    private AIModelClient aiModelClient;
    @Value("${flask.ai.url}")
    private String flaskUrl;

    public PredictionResponse predict(PredictionRequest request) {
    	
    	PatientResponse patient =
    	        patientClient.getPatient(request.getPatientId());
    	
    	Date dob = patient.getDob();

    	int age = java.time.Period.between(
    	        dob.toInstant()
    	           .atZone(java.time.ZoneId.systemDefault())
    	           .toLocalDate(),
    	        java.time.LocalDate.now())
    	        .getYears();

    	request.setAge(age);
    	if ("Male".equalsIgnoreCase(patient.getGender())) {
    	    request.setSex(1);
    	} else {
    	    request.setSex(0);
    	}
    	HealthResponse health =
    	        healthClient.getHealth(request.getPatientId());
    	request.setThalach(health.getHeartRate());
    	String bp = health.getBloodPressure();   // "130/85"

    	int systolic =
    	        Integer.parseInt(bp.split("/")[0]);

    	request.setTrestbps(systolic);
    	
    	DiagnosticResponse diagnostic =
    	        diagnosticClient.getDiagnostic(request.getPatientId());
    	request.setCp(diagnostic.getCp());
    	request.setChol(diagnostic.getChol());
    	request.setFbs(diagnostic.getFbs());
    	request.setRestecg(diagnostic.getRestecg());
    	request.setExang(diagnostic.getExang());
    	request.setOldpeak(diagnostic.getOldpeak());
    	request.setSlope(diagnostic.getSlope());
    	request.setCa(diagnostic.getCa());
    	request.setThal(diagnostic.getThal());
    	AIModelResponse model = aiModelClient.getActiveModel();

    	request.setModelFile(model.getModelFile());
    	request.setModelVersion(model.getVersion());
    	PredictionResponse response =
    	        restTemplate.postForObject(
    	                flaskUrl,
    	                request,
    	                PredictionResponse.class);
    	PredictionHistory history = new PredictionHistory();

        history.setPatientId(request.getPatientId());
        history.setPrediction(response.getPrediction());
        history.setProbability(response.getProbability());
        history.setRisk(response.getRisk());
        history.setConfidence(response.getConfidence());
        history.setModelVersion(response.getModelVersion());
        history.setCreatedAt(LocalDateTime.now());
        history.setDisease(response.getDisease());
        System.out.println("Top Factors: " + response.getTopFactors());
        System.out.println("Recommendations: " + response.getRecommendations());
        history.setPredictionTime(response.getPredictionTime());
        history.setTopFactors(response.getTopFactors());

        history.setRecommendations(response.getRecommendations());
       
        repository.save(history);

        return response;

    }

    public List<PredictionHistory> getHistory(String patientId) {

        return repository.findTop10ByPatientIdOrderByCreatedAtDesc(patientId);

    }
    public PredictionHistory getPrediction(String predictionId) {
        return repository.findById(predictionId)
                .orElseThrow(() -> new RuntimeException("Prediction not found"));
    }
    public PredictionHistory getLatestPrediction(String patientId) {

        return repository.findTopByPatientIdOrderByCreatedAtDesc(patientId)
                .orElseThrow(() -> new RuntimeException("No prediction found for patient"));
    }
    
}
