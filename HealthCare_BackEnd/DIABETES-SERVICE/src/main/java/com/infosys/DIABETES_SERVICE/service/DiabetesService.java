package com.infosys.DIABETES_SERVICE.service;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.infosys.DIABETES_SERVICE.client.AIModelClient;
import com.infosys.DIABETES_SERVICE.client.FlaskClient;
import com.infosys.DIABETES_SERVICE.client.PatientClient;
import com.infosys.DIABETES_SERVICE.dto.AIModelResponse;
import com.infosys.DIABETES_SERVICE.dto.PatientResponse;
import com.infosys.DIABETES_SERVICE.dto.PredictionRequest;
import com.infosys.DIABETES_SERVICE.dto.PredictionResponse;
import com.infosys.DIABETES_SERVICE.entity.DiabetesData;
import com.infosys.DIABETES_SERVICE.entity.DiabetesPrediction;
import com.infosys.DIABETES_SERVICE.repository.DiabetesDataRepository;
import com.infosys.DIABETES_SERVICE.repository.DiabetesPredictionRepository;
@Service
public class DiabetesService {
	@Autowired
    private DiabetesDataRepository diabetesDataRepository;

    @Autowired
    private DiabetesPredictionRepository diabetesPredictionRepository;

    @Autowired
    private PatientClient patientClient;

    @Autowired
    private AIModelClient aiModelClient;

    @Autowired
    private FlaskClient flaskClient;
	
    public DiabetesData getDiabetesData(String patientId) {

        return diabetesDataRepository.findByPatientId(patientId)
                .orElseThrow(() -> new RuntimeException("Diabetes Data Not Found"));
    }
    public DiabetesData saveOrUpdate(DiabetesData data) {

        Optional<DiabetesData> existing =
                diabetesDataRepository.findByPatientId(data.getPatientId());

        if (existing.isPresent()) {

            DiabetesData old = existing.get();

            old.setHypertension(data.getHypertension());
            old.setHeartDisease(data.getHeartDisease());
            old.setSmokingHistory(data.getSmokingHistory());
            old.setBmi(data.getBmi());
            old.setHba1cLevel(data.getHba1cLevel());
            old.setBloodGlucoseLevel(data.getBloodGlucoseLevel());
            old.setUpdatedAt(LocalDateTime.now());

            return diabetesDataRepository.save(old);
        }

        data.setUpdatedAt(LocalDateTime.now());
        return diabetesDataRepository.save(data);
    }
    public PredictionResponse predictDiabetes(String patientId) {

        PatientResponse patient =
                patientClient.getPatient(patientId);

        DiabetesData diabetes =
                getDiabetesData(patientId);

        AIModelResponse model =
                aiModelClient.getActiveModel();
        System.out.println("================================");
        System.out.println("Model Object : " + model);
        System.out.println("Model Type   : " + model.getModelType());
        System.out.println("Model Name   : " + model.getModelName());
        System.out.println("Version      : " + model.getVersion());
        System.out.println("================================");
        // Change heart model filenames to diabetes model filenames
        String file;
        switch (model.getModelType().toUpperCase()) {

        case "ANN":
            file = "diabetes_ann.keras";
            break;

        case "RF":
            file = "diabetes_rf.pkl";
            break;

        case "XGBOOST":
            file = "diabetes_xgboost.pkl";
            break;

        default:
            throw new RuntimeException("Unknown Model Type");
    }
        int age = Period.between(
                patient.getDob(),
                LocalDate.now()
        ).getYears();

        PredictionRequest request =
                PredictionRequest.builder()

                        .gender(
                                patient.getGender().equalsIgnoreCase("Male") ? 1 : 0
                        )

                        .age(age)

                        .hypertension(diabetes.getHypertension())

                        .heartDisease(diabetes.getHeartDisease())

                        .smokingHistory(
                                convertSmoking(diabetes.getSmokingHistory())
                        )

                        .bmi(diabetes.getBmi())

                        .hba1cLevel(diabetes.getHba1cLevel())

                        .bloodGlucoseLevel(diabetes.getBloodGlucoseLevel())

                        .modelFile(file)

                        .modelVersion(model.getVersion())
                        .build();
        System.out.println("Model File Sent To Flask : " + file);
        System.out.println("Model Name    : " + model.getModelName());
        System.out.println("Model File    : " + model.getModelFile());
        System.out.println("Model Version : " + model.getVersion());
        PredictionResponse response =
                flaskClient.predict(request);

        DiabetesPrediction prediction = DiabetesPrediction.builder()

                .patientId(patientId)

                .prediction(response.getPrediction())

                .probability(response.getProbability())

                .confidence(response.getConfidence())

                .risk(response.getRisk())

                .modelName(model.getModelName())

                .algorithm(model.getAlgorithm())

                .modelVersion(model.getVersion())

                .predictionTime(response.getPredictionTime())
                
                .topFactors(response.getTopFactors())
                .recommendations(response.getRecommendations())

                .predictionDate(Instant.now())

                .build();

        diabetesPredictionRepository.save(prediction);
        response.setPredictionDate(prediction.getPredictionDate());
        return response;
       
    }
    private Integer convertSmoking(String smoking) {

        if (smoking == null)
            return 0;

        switch (smoking.toLowerCase()) {

            case "never":
                return 0;

            case "former":
                return 1;

            case "current":
                return 2;

            case "not current":
                return 3;

            default:
                return 0;
        }

    }
    public List<DiabetesPrediction> getPredictionHistory(String patientId) {
        return diabetesPredictionRepository.findByPatientIdOrderByPredictionDateDesc(patientId);
    }
    public DiabetesPrediction getLatestPrediction(String patientId) {
        return diabetesPredictionRepository
                .findTopByPatientIdOrderByPredictionDateDesc(patientId);
    }
    public DiabetesPrediction getPrediction(String predictionId) {
        return diabetesPredictionRepository
                .findById(predictionId)
                .orElseThrow(() -> new RuntimeException("Prediction not found"));
    }

}