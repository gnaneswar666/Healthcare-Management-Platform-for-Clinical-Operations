import api from "./api";

const API = "/audit/api/logs";
const STORAGE_KEY = "medisphere_keycloak_audit_logs";

// Default initial audit log entries for demonstration if storage is empty
const INITIAL_LOGS = [
    {
        id: "LOG-1001",
        eventType: "PATIENT_KEYCLOAK_LOGIN_CREATED",
        patientId: "P201",
        email: "sarah.jenkins@healthtwin.io",
        keycloakUsername: "p201_sarah",
        keycloakRealm: "healthcare-realm",
        registeredBy: "Admin (admin@medisphere.com)",
        status: "SUCCESS",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        details: "Keycloak user created with patient role & initial password generated."
    },
    {
        id: "LOG-1000",
        eventType: "PATIENT_KEYCLOAK_LOGIN_CREATED",
        patientId: "P202",
        email: "robert.chen@healthtwin.io",
        keycloakUsername: "p202_robert",
        keycloakRealm: "healthcare-realm",
        registeredBy: "Admin (admin@medisphere.com)",
        status: "SUCCESS",
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        details: "Keycloak user created with patient role & initial password generated."
    }
];

function getLocalAuditLogs() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LOGS));
        return INITIAL_LOGS;
    } catch {
        return INITIAL_LOGS;
    }
}

function saveLocalAuditLogs(logs) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (err) {
        console.warn("Failed to persist audit log locally:", err);
    }
}

export const logKeycloakRegistration = async (payload) => {
    const newLog = {
        id: `LOG-${Date.now().toString().slice(-6)}`,
        eventType: "PATIENT_KEYCLOAK_LOGIN_CREATED",
        patientId: payload.patientId || "P200",
        email: payload.email || "",
        keycloakUsername: payload.patientId ? payload.patientId.toLowerCase() : "patient_user",
        keycloakRealm: "healthcare-realm",
        registeredBy: payload.registeredBy || "System Admin",
        status: payload.status || "SUCCESS",
        timestamp: new Date().toISOString(),
        details: payload.details || `Keycloak user credentials created for ${payload.firstName || ''} ${payload.lastName || ''}`.trim()
    };

    // Save to local storage first for immediate UI availability
    const existingLogs = getLocalAuditLogs();
    const updatedLogs = [newLog, ...existingLogs];
    saveLocalAuditLogs(updatedLogs);

    // Attempt backend microservice call
    try {
        await api.post(API, newLog);
    } catch (err) {
        console.warn("Audit service API call failed (using local audit log):", err?.message || err);
    }

    return newLog;
};

export const getAuditLogs = async () => {
    try {
        const response = await api.get(API);
        if (Array.isArray(response.data) && response.data.length > 0) {
            return response.data;
        }
    } catch (err) {
        console.warn("Could not fetch remote audit logs, falling back to local audit logs:", err?.message || err);
    }
    return getLocalAuditLogs();
};

export const clearAuditLogs = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
        console.error("Failed to clear local audit logs:", err);
    }
};
