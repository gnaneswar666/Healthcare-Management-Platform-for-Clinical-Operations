import api from "./api";

/**
 * Assign patient to doctor
 */
export const assignPatient = (assignment) =>
    api.post("/doctor/api/assignments", assignment);

/**
 * Get patients assigned to a doctor
 */
export const getAssignedPatients = (doctorId) =>
    api.get(`/doctor/api/assignments/${doctorId}`);

/**
 * Unassign patient
 */
export const unAssignPatient = (doctorId, patientId) =>
    api.delete(`/doctor/api/assignments/${doctorId}/${patientId}`);