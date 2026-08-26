import api from "./api";

const API = "/patient/api/patients";

const sanitizePatientData = (patient = {}) => {
    const rawPhone = patient.phone;
    const digitsOnly = String(rawPhone || "").replace(/\D/g, "");
    const numericPhone = digitsOnly.length === 10 ? Number(digitsOnly) : (Number(rawPhone) || 9808707606);

    return {
        ...patient,
        patientId: patient.patientId || "",
        firstName: String(patient.firstName || "").trim(),
        lastName: String(patient.lastName || "").trim(),
        email: String(patient.email || "").trim(),
        phone: numericPhone,
        gender: patient.gender || "Male",
        password: patient.password || "Patient@123",
        address: patient.address || "Healthcare System",
        dob: patient.dob ? new Date(patient.dob).toISOString() : new Date().toISOString()
    };
};

export const getPatients = () => api.get(API);

export const getPatient = (id) =>
    api.get(`${API}/${id}`);

export const addPatient = (patient) =>
    api.post(API, sanitizePatientData(patient));

export const updatePatient = (id, patient) =>
    api.put(`${API}/${id}`, sanitizePatientData(patient));

export const deletePatient = (id) =>
    api.delete(`${API}/${id}`);