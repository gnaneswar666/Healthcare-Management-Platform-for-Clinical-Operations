package com.infosys.HealthTwin.security;

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
                && !patientId.equals(loggedPatientId)) {

            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You can access only your own data");
        }
    }

    public void validateDoctorOrAdmin(HttpServletRequest request) {

        String role = request.getHeader("X-Role");

        if (!"ADMIN".equals(role) && !"DOCTOR".equals(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"You are not supposed to acces this");
        }
    }

    public void validateDoctor(HttpServletRequest request) {

        String role = request.getHeader("X-Role");

        if (!"DOCTOR".equals(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }
}
