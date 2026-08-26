import api from "./api";
import { getHealthTwin, updateHealthTwin, createHealthTwin } from "./HealthTwinService";

/**
 * Trigger backend SIMULATION-SERVICE to generate & update simulated health vitals for a patient
 */
export const simulateHealthVitals = (patientId) => {
    return api.post(`/simulation/api/simulation/health/${patientId}`);
};

/**
 * Trigger backend SIMULATION-SERVICE to generate & update simulated diagnosis data for a patient
 */
export const simulateDiagnosisData = (patientId) => {
    return api.post(`/simulation/api/simulation/diagnosis/${patientId}`);
};

/**
 * Trigger backend SIMULATION-SERVICE to generate & update simulated diabetes data for a patient
 * (Uses Diabetes Simulation Generator matching DiagnosticGenerator in SIMULATION-SERVICE)
 */
export const simulateDiabetesData = (patientId) => {
    return api.post(`/simulation/api/simulation/diabetes/${patientId}`);
};

/**
 * Generate simulated diabetes clinical dataset values (Hypertension, Heart Disease, Smoking, BMI, HbA1c, Glucose)
 * matching SIMULATION-SERVICE clinical rules
 */
export const generateSimulatedDiabetesValues = () => {
    const isDiabeticRisk = Math.random() > 0.4;
    return {
        hypertension: isDiabeticRisk ? (Math.random() > 0.4 ? 1 : 0) : 0,
        heartDisease: isDiabeticRisk ? (Math.random() > 0.5 ? 1 : 0) : 0,
        smokingHistory: Math.floor(Math.random() * 4), // 0: Never, 1: Current, 2: Former, 3: Ever
        bmi: Number((20.0 + Math.random() * 15.0).toFixed(1)), // 20.0 - 35.0 kg/m²
        hba1cLevel: isDiabeticRisk
            ? Number((6.5 + Math.random() * 3.2).toFixed(1)) // 6.5 - 9.7%
            : Number((4.8 + Math.random() * 1.5).toFixed(1)), // 4.8 - 6.3%
        bloodGlucoseLevel: isDiabeticRisk
            ? Math.floor(135 + Math.random() * 135) // 135 - 270 mg/dL
            : Math.floor(75 + Math.random() * 45) // 75 - 120 mg/dL
    };
};

/**
 * Generate simulated heart disease clinical dataset values
 * matching SIMULATION-SERVICE clinical rules
 */
export const generateSimulatedHeartValues = () => {
    const isHeartRisk = Math.random() > 0.4;
    return {
        cp: isHeartRisk ? Math.floor(1 + Math.random() * 3) : 0, // 0: Typical, 1: Atypical, 2: Non-anginal, 3: Asymptomatic
        chol: Math.floor(170 + Math.random() * 150), // 170 - 320 mg/dL
        fbs: isHeartRisk ? (Math.random() > 0.5 ? 1 : 0) : 0,
        restecg: Math.floor(Math.random() * 3), // 0: Normal, 1: Abnormality, 2: Hypertrophy
        thalach: Math.floor(110 + Math.random() * 75), // 110 - 185 bpm
        exang: isHeartRisk ? (Math.random() > 0.5 ? 1 : 0) : 0,
        oldpeak: Number((Math.random() * 3.2).toFixed(1)), // 0.0 - 3.2
        slope: Math.floor(Math.random() * 3), // 0: Upsloping, 1: Flat, 2: Downsloping
        ca: Math.floor(Math.random() * 4), // 0 - 3
        thal: Math.floor(1 + Math.random() * 3) // 1: Fixed, 2: Reversible, 3: Other
    };
};

/**
 * Ensures Diabetes dataset parameters exist in MongoDB and simulates/saves them automatically
 * (Solves missing MongoDB diabetes data issue for simulation service)
 */
export const ensureAndSimulateDiabetesData = async (patientId) => {
    if (!patientId) return null;

    const simDiabetes = generateSimulatedDiabetesValues();

    let existingTwin = {};
    try {
        const res = await getHealthTwin(patientId);
        existingTwin = res.data || {};
    } catch {
        console.log(`Creating baseline health twin for patient ${patientId}`);
    }

    const updatedTwin = {
        patientId,
        height: 175,
        weight: 70,
        heartRate: 72,
        oxygenLevel: 98,
        temperature: 36.8,
        bloodPressure: "120/80",
        bloodGroup: "O+",
        allergies: [],
        chronicDiseases: [],
        currentMedications: [],
        riskScore: 15.0,
        cp: 0,
        chol: 200,
        fbs: 0,
        restecg: 0,
        thalach: 150,
        exang: 0,
        oldpeak: 1.0,
        slope: 1,
        ca: 0,
        thal: 1,
        ...existingTwin,
        ...simDiabetes
    };

    try {
        await updateHealthTwin(patientId, updatedTwin);
    } catch {
        try {
            await createHealthTwin(updatedTwin);
        } catch (err) {
            console.error("Could not save simulated diabetes twin data:", err);
        }
    }

    try {
        await simulateDiabetesData(patientId);
    } catch (simErr) {
        console.warn("Backend SIMULATION-SERVICE trigger notice:", simErr);
    }

    return updatedTwin;
};
