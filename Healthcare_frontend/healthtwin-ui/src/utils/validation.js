/**
 * Utility functions for form input validation across the application
 */

/**
 * Validates an email address.
 * @param {string} email 
 * @returns {{ isValid: boolean, message: string }}
 */
export const validateEmail = (email) => {
  if (!email || !String(email).trim()) {
    return { isValid: false, message: "Email address is required." };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(email).trim())) {
    return { isValid: false, message: "Please enter a valid email address (e.g. user@example.com)." };
  }
  return { isValid: true, message: "" };
};

/**
 * Validates a phone number to ensure it contains exactly 10 numeric digits.
 * @param {string|number} phone 
 * @returns {{ isValid: boolean, message: string }}
 */
export const validatePhone = (phone) => {
  if (phone === undefined || phone === null || String(phone).trim() === "") {
    return { isValid: false, message: "Phone number is required." };
  }
  // Remove non-digit characters
  const digitsOnly = String(phone).replace(/\D/g, "");
  if (digitsOnly.length !== 10) {
    return { isValid: false, message: "Phone number must be exactly 10 digits." };
  }
  return { isValid: true, message: "" };
};

/**
 * Validates password requirement (min 6 characters and at least one uppercase letter).
 * @param {string} password 
 * @returns {{ isValid: boolean, message: string }}
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: "Password is required." };
  }
  if (password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one uppercase letter (A-Z)." };
  }
  return { isValid: true, message: "" };
};
