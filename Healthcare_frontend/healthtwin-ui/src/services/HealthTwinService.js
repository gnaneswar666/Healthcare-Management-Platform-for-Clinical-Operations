import api from "./api";

const API = "/twin/api/twins";

const sanitizeTwinData = (twin = {}) => {
    const rawHeight = twin.height;
    const rawWeight = twin.weight;
    const rawRiskScore = twin.riskScore;

    const heightNum = rawHeight !== null && rawHeight !== "" && !isNaN(Number(rawHeight)) ? Number(rawHeight) : 175.0;
    const weightNum = rawWeight !== null && rawWeight !== "" && !isNaN(Number(rawWeight)) ? Number(rawWeight) : 70.0;
    const riskScoreNum = rawRiskScore !== null && rawRiskScore !== "" && !isNaN(Number(rawRiskScore)) ? Number(rawRiskScore) : 15.0;

    const rawHR = twin.heartRate;
    const rawO2 = twin.oxygenLevel;
    const rawTemp = twin.temperature;

    const heartRateNum = rawHR !== null && rawHR !== "" && !isNaN(Number(rawHR)) ? Number(rawHR) : 72;
    const oxygenLevelNum = rawO2 !== null && rawO2 !== "" && !isNaN(Number(rawO2)) ? Number(rawO2) : 98;
    const temperatureNum = rawTemp !== null && rawTemp !== "" && !isNaN(Number(rawTemp)) ? Number(rawTemp) : 36.8;

    // Heart AI Model Parameters
    const cpVal = twin.chestPainType ?? twin.cp ?? 0;
    const cholVal = twin.cholesterol ?? twin.chol ?? 200;
    const fbsVal = twin.fastingBS ?? twin.fbs ?? 0;
    const restecgVal = twin.restECG ?? twin.restecg ?? 0;
    const thalachVal = twin.maxHeartRate ?? twin.thalach ?? 150;
    const exangVal = twin.exerciseAngina ?? twin.exang ?? 0;
    const oldpeakVal = twin.oldpeak ?? 1.0;
    const slopeVal = twin.slope ?? 1;
    const caVal = twin.majorVessels ?? twin.ca ?? 0;
    const thalVal = twin.thalassemia ?? twin.thal ?? 1;

    // Diabetes AI Model Parameters
    const hypertensionVal = twin.hypertension ?? 0;
    const heartDiseaseVal = twin.heartDisease ?? twin.heart_disease ?? 0;
    const smokingHistoryVal = twin.smokingHistory ?? twin.smoking_history ?? 0;
    const defaultBmi = heightNum > 0 ? Number((weightNum / Math.pow(heightNum / 100, 2)).toFixed(1)) : 22.9;
    const bmiVal = twin.bmi !== null && twin.bmi !== "" && !isNaN(Number(twin.bmi)) ? Number(twin.bmi) : defaultBmi;
    const hba1cVal = twin.hba1cLevel ?? twin.HbA1c_level ?? 5.7;
    const glucoseVal = twin.bloodGlucoseLevel ?? twin.blood_glucose_level ?? 100;

    return {
        ...twin,
        patientId: twin.patientId || "",
        height: heightNum,
        weight: weightNum,
        heartRate: heartRateNum,
        oxygenLevel: oxygenLevelNum,
        temperature: temperatureNum,
        bloodPressure: twin.bloodPressure || "120/80",
        riskScore: riskScoreNum,
        bloodGroup: twin.bloodGroup || "O+",
        allergies: Array.isArray(twin.allergies) ? twin.allergies : [],
        chronicDiseases: Array.isArray(twin.chronicDiseases) ? twin.chronicDiseases : [],
        currentMedications: Array.isArray(twin.currentMedications) ? twin.currentMedications : [],

        // Heart AI Model Data
        chestPainType: Number(cpVal),
        cp: Number(cpVal),
        cholesterol: Number(cholVal),
        chol: Number(cholVal),
        fastingBS: Number(fbsVal),
        fbs: Number(fbsVal),
        restECG: Number(restecgVal),
        restecg: Number(restecgVal),
        maxHeartRate: Number(thalachVal),
        thalach: Number(thalachVal),
        exerciseAngina: Number(exangVal),
        exang: Number(exangVal),
        oldpeak: Number(oldpeakVal),
        slope: Number(slopeVal),
        majorVessels: Number(caVal),
        ca: Number(caVal),
        thalassemia: Number(thalVal),
        thal: Number(thalVal),

        // Diabetes AI Model Data
        hypertension: Number(hypertensionVal),
        heartDisease: Number(heartDiseaseVal),
        heart_disease: Number(heartDiseaseVal),
        smokingHistory: Number(smokingHistoryVal),
        smoking_history: Number(smokingHistoryVal),
        bmi: Number(bmiVal),
        hba1cLevel: Number(hba1cVal),
        HbA1c_level: Number(hba1cVal),
        bloodGlucoseLevel: Number(glucoseVal),
        blood_glucose_level: Number(glucoseVal)
    };
};

export const getHealthTwins = () =>
    api.get(API);

export const getHealthTwin = (patientId) =>
    api.get(`${API}/${patientId}`);

export const createHealthTwin = (twin) =>
    api.post(API, sanitizeTwinData(twin));

export const updateHealthTwin = (patientId, twin) =>
    api.put(`${API}/${patientId}`, sanitizeTwinData(twin));