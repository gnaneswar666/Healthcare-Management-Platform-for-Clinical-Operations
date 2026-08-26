/**
 * Utility to calculate the next auto-upgraded Patient ID.
 * Scans existing patients list to find the highest Patient ID (e.g., P202)
 * and returns the next auto-incremented ID (e.g., P203).
 *
 * @param {Array} patients 
 * @returns {string} Next patient ID (e.g. "P203")
 */
export const getNextPatientId = (patients = []) => {
  if (!Array.isArray(patients) || patients.length === 0) {
    return "P201";
  }

  let maxNum = 0;
  patients.forEach((patient) => {
    const pId = patient?.patientId || patient?.id || "";
    // Regex matching P followed by digits (e.g., P202, P105, 202)
    const match = String(pId).match(/^P?(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  });

  if (maxNum === 0) {
    return "P201";
  }

  const nextNum = maxNum + 1;
  return `P${nextNum}`;
};
