package com.infosys.consestService.security;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class AuthorizationUtil {

    public void validatePatientAccess(HttpServletRequest request, String patientId) {

        String role = request.getHeader("X-Role");
        String loggedPatientId = request.getHeader("X-PatientId");

        if ("PATIENT".equals(role)
                && loggedPatientId != null && !loggedPatientId.isEmpty()
                && !patientId.equals(loggedPatientId)) {

            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You can access only your own data");
        }
    }

    public void validateDoctorOrAdmin(HttpServletRequest request) {

        String role = request.getHeader("X-Role");

        if (role != null && !"ADMIN".equals(role) && !"DOCTOR".equals(role) && !"PATIENT".equals(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    public void validateDoctor(HttpServletRequest request) {

        String role = request.getHeader("X-Role");

        if (role != null && !"DOCTOR".equals(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }
}