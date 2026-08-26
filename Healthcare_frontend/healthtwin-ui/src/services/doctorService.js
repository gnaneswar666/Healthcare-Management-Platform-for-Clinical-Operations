import api from "./api";

/**
 * Get all doctors
 */
export const getDoctors = () =>
    api.get("/doctor/api/doctors");

/**
 * Get doctor by doctorId
 */
export const getDoctor = (doctorId) =>
    api.get(`/doctor/api/doctors/${doctorId}`);

/**
 * Add doctor
 */
export const addDoctor = (doctor) =>
    api.post("/doctor/api/doctors", doctor);

/**
 * Update doctor
 */
export const updateDoctor = (doctorId, doctor) =>
    api.put(`/doctor/api/doctors/${doctorId}`, doctor);

/**
 * Delete doctor
 */
export const deleteDoctor = (doctorId) =>
    api.delete(`/doctor/api/doctors/${doctorId}`);