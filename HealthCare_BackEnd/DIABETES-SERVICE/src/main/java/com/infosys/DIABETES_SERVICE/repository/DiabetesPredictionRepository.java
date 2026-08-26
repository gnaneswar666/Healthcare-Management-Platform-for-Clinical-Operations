package com.infosys.DIABETES_SERVICE.repository;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.infosys.DIABETES_SERVICE.entity.DiabetesPrediction;

public interface DiabetesPredictionRepository
        extends MongoRepository<DiabetesPrediction, String> {

	DiabetesPrediction findTopByPatientIdOrderByPredictionDateDesc(String patientId);
	List<DiabetesPrediction> findByPatientIdOrderByPredictionDateDesc(String patientId);}