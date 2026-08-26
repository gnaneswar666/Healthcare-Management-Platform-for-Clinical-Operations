import api from "./api";

export const getAllAlerts = () =>
    api.get("/api/alerts");
export const getDoctorAlerts = (doctorId) =>
    api.get(`/api/alerts/doctor/${doctorId}`);

export const acknowledgeAlert = (alertId) =>
    api.put(`/api/alerts/${alertId}/acknowledge`);

export const getPatientAlerts = (patientId) =>
    api.get(`/api/alerts/patient/${patientId}`);