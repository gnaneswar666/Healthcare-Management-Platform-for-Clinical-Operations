import api from "./api";

export const getAnomaly = (patientId) => {
    return api.get(`/anomaly/api/anomaly/${patientId}`);
};