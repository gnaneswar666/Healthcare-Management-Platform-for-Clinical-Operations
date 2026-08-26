import api from "./api";

export const getPatient = async (patientId) => {
    const response = await api.get(`/patient/api/patients/${patientId}`);
    return response.data;
};

export const getHealthTwin = async (patientId) => {
    const response = await api.get(`/twin/api/twins/${patientId}`);
    return response.data;
};

export { getConsent } from "./consentService";


