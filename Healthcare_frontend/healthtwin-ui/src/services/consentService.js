import api from "./api";

/**
 * Fetch patient consent record by patientId
 */
export const getConsent = async (patientId) => {
    const response = await api.get(`/consent/api/consents/${patientId}`);
    return response.data;
};

/**
 * Revoke consent for patient using patientId
 */
export const revokeConsentByPatient = async (patientId) => {
    const response = await api.patch(`/consent/api/consents/patient/${patientId}/revoke`);
    return response.data;
};

/**
 * Grant consent for patient using patientId
 */
export const grantConsentByPatient = async (patientId, consentType = "GENERAL_HEALTHCARE") => {
    const response = await api.patch(`/consent/api/consents/patient/${patientId}/grant`, {
        consentType
    });
    return response.data;
};

/**
 * Revoke consent using consentId
 */
export const revokeConsent = async (consentId) => {
    const response = await api.patch(`/consent/api/consents/${consentId}/revoke`);
    return response.data;
};

/**
 * Grant / Create new consent record (Doctor / Admin / Backend)
 */
export const createConsent = async (consentData) => {
    const response = await api.post(`/consent/api/consents`, consentData);
    return response.data;
};

/**
 * Update existing consent record
 */
export const updateConsent = async (consentId, consentData) => {
    const response = await api.put(`/consent/api/consents/${consentId}`, consentData);
    return response.data;
};

/**
 * Fetch all consents (Doctor / Admin)
 */
export const getAllConsents = async () => {
    const response = await api.get(`/consent/api/consents`);
    return response.data;
};
