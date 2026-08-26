import api from "./api";

export const getPatients = async () => {
    const res = await api.get("/patient/api/patients");
    return res.data;
};

export const getHealthTwins = async () => {
    const res = await api.get("/twin/api/twins");
    return res.data;
};

export const getConsents = async () => {
    const res = await api.get("/consent/api/consents");
    return res.data;
};

export const getVitals = async () => {
    const res = await api.get("/vital/api/vitals");
    return res.data;
};