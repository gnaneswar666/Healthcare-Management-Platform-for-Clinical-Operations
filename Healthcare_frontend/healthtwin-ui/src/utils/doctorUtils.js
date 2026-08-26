/**
 * Utility to calculate the next auto-incremented Doctor ID.
 * Scans existing doctors list to find the highest Doctor ID (e.g., D102)
 * and returns the next auto-incremented ID (e.g., D103).
 *
 * @param {Array} doctors 
 * @returns {string} Next doctor ID (e.g. "D103")
 */
export const getNextDoctorId = (doctors = []) => {
  if (!Array.isArray(doctors) || doctors.length === 0) {
    return "D101";
  }

  let maxNum = 0;
  doctors.forEach((doctor) => {
    const dId = doctor?.doctorId || doctor?.id || "";
    // Regex matching D followed by digits (e.g., D101, D102, 101)
    const match = String(dId).match(/^D?(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  });

  if (maxNum === 0) {
    return "D101";
  }

  const nextNum = maxNum + 1;
  return `D${nextNum}`;
};
