import api from "./api";

// Get latest care plan for a patient
export const getCarePlan = (patientId) => {
    return api.get(`/careplan/api/careplan/${patientId}`);
};

// Generate a new care plan using AI Engine
export const generateCarePlan = (patientId) => {
    return api.post(`/careplan/api/careplan/generate/${patientId}`);
};

// Doctor Approve care plan
export const approveCarePlan = (carePlanId, doctorId = "DOC101", doctorNotes = "") => {
    return api.put(`/careplan/api/careplan/${carePlanId}/approve`, {
        doctorId,
        doctorNotes
    });
};

// Doctor Reject care plan
export const rejectCarePlan = (carePlanId, doctorId = "DOC101", doctorNotes = "") => {
    return api.put(`/careplan/api/careplan/${carePlanId}/reject`, {
        doctorId,
        doctorNotes
    });
};

// Update doctor notes
export const updateDoctorNotes = (carePlanId, doctorId, doctorNotes) => {
    return api.put(`/careplan/api/careplan/${carePlanId}/notes`, {
        doctorId,
        doctorNotes
    });
};

// Update patient daily adherence progress (Step 7)
export const updateProgress = (carePlanId, patientId, checklistData) => {
    if (typeof carePlanId === 'object') {
        return api.put(`/careplan/api/careplan/updateProgress`, carePlanId);
    }
    const payload = {
        carePlanId: carePlanId,
        patientId: patientId,
        ...checklistData
    };
    return api.put(`/careplan/api/careplan/updateProgress`, payload);
};

// Get patient daily adherence progress (Step 7)
export const getTodayProgress = (patientId) => {
    return api.get(`/careplan/api/careplan/progress/${patientId}`);
};

// Get pending care plans for Doctor queue (Step 5)
export const getPendingCarePlans = () => {
    return api.get(`/careplan/api/careplan/pending`);
};

// Get dashboard statistics (Step 10)
export const getDashboardStats = () => {
    return api.get(`/careplan/api/careplan/dashboard/stats`);
};

// Get validation & audit log (Step 11)
export const getValidationAudit = (patientId) => {
    return api.get(`/careplan/api/careplan/validation-audit/${patientId}`);
};