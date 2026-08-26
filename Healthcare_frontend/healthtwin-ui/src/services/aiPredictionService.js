import api from "./api";

/**
 * Generate a new AI prediction
 */
export const predictPatient = (patientId) =>
    api.post("/predict/api/predict", {
        patientId,
    });

/**
 * Get AI explanation
 */
export const getExplanation = (patientId) =>
    api.get(`/explanations/api/explanations/patient/${patientId}`);

/**
 * Get latest prediction
 */
export const getLatestPrediction = (patientId) =>
    api.get(`/predict/api/predict/latest/${patientId}`);

/**
 * Get prediction history
 */
export const getPredictionHistory = (patientId) =>
    api.get(`/predict/api/predict/history/${patientId}`);

/**
 * Get complete prediction report by predictionId
 */
export const getPrediction = (predictionId) =>
    api.get(`/predict/api/predict/${predictionId}`);


export const predictDiabetesPatient = (patientId) =>
    api.post(`/diabetes/api/diabetes/predict/${patientId}`);

export const getDiabetesLatestPrediction = (patientId) =>
    api.get(`/diabetes/api/diabetes/latest/${patientId}`);

export const getDiabetesPredictionHistory = (patientId) =>
    api.get(`/diabetes/api/diabetes/history/${patientId}`);

export const getDiabetesPrediction = (predictionId) =>
    api.get(`/diabetes/api/diabetes/${predictionId}`);